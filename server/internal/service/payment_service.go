package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type PaymentService interface {
	ProcessPayment(orderID uint, amount float64, method string) (*model.Payment, error)
	GetSavedMethods(userID uint) ([]model.PaymentMethod, error)
	GetUsedMethod(userID uint, methodType string) (*model.PaymentMethod, error)
	SaveMethod(method *model.PaymentMethod) error
}

type paymentService struct{ repo repository.PaymentRepository }

func NewPaymentService(r repository.PaymentRepository) PaymentService { return &paymentService{r} }

func (s *paymentService) ProcessPayment(orderID uint, amount float64, method string) (*model.Payment, error) {
	payment := &model.Payment{OrderID: orderID, Amount: amount, Method: method, Status: "completed"}
	err := s.repo.Create(payment)
	return payment, err
}

func (s *paymentService) GetSavedMethods(userID uint) ([]model.PaymentMethod, error) {
	return s.repo.GetMethodsByUserID(userID)
}

func (s *paymentService) GetUsedMethod(userID uint, methodType string) (*model.PaymentMethod, error) {
	return s.repo.GetMethodByType(userID, methodType)
}

func (s *paymentService) SaveMethod(method *model.PaymentMethod) error {
	// Specialized uniqueness check based on payment type
	var existing *model.PaymentMethod
	var err error

	if method.Type == "credit_card" {
		// For cards, check by last 4 digits (or card number string if stored)
		existing, err = s.repo.GetMethodByType(method.UserID, method.Type)
		if err == nil && existing != nil && existing.CardNumber != method.CardNumber {
			existing = nil // Not the same card
		}
	} else {
		existing, err = s.repo.GetMethodByType(method.UserID, method.Type)
	}

	if err == nil && existing != nil && existing.ID != 0 {
		method.ID = existing.ID
		return s.repo.UpdateMethod(method)
	}
	return s.repo.CreateMethod(method)
}
