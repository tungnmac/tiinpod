package handler

import "server/internal/service"

type Handlers struct {
	Auth            *AuthHandler
	Category        *CategoryHandler
	Product         *ProductHandler
	ProductTemplate *ProductTemplateHandler
	Order           *OrderHandler
	Shipment        *ShipmentHandler
	Inventory       *InventoryHandler
	Cart            *CartHandler
	Checkout        *CheckoutHandler
	Payment         *PaymentHandler
	File            *FileHandler
	UserTemplate    *UserTemplateHandler
	Scene           *SceneHandler
}

func NewHandlers(services *service.Services) *Handlers {
	return &Handlers{
		Auth:            NewAuthHandler(services.Auth),
		Category:        NewCategoryHandler(services.Category),
		Product:         NewProductHandler(services.Product),
		ProductTemplate: NewProductTemplateHandler(services.ProductTemplate),
		Order:           NewOrderHandler(services.Order),
		Shipment:        NewShipmentHandler(services.Shipment),
		Inventory:       NewInventoryHandler(services.Inventory),
		Cart:            NewCartHandler(services.Cart),
		Checkout:        NewCheckoutHandler(services.Checkout),
		Payment:         NewPaymentHandler(services.Payment),
		File:            NewFileHandler(services.File),
		UserTemplate:    NewUserTemplateHandler(services.UserTemplate),
		Scene:           NewSceneHandler(),
	}
}
