package model

import (
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
)

type Product struct {
	BaseModel
	CategoryID    *uint    `json:"category_id"`
	Category      Category `gorm:"foreignKey:CategoryID" json:"category"`
	Name          string   `gorm:"size:255;not null" json:"name"`
	Price         float64  `gorm:"type:decimal(10,2);not null" json:"price"`
	Currency      string   `gorm:"size:10;default:'VND';not null" json:"currency"`
	ExchangeRate  float64  `gorm:"default:1.0" json:"exchange_rate"`
	OriginalPrice float64  `gorm:"type:decimal(10,2)" json:"original_price"`
	SKU           string   `gorm:"size:100;uniqueIndex" json:"sku"`
	Description   string   `gorm:"type:text" json:"description"`
	ImageURL      string   `gorm:"size:255" json:"image_url"`
	Stock         int      `gorm:"default:0" json:"stock"`
	IsActive      bool     `gorm:"default:true" json:"is_active"`
}

// BeforeCreate hooks for Product
func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	// Tự động tạo SKU nếu trống
	if p.SKU == "" {
		p.SKU = strings.ToUpper(fmt.Sprintf("SKU-%s-%d", strings.ReplaceAll(p.Name, " ", ""), time.Now().Unix()))
	}

	if p.Currency == "" {
		p.Currency = "VND"
	}

	if p.ExchangeRate <= 0 {
		p.ExchangeRate = 1.0
	}

	return nil
}

// AfterCreate hooks for Product
func (p *Product) AfterCreate(tx *gorm.DB) (err error) {
	fmt.Printf("Product created: %s (SKU: %s)\n", p.Name, p.SKU)
	return nil
}

// BeforeUpdate hooks for Product
func (p *Product) BeforeUpdate(tx *gorm.DB) (err error) {
	// Luôn in hoa SKU khi cập nhật
	p.SKU = strings.ToUpper(p.SKU)
	return nil
}
