package model

import (
	"time"
	"gorm.io/gorm"
)

type GiftCard struct {
gorm.Model
Code           string    `gorm:"size:20;uniqueIndex;not null" json:"code"`
InitialValue   float64   `gorm:"type:decimal(10,2);not null" json:"initial_value"`
CurrentBalance float64   `gorm:"type:decimal(10,2);not null" json:"current_balance"`
Balance        float64   `gorm:"-" json:"balance"` // Alias for CurrentBalance
ExpiryDate     time.Time `json:"expiry_date"`
IsActive       bool      `gorm:"default:true" json:"is_active"`
}
