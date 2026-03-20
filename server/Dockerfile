# Bước 1: Build file Golang tĩnh (Builder)
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Khai báo các biến môi trường để build file thực thi siêu nhẹ cho Linux
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Copy cấu hình Go mod và tải thư viện về nháp cache
COPY go.mod go.sum ./
RUN go mod download

# Copy toàn bộ mã nguồn vào
COPY . .

# Build code bằng lệnh Cobra (tạo ra file tên 'tiinpod-api')
# -ldflags="-w -s": xóa bớt thông tin debug để thu nhỏ file thực thi
RUN go build -ldflags="-w -s" -o bin/tiinpod-api main.go

# Bước 2: Tạo Image Production siêu nhỏ nhắn (chỉ vài MB)
FROM alpine:latest

WORKDIR /app

# Copy các dependencies liên quan tới timezone hoặc chứng chỉ SSL TLS
RUN apk --no-cache add ca-certificates tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Thu nhỏ Image bằng cách copy duy nhất file chạy đã được Compile từ Bước 1
COPY --from=builder /app/bin/tiinpod-api /app/tiinpod-api
# Copy file môi trường (nếu có, không bắt buộc, K8s sẽ thường truyền từ Secret/ConfigMap)
# COPY --from=builder /app/.env /app/.env

# Chạy bằng cổng 8080 cho API
EXPOSE 8080

# Chạy Server bằng lệnh "serve" (Có thể tự do truyền "migrate" ở Kubernetes InitContainers)
CMD ["/app/tiinpod-api", "serve"]
