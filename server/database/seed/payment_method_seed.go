package seed

import (
	"log"
	"server/database"
	"server/internal/model"

	"gorm.io/gorm"
)

func SeedPaymentMethods() {
	log.Println("Bắt đầu seed Payment Methods...")
	db := database.DB

	// Get a test user
	var user model.User
	if err := db.First(&user).Error; err != nil {
		log.Println("Skipping PaymentMethods seed: No user found")
		return
	}
	log.Printf("Found user for seeding: %d (%s)\n", user.ID, user.Username)

	methods := []model.PaymentMethod{
		{
			UserID:     user.ID,
			Type:       "credit_card",
			CardHolder: "NGUYEN VAN A",
			CardNumber: "**** **** **** 1234",
			ExpiryDate: "12/26",
			IsDefault:  true,
		},
		{
			UserID:        user.ID,
			Type:          "bank_transfer",
			BankName:      "Vietcombank",
			AccountNumber: "1234567890",
			AccountName:   "NGUYEN VAN A",
			IsDefault:     false,
		},
	}

	for _, m := range methods {
		var existing model.PaymentMethod
		// Correct duplicate check: look for same user and same identification fields
		query := db.Where("user_id = ? AND type = ?", m.UserID, m.Type)
		if m.Type == "credit_card" {
			query = query.Where("card_number = ?", m.CardNumber)
		} else if m.Type == "bank_transfer" {
			query = query.Where("account_number = ?", m.AccountNumber)
		}

		err := query.First(&existing).Error
		if err != nil {
			if err.Error() == gorm.ErrRecordNotFound.Error() || err == gorm.ErrRecordNotFound {
				if createErr := db.Create(&m).Error; createErr != nil {
					log.Printf("Error creating payment method %s: %v\n", m.Type, createErr)
				} else {
					log.Printf("Created payment method: %s for user %d\n", m.Type, m.UserID)
				}
			} else {
				log.Printf("Error checking existing payment method %s: %v\n", m.Type, err)
			}
		} else {
			log.Printf("Payment method %s already exists for user %d\n", m.Type, m.UserID)
		}
	}
}
