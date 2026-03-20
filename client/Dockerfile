# Bước 1: Build ứng dụng React với Node.js
FROM node:18-alpine as build

WORKDIR /app

# Copy các file config trước để tận dụng Docker cache
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build code (sẽ tạo thư mục dist/ chứa file tĩnh)
RUN npm run build

# Bước 2: Phục vụ ứng dụng với Nginx
FROM nginx:alpine

# Copy cấu hình Nginx do chúng ta vừa chuẩn bị
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy toàn bộ file đã build từ Bước 1 sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
