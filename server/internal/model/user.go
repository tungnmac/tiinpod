package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Username   string         `gorm:"size:255;uniqueIndex;not null" json:"username"`
	Email      string         `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Password   string         `gorm:"size:255;not null" json:"-"`
	Role       string         `gorm:"size:20;default:'user'" json:"role"` // admin, user
	Provider   string         `gorm:"size:50;default:'local'" json:"provider"`
	ProviderID string         `gorm:"size:255" json:"provider_id"`
	Avatar     string         `gorm:"type:text" json:"avatar"`
	IsActive   bool           `gorm:"default:true" json:"is_active"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
