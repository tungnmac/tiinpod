package handler

import (
	"net/http"
	"strconv"

	"server/internal/model"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

// OrderHandler handles orders
type OrderHandler struct {
	service service.OrderService
}

// NewOrderHandler creates a new OrderHandler
func NewOrderHandler(s service.OrderService) *OrderHandler {
	return &OrderHandler{service: s}
}

// @Summary Create a new order
// @Description Add a new order to the database
// @Tags Orders
// @Accept json
// @Produce json
// @Param order body model.Order true "Order Info"
// @Success 201 {object} model.Order
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /orders [post]
func (h *OrderHandler) Create(c *gin.Context) {
	var item model.Order
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

// @Summary Get all orders
// @Description Retrieve a list of all orders
// @Tags Orders
// @Produce json
// @Success 200 {array} model.Order
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /orders [get]
func (h *OrderHandler) GetAll(c *gin.Context) {
	items, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, items)
}

// @Summary Get an order by ID
// @Description Retrieve a single order by its ID
// @Tags Orders
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} model.Order
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /orders/{id} [get]
func (h *OrderHandler) GetByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	item, err := h.service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

// @Summary Update an order
// @Description Update an existing order's information
// @Tags Orders
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Param order body model.Order true "Order Info"
// @Success 200 {object} model.Order
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /orders/{id} [put]
func (h *OrderHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	item, err := h.service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	if err := c.ShouldBindJSON(item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.service.Update(item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, item)
}

// @Summary Delete an order
// @Description Remove an order from the database
// @Tags Orders
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} map[string]string "message: Order deleted"
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /orders/{id} [delete]
func (h *OrderHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
}
