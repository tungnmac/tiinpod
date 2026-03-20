package seed

import (
"log"

"server/database"
"server/internal/model"

"golang.org/x/crypto/bcrypt"
)

// SeedUsers tạo data mặc định cho bảng User
func SeedUsers() {
	if database.DB == nil {
		log.Fatal("Database không tồn tại để Seed dữ liệu!")
	}

	// Kiểm tra xem đã có dữ liệu chưa
	var count int64
	database.DB.Model(&model.User{}).Count(&count)
	if count > 0 {
		log.Println("Bảng User đã có dữ liệu. Bỏ qua quá trình Seed.")
		return
	}

	// Mã hóa mật khẩu mặc định "123456"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Lỗi tạo mã hóa mật khẩu: %v", err)
	}

	// Các mẫu user mặc định
	users := []model.User{
		{
			Name:     "Admin TiinPod",
			Email:    "admin@tiinpod.com",
			Password: string(hashedPassword),
			Provider: "local",
			IsActive: true,
			Avatar:   "https://ui-avatars.com/api/?name=Admin+TiinPod",
		},
		{
			Name:     "Test User",
			Email:    "user@tiinpod.com",
			Password: string(hashedPassword),
			Provider: "local",
			IsActive: true,
			Avatar:   "https://ui-avatars.com/api/?name=User",
		},
	}

	// Trực tiếp lưu vào database
	for _, u := range users {
		if err := database.DB.Create(&u).Error; err != nil {
			log.Printf("Lỗi khi thêm user %s: %v\n", u.Email, err)
		} else {
			log.Printf("Đã tạo User mặc định: %s\n", u.Email)
		}
	}
}
