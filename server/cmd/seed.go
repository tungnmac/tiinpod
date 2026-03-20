package cmd

import (
"log"

"server/database"
"server/database/seed"

"github.com/joho/godotenv"
"github.com/spf13/cobra"
)

var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Seed default data into the database",
	Run: func(cmd *cobra.Command, args []string) {
		if err := godotenv.Load(); err != nil {
			log.Println("Cảnh báo: Không load được file .env")
		}

		database.Connect()
		
		log.Println("Bắt đầu quá trình seed dữ liệu...")
		seed.SeedUsers()
		log.Println("Hoàn tất seed dữ liệu.")
	},
}

func init() {
	rootCmd.AddCommand(seedCmd)
}
