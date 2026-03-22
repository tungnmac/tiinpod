package main

import "server/cmd"

// @title TiinPod E-commerce API
// @version 1.0
// @description Đây là tài liệu API cho hệ thống thương mại điện tử TiinPod.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.tiinpod.com/support
// @contact.email support@tiinpod.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	cmd.Execute()
}
