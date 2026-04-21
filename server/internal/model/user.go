package model

import (
	"gorm.io/gorm"
)

type User struct {
	BaseModel
	Username   string         `gorm:"size:255;uniqueIndex;not null" json:"username"`
	Email      string         `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Password   string         `gorm:"size:255;not null" json:"-"`
	Role       string         `gorm:"size:20;default:'user'" json:"role"` // admin, user
	Provider   string         `gorm:"size:50;default:'local'" json:"provider"`
	ProviderID string         `gorm:"size:255" json:"provider_id"`
	Avatar     string         `gorm:"type:text" json:"avatar"`
	IsActive   bool           `gorm:"default:true" json:"is_active"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
