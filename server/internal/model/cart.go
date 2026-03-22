package model

import (
	"gorm.io/gorm"
)

type Cart struct {
gorm.Model
UserID   uint       `gorm:"uniqueIndex;not null" json:"user_id"`
IsActive bool       `gorm:"default:true" json:"is_active"`
Status   string     `gorm:"size:20;default:\"active\"" json:"status"` // active, checked_out, abandoned
Items    []CartItem `json:"items"`
}

type CartItem struct {
gorm.Model
CartID    uint    `gorm:"not null" json:"cart_id"`
ProductID uint    `gorm:"not null" json:"product_id"`
Product   Product `json:"product"`
Quantity  int     `gorm:"default:1;not null" json:"quantity"`
Price     float64 `gorm:"type:decimal(10,2)" json:"price"` // Snapshot price at time of adding to cart
}
