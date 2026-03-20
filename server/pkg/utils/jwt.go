package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Khóa bí mật (Nên để trong file .env thực tế)
var jwtSecret = []byte("your_super_secret_key_2026")

// CustomClaims định nghĩa cấu trúc dữ liệu lưu trong Token
type CustomClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateToken tạo ra một JWT token với thời gian hết hạn tùy chỉnh
func GenerateToken(userID uint, duration time.Duration) (string, error) {
	claims := CustomClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "my-awesome-app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidateToken kiểm tra tính hợp lệ của token và trả về Claims
func ValidateToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, err
}
