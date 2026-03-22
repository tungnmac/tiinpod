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
	repo repository.UserTemplateRepository
}

func NewUserTemplateService(repo repository.UserTemplateRepository) UserTemplateService {
	return &userTemplateService{repo: repo}
}

func (s *userTemplateService) Create(template *model.UserTemplate) error {
	return s.repo.Create(template)
}

func (s *userTemplateService) Update(template *model.UserTemplate) error {
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
