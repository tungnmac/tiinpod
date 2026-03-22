package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type PaymentService interface {
	ProcessPayment(orderID uint, amount float64, method string) (*model.Payment, error)
}

type paymentService struct{ repo repository.PaymentRepository }

func NewPaymentService(r repository.PaymentRepository) PaymentService { return &paymentService{r} }

func (s *paymentService) ProcessPayment(orderID uint, amount float64, method string) (*model.Payment, error) {
	payment := &model.Payment{OrderID: orderID, Amount: amount, Method: method, Status: "completed"}
	err := s.repo.Create(payment)
	return payment, err
}
