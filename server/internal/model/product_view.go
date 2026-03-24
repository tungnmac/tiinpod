package model

import "gorm.io/gorm"

type ProductView struct {
	gorm.Model
	ProductTemplateID uint   `json:"product_template_id"`
	ViewName          string `gorm:"size:50;not null" json:"view_name"` // "front", "back", "left", "right"
	ImageURL          string `gorm:"size:255;not null" json:"image_url"`
}
