package model

import (
	"time"
)

type Payment struct {
	BaseModel
	OrderID       uint       `gorm:"not null" json:"order_id"`
	Amount        float64    `gorm:"type:decimal(10,2);not null" json:"amount"`
	Currency      string     `gorm:"size:10;not null;default:'VND'" json:"currency"`
	PaymentMethod string     `gorm:"size:50;not null" json:"payment_method"`
	Method        string     `gorm:"-" json:"method"` // Alias for PaymentMethod for compatibility
	TransactionID string     `gorm:"size:100;uniqueIndex" json:"transaction_id"`
	Status        string     `gorm:"size:20;default:\"pending\"" json:"status"`
	PaidAt        *time.Time `json:"paid_at"`
}

type PaymentMethod struct {
	BaseModel
	UserID        uint   `gorm:"not null;index" json:"user_id"`
	Type          string `gorm:"size:20;not null" json:"type"` // credit_card, bank_transfer
	CardHolder    string `gorm:"size:100" json:"card_holder,omitempty"`
	CardNumber    string `gorm:"size:20" json:"card_number,omitempty"`
	ExpiryDate    string `gorm:"size:10" json:"expiry_date,omitempty"`
	BankName      string `gorm:"size:50" json:"bank_name,omitempty"`
	AccountNumber string `gorm:"size:50" json:"account_number,omitempty"`
	AccountName   string `gorm:"size:100" json:"account_name,omitempty"`
	IsDefault     bool   `gorm:"default:false" json:"is_default"`
}

type PaymentRequest struct {
	OrderID uint    `json:"order_id"`
	Amount  float64 `json:"amount"`
	Method  string  `json:"method"`
}
type PaymentMethodRequest struct {
	UserID uint   `form:"user_id" json:"user_id"`
	Type   string `form:"type" json:"type"` // credit_card, bank_transfer
}

type PaymentMethodsRequest struct {
	UserID uint   `form:"user_id" json:"user_id"`
	Type   string `form:"type" json:"type"` // credit_card, bank_transfer
}

type PaymentResponse struct {
	OrderID       uint       `json:"order_id"`
	Amount        float64    `json:"amount"`
	Currency      string     `json:"currency"`
	PaymentMethod string     `json:"payment_method"`
	Status        string     `json:"status"`
	PaidAt        *time.Time `json:"paid_at,omitempty"`
}

type VerifyCardRequest struct {
	CardNumber string `json:"card_number"`
	CardHolder string `json:"card_holder"`
	Expiry     string `json:"expiry"`
}

type VerifyCardResponse struct {
	Valid   bool   `json:"valid"`
	Message string `json:"message,omitempty"`
}
