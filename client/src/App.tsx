import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import MyTemplates from './features/dashboard/MyTemplates';
import ProductsList from './features/product/ProductsList';
import ProductDetail from './features/product/ProductDetail';
import UpdateProduct from './features/product/UpdateProduct';
import PublicTemplatesList from './features/product/PublicTemplatesList';
import BaseTemplateDetail from './features/product/BaseTemplateDetail';
import UpdateBaseTemplate from './features/product/UpdateBaseTemplate';
import OrdersList from './features/order/OrdersList';
import OrderDetail from './features/order/OrderDetail';
import Checkout from './features/order/Checkout';
import StoresList from './features/store/StoresList';
import CategoriesList from './features/category/CategoriesList';
import MainLayout from './components/layout/MainLayout';
import SpecialtyTea from './features/home/pages/SpecialtyTea';
import BrewingTeaware from './features/home/pages/BrewingTeaware';
import CulturalApparel from './features/home/pages/CulturalApparel';
import DesignSpace from './features/home/pages/DesignSpace';
import HomeIntro from './features/home/pages/HomeIntro';
import ContentHub from './features/dashboard/ContentHub';

const ProtectedLayout = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content-hub" element={<ContentHub />} />
        <Route path="/home" element={<HomeIntro />} />
        <Route path="/home/tea" element={<SpecialtyTea />} />
        <Route path="/home/teaware" element={<BrewingTeaware />} />
        <Route path="/home/apparel" element={<CulturalApparel />} />
        <Route path="/home/design" element={<DesignSpace />} />
        <Route path="/my-templates" element={<MyTemplates />} />
        <Route path="/templates" element={<PublicTemplatesList />} />
        <Route path="/templates/new" element={<UpdateBaseTemplate />} />
        <Route path="/templates/:id" element={<BaseTemplateDetail />} />
        <Route path="/templates/:id/edit" element={<UpdateBaseTemplate />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/new" element={<UpdateProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id/edit" element={<UpdateProduct />} />
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/stores" element={<StoresList />} />
        <Route path="/categories" element={<CategoriesList />} />
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
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
