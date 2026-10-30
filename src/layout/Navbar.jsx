import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa6';
import { Search, Truck, User, Menu, X, ChevronDown } from 'lucide-react';
import { getTotalCartQuantity, openCartPopup } from "../cart/cartSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getNavMenu, getSiteSettings } from '../services/api';
import useTypewriterPlaceholder from '../hooks/useTypewriterPlaceholder';

const SEARCH_SUGGESTIONS = [
  'Search for lipstick...',
  'Search for sunscreen...',
  'Search for face serum...',
  'Search for perfume...',
  'Search for moisturizer...',
];

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
  const searchPlaceholder = useTypewriterPlaceholder(SEARCH_SUGGESTIONS, !!searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [activeMobileCat, setActiveMobileCat] = useState(null);
  const [activeMobileSubCat, setActiveMobileSubCat] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  const totalQuantity = useSelector(getTotalCartQuantity) || 0;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSiteSettings();
        setSiteSettings(res);
      } catch (error) {
        console.error("Site settings load failed:", error);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getNavMenu();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Navbar menu load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const promoPills = [
    { name: "SHOP", color: "bg-[#0b5c63] hover:bg-[#084a50]", path: "/shop" },
    { name: "COMBO", color: "bg-[#9461f0] hover:bg-[#8049e0]", path: "/offers/combo" },
    { name: "CLEARANCE SALE", color: "bg-[#c8102e] hover:bg-[#a80d26]", path: "/offers/clearance" },
    { name: "MEN", color: "bg-[#0e80b2] hover:bg-[#0b6a95]", path: "/category/men" }
  ];

  const drawer = (
    <div className={`md:hidden fixed inset-0 z-[9999] ${mobileMenuOpen ? '' : 'pointer-events-none'}`}>
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute top-0 left-0 h-full w-[82%] max-w-xs bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out will-change-transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
            <span className="text-base font-bold text-[#db2777] italic">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-gray-500 hover:text-[#db2777] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-pink-200 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm placeholder:text-sm placeholder:font-medium"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-2 divide-y divide-gray-100 pt-2">
            {categories.map((cat) => {
              const hasSub = cat.sub_categories && cat.sub_categories.length > 0;
              const isCatOpen = activeMobileCat === cat.id;

              return (
                <div key={cat.id} className="pt-2">
                  <div className="flex items-center justify-between py-1">
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-gray-800 uppercase tracking-wide"
                    >
                      {cat.name}
                    </Link>
                    {hasSub && (
                      <button
                        onClick={() => setActiveMobileCat(isCatOpen ? null : cat.id)}
                        className="p-1 text-gray-500 hover:text-[#db2777]"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatOpen ? "rotate-180 text-[#db2777]" : ""}`} />
                      </button>
                    )}
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      hasSub && isCatOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pl-3 space-y-1 border-l-2 border-pink-200">
                      {hasSub && cat.sub_categories.map((sub) => {
                        const hasChild = sub.child_categories && sub.child_categories.length > 0;
                        const isSubOpen = activeMobileSubCat === sub.id;

                        return (
                          <div key={sub.id}>
                            <div className="flex items-center justify-between py-1">
                              <Link
                                to={`/category/${cat.slug}/${sub.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-gray-700"
                              >
                                {sub.name}
                              </Link>
                              {hasChild && (
                                <button
                                  onClick={() => setActiveMobileSubCat(isSubOpen ? null : sub.id)}
                                  className="p-1 text-gray-400"
                                >
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSubOpen ? "rotate-180 text-[#db2777]" : ""}`} />
                                </button>
                              )}
                            </div>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                hasChild && isSubOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="pl-3 space-y-1 border-l-2 border-pink-300">
                                {hasChild && sub.child_categories.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/category/${cat.slug}/${sub.slug}/${child.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 text-xs font-medium text-gray-500 hover:text-[#db2777]"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            id="mobile-btn-track"
            onClick={() => {
              onTrackOrderClick();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-4"
          >
            <Truck className="w-4 h-4" />
            Track Your Order
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_10px_30px_-18px_rgba(219,39,119,0.35)]">
      {/* Brand accent line */}
      <div className="h-[3px] w-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-rose-400" />

      {/* Row 1: logo, search, actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-3 md:gap-6 lg:gap-8 py-2.5 md:py-3">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-800 hover:text-[#db2777] transition-colors relative w-7 h-7 shrink-0"
            aria-label="Toggle menu"
          >
            <Menu className={`w-7 h-7 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
            <X className={`w-7 h-7 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0 cursor-pointer" onClick={() => setSelectedCategory(null)}>
            {settingsLoading ? (
              <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse" />
            ) : (
              <div className="flex items-center gap-2">
                {siteSettings?.logo && (
                  <img
                    src={siteSettings.logo}
                    alt={siteSettings?.name || "Shajer Ghor"}
                    className="h-8 w-auto object-contain mt-1.5"
                  />
                )}
                {(siteSettings?.site_title || siteSettings?.site_subtitle) && (
                  <div className="leading-none">
                    {siteSettings?.site_title && (
                      <h1 className="text-xl md:text-[26px] font-black uppercase tracking-[0.14em] text-gray-950">
                        {siteSettings.site_title}
                      </h1>
                    )}
                    {siteSettings?.site_subtitle && (
                      <p className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase mt-1 hidden sm:block">
                        {siteSettings.site_subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </Link>

          {/* Search */}
          <div className="hidden md:block flex-1">
            <div className="relative w-full max-w-[490px] mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-11 pr-5 rounded-full bg-gray-50 border-2 border-[#db2777]/80 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-pink-100 transition-all duration-200"
              />
              <button id="header-search-submit" type="submit" className="sr-only">Search</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="btn-track-order"
              onClick={onTrackOrderClick}
              className="hidden lg:flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-[13px] font-bold uppercase tracking-wide h-8 px-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              Track Order
            </button>

            <button
              id="btn-login"
              onClick={onLoginClick}
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-pink-50 text-gray-900 hover:text-[#db2777] text-[13px] font-bold uppercase tracking-wide h-8 px-3 sm:px-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Login</span>
            </button>

            <button
              id="btn-cart-nav"
              onClick={() => dispatch(openCartPopup())}
              className="flex items-center justify-center gap-2 bg-[#db2777] hover:bg-[#be185d] text-white text-[13px] font-bold uppercase tracking-wide h-8 px-3 sm:px-4 rounded-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <FaCartPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalQuantity > 0 && (
                <span className="bg-white text-[#db2777] text-[11px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: categories + promo pills */}
      <div className="border-t border-gray-100 w-full">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative"
          onMouseLeave={() => setHoveredCat(null)}
        >
          <div className="flex items-center justify-between gap-4 py-2 md:py-2.5 w-full">

            <nav className="hidden md:flex flex-1 min-w-0 flex-nowrap items-center gap-2 lg:gap-3 whitespace-nowrap overflow-x-auto no-scrollbar">
              {loading ? (
                <span className="text-sm text-gray-400 font-medium">Loading categories...</span>
              ) : (
                categories.map((cat) => {
                  const hasSub = cat.sub_categories && cat.sub_categories.length > 0;
                  const isHovered = hoveredCat?.id === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => { setSelectedCategory(cat.slug); setHoveredCat(null); }}
                      onMouseEnter={() => setHoveredCat(hasSub ? cat : null)}
                      className={`relative flex shrink-0 items-center gap-[5px] whitespace-nowrap text-[16px] font-medium tracking-wide px-2 py-2 transition-colors duration-200 after:absolute after:left-2 after:right-2 after:bottom-0 after:h-[3px] after:rounded-full after:bg-linear-to-r after:from-[#db2777] after:to-rose-400 after:origin-left after:transition-transform after:duration-300 ${
                        selectedCategory === cat.slug || isHovered
                          ? 'text-[#db2777] after:scale-x-100'
                          : 'text-gray-900 hover:text-[#db2777] after:scale-x-0 hover:after:scale-x-100'
                      }`}
                    >
                      {cat.name}
                      {hasSub && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180 text-[#db2777]' : 'text-gray-400'}`} />}
                    </Link>
                  );
                })
              )}
            </nav>

            {hoveredCat && (
              <div className="hidden md:block absolute left-0 right-0 top-full pt-1 z-50">
                <div className="bg-white rounded-2xl shadow-[0_24px_60px_-20px_rgba(219,39,119,0.35)] border border-pink-100 p-8 max-h-[70vh] overflow-y-auto">
                  <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-6 gap-8">
                    {hoveredCat.sub_categories.map((sub) => {
                      const hasChild = sub.child_categories && sub.child_categories.length > 0;
                      return (
                        <div key={sub.id} className="break-inside-avoid-column mb-6">
                          <Link
                            to={`/category/${hoveredCat.slug}/${sub.slug}`}
                            onClick={() => { setSelectedCategory(hoveredCat.slug); setHoveredCat(null); }}
                            className="block text-sm font-bold uppercase text-gray-900 hover:text-[#db2777] mb-2 tracking-wide transition-colors"
                          >
                            {sub.name}
                          </Link>
                          {hasChild && (
                            <ul className="space-y-1.5">
                              {sub.child_categories.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    to={`/category/${hoveredCat.slug}/${sub.slug}/${child.slug}`}
                                    onClick={() => { setSelectedCategory(hoveredCat.slug); setHoveredCat(null); }}
                                    className="block text-[13px] font-medium text-gray-600 hover:text-[#db2777] hover:translate-x-0.5 transition-all"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Promotional Pills */}
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar shrink-0 max-w-full md:ml-auto">
              {promoPills.map((pill) => (
                <Link
                  key={pill.name}
                  to={pill.path}
                  id={`promo-pill-${pill.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => { if (pill.name !== "SHOP") setSearchQuery(pill.name === "CLEARANCE SALE" ? "15% OFF" : pill.name); }}
                  className={`text-[13px] font-bold text-white h-8 px-3 lg:px-4 rounded-full cursor-pointer transition-all duration-200 ${pill.color} tracking-wide hover:-translate-y-0.5 active:scale-95 shrink-0 uppercase inline-flex items-center justify-center whitespace-nowrap`}
                >
                  {pill.name}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(drawer, document.body)}
    </header>
  );
}
