package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type CategoryService interface {
	Create(category *model.Category) error
	GetAll() ([]model.Category, error)
	GetByID(id uint) (*model.Category, error)
	Update(category *model.Category) error
	Delete(id uint) error
}

type categoryService struct {
	repo repository.CategoryRepository
}

func NewCategoryService(repo repository.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) Create(category *model.Category) error {
	return s.repo.Create(category)
}

func (s *categoryService) GetAll() ([]model.Category, error) {
	return s.repo.FindAll()
}

func (s *categoryService) GetByID(id uint) (*model.Category, error) {
	return s.repo.FindByID(id)
}

func (s *categoryService) Update(category *model.Category) error {
	return s.repo.Update(category)
}

func (s *categoryService) Delete(id uint) error {
	return s.repo.Delete(id)
}
