package model

import (
	"time"

	"gorm.io/gorm"
)

type ProductView struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	ProductTemplateID uint   `json:"product_template_id"`
	ViewName          string `gorm:"size:50;not null" json:"view_name"` // "front", "back", "left", "right"
	ImageURL          string `gorm:"size:255;not null" json:"image_url"`
}
