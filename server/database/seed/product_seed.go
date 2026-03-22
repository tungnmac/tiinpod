package seed

import (
	"log"
	"server/database"
	"server/internal/model"
)

func SeedCategoriesAndProducts() {
	var count int64
	database.DB.Model(&model.Category{}).Count(&count)
	if count > 0 {
		return
	}

	categories := []model.Category{
		{Name: "Áo Quần", Description: "Trang phục thời trang", Slug: "ao-quan"},
		{Name: "Phụ kiện", Description: "Phụ kiện điện thoại, túi xách", Slug: "phu-kien"},
	}
	for i := range categories {
		database.DB.Create(&categories[i])
	}

	products := []model.Product{
		{CategoryID: &categories[0].ID, Name: "Áo Thun TiinPod Basic", Price: 150000, SKU: "TP-AT-001", Stock: 100},
		{CategoryID: &categories[0].ID, Name: "Áo Hoodie", Price: 250000, SKU: "TP-HD-001", Stock: 50},
		{CategoryID: &categories[1].ID, Name: "Túi Tote", Price: 85000, SKU: "TP-BAG-001", Stock: 200},
		{CategoryID: &categories[1].ID, Name: "Ốp Lưng Magsafe", Price: 120000, SKU: "TP-CASE-001", Stock: 150},
	}

	for _, p := range products {
		if err := database.DB.Create(&p).Error; err == nil {
			inv := model.Inventory{
				ProductID: p.ID,
				Quantity:  p.Stock,
				MinStock:  10,
				Location:  "Kho Tổng",
				Status:    "in_stock",
			}
			database.DB.Create(&inv)
		}
	}
	log.Println("Đã seed xong Categories, Products & Inventories.")
}
