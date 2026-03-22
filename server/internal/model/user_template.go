package model

import "gorm.io/gorm"

type UserTemplate struct {
	gorm.Model
	UserID            uint           `json:"user_id" gorm:"not null"`
	ProductTemplateID uint           `json:"product_template_id" gorm:"not null"`
	ProductTemplate   ProductTemplate `json:"product_template" gorm:"foreignKey:ProductTemplateID"`
	Name              string         `json:"name" gorm:"not null"`
	PreviewImageUrl   string         `json:"preview_image_url"`
	DesignData        string         `json:"design_data" gorm:"type:text"` // Stores JSON representation of transforms, text, etc.
}
