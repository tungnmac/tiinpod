package handler

import (
	"net/http"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

type CheckoutHandler struct{ service service.CheckoutService }

func NewCheckoutHandler(s service.CheckoutService) *CheckoutHandler { return &CheckoutHandler{s} }

func (h *CheckoutHandler) ProcessCheckout(c *gin.Context) {
	var req struct {
		UserID        uint   `json:"user_id"`
		PaymentMethod string `json:"payment_method"`
		GiftCardCode  string `json:"gift_card_code"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	order, err := h.service.Checkout(req.UserID, req.PaymentMethod, req.GiftCardCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Checkout successful", "order": order})
}
