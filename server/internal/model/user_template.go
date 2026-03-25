package model

import (
	"time"

	"gorm.io/gorm"
)

type UserTemplate struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	UserID            uint            `json:"user_id" gorm:"not null"`
	ProductTemplateID uint            `json:"product_template_id" gorm:"not null"`
	ProductTemplate   ProductTemplate `json:"product_template" gorm:"foreignKey:ProductTemplateID"`
	Name              string          `json:"name" gorm:"not null"`
	PreviewImageUrl   string          `json:"preview_image_url"`
	DesignData        string          `json:"design_data" gorm:"type:text"` // Stores JSON representation of transforms, text, etc.
}
