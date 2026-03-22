package repository

import (
	"server/internal/model"
	"gorm.io/gorm"
)

type CartRepository interface {
	CreateCart(cart *model.Cart) error
	GetActiveCartByUserID(userID uint) (*model.Cart, error)
	AddItem(item *model.CartItem) error
	GetItemsByCartID(cartID uint) ([]model.CartItem, error)
	UpdateCart(cart *model.Cart) error
}

type cartRepository struct { db *gorm.DB }

func NewCartRepository(db *gorm.DB) CartRepository { return &cartRepository{db} }

func (r *cartRepository) CreateCart(cart *model.Cart) error { return r.db.Create(cart).Error }
func (r *cartRepository) GetActiveCartByUserID(userID uint) (*model.Cart, error) {
	var cart model.Cart
	err := r.db.Where("user_id = ? AND status = ?", userID, "active").First(&cart).Error
	return &cart, err
}
func (r *cartRepository) AddItem(item *model.CartItem) error { return r.db.Create(item).Error }
func (r *cartRepository) GetItemsByCartID(cartID uint) ([]model.CartItem, error) {
	var items []model.CartItem
	err := r.db.Where("cart_id = ?", cartID).Find(&items).Error
	return items, err
}
func (r *cartRepository) UpdateCart(cart *model.Cart) error { return r.db.Save(cart).Error }
