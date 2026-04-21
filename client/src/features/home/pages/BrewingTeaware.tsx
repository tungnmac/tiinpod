import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Flame, Scale, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrency } from '../../../hooks/useCurrency';
import toast from 'react-hot-toast';

const BrewingTeaware = () => {
  const { addItem } = useCartStore();
  const { formatCurrency } = useCurrency();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id, // Chuẩn hóa về number, id phải là số thực tế từ DB
      name: item.title,
      price: parseFloat(item.price),
      currency: 'USD',
      image: item.image,
      quantity: 1
    });
    
    toast.success(`${item.title} added to collection!`, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '10px'
      },
      icon: '🏺'
    });

    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const teaware = [
    { id: 103, title: 'Ceramic Gaiwan', price: '85.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1576091160550-2173bdd99975?q=80&w=800' },
    { id: 104, title: 'Bamboo Shusaku Kettle', price: '125.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=800' },
    { id: 105, title: 'Glass Infuser Set', price: '45.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=800' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* ...existing code... */}
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase tracking-widest">Seasonal Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teaware.map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group">
              <div className="aspect-square mb-8 overflow-hidden rounded-3xl relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     onClick={() => handleAddToCart(item)}
                     className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2"
                   >
                     <ShoppingCart size={14} /> Add to Cart
                   </button>
                </div>
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-2">{item.title}</h4>
              <p className="text-indigo-600 font-bold mb-6">{formatCurrency(parseFloat(item.price), item.currency || 'USD')}</p>
              <button 
                onClick={() => handleAddToCart(item)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrewingTeaware;
