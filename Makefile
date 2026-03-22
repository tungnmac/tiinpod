# Tên project
PROJECT_NAME=tiinpod

# Các thư mục chính
CLIENT_DIR=client
SERVER_DIR=server

# --- CÁC LỆNH DÀNH CHO DOCKER ---
.PHONY: docker-up docker-down docker-restart docker-logs

docker-up:
	@echo "Khởi động các dịch vụ Docker (PostgreSQL, Redis)..."
	docker-compose up -d

docker-down:
	@echo "Dừng các dịch vụ Docker..."
	docker-compose down

docker-restart: docker-down docker-up

docker-logs:
	docker-compose logs -f

# --- CÁC LỆNH DÀNH CHO SERVER (GOLANG) ---
.PHONY: server-dev server-migrate server-tidy server-build server-lint

server-dev:
	@echo "Đang chạy Server API tại cổng 8080..."
	cd $(SERVER_DIR) && go run main.go serve

server-migrate:
	@echo "Chạy Migrate Database..."
	cd $(SERVER_DIR) && go run main.go migrate

server-tidy:
	@echo "Dọn dẹp thư viện Go..."
	cd $(SERVER_DIR) && go mod tidy

server-build:
	@echo "Build file thực thi server..."
	cd $(SERVER_DIR) && go build -o bin/server main.go

server-lint:
	@echo "Chạy Go linter..."
	cd $(SERVER_DIR) && golangci-lint run

server-seed:
	@echo "Chạy Seed dữ liệu mặc định..."
	cd $(SERVER_DIR) && go run main.go seed

server-clean:
	@echo "Đang làm sạch Database (DROP SCHEMA public)..."
	docker exec tiin-pod-db psql -U tiinpod_user -d tiinpod_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	@echo "Database đã được dọn dẹp. Hãy chạy 'make server-migrate' và 'make server-seed' tiếp theo."

# --- CÁC LỆNH DÀNH CHO CLIENT (REACT) ---
.PHONY: client-install client-dev client-build client-lint

client-install:
	@echo "Cài đặt thư viện Node.js cho Client..."
	cd $(CLIENT_DIR) && npm install

client-dev:
	@echo "Đang chạy Client Vite..."
	cd $(CLIENT_DIR) && npm run dev

client-build:
	@echo "Build production cho Client..."
	cd $(CLIENT_DIR) && npm run build

client-lint:
	@echo "Chạy ESLint cho Client..."
	cd $(CLIENT_DIR) && npm run lint

# --- CÁC LỆNH CHẠY FULL STACK ---
.PHONY: dev

dev: docker-up
	@echo "Bật Client và Server song song (ấn Ctrl+C để tắt)"
	# Chạy background server, và foreground cho client
	@make -j 2 server-dev client-dev
