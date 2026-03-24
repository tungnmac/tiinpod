package repository

import (
	"server/internal/model"

	"gorm.io/gorm"
)

type UserTemplateRepository interface {
	Create(template *model.UserTemplate) error
	Update(template *model.UserTemplate) error
	Delete(id uint) error
	GetByUserID(userID uint) ([]model.UserTemplate, error)
	GetByID(id uint) (*model.UserTemplate, error)
}

type userTemplateRepository struct {
	db *gorm.DB
}

func NewUserTemplateRepository(db *gorm.DB) UserTemplateRepository {
	return &userTemplateRepository{db: db}
}

func (r *userTemplateRepository) Create(template *model.UserTemplate) error {
	return r.db.Create(template).Error
}

func (r *userTemplateRepository) Update(template *model.UserTemplate) error {
	return r.db.Save(template).Error
}

func (r *userTemplateRepository) Delete(id uint) error {
	return r.db.Delete(&model.UserTemplate{}, id).Error
}

func (r *userTemplateRepository) GetByUserID(userID uint) ([]model.UserTemplate, error) {
	var templates []model.UserTemplate
	err := r.db.Preload("ProductTemplate").Preload("ProductTemplate.Views").Where("user_id = ?", userID).Find(&templates).Error
	return templates, err
}

func (r *userTemplateRepository) GetByID(id uint) (*model.UserTemplate, error) {
	var template model.UserTemplate
	err := r.db.Preload("ProductTemplate").Preload("ProductTemplate.Views").First(&template, id).Error
	return &template, err
}
