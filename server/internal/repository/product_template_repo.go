package repository

import (
	"server/internal/model"

	"gorm.io/gorm"
)

type ProductTemplateRepository interface {
	Create(template *model.ProductTemplate) error
	FindAll() ([]model.ProductTemplate, error)
	FindByID(id uint) (*model.ProductTemplate, error)
}

type productTemplateRepository struct {
	db *gorm.DB
}

func NewProductTemplateRepository(db *gorm.DB) ProductTemplateRepository {
	return &productTemplateRepository{db}
}

func (r *productTemplateRepository) Create(template *model.ProductTemplate) error {
	return r.db.Create(template).Error
}

func (r *productTemplateRepository) FindAll() ([]model.ProductTemplate, error) {
	var list []model.ProductTemplate
	err := r.db.Find(&list).Error
	return list, err
}

func (r *productTemplateRepository) FindByID(id uint) (*model.ProductTemplate, error) {
	var item model.ProductTemplate
	err := r.db.First(&item, id).Error
	return &item, err
}
