package service

import (
	"fmt"
	"server/internal/model"
	"server/internal/repository"
	"time"
)

type OrderService interface {
	Create(order *model.Order) error
	GetAll() ([]model.Order, error)
	GetByID(id uint) (*model.Order, error)
	Update(order *model.Order) error
	Delete(id uint) error
	ProcessCheckout(order *model.Order) error
}

type orderService struct {
	repo          repository.OrderRepository
	productRepo   repository.ProductRepository
	inventoryRepo repository.InventoryRepository
}

func NewOrderService(repo repository.OrderRepository, productRepo repository.ProductRepository, inventoryRepo repository.InventoryRepository) OrderService {
	return &orderService{
		repo:          repo,
		productRepo:   productRepo,
		inventoryRepo: inventoryRepo,
	}
}

func (s *orderService) Create(order *model.Order) error {
	return s.repo.Create(order)
}

func (s *orderService) ProcessCheckout(order *model.Order) error {
	// 1. Create Order with Items (Transactional)
	// For simplicity in this demo, we use basic logic,
	// but normally this should be a DB transaction.

	if err := s.repo.Create(order); err != nil {
		return err
	}

	// 1.1 Handle Initial Payment Record
	if len(order.Payments) == 0 {
		payment := model.Payment{
			OrderID:       order.ID,
			Amount:        order.FinalAmount,
			Currency:      order.Currency,
			PaymentMethod: order.PaymentMethod,
			Status:        "pending",
		}

		if order.PaymentMethod == "credit_card" {
			order.PaymentStatus = "paid"
			now := time.Now()
			order.CompletedAt = &now

			payment.Status = "paid"
			payment.PaidAt = &now

			if err := s.repo.Update(order); err != nil {
				return err
			}
		}
		order.Payments = append(order.Payments, payment)
	} else {
		// If payments are already provided from frontend, ensure they are linked to the order
		for i := range order.Payments {
			if order.Payments[i].OrderID == 0 {
				order.Payments[i].OrderID = order.ID
			}
			if order.PaymentMethod == "credit_card" && order.Payments[i].Status == "paid" {
				order.PaymentStatus = "paid"
				now := time.Now()
				order.CompletedAt = &now
				order.Payments[i].PaidAt = &now
				if err := s.repo.Update(order); err != nil {
					return err
				}
			}
		}
	}
	// 2. Update Inventory
	for _, item := range order.Items {
		product, err := s.productRepo.FindByID(item.ProductID)
		if err != nil {
			return fmt.Errorf("product %d not found", item.ProductID)
		}

		if product.Stock < item.Quantity {
			return fmt.Errorf("insufficient stock for product: %s", product.Name)
		}

		product.Stock -= item.Quantity
		if err := s.productRepo.Update(product); err != nil {
			return err
		}
	}

	return nil
}

func (s *orderService) GetAll() ([]model.Order, error) {
	return s.repo.FindAll()
}

func (s *orderService) GetByID(id uint) (*model.Order, error) {
	return s.repo.FindByID(id)
}

func (s *orderService) Update(order *model.Order) error {
	return s.repo.Update(order)
}

func (s *orderService) Delete(id uint) error {
	return s.repo.Delete(id)
}
