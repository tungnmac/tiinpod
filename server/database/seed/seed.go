package seed

import (
	"log"
	"server/database"
)

func SeedAll() {
	if database.DB == nil {
		log.Fatal("Database không tồn tại để Seed dữ liệu!")
	}

	log.Println("Bắt đầu quá trình seed dữ liệu...")

	SeedUsers()
	SeedCategoriesAndProducts()
	SeedProductTemplates()
	SeedOrders()
	SeedScenes()
	SeedPaymentMethods()

	log.Println("Hoàn tất tất cả seed dữ liệu.")
}
