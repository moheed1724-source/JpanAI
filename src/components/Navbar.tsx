import React from 'react';
import logoImg from '../logo.png'; // 安全引入 Logo

interface NavbarProps {
  scrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrollToSection }) => {
  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'assessment', label: 'EJU考学评估' },
    { id: 'system', label: '日本名校' },
    { id: 'timeline', label: '升学时间线' },
    { id: 'success', label: '合格实绩' },
    { id: 'experts', label: '私塾导师' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-jp-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <img src={logoImg} alt="济才日本留学 Logo" className="h-8 w-auto object-contain bg-white rounded p-1" />
            <span className="text-white font-bold text-lg tracking-widest border-l-2 border-jp-red pl-3">济才日本留学</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-400 hover:text-jp-pink hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
