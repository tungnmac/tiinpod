package repository

import (
	"server/internal/model"

	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *model.Order) error
	CreateOrderItem(item *model.OrderItem) error
	FindAll() ([]model.Order, error)
	FindByID(id uint) (*model.Order, error)
	Update(order *model.Order) error
	Delete(id uint) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db}
}

func (r *orderRepository) Create(order *model.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) CreateOrderItem(item *model.OrderItem) error {
	return r.db.Create(item).Error
}

func (r *orderRepository) FindAll() ([]model.Order, error) {
	var list []model.Order
	err := r.db.Find(&list).Error
	return list, err
}

func (r *orderRepository) FindByID(id uint) (*model.Order, error) {
	var item model.Order
	err := r.db.First(&item, id).Error
	return &item, err
}

func (r *orderRepository) Update(order *model.Order) error {
	return r.db.Save(order).Error
}

func (r *orderRepository) Delete(id uint) error {
	return r.db.Delete(&model.Order{}, id).Error
}
