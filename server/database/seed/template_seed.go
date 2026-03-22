package seed

import (
	"log"
	"server/database"
	"server/internal/model"
)

func SeedProductTemplates() {
	var count int64
	database.DB.Model(&model.ProductTemplate{}).Count(&count)
	log.Printf("Checking Product Templates: found %d", count)
	if count > 0 {
		return
	}

	templates := []model.ProductTemplate{
		{
			Name:          "Premium Cotton T-Shirt",
			SKU:           "TSH-001",
			ImageURL:      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop",
			BasePrice:     12.99,
			DefaultProfit: 7.50,
			Rating:        4.8,
			ReviewCount:   124,
			Colors:        "Black,White,Navy,Red",
			Sizes:         "S,M,L,XL,2XL",
			Description:   "High-quality 100% cotton t-shirt, perfect for custom printing.",
			Category:      "Apparel",
		},
		{
			Name:          "Classic Unisex Hoodie",
			SKU:           "HOD-002",
			ImageURL:      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500&auto=format&fit=crop",
			BasePrice:     24.50,
			DefaultProfit: 10.20,
			Rating:        4.9,
			ReviewCount:   89,
			Colors:        "Dark Gray,Light Gray,Indigo",
			Sizes:         "M,L,XL,3XL",
			Description:   "Warm and cozy hoodie made from premium fleece.",
			Category:      "Apparel",
		},
		{
			Name:          "Canvas Tote Bag",
			SKU:           "TOT-003",
			ImageURL:      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=500&auto=format&fit=crop",
			BasePrice:     8.99,
			DefaultProfit: 5.00,
			Rating:        4.7,
			ReviewCount:   56,
			Colors:        "Natural,Emerald",
			Sizes:         "One Size",
			Description:   "Durable canvas tote bag for everyday use.",
			Category:      "Accessories",
		},
		{
			Name:          "Ceramic Coffee Mug",
			SKU:           "MUG-004",
			ImageURL:      "https://images.unsplash.com/photo-1514228742587-6b1558fbed20?q=80&w=500&auto=format&fit=crop",
			BasePrice:     6.25,
			DefaultProfit: 4.50,
			Rating:        4.6,
			ReviewCount:   210,
			Colors:        "White",
			Sizes:         "11oz,15oz",
			Description:   "Classic ceramic mug with a smooth finish.",
			Category:      "Home & Living",
		},
	}

	for _, t := range templates {
		if err := database.DB.Create(&t).Error; err != nil {
			log.Printf("Error creating template %s: %v", t.Name, err)
		}
	}
	log.Println("Đã seed xong Product Templates.")
}
