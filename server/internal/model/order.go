package model

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Order struct {
	BaseModel
	OrderNumber     string      `gorm:"size:50;uniqueIndex;not null" json:"order_number"`
	UserID          uint        `gorm:"not null" json:"user_id"`
	User            User        `json:"user"`
	TotalAmount     float64     `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	TaxAmount       float64     `gorm:"type:decimal(10,2);default:0" json:"tax_amount"`
	ShippingFee     float64     `gorm:"type:decimal(10,2);default:0" json:"shipping_fee"`
	DiscountAmount  float64     `gorm:"type:decimal(10,2);default:0" json:"discount_amount"`
	FinalAmount     float64     `gorm:"type:decimal(10,2);not null" json:"final_amount"`
	Currency        string      `gorm:"size:10;default:'VND';not null" json:"currency"`
	ExchangeRate    float64     `gorm:"default:1.0" json:"exchange_rate"`
	Status          string      `gorm:"size:50;not null;default:\"pending\"" json:"status"`
	PaymentStatus   string      `gorm:"size:50;default:\"unpaid\"" json:"payment_status"`
	PaymentMethod   string      `gorm:"size:50" json:"payment_method"`
	ShippingAddress string      `gorm:"size:255" json:"shipping_address"`
	GiftCardCode    string      `gorm:"size:50" json:"gift_card_code"`
	Items           []OrderItem `json:"items"`
	Shipments       []Shipment  `json:"shipments"`
	Payments        []Payment   `json:"payments"`
	CompletedAt     *time.Time  `json:"completed_at"`
}

// BeforeCreate chuẩn bị dữ liệu trước khi tạo Order mới
func (o *Order) BeforeCreate(tx *gorm.DB) (err error) {
	// 1. Tạo OrderNumber duy nhất và tăng dần nếu chưa có
	if o.OrderNumber == "" {
		var lastOrder Order
		// Lấy đơn hàng mới nhất được tạo trong ngày hôm nay
		today := time.Now().Format("20060102")
		prefix := fmt.Sprintf("ORD-%s-", today)

		tx.Where("order_number LIKE ?", prefix+"%").Order("order_number DESC").First(&lastOrder)

		nextNumber := 1
		if lastOrder.ID != 0 {
			// Parse số thứ tự từ mã đơn hàng cuối cùng (ví dụ: ORD-20240415-0001 -> 0001)
			fmt.Sscanf(lastOrder.OrderNumber, prefix+"%d", &nextNumber)
			nextNumber++
		}

		o.OrderNumber = fmt.Sprintf("%s%04d", prefix, nextNumber)
	}

	// 2. Đảm bảo các giá trị mặc định cho các trường số
	if o.Status == "" {
		o.Status = "pending"
	}
	if o.PaymentStatus == "" {
		o.PaymentStatus = "unpaid"
	}
	if o.Currency == "" {
		o.Currency = "VND"
	}
	if o.ExchangeRate == 0 {
		o.ExchangeRate = 1.0
	}

	// 3. Tính toán lại FinalAmount để đảm bảo tính nhất quán (nếu cần)
	// FinalAmount = (Total + Tax + Shipping) - Discount
	o.FinalAmount = (o.TotalAmount + o.TaxAmount + o.ShippingFee) - o.DiscountAmount

	return nil
}

// AfterCreate có thể dùng để log hoặc tạo shipping mặc định
func (o *Order) AfterCreate(tx *gorm.DB) (err error) {
	fmt.Printf("Order created successfully with ID: %d and Number: %s\n", o.ID, o.OrderNumber)
	return nil
}

// BeforeUpdate kiểm tra logic trước khi cập nhật
func (o *Order) BeforeUpdate(tx *gorm.DB) (err error) {
	// Đảm bảo FinalAmount luôn đúng sau khi cập nhật các thành phần giá
	o.FinalAmount = (o.TotalAmount + o.TaxAmount + o.ShippingFee) - o.DiscountAmount

	// Nếu trạng thái đổi sang 'completed', tự động gán thời gian hoàn tất
	if o.Status == "completed" && o.CompletedAt == nil {
		now := time.Now()
		o.CompletedAt = &now
	}

	return nil
}

type OrderItem struct {
	BaseModel
	OrderID      uint    `gorm:"not null" json:"order_id"`
	ProductID    uint    `gorm:"not null" json:"product_id"`
	Product      Product `json:"product"`
	Quantity     int     `gorm:"not null" json:"quantity"`
	Price        float64 `gorm:"type:decimal(10,2);not null" json:"price"`
	Currency     string  `gorm:"size:10;default:'VND';not null" json:"currency"`
	ExchangeRate float64 `gorm:"default:1.0" json:"exchange_rate"`
	SKU          string  `gorm:"size:50" json:"sku"`
	Name         string  `gorm:"size:255" json:"name"`
}

// BeforeCreate hooks for OrderItem
func (oi *OrderItem) BeforeCreate(tx *gorm.DB) (err error) {
	if oi.Currency == "" {
		oi.Currency = "VND"
	}
	if oi.ExchangeRate == 0 {
		oi.ExchangeRate = 1.0
	}
	return nil
}

// AfterCreate hooks for OrderItem
func (oi *OrderItem) AfterCreate(tx *gorm.DB) (err error) {
	fmt.Printf("OrderItem created for OrderID: %d, ProductID: %d\n", oi.OrderID, oi.ProductID)
	return nil
}

type Shipment struct {
	BaseModel
	OrderID          uint      `gorm:"not null" json:"order_id"`
	TrackingNumber   string    `gorm:"size:100" json:"tracking_number"`
	Carrier          string    `gorm:"size:100" json:"carrier"`
	Status           string    `gorm:"size:50" json:"status"`
	EstimatedArrival time.Time `json:"estimated_arrival"`
}

// BeforeCreate hooks for Shipment
func (s *Shipment) BeforeCreate(tx *gorm.DB) (err error) {
	if s.Status == "" {
		s.Status = "preparing"
	}
	if s.Carrier == "" {
		s.Carrier = "Standard Shipping"
	}
	if s.TrackingNumber == "" {
		s.TrackingNumber = fmt.Sprintf("TRK-%d-%d", s.OrderID, time.Now().Unix())
	}
	return nil
}

// AfterCreate hooks for Shipment
func (s *Shipment) AfterCreate(tx *gorm.DB) (err error) {
	fmt.Printf("Shipment created for OrderID: %d with tracking: %s\n", s.OrderID, s.TrackingNumber)
	return nil
}
