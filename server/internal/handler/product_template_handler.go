package handler

import (
	"net/http"
	"strconv"

	"server/internal/model"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

type ProductTemplateHandler struct {
	service service.ProductTemplateService
}

func NewProductTemplateHandler(s service.ProductTemplateService) *ProductTemplateHandler {
	return &ProductTemplateHandler{service: s}
}

// @Summary Create a new product template
// @Description Add a new product template to the database
// @Tags ProductTemplates
// @Accept json
// @Produce json
// @Param template body model.ProductTemplate true "Product Template Info"
// @Success 201 {object} model.ProductTemplate
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /product-templates [post]
func (h *ProductTemplateHandler) Create(c *gin.Context) {
	var item model.ProductTemplate
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.service.Create(&item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// @Summary Get all product templates
// @Description Retrieve a list of all product templates
// @Tags ProductTemplates
// @Produce json
// @Success 200 {array} model.ProductTemplate
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /product-templates [get]
func (h *ProductTemplateHandler) GetAll(c *gin.Context) {
	items, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, items)
}

// @Summary Get a product template by ID
// @Description Retrieve a single product template by its ID
// @Tags ProductTemplates
// @Produce json
// @Param id path int true "Product Template ID"
// @Success 200 {object} model.ProductTemplate
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /product-templates/{id} [get]
func (h *ProductTemplateHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	item, err := h.service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}
