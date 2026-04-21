package handler

import (
	"fmt"
	"net/http"
	"server/internal/model"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

type PaymentHandler struct{ service service.PaymentService }

func NewPaymentHandler(s service.PaymentService) *PaymentHandler { return &PaymentHandler{s} }

func (h *PaymentHandler) ProcessPayment(c *gin.Context) {
	req := model.PaymentRequest{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	payment, err := h.service.ProcessPayment(req.OrderID, req.Amount, req.Method)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payment)
}

func (h *PaymentHandler) GetCurrentMethod(c *gin.Context) {
	params := model.PaymentMethodRequest{}
	err := c.ShouldBindQuery(&params)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid query parameters"})
		return
	}

	userID := params.UserID
	methodType := params.Type

	method, err := h.service.GetUsedMethod(userID, methodType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, method)
}

func (h *PaymentHandler) GetSavedMethods(c *gin.Context) {
	var params model.PaymentMethodsRequest
	if err := c.ShouldBind(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid query parameters: " + err.Error()})
		return
	}

	userID := params.UserID
	if userID == 0 {
		if val, exists := c.Get("userID"); exists {
			userID = val.(uint)
		}
	}

	fmt.Printf("Fetching methods for userID: %d\n", userID)
	methods, err := h.service.GetSavedMethods(userID)
	fmt.Println("Fetched methods:", methods)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(methods) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No saved payment methods found", "methods": []model.PaymentMethod{}})
		return
	}
	c.JSON(http.StatusOK, methods)
}

func (h *PaymentHandler) SaveMethod(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	var method model.PaymentMethod
	if err := c.ShouldBindJSON(&method); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	method.UserID = userID
	if err := h.service.SaveMethod(&method); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, method)
}

func (h *PaymentHandler) VerifyCard(c *gin.Context) {
	var req struct {
		CardNumber string `json:"card_number"`
		CardHolder string `json:"card_holder"`
		Expiry     string `json:"expiry"`
		CVC        string `json:"cvc"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Mock verification: success if non-empty
	if req.CardNumber != "" && req.CVC != "" {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Card verified successfully",
		})
		return
	}

	c.JSON(http.StatusUnprocessableEntity, gin.H{
		"success": false,
		"message": "Card verification failed",
	})
}
