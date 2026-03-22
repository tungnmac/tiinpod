package repository

import "gorm.io/gorm"

type Repositories struct {
	User      UserRepository
	Category  CategoryRepository
	Product   ProductRepository
	Order     OrderRepository
	Shipment  ShipmentRepository
	Inventory InventoryRepository
	Cart      CartRepository
	Payment   PaymentRepository
	GiftCard  GiftCardRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		User:      NewUserRepository(db),
		Category:  NewCategoryRepository(db),
		Product:   NewProductRepository(db),
		Order:     NewOrderRepository(db),
		Shipment:  NewShipmentRepository(db),
		Inventory: NewInventoryRepository(db),
		Cart:      NewCartRepository(db),
		Payment:   NewPaymentRepository(db),
		GiftCard:  NewGiftCardRepository(db),
	}
}
