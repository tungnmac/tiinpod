package model

type Category struct {
	BaseModel
	Name        string `gorm:"size:100;not null" json:"name"`
	Description string `gorm:"type:text" json:"description"`
	Slug        string `gorm:"size:100;uniqueIndex" json:"slug"`
	ImageURL    string `gorm:"size:255" json:"image_url"`
}
