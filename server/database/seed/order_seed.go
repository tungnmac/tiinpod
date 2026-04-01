package seed

import (
"fmt"
"log"
"server/database"
"server/internal/model"
"time"
)

func SeedOrders() {
	var user model.User
	if err := database.DB.First(&user).Error; err != nil {
		log.Println("Không tìm thấy user để seed order")
		return
	}

	var products []model.Product
	database.DB.Find(&products)
	if len(products) < 4 {
		return
	}

	orderData := []struct {
		Status        string
		PaymentStatus string
		Tracking      string
		Items         []int // Index trong mảng products
	}{
		{"delivered", "paid", "GHTK-001", []int{0, 1}},
		{"shipped", "paid", "GHN-002", []int{2}},
		{"processing", "paid", "", []int{3, 4}},
		{"pending", "unpaid", "", []int{5}},
	}

	for i, d := range orderData {
		total := 0.0
		for _, idx := range d.Items {
			total += products[idx].Price
		}

		order := model.Order{
			UserID:          user.ID,
			OrderNumber:     fmt.Sprintf("TP-ORD-%d", time.Now().Unix()+int64(i)),
			TotalAmount:     total,
			TaxAmount:       total * 0.1,
			FinalAmount:     total * 1.1,
			Status:          d.Status,
			PaymentStatus:   d.PaymentStatus,
			ShippingAddress: "123 Giải Phóng, Hai Bà Trưng, Hà Nội",
		}
		database.DB.Create(&order)

		for _, idx := range d.Items {
			item := model.OrderItem{
				OrderID:   order.ID,
				ProductID: products[idx].ID,
				Quantity:  1,
				Price:     products[idx].Price,
				SKU:       products[idx].SKU,
				Name:      products[idx].Name,
			}
			database.DB.Create(&item)
		}

		if d.Tracking != "" {
			database.DB.Create(&model.Shipment{
				OrderID:          order.ID,
				TrackingNumber:   d.Tracking,
				Carrier:          "GHTK",
				Status:           d.Status,
				EstimatedArrival: time.Now().Add(48 * time.Hour),
			})
		}
	}

	log.Println("Đã seed xong Orders mới.")
}
