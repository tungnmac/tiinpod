import React from 'react';
import { 
  Instagram, Facebook, Youtube, Linkedin, 
  Twitter, Music2 
} from 'lucide-react'; // Đảm bảo đã cài lucide-react

const Footer: React.FC = () => {
  const socialIcons = [
    { Icon: Instagram, href: '#' },
    { Icon: Facebook, href: '#' },
    { Icon: Youtube, href: '#' },
    { Icon: Linkedin, href: '#' },
    { Icon: Twitter, href: '#' }, // Dùng cho biểu tượng X
    { Icon: Music2, href: '#' }, // Dùng cho biểu tượng TikTok
  ];

  const footerLinks = [
    'Services', 'Integrations', 'Shipping', 'Policies', 
    'Your Privacy Choices', 'Feature requests', 'Blog', 'FAQ'
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Vùng trên: Logo, Slogan và Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-12">
          
          {/* Cột trái: Brand & Slogan */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
               {/* Thay bằng ảnh logo thật của bạn nếu có */}
              <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center text-white font-bold text-xs italic">
                ▲
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                PRINTFUL
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Fulfilling your ideas on demand
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trusted to deliver 129.5M items since 2013
            </p>
          </div>

          {/* Cột phải: Navigation Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end text-sm font-medium text-gray-600">
            {footerLinks.map((link) => (
              <a 
                key={link} 
                href="#" 
                className="hover:text-red-600 transition-colors flex items-center gap-1"
              >
                {link === 'Your Privacy Choices' && (
                  <span className="inline-block w-6 h-3 bg-blue-500 rounded-full relative mr-1">
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] text-white">✓</span>
                  </span>
                )}
                {link}
              </a>
            ))}
            <div className="w-full lg:text-right mt-2">
              <a href="#" className="text-gray-500 hover:text-red-600">Recent updates</a>
            </div>
          </div>
        </div>

        {/* Vùng giữa: Social Icons */}
        <div className="flex flex-wrap gap-2 mb-12">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-all"
            >
              <social.Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;