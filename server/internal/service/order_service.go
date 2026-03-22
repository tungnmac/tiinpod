package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type OrderService interface {
	Create(order *model.Order) error
	GetAll() ([]model.Order, error)
	GetByID(id uint) (*model.Order, error)
	Update(order *model.Order) error
	Delete(id uint) error
}

type orderService struct {
	repo repository.OrderRepository
}

func NewOrderService(repo repository.OrderRepository) OrderService {
	return &orderService{repo: repo}
}

func (s *orderService) Create(order *model.Order) error {
	return s.repo.Create(order)
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
