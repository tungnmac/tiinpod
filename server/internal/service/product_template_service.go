package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type ProductTemplateService interface {
	Create(template *model.ProductTemplate) error
	GetAll() ([]model.ProductTemplate, error)
	GetByID(id uint) (*model.ProductTemplate, error)
}

type productTemplateService struct {
	repo repository.ProductTemplateRepository
}

func NewProductTemplateService(repo repository.ProductTemplateRepository) ProductTemplateService {
	return &productTemplateService{repo: repo}
}

func (s *productTemplateService) Create(template *model.ProductTemplate) error {
	return s.repo.Create(template)
}

func (s *productTemplateService) GetAll() ([]model.ProductTemplate, error) {
	return s.repo.FindAll()
}

func (s *productTemplateService) GetByID(id uint) (*model.ProductTemplate, error) {
	return s.repo.FindByID(id)
}
