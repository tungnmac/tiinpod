import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Quan trọng để gửi/nhận Cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // TRÁNH REFRESH VÒNG LẶP: Nếu url là "/auth/refresh" thì không retry nữa
    if (originalRequest.url === '/auth/refresh' || originalRequest.url === 'auth/refresh') {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 (Hết hạn Access Token) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        localStorage.setItem('access_token', data.access_token);
        
        // Cập nhật token mới vào header của request đang bị lỗi trước khi thử lại
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        
        return api(originalRequest); // Chạy lại request cũ với token mới
      } catch (err) {
        localStorage.removeItem('access_token');
        // Chỉ redirect về login nếu không phải trang login sẵn
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;