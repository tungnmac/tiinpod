package model

import (
	"time"

	"gorm.io/gorm"
)

type ProductTemplate struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Name          string        `gorm:"size:255;not null" json:"name"`
	SKU           string        `gorm:"size:100;uniqueIndex" json:"sku"`
	ImageURL      string        `gorm:"size:255;not null" json:"image_url"`
	BasePrice     float64       `gorm:"type:decimal(10,2);not null" json:"base_price"`
	DefaultProfit float64       `gorm:"type:decimal(10,2);default:0" json:"default_profit"`
	Rating        float64       `gorm:"type:decimal(3,2);default:0" json:"rating"`
	ReviewCount   int           `gorm:"default:0" json:"review_count"`
	Colors        string        `gorm:"type:text" json:"colors"` // Stored as comma-separated values or JSON
	Sizes         string        `gorm:"type:text" json:"sizes"`  // Stored as comma-separated values or JSON
	Description   string        `gorm:"type:text" json:"description"`
	Category      string        `gorm:"size:100" json:"category"`
	Views         []ProductView `gorm:"foreignKey:ProductTemplateID" json:"views"`
}
