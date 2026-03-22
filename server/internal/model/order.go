package model

import (
	"time"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderNumber    string    `gorm:"size:50;uniqueIndex;not null" json:"order_number"`
	UserID         uint      `gorm:"not null" json:"user_id"`
	User           User      `json:"user"`
	TotalAmount    float64   `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	TaxAmount      float64   `gorm:"type:decimal(10,2);default:0" json:"tax_amount"`
	ShippingFee    float64   `gorm:"type:decimal(10,2);default:0" json:"shipping_fee"`
	DiscountAmount float64   `gorm:"type:decimal(10,2);default:0" json:"discount_amount"`
	FinalAmount    float64   `gorm:"type:decimal(10,2);not null" json:"final_amount"`
	Status         string    `gorm:"size:50;not null;default:\"pending\"" json:"status"`
	PaymentStatus  string    `gorm:"size:50;default:\"unpaid\"" json:"payment_status"`
	ShippingAddress string    `gorm:"size:255" json:"shipping_address"`
	GiftCardCode   string    `gorm:"size:50" json:"gift_card_code"`
	Items          []OrderItem `json:"items"`
	Shipments      []Shipment  `json:"shipments"`
	CompletedAt    *time.Time  `json:"completed_at"`
}

type OrderItem struct {
	gorm.Model
	OrderID   uint    `gorm:"not null" json:"order_id"`
	ProductID uint    `gorm:"not null" json:"product_id"`
	Product   Product `json:"product"`
	Quantity  int     `gorm:"not null" json:"quantity"`
	Price     float64 `gorm:"type:decimal(10,2);not null" json:"price"`
	SKU       string  `gorm:"size:50" json:"sku"`
	Name      string  `gorm:"size:255" json:"name"`
}

type Shipment struct {
	gorm.Model
	OrderID          uint      `gorm:"not null" json:"order_id"`
	TrackingNumber   string    `gorm:"size:100" json:"tracking_number"`
	Carrier          string    `gorm:"size:100" json:"carrier"`
	Status           string    `gorm:"size:50" json:"status"`
	EstimatedArrival time.Time `json:"estimated_arrival"`
}
