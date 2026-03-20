package cmd

import (
"fmt"
"os"

"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "tiinpod",
	Short: "TiinPod Backend Server CLI",
	Long:  `TiinPod Backend Server is managed via Cobra. Use subcommands to run api server, migrate database, etc.`,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
