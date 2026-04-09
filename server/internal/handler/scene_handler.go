package handler

import (
	"net/http"
	"server/database"
	"server/internal/model"

	"github.com/gin-gonic/gin"
)

type SceneHandler struct{}

func NewSceneHandler() *SceneHandler {
	return &SceneHandler{}
}

// GetTemplates trả về danh sách room templates
func (h *SceneHandler) GetTemplates(c *gin.Context) {
	var templates []model.SceneTemplate
	if err := database.DB.Find(&templates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch templates"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    templates,
	})
}

// GetAssets trả về danh sách đồ nội thất, decor
func (h *SceneHandler) GetAssets(c *gin.Context) {
	var assets []model.SceneAsset
	if err := database.DB.Find(&assets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch assets"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    assets,
	})
}
