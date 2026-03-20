package database

import (
"fmt"
"log"
"os"

"server/internal/model"

"gorm.io/driver/postgres"
"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
os.Getenv("DB_HOST"),
os.Getenv("DB_USER"),
os.Getenv("DB_PASSWORD"),
os.Getenv("DB_NAME"),
os.Getenv("DB_PORT"),
)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Lỗi kết nối cơ sở dữ liệu: %v", err)
	}

	DB = db
	log.Println("Kết nối cơ sở dữ liệu thành công!")
}

func Migrate() {
    if DB == nil {
        log.Fatal("Database chưa được kết nối!")
    }

	log.Println("Đang thực hiện Migrate dữ liệu...")
	err := DB.AutoMigrate(&model.User{})
	if err != nil {
		log.Fatalf("Lỗi migrate: %v", err)
	}
	log.Println("Migrate thành công!")
}
