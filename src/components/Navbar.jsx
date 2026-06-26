import React from 'react';
import { Search, ShoppingBag, Truck, User, Menu, X, Heart } from 'lucide-react';

export default function Navbar({ 
  cartItemsCount = 0, 
  onCartClick, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  onTrackOrderClick,
  onLoginClick
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const mainCategories = [
    { name: "Makeup", key: "Makeup" },
    { name: "Skin", key: "Skin" },
    { name: "Personal Care", key: "Personal Care" },
    { name: "Mom & Baby", key: "Mom & Baby" },
    { name: "Fragrance", key: "Fragrance" },
    { name: "Men", key: "Men" }
  ];

  const promoPills = [
    { name: "BOGO", color: "bg-pink-500 hover:bg-pink-600" },
    { name: "COMBO", color: "bg-purple-500 hover:bg-purple-600" },
    { name: "CLEARANCE SALE", color: "bg-orange-500 hover:bg-orange-600" },
    { name: "BURKA", color: "bg-emerald-500 hover:bg-emerald-600" },
    { name: "MEN", color: "bg-blue-500 hover:bg-blue-600" }
  ];

  return (
    <header className="sticky top-0 glass z-50 shadow-md border-b border-pink-100/50">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Icon */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-gray-700 hover:text-[#db2777] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setSelectedCategory(null)}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#db2777] rounded-full flex items-center justify-center shadow-md">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-[#db2777] italic flex items-center">
                SHAJERGHOR
              </h1>
            </div>
            <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase -mt-0.5 hidden sm:block">
              Premium Beauty & Care
            </p>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                placeholder="Search for beauty products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-2.5 rounded-full bg-pink-50/50 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs transition-all shadow-sm"
              />
              <button 
                id="header-search-submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#db2777] hover:bg-black text-white p-2 rounded-full transition-all duration-300"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right utility links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Track Order */}
            <button
              id="btn-track-order"
              onClick={onTrackOrderClick}
              className="hidden lg:flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Order
            </button>

            {/* Login */}
            <button
              id="btn-login"
              onClick={onLoginClick}
              className="flex items-center gap-1.5 border border-pink-100 hover:border-[#db2777] text-gray-700 hover:text-[#db2777] text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 bg-white/60 backdrop-blur-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login</span>
            </button>

            {/* Cart Button */}
            <button
              id="btn-cart-nav"
              onClick={onCartClick}
              className="flex items-center gap-1.5 bg-[#db2777] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-pink-100 relative group"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[8px] rounded-full px-1.5 py-0.5">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation and Colored Pills */}
      <div className="bg-white/40 border-t border-pink-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            
            {/* Horizontal Categories Menu */}
            <nav className="flex items-center overflow-x-auto no-scrollbar gap-5 py-1">
              <button
                id="btn-cat-all"
                onClick={() => setSelectedCategory(null)}
                className={`text-[11px] font-bold whitespace-nowrap uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === null 
                    ? 'text-[#db2777] scale-105 underline underline-offset-4 decoration-2' 
                    : 'text-gray-600 hover:text-[#db2777]'
                }`}
              >
                All Products
              </button>
              {mainCategories.map((cat) => (
                <button
                  key={cat.key}
                  id={`btn-cat-${cat.key.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`text-[11px] font-bold whitespace-nowrap uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.key 
                      ? 'text-[#db2777] scale-105 underline underline-offset-4 decoration-2' 
                      : 'text-gray-600 hover:text-[#db2777]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>

            {/* Vertical dividing line on desktop */}
            <div className="hidden md:block w-px h-6 bg-pink-100"></div>

            {/* Promotional Pills */}
            <div className="flex items-center overflow-x-auto no-scrollbar gap-2 py-1">
              {promoPills.map((pill) => (
                <button
                  key={pill.name}
                  id={`promo-pill-${pill.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSearchQuery(pill.name === "CLEARANCE SALE" ? "15% OFF" : pill.name)}
                  className={`text-[10px] font-black text-white px-3 py-1 rounded-full cursor-pointer transition-all duration-300 ${pill.color} tracking-wider shadow-sm flex-shrink-0 uppercase`}
                >
                  {pill.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Search & Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 p-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Mobile Search Bar */}
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-pink-200 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Quick Track Order Mobile */}
          <button
            id="mobile-btn-track"
            onClick={() => {
              onTrackOrderClick();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Track Your Order
          </button>
        </div>
      )}
    </header>
  );
}
