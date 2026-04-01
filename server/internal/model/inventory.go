package model

import "gorm.io/gorm"

type Inventory struct {
	gorm.Model
	ProductID uint   `gorm:"not null;uniqueIndex" json:"product_id"`
	Quantity  int    `gorm:"default:0" json:"quantity"`
	MinStock  int    `gorm:"default:10" json:"min_stock"`
	Location  string `gorm:"size:255" json:"location"`
	Stock     int    `gorm:"not null" json:"stock"`
	Status    string `gorm:"size:50;default:'in_stock'" json:"status"` // in_stock, low_stock, out_of_stock
}
