package handler

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

type CartHandler struct{ service service.CartService }

func NewCartHandler(s service.CartService) *CartHandler { return &CartHandler{s} }

func (h *CartHandler) AddItem(c *gin.Context) {
	var req struct {
		UserID    uint    `json:"user_id"`
		ProductID uint    `json:"product_id"`
		Quantity  int     `json:"quantity"`
		Price     float64 `json:"price"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.service.AddItemToCart(req.UserID, req.ProductID, req.Quantity, req.Price); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Item added to cart"})
}

func (h *CartHandler) GetCart(c *gin.Context) {
	// Dummy: replace with actual user ID from token
	// id := c.GetUint("userID")
	userID := uint(1)
	items, err := h.service.GetCartItems(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, items)
}
