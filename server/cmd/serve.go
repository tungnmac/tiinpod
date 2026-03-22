package cmd

import (
	"log"

	"server/config"
	"server/database"
	"server/internal/handler"
	"server/internal/repository"
	"server/internal/router"
	"server/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Khởi động HTTP server",
	Run: func(cmd *cobra.Command, args []string) {
		config.LoadConfig()
		database.Connect()

		db := database.DB

		// Initialize Registry (Clean Architecture)
		repos := repository.NewRepositories(db)
		services := service.NewServices(repos)
		appHandlers := handler.NewHandlers(services)

		r := gin.Default()

		// Cấu hình CORS
		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}))

		// Register routes using the Router struct
		appRouter := router.NewRouter(appHandlers)
		appRouter.RegisterRoutes(r)

		log.Printf("Server is running on port :%s...\n", config.AppConfig.ServerPort)
		if err := r.Run(":" + config.AppConfig.ServerPort); err != nil {
			log.Fatalf("Lỗi khởi động máy chủ: %v", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)
}
