package seed

import (
	"log"
	"server/database"
	"server/internal/model"
)

func SeedCategoriesAndProducts() {
	database.DB.Exec("DELETE FROM inventories")
	database.DB.Exec("DELETE FROM order_items")
	database.DB.Exec("DELETE FROM orders")
	database.DB.Exec("DELETE FROM products")
	database.DB.Exec("DELETE FROM categories")

	categories := []model.Category{
		{Name: "Áo Thun", Description: "Cotton 100%, 250gsm", Slug: "ao-thun"},
		{Name: "Hoodie", Description: "Nỉ bông cao cấp", Slug: "hoodie"},
		{Name: "Túi Tote", Description: "Vải canvas bền đẹp", Slug: "tui-tote"},
		{Name: "Cốc Sứ", Description: "Gốm sứ tráng men", Slug: "coc-su"},
		{Name: "Ốp Lưng", Description: "Nhựa dẻo TPU", Slug: "op-lung"},
	}

	for i := range categories {
		database.DB.Create(&categories[i])
	}

	products := []model.Product{
		{CategoryID: &categories[0].ID, Name: "Áo Thun Oversize Black", Price: 199000, Currency: "VND", ExchangeRate: 25450, OriginalPrice: 250000, SKU: "AT-BLK-01", Stock: 50, IsActive: true},
		{CategoryID: &categories[0].ID, Name: "Áo Thun Oversize White", Price: 199000, Currency: "VND", ExchangeRate: 25450, OriginalPrice: 250000, SKU: "AT-WHT-02", Stock: 45, IsActive: true},
		{CategoryID: &categories[1].ID, Name: "Hoodie Essential Grey", Price: 350000, Currency: "VND", ExchangeRate: 25450, OriginalPrice: 450000, SKU: "HD-GRY-01", Stock: 30, IsActive: true},
		{CategoryID: &categories[2].ID, Name: "Túi Tote TiinPod Eco", Price: 99000, Currency: "VND", ExchangeRate: 25450, OriginalPrice: 150000, SKU: "TT-ECO-01", Stock: 100, IsActive: true},
		{CategoryID: &categories[3].ID, Name: "Cốc Sứ Ceramic White", Price: 120000, Currency: "VND", ExchangeRate: 25450, OriginalPrice: 150000, SKU: "CS-WHT-01", Stock: 80, IsActive: true},
		{CategoryID: &categories[4].ID, Name: "Ốp Lưng Magsafe Clear", Price: 150000, Currency: "VND", ExchangeRate: 25450, OriginalPrice: 200000, SKU: "OL-MAG-01", Stock: 120, IsActive: true},
	}

	for _, p := range products {
		if err := database.DB.Create(&p).Error; err == nil {
			inv := model.Inventory{
				ProductID: p.ID,
				Quantity:  p.Stock,
				MinStock:  5,
				Location:  "Kho Hà Nội",
				Status:    "in_stock",
			}
			database.DB.Create(&inv)
		}
	}
	log.Println("Đã seed xong Categories, Products & Inventories mới.")
}
