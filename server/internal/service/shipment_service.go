package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type ShipmentService interface {
	Create(shipment *model.Shipment) error
	GetAll() ([]model.Shipment, error)
	GetByID(id uint) (*model.Shipment, error)
	Update(shipment *model.Shipment) error
	Delete(id uint) error
}

type shipmentService struct {
	repo repository.ShipmentRepository
}

func NewShipmentService(repo repository.ShipmentRepository) ShipmentService {
	return &shipmentService{repo: repo}
}

func (s *shipmentService) Create(shipment *model.Shipment) error {
	return s.repo.Create(shipment)
}

func (s *shipmentService) GetAll() ([]model.Shipment, error) {
	return s.repo.FindAll()
}

func (s *shipmentService) GetByID(id uint) (*model.Shipment, error) {
	return s.repo.FindByID(id)
}

func (s *shipmentService) Update(shipment *model.Shipment) error {
	return s.repo.Update(shipment)
}

func (s *shipmentService) Delete(id uint) error {
	return s.repo.Delete(id)
}
