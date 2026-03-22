import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  ShoppingCart, 
  Files, 
  Box, 
  Layers, 
  LogOut, 
  Store, 
  PlusCircle, 
  Warehouse, 
  Settings, 
  HelpCircle,
  ChevronDown,
  User,
  Shield,
  Monitor,
  Lock,
  Smartphone,
  ClipboardList,
  CreditCard,
  ListOrdered,
  Home
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: t('home'), path: '/dashboard', icon: Home },
    { name: t('orders'), path: '/orders', icon: ListOrdered },
    { name: t('products'), path: '/products', icon: ShoppingCart },
    // { name: t('inventory'), path: '/inventory', icon: Box },
    { name: t('categories'), path: '/categories', icon: Layers },
    { name: t('stores'), path: '/stores', icon: Store },
    { 
      name: t('more'), 
      path: '/more', 
      icon: PlusCircle, 
      type: 'more',
      menus: [
        { name: t('billing'), path: '/billing', icon: CreditCard, 
          menus: [
            { name: t('payments'), path: '/billing/payments', icon: "" },
            { name: t('invoices'), path: '/billing/invoices', icon: "" },
            { name: t('payment_methods'), path: '/billing/payment-methods', icon: "" },
            { name: t('transactions'), path: '/billing/transactions', icon: "" },
            { name: t('tax_info'), path: '/billing/tax-info', icon: "" },
            { name: t('discounts'), path: '/billing/discounts', icon: "" },
          ]
         },
        { name: t('warehouse'), path: '/warehouse', icon: Warehouse,
          menus: [
            { name: t('locations'), path: '/warehouse/locations', icon: "" },
            { name: t('inventory'), path: '/warehouse/inventory', icon: "" },
            { name: t('shipments'), path: '/warehouse/shipments', icon: "" },
            { name: t('pricing'), path: '/warehouse/pricing', icon: "" },
            { name: t('stock_levels'), path: '/warehouse/stock-levels', icon: "" },
            { name: t('suppliers'), path: '/warehouse/suppliers', icon: "" },
          ]
         },
        { 
          name: t('settings'), 
          path: '/settings', 
          icon: Settings, 
          menus: [
            { name: t('profile'), path: '/settings/profile', icon: User },
            { name: t('users'), path: '/settings/users', icon: User },
            { name: t('system'), path: '/settings/system', icon: Monitor },
            { 
              name: t('security'), 
              path: '/settings/security', 
              icon: Shield, 
              menus: [
                { name: t('password'), path: '/settings/security/password', icon: Lock },
                { name: t('2fa'), path: '/settings/security/2fa', icon: Smartphone },
                { name: t('logs'), path: '/settings/security/logs', icon: ClipboardList },
              ] 
            },
          ] 
        },
        { name: t('help'), path: '/help', icon: HelpCircle },
      ]
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdowns(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const renderSubMenu = (items: any[], level = 0) => {
    return (
      <ul className={`${level === 0 ? 'py-2' : 'pl-4 mt-1 border-l border-gray-100'}`}>
        {items.map((item) => {
          const hasChildren = item.menus && item.menus.length > 0;
          const isOpen = openDropdowns.includes(item.name);

          return (
            <li key={item.path} className="mb-1">
              {hasChildren ? (
                <div>
                  <button
                    onClick={(e) => toggleDropdown(item.name, e)}
                    className="flex items-center justify-between w-full p-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="w-4 h-4 mr-3 text-gray-500" />}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && renderSubMenu(item.menus, level + 1)}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => setShowMore(false)}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-sm rounded-lg transition-colors ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon && <item.icon className="w-4 h-4 mr-3 text-gray-500" />}
                  <span>{item.name}</span>
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all duration-300 bg-white border-r border-gray-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="h-full p-4 overflow-y-auto bg-white flex flex-col justify-between relative">
        <div>
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.path} className="relative">
                {item.type === 'more' ? (
                  <div ref={moreMenuRef}>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className={`flex items-center w-full p-2 rounded-lg group transition-all duration-200 ${
                        isCollapsed ? 'justify-center' : ''
                      } ${showMore ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900 hover:bg-gray-100'}`}
                    >
                      <item.icon className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600" />
                      {!isCollapsed && <span className="ms-3">{item.name}</span>}
                    </button>

                    {/* Popup Submenu */}
                    {showMore && (
                      <div 
                        className={`fixed left-16 ${isCollapsed ? 'ml-4' : 'ml-48'} top-0 h-screen z-50 w-64 bg-white border-l border-r border-gray-200 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200`}
                      >
                        <div className="pt-20 h-full flex flex-col">
                          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('more')}</span>
                            <button 
                              onClick={() => setShowMore(false)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto px-4 py-2">
                            {item.menus && renderSubMenu(item.menus)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg group transition-all duration-200 ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600" />
                    {!isCollapsed && <span className="ms-3">{item.name}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-100">
          <li className='list-none'>
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
              }}
              className={`flex items-center w-full p-2 text-red-600 rounded-lg group hover:bg-red-50 transition-all duration-200 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="shrink-0 w-5 h-5 text-red-500 transition duration-75" />
              {!isCollapsed && <span className="ms-3 font-semibold">{t('logout')}</span>}
            </button>
          </li>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
