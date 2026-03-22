package service

import "server/internal/repository"

type Services struct {
	Auth      AuthService
	Category  CategoryService
	Product   ProductService
	Order     OrderService
	Shipment  ShipmentService
	Inventory InventoryService
	Cart      CartService
	Payment   PaymentService
	Checkout  CheckoutService
	File      FileService
}

func NewServices(repos *repository.Repositories) *Services {
	return &Services{
		Auth:      NewAuthService(repos.User),
		Category:  NewCategoryService(repos.Category),
		Product:   NewProductService(repos.Product),
		Order:     NewOrderService(repos.Order),
		Shipment:  NewShipmentService(repos.Shipment),
		Inventory: NewInventoryService(repos.Inventory),
		Cart:      NewCartService(repos.Cart),
		Payment:   NewPaymentService(repos.Payment),
		Checkout:  NewCheckoutService(repos.Cart, repos.Order, repos.Payment, repos.GiftCard),
		File:      NewFileService(repos.Product),
	}
}
