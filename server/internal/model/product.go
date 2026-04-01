package model

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	CategoryID    *uint    `json:"category_id"`
	Category      Category `gorm:"foreignKey:CategoryID" json:"category"`
	Name          string   `gorm:"size:255;not null" json:"name"`
	Price         float64  `gorm:"type:decimal(10,2);not null" json:"price"`
	OriginalPrice float64  `gorm:"type:decimal(10,2)" json:"original_price"`
	SKU           string   `gorm:"size:100;uniqueIndex" json:"sku"`
	Description   string   `gorm:"type:text" json:"description"`
	ImageURL      string   `gorm:"size:255" json:"image_url"`
	Stock         int      `gorm:"default:0" json:"stock"`
	IsActive      bool     `gorm:"default:true" json:"is_active"`
}
