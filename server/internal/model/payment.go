package model

import (
	"time"
	"gorm.io/gorm"
)

type Payment struct {
gorm.Model
OrderID       uint       `gorm:"not null" json:"order_id"`
Amount        float64    `gorm:"type:decimal(10,2);not null" json:"amount"`
PaymentMethod string     `gorm:"size:50;not null" json:"payment_method"` 
Method        string     `gorm:"-" json:"method"` // Alias for PaymentMethod for compatibility
TransactionID string     `gorm:"size:100;uniqueIndex" json:"transaction_id"`
Status        string     `gorm:"size:20;default:\"pending\"" json:"status"` 
PaidAt        *time.Time  `json:"paid_at"`
}
