package repository

import (
	"server/internal/model"
	"gorm.io/gorm"
)

type PaymentRepository interface {
	Create(payment *model.Payment) error
	GetByOrderID(orderID uint) (*model.Payment, error)
	Update(payment *model.Payment) error
}

type paymentRepository struct { db *gorm.DB }

func NewPaymentRepository(db *gorm.DB) PaymentRepository { return &paymentRepository{db} }

func (r *paymentRepository) Create(payment *model.Payment) error { return r.db.Create(payment).Error }
func (r *paymentRepository) GetByOrderID(orderID uint) (*model.Payment, error) {
	var p model.Payment
	err := r.db.Where("order_id = ?", orderID).First(&p).Error
	return &p, err
}
func (r *paymentRepository) Update(payment *model.Payment) error { return r.db.Save(payment).Error }
