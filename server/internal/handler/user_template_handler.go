package handler

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"server/config"
	"server/internal/model"
	"server/internal/service"
	"server/pkg/utils"

	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/gin-gonic/gin"
)

type UserTemplateHandler struct {
	srv service.UserTemplateService
}

func NewUserTemplateHandler(srv service.UserTemplateService) *UserTemplateHandler {
	return &UserTemplateHandler{srv: srv}
}

func (h *UserTemplateHandler) Create(c *gin.Context) {
	var input struct {
		ID                uint   `json:"id"`
		ProductTemplateID uint   `json:"product_template_id"`
		Name              string `json:"name"`
		PreviewImageUrl   string `json:"preview_image_url"`
		DesignData        string `json:"design_data"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse design data to get image URLs
	var designDataObj struct {
		Transform interface{} `json:"transform"`
		Designs   []struct {
			URL string `json:"url"`
		} `json:"designs"`
	}
	if err := json.Unmarshal([]byte(input.DesignData), &designDataObj); err == nil {
		// If image is base64, upload to Cloudinary
		modified := false
		for i, design := range designDataObj.Designs {
			// Check if URL starts with "data:image" (base64)
			if strings.HasPrefix(design.URL, "data:image") {
				uploadedURL, err := utils.UploadToCloudinary(design.URL)
				if err == nil {
					designDataObj.Designs[i].URL = uploadedURL
					modified = true
				} else {
					// Fallback: check length if prefix check fails for some reason
					if len(design.URL) > 500 {
						uploadedURL, err := utils.UploadToCloudinary(design.URL)
						if err == nil {
							designDataObj.Designs[i].URL = uploadedURL
							modified = true
						}
					}
				}
			}
		}
		// Update input.DesignData with new URLs if any were uploaded
		if modified {
			newData, _ := json.Marshal(designDataObj)
			input.DesignData = string(newData)
		}
	}

	// Get user_id from context (set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	uid := uint(userID.(float64))

	// If ID is provided, check if it belongs to the user and update
	if input.ID != 0 {
		existing, err := h.srv.GetByID(input.ID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
			return
		}
		if existing.UserID != uid {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			return
		}

		existing.Name = input.Name
		existing.PreviewImageUrl = input.PreviewImageUrl
		existing.DesignData = input.DesignData
		existing.ProductTemplateID = input.ProductTemplateID

		if err := h.srv.Update(existing); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update template"})
			return
		}
		c.JSON(http.StatusOK, existing)
		return
	}

	template := &model.UserTemplate{
		UserID:            uid,
		ProductTemplateID: input.ProductTemplateID,
		Name:              input.Name,
		PreviewImageUrl:   input.PreviewImageUrl,
		DesignData:        input.DesignData,
	}

	if err := h.srv.Create(template); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create template"})
		return
	}

	c.JSON(http.StatusCreated, template)
}

func (h *UserTemplateHandler) GetMyTemplates(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	templates, err := h.srv.GetByUserID(uint(userID.(float64)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch templates"})
		return
	}

	c.JSON(http.StatusOK, templates)
}

func (h *UserTemplateHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	uid := uint(userID.(float64))

	// Check ownership
	existing, err := h.srv.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}

	if existing.UserID != uid {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own templates"})
		return
	}

	if err := h.srv.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete template"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Template deleted successfully"})
}

func (h *UserTemplateHandler) PreUpload(c *gin.Context) {
	var input struct {
		Image string `json:"image" binding:"required"` // base64 string
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image data is required"})
		return
	}

	// Validate if it's actually an image base64
	if !strings.HasPrefix(input.Image, "data:image") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image format"})
		return
	}

	// Simple size check (e.g., max 10MB base64)
	if len(input.Image) > 13946060 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image too large (max 10MB)"})
		return
	}

	url, err := utils.UploadToCloudinary(input.Image)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"url": url,
	})
}

func (h *UserTemplateHandler) GetPresignedUpload(c *gin.Context) {
	// Generate signature
	timestamp := time.Now().Unix()
	params := url.Values{}
	params.Set("folder", "tiinpod/designs")
	params.Set("timestamp", strconv.FormatInt(timestamp, 10))

	sign, err := api.SignParameters(params, config.AppConfig.CloudinaryAPISecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate signature"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"signature":  sign,
		"timestamp":  timestamp,
		"api_key":    config.AppConfig.CloudinaryAPIKey,
		"cloud_name": config.AppConfig.CloudinaryCloudName,
		"folder":     "tiinpod/designs",
		"upload_url": "https://api.cloudinary.com/v1_1/" + config.AppConfig.CloudinaryCloudName + "/image/upload",
	})
}
