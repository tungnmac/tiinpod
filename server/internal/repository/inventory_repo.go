package repository

import (
	"server/internal/model"
	"gorm.io/gorm"
)

type InventoryRepository interface {
	Create(inventory *model.Inventory) error
	FindAll() ([]model.Inventory, error)
	FindByID(id uint) (*model.Inventory, error)
	Update(inventory *model.Inventory) error
	Delete(id uint) error
}

type inventoryRepository struct {
	db *gorm.DB
}

func NewInventoryRepository(db *gorm.DB) InventoryRepository {
	return &inventoryRepository{db}
}

func (r *inventoryRepository) Create(inventory *model.Inventory) error {
	return r.db.Create(inventory).Error
}

func (r *inventoryRepository) FindAll() ([]model.Inventory, error) {
	var list []model.Inventory
	err := r.db.Find(&list).Error
	return list, err
}

func (r *inventoryRepository) FindByID(id uint) (*model.Inventory, error) {
	var item model.Inventory
	err := r.db.First(&item, id).Error
	return &item, err
}

func (r *inventoryRepository) Update(inventory *model.Inventory) error {
	return r.db.Save(inventory).Error
}

func (r *inventoryRepository) Delete(id uint) error {
	return r.db.Delete(&model.Inventory{}, id).Error
}
