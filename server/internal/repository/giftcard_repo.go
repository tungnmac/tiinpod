package repository

import (
	"server/internal/model"
	"gorm.io/gorm"
)

type GiftCardRepository interface {
	FindByCode(code string) (*model.GiftCard, error)
	Update(card *model.GiftCard) error
}

type giftCardRepository struct { db *gorm.DB }

func NewGiftCardRepository(db *gorm.DB) GiftCardRepository { return &giftCardRepository{db} }

func (r *giftCardRepository) FindByCode(code string) (*model.GiftCard, error) {
	var card model.GiftCard
	err := r.db.Where("code = ? AND is_active = ?", code, true).First(&card).Error
	return &card, err
}

func (r *giftCardRepository) Update(card *model.GiftCard) error {
	return r.db.Save(card).Error
}
