
import React, { useState, useEffect, memo } from 'react';
import { ShoppingCart, Menu, X, Search, User, Heart, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { navigate, cart, categories, pausedCategories, menuCategories } = useAppStore(state => ({
    navigate: state.navigate,
    cart: state.cart,
    categories: state.settings?.categories || [],
    pausedCategories: state.settings?.pausedCategories || [],
    menuCategories: state.settings?.menuCategories || []
  }));
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (navPath: string) => {
    navigate(navPath);
    setIsMenuOpen(false);
  };

  const visibleCategories = categories.filter((cat: string) => {
    const isPaused = pausedCategories.includes(cat);
    if (isPaused) return false;
    if (menuCategories && menuCategories.length > 0) {
      return menuCategories.includes(cat);
    }
    return true;
  });
  
  const menuItems = [
      { label: 'Collection', path: '/shop' },
      ...visibleCategories.map((cat: string) => ({
          label: cat,
          path: `/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`
      })),
      { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] h-[68px] sm:h-[84px] flex items-center ${
        isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white border-b border-brand-border'
      }`}
    >
      <div className="container-luxury w-full flex justify-between items-center">
        
        {/* Left: Nav (Desktop) */}
        <nav className="hidden lg:flex items-center lg:space-x-12 flex-1">
          {menuItems.map(item => (
              <button 
                  key={item.path}
                  onClick={() => handleNavClick(item.path)} 
                  className="text-[10px] lg:text-[11px] font-display font-black uppercase tracking-[0.3em] text-brand-charcoal/80 hover:text-brand-charcoal transition-colors relative group"
              >
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-brand-charcoal transition-all duration-500 group-hover:w-full"></span>
              </button>
          ))}
        </nav>

        {/* Left: Menu Mobile */}
        <div className="flex-1 lg:hidden">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-brand-charcoal"
            >
                {isMenuOpen ? <X size={22} strokeWidth={1.6} /> : <Menu size={22} strokeWidth={1.6} />}
            </button>
        </div>

        {/* Center: Logo */}
        <div 
          onClick={() => handleNavClick('/')} 
          className="flex items-center justify-center cursor-pointer select-none lg:flex-initial"
        >
          <h1 className="font-serif text-[1.7rem] lg:text-[2.6rem] md:text-[2.2rem] font-light tracking-tight luxury-text-gradient group">
            SAZO
            <span className="block h-[0.5px] bg-brand-accent w-0 group-hover:w-full transition-all duration-1000 ease-in-out mx-auto"></span>
          </h1>
        </div>
        
        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center space-x-3 lg:space-x-8">
            <button className="text-brand-charcoal/80 hover:text-brand-charcoal transition-colors hidden lg:block">
              <Search size={22} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => handleNavClick('/cart')} 
              className="relative p-1 text-brand-charcoal/80 hover:text-brand-charcoal transition-all group"
            >
              <ShoppingCart size={24} strokeWidth={1.5} className="hidden lg:block group-hover:scale-110 transition-transform duration-500" />
              <ShoppingCart size={22} strokeWidth={1.6} className="lg:hidden group-hover:scale-110 transition-transform duration-500" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full shadow-md z-10 border border-white/20">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button 
                onClick={() => handleNavClick('/shop')} 
                className="lg:hidden p-1 text-brand-charcoal"
            >
                <Search size={22} strokeWidth={1.6} />
            </button>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
        {isMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-[90] bg-white pt-32 px-10 pb-20 overflow-y-auto"
            >
                <nav className="flex flex-col space-y-4">
                    {menuItems.map((item, idx) => (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.label}
                            onClick={() => handleNavClick(item.path)}
                            className="flex justify-between items-center group py-5 border-b border-stone-50 last:border-0"
                        >
                            <span className="text-xs font-sans font-medium uppercase tracking-widest text-brand-charcoal group-hover:text-brand-accent transition-colors">{item.label}</span>
                            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-brand-accent transform group-hover:translate-x-2 transition-all" />
                        </motion.button>
                    ))}
                </nav>

                <div className="mt-16 pt-10 border-t border-stone-100 flex flex-col space-y-6">
                     <button onClick={() => handleNavClick('/cart')} className="flex items-center justify-between py-4 px-6 bg-brand-offwhite rounded-xl group transition-all hover:bg-stone-100">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-stone-600 group-hover:text-brand-charcoal">Your Edit</span>
                        <span className="text-[9px] font-bold bg-brand-charcoal text-white w-5 h-5 flex items-center justify-center rounded-full tracking-normal">
                            {cartItemCount}
                        </span>
                     </button>
                     <button onClick={() => handleNavClick('/checkout')} className="w-full py-5 rounded-xl bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-md shadow-stone-50">
                        Secure Checkout
                     </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};

export default memo(Header);
