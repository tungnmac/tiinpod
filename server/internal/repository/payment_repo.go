package repository

import (
	"server/internal/model"

	"gorm.io/gorm"
)

type PaymentRepository interface {
	Create(payment *model.Payment) error
	GetByOrderID(orderID uint) (*model.Payment, error)
	Update(payment *model.Payment) error

	// PaymentMethod
	CreateMethod(method *model.PaymentMethod) error
	GetMethodsByUserID(userID uint) ([]model.PaymentMethod, error)
	GetMethodByType(userID uint, methodType string) (*model.PaymentMethod, error)
	UpdateMethod(method *model.PaymentMethod) error
}

type paymentRepository struct{ db *gorm.DB }

func NewPaymentRepository(db *gorm.DB) PaymentRepository { return &paymentRepository{db} }

func (r *paymentRepository) Create(payment *model.Payment) error { return r.db.Create(payment).Error }
func (r *paymentRepository) GetByOrderID(orderID uint) (*model.Payment, error) {
	var p model.Payment
	err := r.db.Where("order_id = ?", orderID).First(&p).Error
	return &p, err
}
func (r *paymentRepository) Update(payment *model.Payment) error { return r.db.Save(payment).Error }

// PaymentMethod implementations
func (r *paymentRepository) CreateMethod(method *model.PaymentMethod) error {
	return r.db.Create(method).Error
}
func (r *paymentRepository) GetMethodsByUserID(userID uint) ([]model.PaymentMethod, error) {
	var methods []model.PaymentMethod
	// Use Distinct on relevant fields to avoid returning duplicate method types for the same user
	err := r.db.Where("user_id = ?", userID).
		Order("id desc").
		Find(&methods).Error
	return methods, err
}
func (r *paymentRepository) GetMethodByType(userID uint, methodType string) (*model.PaymentMethod, error) {
	var method model.PaymentMethod
	// Allow finding any existing record of this type for the user, not just default ones
	// to properly detect duplicates before creation
	err := r.db.Where("user_id = ? AND type = ?", userID, methodType).First(&method).Error
	if err != nil {
		return nil, err
	}
	return &method, nil
}
func (r *paymentRepository) UpdateMethod(method *model.PaymentMethod) error {
	return r.db.Save(method).Error
}
