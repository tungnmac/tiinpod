package handler

import "server/internal/service"

type Handlers struct {
	Auth      *AuthHandler
	Category  *CategoryHandler
	Product   *ProductHandler
	Order     *OrderHandler
	Shipment  *ShipmentHandler
	Inventory *InventoryHandler
	Cart      *CartHandler
	Checkout  *CheckoutHandler
	Payment   *PaymentHandler
	File      *FileHandler
}

func NewHandlers(services *service.Services) *Handlers {
	return &Handlers{
		Auth:      NewAuthHandler(services.Auth),
		Category:  NewCategoryHandler(services.Category),
		Product:   NewProductHandler(services.Product),
		Order:     NewOrderHandler(services.Order),
		Shipment:  NewShipmentHandler(services.Shipment),
		Inventory: NewInventoryHandler(services.Inventory),
		Cart:      NewCartHandler(services.Cart),
		Checkout:  NewCheckoutHandler(services.Checkout),
		Payment:   NewPaymentHandler(services.Payment),
		File:      NewFileHandler(services.File),
	}
}
