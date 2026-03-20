package model

import (
"time"

"gorm.io/gorm"
)

// User biểu diễn table user trong database
type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Email     string         `gorm:"size:255;uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"size:255" json:"-"` // Không trả passowrd ra json
	Provider  string         `gorm:"size:50;default:'local'" json:"provider"` // local, google, github...
	ProviderID string        `gorm:"size:255" json:"provider_id"` // Dùng cho OAuth
	Avatar    string         `gorm:"type:text" json:"avatar"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
