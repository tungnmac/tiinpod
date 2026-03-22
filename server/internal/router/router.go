package router

import (
	_ "server/docs"
	"server/internal/handler"
	"server/pkg/middleware"
	"time"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
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
	// Swagger documentation route - PHẢI ĐẶT NGOÀI GROUP /API
	engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Healthcheck endpoint
	engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "up",
			"message": "Server is healthy",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Redirect root to swagger
	engine.GET("/", func(c *gin.Context) {
		c.Redirect(301, "/swagger/index.html")
	})

	api := engine.Group("/api")
	{
		// Public routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", r.Handlers.Auth.Register)
			auth.POST("/login", r.Handlers.Auth.Login)
			auth.POST("/refresh", r.Handlers.Auth.Refresh)
			auth.POST("/logout", r.Handlers.Auth.Logout)
		}

		// Protected routes (Cần Login)
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			categories := protected.Group("/categories")
			{
				categories.POST("", r.Handlers.Category.Create)
				categories.GET("", r.Handlers.Category.GetAll)
				categories.GET("/:id", r.Handlers.Category.GetByID)
				categories.PUT("/:id", r.Handlers.Category.Update)
				categories.DELETE("/:id", r.Handlers.Category.Delete)
			}

			products := protected.Group("/products")
			{
				products.GET("", r.Handlers.Product.GetAll)
				products.GET("/:id", r.Handlers.Product.GetByID)
				products.PUT("/:id", r.Handlers.Product.Update)
				products.DELETE("/:id", r.Handlers.Product.Delete)
			}

			orders := protected.Group("/orders")
			{
				orders.POST("", r.Handlers.Order.Create)
				orders.GET("", r.Handlers.Order.GetAll)
				orders.GET("/:id", r.Handlers.Order.GetByID)
				orders.PUT("/:id", r.Handlers.Order.Update)
				orders.DELETE("/:id", r.Handlers.Order.Delete)
			}

			shipments := protected.Group("/shipments")
			{
				shipments.POST("", r.Handlers.Shipment.Create)
				shipments.GET("", r.Handlers.Shipment.GetAll)
				shipments.GET("/:id", r.Handlers.Shipment.GetByID)
				shipments.PUT("/:id", r.Handlers.Shipment.Update)
				shipments.DELETE("/:id", r.Handlers.Shipment.Delete)
			}

			cart := protected.Group("/cart")
			{
				cart.POST("/add", r.Handlers.Cart.AddItem)
				cart.GET("", r.Handlers.Cart.GetCart)
			}

			checkout := protected.Group("/checkout")
			{
				checkout.POST("", r.Handlers.Checkout.ProcessCheckout)
			}

			payment := protected.Group("/payment")
			{
				payment.POST("", r.Handlers.Payment.ProcessPayment)
			}

			// Admin only routes
			admin := protected.Group("/")
			admin.Use(middleware.RoleMiddleware("admin"))
			{
				inventories := admin.Group("/inventories")
				{
					inventories.POST("", r.Handlers.Inventory.Create)
					inventories.GET("", r.Handlers.Inventory.GetAll)
					inventories.GET("/:id", r.Handlers.Inventory.GetByID)
					inventories.PUT("/:id", r.Handlers.Inventory.Update)
					inventories.DELETE("/:id", r.Handlers.Inventory.Delete)
				}

				files := admin.Group("/files")
				{
					files.POST("/upload", r.Handlers.File.UploadFile)
					files.GET("/download/:filename", r.Handlers.File.DownloadFile)
					files.GET("/export/products", r.Handlers.File.ExportProducts)
					files.POST("/import/products", r.Handlers.File.ImportProducts)
				}
			}
		}
	}
}
