package seed

import (
	"fmt"
	"log"
	"server/database"
	"server/internal/model"
	"time"
)

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

	order1 := model.Order{
		UserID:          user.ID,
		OrderNumber:     fmt.Sprintf("ORD-%d", time.Now().Unix()),
		TotalAmount:     150000 + (250000 * 2),
		TaxAmount:       (150000 + 500000) * 0.1,
		FinalAmount:     (150000 + 500000) * 1.1,
		Status:          "delivered",
		PaymentStatus:   "paid",
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
		OrderID:          order1.ID,
		TrackingNumber:   "GHTK12345",
		Carrier:          "GHTK",
		Status:           "delivered",
		EstimatedArrival: time.Now(),
	})

	log.Println("Đã seed xong Orders & OrderItems.")
}
