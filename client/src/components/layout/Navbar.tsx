import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, ChevronDown, Bell, ShoppingCart, Globe, Check, Info, AlertTriangle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { items } = useCartStore();
  const { user, clearAuth } = useAuthStore();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const handleOpenCart = () => {
    const event = new CustomEvent('open-cart');
    window.dispatchEvent(event);
  };

  const notifications = [
    { id: 1, title: 'Order #1234 Successful', time: '2 mins ago', icon: Check, color: 'bg-emerald-50 text-emerald-600', desc: 'Your print order has been processed.' },
    { id: 2, title: 'New Template Available', time: '1 hour ago', icon: Info, color: 'bg-blue-50 text-blue-600', desc: 'The "Summer Vibes" collection is out.' },
    { id: 3, title: 'Account Security', time: '5 hours ago', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600', desc: 'Please verify your backup email.' }
  ];

  return (
    <nav className="fixed top-0 z-50 bg-white border-b border-gray-200 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <a href="/" className="flex ms-2 md:me-24 italic tracking-widest">
              <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap text-indigo-600">TiinPod</span>
            </a>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input type="text" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('search')} />
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="p-2 text-gray-500 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">{i18n.language}</span>
                </button>
                
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={`flex items-center w-full px-4 py-2 text-sm ${i18n.language === 'en' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => changeLanguage('vi')}
                      className={`flex items-center w-full px-4 py-2 text-sm ${i18n.language === 'vi' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Tiếng Việt
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Button */}
              <div className="relative" ref={notifRef}>
                <button 
                  type="button" 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`p-2 rounded-lg transition-all relative ${isNotifOpen ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-5 mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">Notifications</h3>
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Clear All</button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto px-2 space-y-1">
                      {notifications.map((n) => (
                        <button key={n.id} className="w-full flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all text-left group">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${n.color}`}>
                            <n.icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{n.title}</p>
                              <span className="text-[9px] font-bold text-gray-400 uppercase flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{n.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 px-5 pt-3 border-t border-gray-50">
                      <button className="w-full py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:bg-indigo-50 hover:text-indigo-600 transition-all">View All Activity</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button 
                onClick={handleOpenCart}
                className="relative p-2 text-gray-500 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="View Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                      {items.length}
                    </span>
                  )}
                </div>
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1 md:mx-2"></div>

              {/* User Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <div>
                  <button 
                    type="button" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-sm bg-white rounded-full focus:ring-4 focus:ring-gray-200 transition-all p-1 hover:bg-gray-50"
                  >
                    <img className="w-8 h-8 rounded-full border border-gray-200" src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=6366f1&color=fff`} alt="user photo" />
                    <div className="hidden md:block text-left mr-1">
                      <p className="text-xs font-semibold text-gray-700">{user?.username || 'Guest'}</p>
                      <p className="text-[10px] text-gray-400">{user?.email || 'No email'}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Dropdown panel */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                      <p className="text-sm font-semibold text-gray-800">{user?.username || 'Guest'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</p>
                    </div>
                    
                    <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      <User className="w-4 h-4 me-3 text-gray-400" />
                      {t('profile')}
                    </a>
                    <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      <Settings className="w-4 h-4 me-3 text-gray-400" />
                      {t('settings')}
                    </a>
                    
                    <div className="border-t border-gray-50 mt-2">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 me-3" />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
