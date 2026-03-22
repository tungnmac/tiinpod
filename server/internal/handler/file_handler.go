package handler

import (
	"net/http"
	"server/internal/service"
	"github.com/gin-gonic/gin"
)

type FileHandler struct {
	service service.FileService
}

func NewFileHandler(s service.FileService) *FileHandler {
	return &FileHandler{service: s}
}

func (h *FileHandler) UploadFile(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	path, err := h.service.SaveUpload(header.Filename, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"path": path})
}

func (h *FileHandler) DownloadFile(c *gin.Context) {
	fileName := c.Param("filename")
	c.File("uploads/" + fileName)
}

func (h *FileHandler) ExportProducts(c *gin.Context) {
	path, err := h.service.ExportProductsCSV()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.File(path)
}

func (h *FileHandler) ImportProducts(c *gin.Context) {
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	if err := h.service.ImportProductsCSV(file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Import successful"})
}
