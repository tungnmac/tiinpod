package handler

import (
	"net/http"
	"server/pkg/utils" // Thay 'server' bằng module name của bạn trong go.mod
	"time"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct{}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login xử lý đăng nhập và cấp cặp Token
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// GIẢ SỬ: Kiểm tra Database thành công và có UserID = 1
	// Trong thực tế: user, err := service.Authenticate(req.Username, req.Password)
	userID := uint(1)

	// 1. Tạo Access Token (Ngắn hạn - 15 phút)
	accessToken, err := utils.GenerateToken(userID, 15*time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo Access Token"})
		return
	}

	// 2. Tạo Refresh Token (Dài hạn - 7 ngày)
	refreshToken, err := utils.GenerateToken(userID, 7*24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo Refresh Token"})
		return
	}

	// 3. Thiết lập Refresh Token vào HttpOnly Cookie
	// Tham số: Name, Value, MaxAge (giây), Path, Domain, Secure, HttpOnly
	c.SetCookie("refresh_token", refreshToken, 3600*24*7, "/", "localhost", false, true)

	// 4. Trả về Access Token qua JSON
	c.JSON(http.StatusOK, gin.H{
		"message":      "Đăng nhập thành công",
		"access_token": accessToken,
	})
}

// Refresh xử lý việc cấp mới Access Token dựa trên Refresh Token trong Cookie
func (h *AuthHandler) Refresh(c *gin.Context) {
	// Lấy Refresh Token từ Cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Hết hạn phiên làm việc, vui lòng đăng nhập lại"})
		return
	}

	// Xác thực Refresh Token
	claims, err := utils.ValidateToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh Token không hợp lệ"})
		return
	}

	// Cấp mới Access Token
	newAccessToken, err := utils.GenerateToken(claims.UserID, 15*time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo Access Token mới"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": newAccessToken,
	})
}

// Logout xóa Cookie Refresh Token
func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Đăng xuất thành công"})
}
