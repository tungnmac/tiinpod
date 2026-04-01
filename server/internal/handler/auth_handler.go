package handler

import (
	"fmt"
	"net/http"
	"time"

	"server/internal/service"
	"server/pkg/utils"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{
		service: authService,
	}
}

type LoginRequest struct {
	Username string `json:"username" binding:"required" example:"admin"`
	Password string `json:"password" binding:"required" example:"123456"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required" example:"newuser"`
	Password string `json:"password" binding:"required" example:"password123"`
	Email    string `json:"email" binding:"required,email" example:"new.user@example.com"`
	Role     string `json:"role" example:"user"`
}

// @Summary Đăng ký người dùng mới
// @Description Tạo tài khoản người dùng mới trong hệ thống
// @Tags Auth
// @Accept json
// @Produce json
// @Param registerRequest body RegisterRequest true "Thông tin đăng ký"
// @Success 201 {object} map[string]interface{} "Đăng ký thành công"
// @Failure 400 {object} map[string]string "Dữ liệu hoặc Username đã tồn tại"
// @Router /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	user, err := h.service.Register(req.Username, req.Password, req.Email, req.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Đăng ký thành công",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"role":     user.Role,
		},
	})
}

// @Summary Đăng nhập người dùng
// @Description Thực hiện đăng nhập bằng username và password để nhận access token
// @Tags Auth
// @Accept json
// @Produce json
// @Param loginRequest body LoginRequest true "Thông tin đăng nhập"
// @Success 200 {object} map[string]interface{} "Đăng nhập thành công và trả về access token"
// @Failure 400 {object} map[string]string "Dữ liệu không hợp lệ"
// @Failure 401 {object} map[string]string "Sai tên đăng nhập hoặc mật khẩu"
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	fmt.Printf("Attempting login for user: %s\n", req.Username)

	user, err := h.service.Authenticate(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai tên đăng nhập hoặc mật khẩu"})
		return
	}

	// 1. Tạo Access Token (Ngắn hạn - 15 phút)
	accessToken, err := utils.GenerateToken(user.ID, user.Role, 15*time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo Access Token"})
		return
	}

	// 2. Tạo Refresh Token (Dài hạn - 7 ngày)
	refreshToken, err := utils.GenerateToken(user.ID, user.Role, 7*24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo Refresh Token"})
		return
	}

	// 3. Thiết lập Refresh Token vào HttpOnly Cookie
	c.SetCookie("refresh_token", refreshToken, 3600*24*7, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message":      "Đăng nhập thành công",
		"access_token": accessToken,
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Hết hạn phiên làm việc"})
		return
	}

	claims, err := utils.ValidateToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh Token không hợp lệ"})
		return
	}

	// Cấp mới Access Token với cả UserID và Role
	newAccessToken, err := utils.GenerateToken(claims.UserID, claims.Role, 15*time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo Access Token mới"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": newAccessToken,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Đăng xuất thành công"})
}
