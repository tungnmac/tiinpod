package repository

import (
	"server/internal/model"
	"gorm.io/gorm"
)

type ShipmentRepository interface {
	Create(shipment *model.Shipment) error
	FindAll() ([]model.Shipment, error)
	FindByID(id uint) (*model.Shipment, error)
	Update(shipment *model.Shipment) error
	Delete(id uint) error
}

type shipmentRepository struct {
	db *gorm.DB
}

func NewShipmentRepository(db *gorm.DB) ShipmentRepository {
	return &shipmentRepository{db}
}

func (r *shipmentRepository) Create(shipment *model.Shipment) error {
	return r.db.Create(shipment).Error
}

func (r *shipmentRepository) FindAll() ([]model.Shipment, error) {
	var list []model.Shipment
	err := r.db.Find(&list).Error
	return list, err
}

func (r *shipmentRepository) FindByID(id uint) (*model.Shipment, error) {
	var item model.Shipment
	err := r.db.First(&item, id).Error
	return &item, err
}

func (r *shipmentRepository) Update(shipment *model.Shipment) error {
	return r.db.Save(shipment).Error
}

func (r *shipmentRepository) Delete(id uint) error {
	return r.db.Delete(&model.Shipment{}, id).Error
}
