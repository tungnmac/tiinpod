package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type InventoryService interface {
	Create(inventory *model.Inventory) error
	GetAll() ([]model.Inventory, error)
	GetByID(id uint) (*model.Inventory, error)
	Update(inventory *model.Inventory) error
	Delete(id uint) error
}

type inventoryService struct {
	repo repository.InventoryRepository
}

func NewInventoryService(repo repository.InventoryRepository) InventoryService {
	return &inventoryService{repo: repo}
}

func (s *inventoryService) Create(inventory *model.Inventory) error {
	return s.repo.Create(inventory)
}

func (s *inventoryService) GetAll() ([]model.Inventory, error) {
	return s.repo.FindAll()
}

func (s *inventoryService) GetByID(id uint) (*model.Inventory, error) {
	return s.repo.FindByID(id)
}

func (s *inventoryService) Update(inventory *model.Inventory) error {
	return s.repo.Update(inventory)
}

func (s *inventoryService) Delete(id uint) error {
	return s.repo.Delete(id)
}
