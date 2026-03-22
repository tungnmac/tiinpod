package seed

import (
	"log"
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
