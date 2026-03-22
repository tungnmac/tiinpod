package handler

import (
	"net/http"
	"server/internal/service"
	"github.com/gin-gonic/gin"
)

type PaymentHandler struct { service service.PaymentService }

func NewPaymentHandler(s service.PaymentService) *PaymentHandler { return &PaymentHandler{s} }

func (h *PaymentHandler) ProcessPayment(c *gin.Context) {
	var req struct { OrderID uint `json:"order_id"`; Amount float64 `json:"amount"`; Method string `json:"method"` }
	if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
	payment, err := h.service.ProcessPayment(req.OrderID, req.Amount, req.Method)
	if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return }
	c.JSON(http.StatusOK, payment)
}
