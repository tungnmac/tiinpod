package cmd

import (
"log"

"server/database"
"github.com/joho/godotenv"
"github.com/spf13/cobra"
)

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Run database migrations",
	Run: func(cmd *cobra.Command, args []string) {
		if err := godotenv.Load(); err != nil {
			log.Println("Cảnh báo: Không load được file .env")
		}

		database.Connect()
		database.Migrate()
		log.Println("Hoàn tất quá trình Migrate Database.")
	},
}

func init() {
	rootCmd.AddCommand(migrateCmd)
}
