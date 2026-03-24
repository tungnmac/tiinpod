package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type UserTemplateService interface {
	Create(template *model.UserTemplate) error
	Update(template *model.UserTemplate) error
	Delete(id uint) error
	GetByUserID(userID uint) ([]model.UserTemplate, error)
	GetByID(id uint) (*model.UserTemplate, error)
}

type userTemplateService struct {
	repo                repository.UserTemplateRepository
	productTemplateRepo repository.ProductTemplateRepository
}

func NewUserTemplateService(repo repository.UserTemplateRepository, productTemplateRepo repository.ProductTemplateRepository) UserTemplateService {
	return &userTemplateService{repo: repo, productTemplateRepo: productTemplateRepo}
}

func (s *userTemplateService) Create(template *model.UserTemplate) error {
	// Preload product template to ensure it's returned for frontend immediately
	if template.ProductTemplateID != 0 {
		pt, err := s.productTemplateRepo.FindByID(template.ProductTemplateID)
		if err == nil {
			template.ProductTemplate = *pt
		}
	}
	return s.repo.Create(template)
}

func (s *userTemplateService) Update(template *model.UserTemplate) error {
	// Ensure product template is updated/preloaded for frontend
	if template.ProductTemplateID != 0 {
		pt, err := s.productTemplateRepo.FindByID(template.ProductTemplateID)
		if err == nil {
			template.ProductTemplate = *pt
		}
	}
	return s.repo.Update(template)
}

func (s *userTemplateService) Delete(id uint) error {
	return s.repo.Delete(id)
}

func (s *userTemplateService) GetByUserID(userID uint) ([]model.UserTemplate, error) {
	return s.repo.GetByUserID(userID)
}

func (s *userTemplateService) GetByID(id uint) (*model.UserTemplate, error) {
	return s.repo.GetByID(id)
}
