import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import MyTemplates from './features/dashboard/MyTemplates';
import MainLayout from './components/layout/MainLayout';

const ProtectedLayout = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-templates" element={<MyTemplates />} />
        <Route path="/products" element={<div className="p-4 text-2xl font-bold">Quản lý Sản phẩm (Coming soon...)</div>} />
        <Route path="/orders" element={<div className="p-4 text-2xl font-bold">Quản lý Đơn hàng (Coming soon...)</div>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;