package seed

import (
	"fmt"
	"log"
	"time"

	"server/database"
	"server/internal/model"

	"golang.org/x/crypto/bcrypt"
)

func SeedUsers() {
	var count int64
	database.DB.Model(&model.User{}).Count(&count)
	if count > 0 {
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	users := []model.User{
		{Username: "admin", Email: "admin@tiinpod.com", Password: string(hashedPassword), Role: "admin", IsActive: true},
		{Username: "user", Email: "user@tiinpod.com", Password: string(hashedPassword), Role: "user", IsActive: true},
	}
	for _, u := range users {
		database.DB.Create(&u)
	}
	log.Println("Đã seed xong Users.")
}

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

func SeedOrders() {
	var count int64
	database.DB.Model(&model.Order{}).Count(&count)
	if count > 0 {
		return
	}

	var user model.User
	database.DB.First(&user)

	var products []model.Product
	database.DB.Find(&products)

	if len(products) < 2 {
		return
	}

	// Đơn hàng 1
	order1 := model.Order{
		UserID:      user.ID,
		OrderNumber: fmt.Sprintf("ORD-%d", time.Now().Unix()),
		TotalAmount: 150000 + (250000 * 2),
		TaxAmount:   (150000 + 500000) * 0.1,
		FinalAmount: (150000 + 500000) * 1.1,
		Status:      "delivered",
		PaymentStatus: "paid",
		ShippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
	}
	database.DB.Create(&order1)

	database.DB.Create(&model.OrderItem{
		OrderID:   order1.ID, 
		ProductID: products[0].ID, 
		Quantity:  1, 
		Price:     products[0].Price,
		SKU:       products[0].SKU,
		Name:      products[0].Name,
	})
	database.DB.Create(&model.OrderItem{
		OrderID:   order1.ID, 
		ProductID: products[1].ID, 
		Quantity:  2, 
		Price:     products[1].Price,
		SKU:       products[1].SKU,
		Name:      products[1].Name,
	})
	
	database.DB.Create(&model.Shipment{
		OrderID: order1.ID, 
		TrackingNumber: "GHTK12345", 
		Carrier: "GHTK", 
		Status: "delivered", 
		EstimatedArrival: time.Now(),
	})

	log.Println("Đã seed xong Orders & OrderItems.")
}

func SeedAll() {
	if database.DB == nil {
		log.Fatal("Database không tồn tại để Seed dữ liệu!")
	}
	SeedUsers()
	SeedCategoriesAndProducts()
	SeedOrders()
}
