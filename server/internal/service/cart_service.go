package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type CartService interface {
	GetOrCreateCart(userID uint) (*model.Cart, error)
	AddItemToCart(userID uint, productID uint, quantity int, price float64) error
	GetCartItems(userID uint) ([]model.CartItem, error)
}

type cartService struct{ repo repository.CartRepository }

func NewCartService(r repository.CartRepository) CartService { return &cartService{r} }

func (s *cartService) GetOrCreateCart(userID uint) (*model.Cart, error) {
	cart, err := s.repo.GetActiveCartByUserID(userID)
	if err != nil {
		newCart := &model.Cart{UserID: userID, Status: "active"}
		if err := s.repo.CreateCart(newCart); err != nil {
			return nil, err
		}
		return newCart, nil
	}
	return cart, nil
}
func (s *cartService) AddItemToCart(userID uint, productID uint, quantity int, price float64) error {
	cart, err := s.GetOrCreateCart(userID)
	if err != nil {
		return err
	}
	item := &model.CartItem{CartID: cart.ID, ProductID: productID, Quantity: quantity, Price: price}
	return s.repo.AddItem(item)
}
func (s *cartService) GetCartItems(userID uint) ([]model.CartItem, error) {
	cart, err := s.repo.GetActiveCartByUserID(userID)
	if err != nil {
		return nil, err
	}
	return s.repo.GetItemsByCartID(cart.ID)
}
