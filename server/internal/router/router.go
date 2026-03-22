package router

import (
	"server/internal/handler"
	"server/pkg/middleware"
	"time"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

type Router struct {
	Handlers *handler.Handlers
}

func NewRouter(h *handler.Handlers) *Router {
	return &Router{
		Handlers: h,
	}
}

func (r *Router) RegisterRoutes(engine *gin.Engine) {
	engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "up",
			"message": "Server is healthy",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	engine.GET("/", func(c *gin.Context) {
		c.Redirect(301, "/swagger/index.html")
	})

	api := engine.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", r.Handlers.Auth.Register)
			auth.POST("/login", r.Handlers.Auth.Login)
			auth.POST("/refresh", r.Handlers.Auth.Refresh)
			auth.POST("/logout", r.Handlers.Auth.Logout)
		}

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			categories := protected.Group("/categories")
			{
				categories.POST("", r.Handlers.Category.Create)
				categories.GET("", r.Handlers.Category.GetAll)
			}

			templates := protected.Group("/product-templates")
			{
				templates.GET("", r.Handlers.ProductTemplate.GetAll)
				templates.GET("/:id", r.Handlers.ProductTemplate.GetByID)
			}

			userTemplates := protected.Group("/saved-templates")
			{
				// Rate limiter for upload: 5 requests per minute per user
				rate := limiter.Rate{
					Period: 1 * time.Minute,
					Limit:  5,
				}
				store := memory.NewStore()
				instance := limiter.New(store, rate)
				uploadLimiter := mgin.NewMiddleware(instance)

				userTemplates.POST("", r.Handlers.UserTemplate.Create)
				userTemplates.PUT("/:id", r.Handlers.UserTemplate.Create) // Reuse Create as it handles Update if ID is provided
				userTemplates.DELETE("/:id", r.Handlers.UserTemplate.Delete)
				userTemplates.GET("", r.Handlers.UserTemplate.GetMyTemplates)
				userTemplates.POST("/upload", uploadLimiter, r.Handlers.UserTemplate.PreUpload)
				userTemplates.GET("/presigned-upload", r.Handlers.UserTemplate.GetPresignedUpload)
			}

			orders := protected.Group("/orders")
			{
				orders.POST("", r.Handlers.Order.Create)
				orders.GET("", r.Handlers.Order.GetAll)
			}
		}
	}
}
