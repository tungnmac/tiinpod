# TiinPod - Workspace Management System

TiinPod là một hệ thống quản lý không gian và dữ liệu hiện đại, được xây dựng với kiến trúc Full-stack tối ưu. Dự án được chia thành hai phần chính: Client (Giao diện người dùng) và Server (API Backend).

## 🚀 Công nghệ sử dụng

### 1. Frontend (Client)
- **Framework:** React 18 với Vite cho tốc độ build siêu tốc.
- **Styling:** Tailwind CSS 3 (Layout Split-screen hiện đại).
- **Routing:** React Router DOM v6.
- **API Client:** Axios.
- **Ngôn ngữ:** TypeScript.

### 2. Backend (Server)
- **Ngôn ngữ:** Golang.
- **Web Framework:** Gin-Gonic (Nhanh và nhẹ).
- **ORM:** GORM (với PostgreSQL Driver).
- **CLI Management:** Cobra (Quản lý các lệnh chạy Server, Migrate, Seed...).
- **Authentication:** Mã hóa mật khẩu với `bcrypt` (Dự kiến mở rộng JWT / OAuth).

### 3. Database & Infrastructure
- **Database:** PostgreSQL 16
- **Cache / Session:** Redis 7
- **Containerization:** Docker & Docker Compose
- **Quản lý quy trình:** Makefile

---

## 🛠 Hướng dẫn cài đặt và khởi chạy

Đảm bảo bạn đã cài đặt: \`Make\`, \`Docker\`, \`Go (>=1.22)\`, \`Node.js\` và \`npm\`.

### 1. Cài đặt ban đầu
Cài đặt toàn bộ thư viện cho Node.js và Go:
\`\`\`bash
# Tải các gói thư viện cho Client
make client-install

# Tải các gói thư viện cho Server
make server-tidy
\`\`\`

### 2. Khởi tạo Database
Bật các container Database và tiến hành nạp cấu trúc, dữ liệu mẫu:
\`\`\`bash
# 1. Khởi động PostgreSQL và Redis
make docker-up

# 2. Tạo cấu trúc bảng (Table) trong Database
make server-migrate

# 3. Tạo dữ liệu mẫu (Seed Data)
## Sẽ tự động tạo 2 tài khoản: 
## - admin@tiinpod.com / 123456
## - user@tiinpod.com / 123456
make server-seed
\`\`\`

### 3. Chạy Môi trường Phát triển (Development)
Để chạy song song cả Server và Client siêu tiện lợi:
\`\`\`bash
make dev
\`\`\`
- 🌐 **Frontend (Client):** Sẽ chạy trên \`http://localhost:5173\` (hoặc port Vite cấp định).
- ⚙️ **Backend API:** Sẽ chạy trên \`http://localhost:8080\`.
- 🗄 **PostgreSQL:** Chạy trên Port \`5433\`.

---

## 📜 Danh sách các lệnh Make hữu ích khác

### Node / Client
- \`make client-dev\`: Chỉ chạy riêng Frontend.
- \`make client-build\`: Build Frontend ra production (thư mục \`dist\`).

### Go / Server
- \`make server-dev\`: Chỉ chạy API Server.
- \`make server-build\`: Biên dịch Server ra file thực thi (nằm trong thư mục \`bin/\`).

### Docker
- \`make docker-down\`: Tắt hoàn toàn Database và Redis.

---
*Dự án đang trong giai đoạn phát triển.*

### 4. Chạy mô phỏng Production qua Docker
Nếu bạn muốn Test cấu hình Production hoặc lấy code này ném thẳng lên VPS (EC2):
\`\`\`bash
# Bước 1: Build Image Server & Client, tạo mạng nội bộ
docker-compose -f docker-compose.prod.yml up -d --build

# Bước 2: Chạy Migrate (Sử dụng Image Server vừa build)
docker-compose -f docker-compose.prod.yml exec server /app/tiinpod-api migrate
docker-compose -f docker-compose.prod.yml exec server /app/tiinpod-api seed
\`\`\`
Trang web sẽ chạy tại `http://localhost:80`.
