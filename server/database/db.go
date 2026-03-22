package database

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"server/config"
	"server/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	if config.AppConfig == nil {
		config.LoadConfig()
	}

	cfg := config.AppConfig
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBPort,
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

	// 1. Chạy các file migrations SQL thủ công để fix dữ liệu NULL trước khi AutoMigrate
	runSQLMigrations()

	log.Println("Đang thực hiện Migrate dữ liệu bằng GORM...")
	err := DB.AutoMigrate(
		&model.User{},
		&model.Category{},
		&model.Product{},
		&model.Order{},
		&model.OrderItem{},
		&model.Shipment{},
		&model.Inventory{},
		&model.Cart{},
		&model.CartItem{},
		&model.Payment{},
		&model.GiftCard{},
	)
	if err != nil {
		log.Fatalf("Lỗi migrate: %v", err)
	}
	log.Println("Migrate thành công!")
}

func runSQLMigrations() {
	migrationDir := "database/migrations"
	files, err := os.ReadDir(migrationDir)
	if err != nil {
		log.Printf("Bỏ qua SQL migrations: %v", err)
		return
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".sql" {
			log.Printf("Đang chạy SQL migration: %s", file.Name())
			content, err := os.ReadFile(filepath.Join(migrationDir, file.Name()))
			if err != nil {
				log.Printf("Lỗi đọc file %s: %v", file.Name(), err)
				continue
			}

			if err := DB.Exec(string(content)).Error; err != nil {
				log.Printf("Lỗi thực thi %s: %v", file.Name(), err)
			}
		}
	}
}
