package service

import (
	"errors"
	"server/internal/model"
	"server/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(username, password, email, role string) (*model.User, error)
	Authenticate(username, password string) (*model.User, error)
	GetUserByID(id uint) (*model.User, error)
}

type authService struct {
	repo repository.UserRepository
}

func NewAuthService(repo repository.UserRepository) AuthService {
	return &authService{repo: repo}
}

func (s *authService) Register(username, password, email, role string) (*model.User, error) {
	// Kiểm tra user tồn tại
	existing, _ := s.repo.GetByUsername(username)
	if existing != nil {
		return nil, errors.New("username already exists")
	}

	// Hash mật khẩu
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	if role == "" {
		role = "user"
	}

	user := &model.User{
		Username: username,
		Password: string(hashedPassword),
		Email:    email,
		Role:     role,
	}

	err = s.repo.Create(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *authService) Authenticate(username, password string) (*model.User, error) {
	user, err := s.repo.GetByUsername(username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

func (s *authService) GetUserByID(id uint) (*model.User, error) {
	return s.repo.GetByID(id)
}
