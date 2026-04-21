import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import CartDrawer from '../common/CartDrawer';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isHomeRoute = location.pathname.startsWith('/home');

  useEffect(() => {
    const handleResize = () => {
      if (!isCollapsed) {
        if (window.innerWidth < 1024) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }
    };

    // Initialize state correct on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="antialiased bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      {!isHomeRoute && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <main className={`transition-all duration-300 ${isHomeRoute ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64'} bg-[#f8f8f8] pt-20 px-0`}>
        <div className={`p-4 border-2 border-gray-100 border-dashed rounded-lg bg-[#f8f8f8] min-h-[calc(100vh-200px)] shadow-sm ${isHomeRoute ? 'border-none p-0' : ''}`}>
          {children}
        </div>
        <Footer/>
        <div className="pb-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Vùng dưới: Copyright & Address */}
            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
              <p className="mb-2 md:mb-0">
                © 2013 - 2026 All Rights reserved. Printful® Inc. 11025 Westlake Dr, Charlotte, North Carolina 28273
              </p>
              <div className="flex items-center gap-4">
                {/* Chat button giả lập giống góc dưới ảnh */}
                <button className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-transform hover:scale-105">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
