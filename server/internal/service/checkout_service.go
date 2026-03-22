package service

import (
	"server/internal/model"
	"server/internal/repository"
)

type CheckoutService interface {
	Checkout(userID uint, method string, giftCardCode string) (*model.Order, error)
}

type checkoutService struct {
	cartRepo     repository.CartRepository
	orderRepo    repository.OrderRepository
	paymentRepo  repository.PaymentRepository
	giftCardRepo repository.GiftCardRepository
}

func NewCheckoutService(c repository.CartRepository, o repository.OrderRepository, p repository.PaymentRepository, g repository.GiftCardRepository) CheckoutService {
	return &checkoutService{cartRepo: c, orderRepo: o, paymentRepo: p, giftCardRepo: g}
}

func (s *checkoutService) Checkout(userID uint, method string, giftCardCode string) (*model.Order, error) {
	cart, err := s.cartRepo.GetActiveCartByUserID(userID)
	if err != nil {
		return nil, err
	}
	items, err := s.cartRepo.GetItemsByCartID(cart.ID)
	if err != nil {
		return nil, err
	}

	subtotal := 0.0
	for _, item := range items {
		subtotal += item.Price * float64(item.Quantity)
	}

	// 1. Calculate Tax (e.g. 10%)
	tax := subtotal * 0.10
	finalTotal := subtotal + tax
	discount := 0.0

	// 2. Apply Gift Card if any
	if giftCardCode != "" {
		card, err := s.giftCardRepo.FindByCode(giftCardCode)
		if err == nil {
			if card.CurrentBalance >= finalTotal {
				discount = finalTotal
				card.CurrentBalance -= finalTotal
				finalTotal = 0
			} else {
				discount = card.CurrentBalance
				finalTotal -= card.CurrentBalance
				card.CurrentBalance = 0
			}
			s.giftCardRepo.Update(card)
		}
	}

	order := &model.Order{
		UserID:         userID,
		TotalAmount:    finalTotal,
		TaxAmount:      tax,
		GiftCardCode:   giftCardCode,
		DiscountAmount: discount,
		Status:         "created",
	}
	if err := s.orderRepo.Create(order); err != nil {
		return nil, err
	}

	// 3. Create OrderItems from CartItems
	for _, item := range items {
		orderItem := &model.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Price,
		}
		if err := s.orderRepo.CreateOrderItem(orderItem); err != nil {
			return nil, err
		}
	}

	if finalTotal > 0 {
		s.paymentRepo.Create(&model.Payment{OrderID: order.ID, Amount: finalTotal, PaymentMethod: method, Status: "completed"})
	} else {
		s.paymentRepo.Create(&model.Payment{OrderID: order.ID, Amount: 0, PaymentMethod: "gift_card", Status: "completed"})
	}

	cart.Status = "checked_out"
	s.cartRepo.UpdateCart(cart)
	return order, nil
}
