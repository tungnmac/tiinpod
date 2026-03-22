package repository

import "gorm.io/gorm"

type Repositories struct {
	User            UserRepository
	Category        CategoryRepository
	Product         ProductRepository
	ProductTemplate ProductTemplateRepository
	Order           OrderRepository
	Shipment        ShipmentRepository
	Inventory       InventoryRepository
	Cart            CartRepository
	Payment         PaymentRepository
	GiftCard        GiftCardRepository
	UserTemplate    UserTemplateRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		User:            NewUserRepository(db),
		Category:        NewCategoryRepository(db),
		Product:         NewProductRepository(db),
		ProductTemplate: NewProductTemplateRepository(db),
		Order:           NewOrderRepository(db),
		Shipment:        NewShipmentRepository(db),
		Inventory:       NewInventoryRepository(db),
		Cart:            NewCartRepository(db),
		Payment:         NewPaymentRepository(db),
		GiftCard:        NewGiftCardRepository(db),
		UserTemplate:    NewUserTemplateRepository(db),
	}
}
