package model

import (
	"time"

	"gorm.io/gorm"
)

type SceneTemplate struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Name          string         `json:"name"`
	Category      string         `json:"category"`
	ThumbnailURL  string         `json:"thumbnail_url"`
	BackgroundURL string         `json:"background_url"`
	Description   string         `json:"description"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

type SceneAsset struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	URL       string         `json:"url"`
	Category  string         `json:"category"` // furniture, decor
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
