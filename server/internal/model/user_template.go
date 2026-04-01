package model

import (
	"time"

	"gorm.io/gorm"
)

type DesignElement struct {
	ID             string  `json:"id"`
	Type           string  `json:"type"`             // "image" or "text"
	ViewID         string  `json:"viewId,omitempty"` // "front", "back", etc.
	URL            string  `json:"url,omitempty"`    // for image
	Text           string  `json:"text,omitempty"`   // for text
	Color          string  `json:"color,omitempty"`  // hex
	FontSize       float64 `json:"fontSize,omitempty"`
	FontFamily     string  `json:"fontFamily,omitempty"`
	FontWeight     string  `json:"fontWeight,omitempty"`
	FontStyle      string  `json:"fontStyle,omitempty"`
	TextDecoration string  `json:"textDecoration,omitempty"`
	TextAlign      string  `json:"textAlign,omitempty"`
	MaxWidth       float64 `json:"maxWidth,omitempty"`
	Curve          float64 `json:"curve,omitempty"`
	X              float64 `json:"x"`
	Y              float64 `json:"y"`
	Scale          float64 `json:"scale"`
	Rotate         float64 `json:"rotate"`
	Opacity        float64 `json:"opacity"`
	IsVisible      bool    `json:"isVisible"`
}

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
