package seed

import (
	"log"
	"server/database"
	"server/internal/model"
)

func SeedScenes() {
	// First, clear existing data to avoid duplicates if names changed
	database.DB.Exec("DELETE FROM scene_templates")
	database.DB.Exec("DELETE FROM scene_assets")

	templates := []model.SceneTemplate{
		{
			Name:          "Modern Tea Room",
			Category:      "tea-room",
			ThumbnailURL:  "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200&h=150&auto=format&fit=crop",
			BackgroundURL: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1200",
			Description:   "Elegant minimalist tea room with bamboo accents.",
		},
		{
			Name:          "Urban Cafe",
			Category:      "cafe",
			ThumbnailURL:  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200&h=150&auto=format&fit=crop",
			BackgroundURL: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200",
			Description:   "Brick walls and industrial lighting for cozy vibes.",
		},
		{
			Name:          "Zen Workspace",
			Category:      "office",
			ThumbnailURL:  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200&h=150&auto=format&fit=crop",
			BackgroundURL: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
			Description:   "Natural light and clean lines for productivity.",
		},
	}

	for _, t := range templates {
		database.DB.Create(&t)
	}

	assets := []model.SceneAsset{
		{
			Name:     "Eames Lounge Chair",
			URL:      "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=250&auto=format&fit=crop",
			Category: "furniture",
		},
		{
			Name:     "Minimalist Sofa",
			URL:      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=250&auto=format&fit=crop",
			Category: "furniture",
		},
		{
			Name:     "Potted Monstera",
			URL:      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=250&auto=format&fit=crop",
			Category: "decor",
		},
		{
			Name:     "Design Lamp",
			URL:      "https://images.unsplash.com/photo-1507473884658-c70b6559995f?q=80&w=250&auto=format&fit=crop",
			Category: "decor",
		},
	}

	for _, a := range assets {
		database.DB.Create(&a)
	}

	log.Println("Seed scene data completed.")
}
