package cmd

import (
"log"
"net/http"

"server/database"
"github.com/gin-gonic/gin"
"github.com/joho/godotenv"
"github.com/spf13/cobra"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the REST API server",
	Run: func(cmd *cobra.Command, args []string) {
		if err := godotenv.Load(); err != nil {
			log.Println("Cảnh báo: Không load được file .env")
		}

		database.Connect()

		r := gin.Default()

		r.GET("/api/ping", func(c *gin.Context) {
c.JSON(http.StatusOK, gin.H{"message": "pong"})
})

		log.Println("Máy chủ đang chạy tại port :8080...")
		if err := r.Run(":8080"); err != nil {
			log.Fatalf("Lỗi khởi động máy chủ: %v", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)
}
