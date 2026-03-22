package repository

import (
	"server/internal/model"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	Create(category *model.Category) error
	FindAll() ([]model.Category, error)
	FindByID(id uint) (*model.Category, error)
	Update(category *model.Category) error
	Delete(id uint) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db}
}

func (r *categoryRepository) Create(category *model.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) FindAll() ([]model.Category, error) {
	var list []model.Category
	err := r.db.Find(&list).Error
	return list, err
}

func (r *categoryRepository) FindByID(id uint) (*model.Category, error) {
	var item model.Category
	err := r.db.First(&item, id).Error
	return &item, err
}

func (r *categoryRepository) Update(category *model.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepository) Delete(id uint) error {
	return r.db.Delete(&model.Category{}, id).Error
}
