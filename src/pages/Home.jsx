import React, { useState, useMemo } from 'react';
import { X, Trash2, Plus, Minus, Search, CheckCircle, ArrowRight, UserCheck, ShieldCheck, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import Footer from '../components/Footer';

// Static Data Imports
import { products } from '../data/products';
import { categories } from '../data/categories';
import { reviews } from '../data/reviews';

export default function Home() {
  // State variables for interactivity
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  
  // Modals simulation states
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  // Brand Exclusive Offers Data
  const brandOffers = [
    {
      id: 1,
      brand: "L'Oreal Paris",
      offer: "FLAT 15% OFF",
      tagline: "On Hydration Range",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
      color: "from-amber-500/10 to-[#db2777]/10",
      pillColor: "bg-amber-600"
    },
    {
      id: 2,
      brand: "Maybelline New York",
      offer: "BUY 1 GET 1 FREE",
      tagline: "On Matte Lipsticks",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop",
      color: "from-pink-500/10 to-rose-400/10",
      pillColor: "bg-pink-600"
    },
    {
      id: 3,
      brand: "The Body Shop",
      offer: "FLAT 20% OFF",
      tagline: "British Rose & Tea Tree",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop",
      color: "from-emerald-500/10 to-teal-400/10",
      pillColor: "bg-emerald-600"
    },
    {
      id: 4,
      brand: "Cetaphil Baby",
      offer: "SAVE ৳250",
      tagline: "On Baby Bath Combo",
      image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=400&auto=format&fit=crop",
      color: "from-sky-500/10 to-blue-400/10",
      pillColor: "bg-sky-600"
    },
    {
      id: 5,
      brand: "Versace",
      offer: "FREE MINIATURE",
      tagline: "With Every Eau De Parfum",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop",
      color: "from-indigo-500/10 to-purple-400/10",
      pillColor: "bg-indigo-600"
    },
    {
      id: 6,
      brand: "La Roche-Posay",
      offer: "FLAT 10% OFF",
      tagline: "Sunscreen SPF 50+ Range",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&auto=format&fit=crop",
      color: "from-cyan-500/10 to-sky-400/10",
      pillColor: "bg-cyan-600"
    },
    {
      id: 7,
      brand: "MAC Cosmetics",
      offer: "FLAT 12% OFF",
      tagline: "On Foundations & Primers",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop",
      color: "from-rose-500/10 to-red-400/10",
      pillColor: "bg-rose-600"
    },
    {
      id: 8,
      brand: "Garnier",
      offer: "BUY 2 GET 1 FREE",
      tagline: "Active Micellar Waters",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop",
      color: "from-green-500/10 to-lime-400/10",
      pillColor: "bg-green-600"
    }
  ];

  // Founders Section Data
  const founders = [
    {
      id: 1,
      name: "TASNEEM JAHAN SHOUROV",
      role: "Founder & Chief Executive Officer",
      bio: "Dedicated to sourcing authentic luxury products. Sourcing directly from official global partners is the only way we guarantee 100% purity.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "TANVIR RAHMAN NOYON",
      role: "Co-Founder & Chief Product Curator",
      bio: "Choosing dermatologically tested cosmetics for Bangladeshi skin types ensures both glamour and skin health go hand-in-hand.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "SADIA ISLAM MIMI",
      role: "Director of Logistics & Operations",
      bio: "Our express delivery system works 24/7 to transport temperature-controlled cosmetics directly to you safely with immaculate packaging.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop"
    }
  ];

  

  // Specific grids
  const bestDealProducts = useMemo(() => {
    // 4 products with the highest discounts or "BOGO"/"15% OFF" badges
    return products.filter(p => p.badge === "BOGO" || p.badge === "15% OFF" || p.badge === "20% OFF" || p.id === 1).slice(0, 4);
  }, []);

  const topRankingProducts = useMemo(() => {
    // Products with rating >= 4.8, sorted
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }, []);

  // Cart Operations
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.quantity + amount;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Simulation: Order Tracking
  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    
    // Simulate a random tracking update
    const statusArray = [
      { status: "In Transit", description: "Your package is processed at Banani Hub.", location: "Dhaka, BD", date: "Today, 10:15 AM" },
      { status: "Shipped", description: "Cosmetics carefully sealed and handed over to courier.", location: "Dhaka HQ", date: "Yesterday, 3:45 PM" },
      { status: "Out for Delivery", description: "Our rider Shajeeb is delivering your product today.", location: "Your Neighborhood", date: "Today, 1:20 PM" }
    ];
    
    const randomStatus = statusArray[trackingNumber.length % statusArray.length];
    setTrackingResult({
      id: trackingNumber.toUpperCase(),
      ...randomStatus
    });
  };

  // Simulation: Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    setUserLoggedIn(loginForm.email.split('@')[0].toUpperCase());
    setLoginOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fff1f2] text-gray-800 flex flex-col font-sans" id="home-page-container">
      
      {/* 1. HEADER SECTION (STICKY NAVBAR) */}
      <Navbar 
        cartItemsCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onTrackOrderClick={() => setTrackOrderOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
      />

      {/* 2. HERO BANNER SECTION (FULL WIDTH) */}
      {!selectedCategory && !searchQuery && (
        <section id="hero-banner-section" className="w-full -mb-16">
          <HeroBanner />
        </section>
      )}

      {/* Main Layout Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">
        
        
       
        {/* Dynamic Search / Filtering Results Section (Shows when search or category is active) */}
        {(selectedCategory || searchQuery) ? (
          <section id="filtered-results-section" className="space-y-8">
            <SectionTitle 
              title={`SHOWING RESULTS (${filteredProducts.length})`} 
              subtitle={selectedCategory ? `${selectedCategory} Collection` : "Search Results"} 
            />
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/50 backdrop-blur-md rounded-3xl border border-pink-100 max-w-md mx-auto space-y-4">
                <Search className="w-12 h-12 text-[#db2777]/40 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-gray-800">No Products Found</h3>
                <p className="text-xs text-gray-500 px-6">
                  We couldn't find anything matching your filters. Try checking your spelling or selecting a different category.
                </p>
                <button
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                  className="bg-[#db2777] text-white text-xs font-bold px-5 py-2.5 rounded-full"
                >
                  View All Products
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* 3. BEST DEAL SECTION */}
            <section id="best-deal-section" className="space-y-8 mb-7">
              <SectionTitle title="BEST DEAL" subtitle="Unmissable Value" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestDealProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* 4. TOP BRANDS EXCLUSIVE OFFERS */}
            <section id="top-brands-exclusive-offers" className="space-y-8">
              <SectionTitle title="TOP BRANDS EXCLUSIVE OFFERS" subtitle="Authorized Global Partners" />
              
              {/* 2 rows, 4 cards per row matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {brandOffers.map((item) => (
                  <div 
                    key={item.id}
                    id={`brand-offer-card-${item.id}`}
                    onClick={() => setSearchQuery(item.brand)}
                    className="relative glass rounded-3xl overflow-hidden border border-white/40 group cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48 bg-gradient-to-br"
                  >
                    {/* Soft background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} z-0`}></div>
                    
                    {/* Cover image right side */}
                    <div className="absolute right-0 bottom-0 w-1/2 h-full z-10 pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={item.image} 
                        alt={item.brand}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain object-bottom" 
                      />
                    </div>

                    {/* Content text */}
                    <div className="relative z-20 p-5 flex flex-col h-full justify-between items-start max-w-[60%]">
                      <div className="space-y-1">
                        <span className={`${item.pillColor} text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider`}>
                          {item.brand}
                        </span>
                        <h3 className="text-lg font-black text-gray-900 leading-tight pt-1">
                          {item.offer}
                        </h3>
                        <p className="text-[11px] text-gray-600 font-medium leading-tight">
                          {item.tagline}
                        </p>
                      </div>

                      <span className="text-xs font-black text-[#db2777] flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
                        Claim Offer <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. FOR HER / FOR HIM */}
            <section id="for-her-for-him" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                
                {/* For Her Banner */}
                <div 
                  id="banner-for-her"
                  onClick={() => setSelectedCategory("Skin")}
                  className="relative h-64 sm:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-md"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop" 
                    alt="For Her"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Rose dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-950/90 via-transparent to-black/20"></div>
                  
                  {/* Text Corner Label */}
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <span className="bg-[#db2777] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-2 block w-max">
                      Elegance Collection
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">For Her</h3>
                    <p className="text-xs text-pink-100 mt-1">Luxe cosmetics, skincare rituals & premium sets</p>
                  </div>
                </div>

                {/* For Him Banner */}
                <div 
                  id="banner-for-him"
                  onClick={() => setSelectedCategory("Men")}
                  className="relative h-64 sm:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-md"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop" 
                    alt="For Him"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Charcoal/blue dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/20"></div>
                  
                  {/* Text Corner Label */}
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <span className="bg-amber-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-2 block w-max">
                      Active Grooming
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">For Him</h3>
                    <p className="text-xs text-gray-200 mt-1">Charcoal face washes, hair pomades & bold cologne</p>
                  </div>
                </div>

              </div>
            </section>

            {/* 6. TOP RANKING PRODUCTS */}
            <section id="top-ranking-products" className="glass-pink rounded-3xl p-6 sm:p-10 space-y-8 border border-pink-200/40 shadow-sm">
              <SectionTitle title="TOP RANKING PRODUCTS" subtitle="Loved By Thousands" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topRankingProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* 7. RECOMMENDED PRODUCTS */}
            <section id="recommended-products" className="space-y-8">
              <SectionTitle title="RECOMMENDED PRODUCTS" subtitle="Dermatologically Curated" />
              
              {/* 2-Column Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skin Routine Guide left */}
                <div className="glass border border-white/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center shadow-md">
                  <div className="w-full sm:w-1/3 aspect-square shrink-0 rounded-2xl overflow-hidden bg-white/70 border border-pink-100">
                    <img 
                      src="https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=400&auto=format&fit=crop" 
                      alt="Vitamin C"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-4" 
                    />
                  </div>
                  <div className="space-y-3 text-left">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#db2777] bg-white px-2.5 py-1 rounded-full border border-pink-200 inline-block">
                      Routine Essential
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      Radiant Glow Vitamin C Skin Regime
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Recommended by leading Bangladeshi curators to combat air pollution and hyperpigmentation. Infused with pure organic extracts.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-lg font-black text-gray-900">৳2,530 BDT</span>
                      <button 
                        onClick={() => handleAddToCart(products[2])}
                        className="bg-black hover:bg-[#db2777] text-white text-xs font-black px-4 py-2 rounded-full transition-all duration-300"
                      >
                        Buy Package
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fragrance Guide right */}
                <div className="glass border border-white/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center shadow-md">
                  <div className="w-full sm:w-1/3 aspect-square shrink-0 rounded-2xl overflow-hidden bg-white/70 border border-pink-100">
                    <img 
                      src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop" 
                      alt="Luxury Perfume"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-4" 
                    />
                  </div>
                  <div className="space-y-3 text-left">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-700 bg-white px-2.5 py-1 rounded-full border border-pink-200 inline-block">
                      Signature Cologne
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      Luxury Scent Harmony Gift Box
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Handpicked premium Italian perfumes for romantic occasions. Sealed with a Certificate of Authenticity and luxurious box packaging.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-lg font-black text-gray-900">৳9,500 BDT</span>
                      <button 
                        onClick={() => handleAddToCart(products[11])}
                        className="bg-black hover:bg-[#db2777] text-white text-xs font-black px-4 py-2 rounded-full transition-all duration-300"
                      >
                        Buy Package
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. FOUNDERS SECTION */}
            <section id="founders-section" className="space-y-8">
              <SectionTitle title="FOUNDERS" subtitle="Our Vision & Authenticity Pledge" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {founders.map((founder) => (
                  <div 
                    key={founder.id}
                    id={`founder-card-${founder.id}`}
                    className="glass border border-white/40 hover:border-[#db2777]/30 rounded-3xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-inner mb-4 bg-gray-50">
                      <img 
                        src={founder.image} 
                        alt={founder.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                      {founder.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#db2777] uppercase tracking-wider block mt-1 mb-3">
                      {founder.role}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed italic max-w-xs">
                      "{founder.bio}"
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. TRENDING CATEGORIES */}
            <section id="trending-categories" className="space-y-8">
              <SectionTitle title="TRENDING CATEGORIES" subtitle="Shop By Aesthetic" />
              
              {/* 4 columns, 2 rows matching screenshot */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    id={`trending-cat-card-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="group relative rounded-3xl overflow-hidden aspect-square cursor-pointer shadow-md border border-white/40"
                  >
                    {/* Background Category Image */}
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 transition-opacity duration-300"></div>

                    {/* Category Details at the bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                      <h3 className="text-white text-base font-black uppercase tracking-tight leading-tight group-hover:text-pink-300 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-pink-200 font-bold block mt-0.5">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. TESTIMONIAL SECTION */}
            <section id="testimonial-section" className="space-y-8">
              <SectionTitle title="TESTIMONIALS" subtitle="#BeautyLovesShajerghor" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          </>
        )}

      </main>

      {/* 11. FOOTER */}
      <Footer />

      {/* ================================================= */}
      {/* INTERACTIVE COMPONENT: SHOPPING CART DRAWERS */}
      {/* ================================================= */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setCartOpen(false)}
          ></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white/85 backdrop-blur-xl shadow-2xl flex flex-col border-l border-white/40">
              {/* Header */}
              <div className="p-5 border-b border-pink-100/30 flex items-center justify-between bg-white/40 backdrop-blur-md">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  Shopping Cart 
                  <span className="bg-[#db2777] text-white text-xs px-2.5 py-0.5 rounded-full font-black">
                    {cart.reduce((acc, i) => acc + i.quantity, 0)} items
                  </span>
                </h3>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-3 border border-white/40 rounded-2xl hover:border-pink-100 transition-colors bg-white/60 backdrop-blur-sm relative group"
                    >
                      <div className="w-16 h-16 rounded-xl border border-pink-100 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center p-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="object-contain w-full h-full" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#db2777]">{item.brand}</span>
                        <h4 className="text-xs font-bold text-gray-800 truncate leading-snug">{item.name}</h4>
                        <span className="text-xs font-extrabold text-gray-900 block mt-1">৳{item.price.toLocaleString()}</span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2.5 mt-2.5">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-[#db2777] p-1 rounded-md transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-[#db2777] p-1 rounded-md transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 absolute top-3 right-3 p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto text-[#db2777]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">Your Cart is Empty</h3>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Explore our best deals and categories to fill your vanity with 100% authentic international products.
                    </p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="bg-[#db2777] text-white text-xs font-bold px-6 py-2.5 rounded-full"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>

              {/* Subtotal & Checkout Section */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-pink-100/30 bg-white/40 backdrop-blur-md space-y-4">
                  <div className="space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-extrabold">৳{cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Shipping</span>
                      <span className="text-emerald-600 font-bold">FREE (Promo)</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-dashed border-pink-200">
                      <span>Total (Incl. VAT)</span>
                      <span className="text-[#db2777]">৳{cartSubtotal.toLocaleString()} BDT</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setConfirmedAmount(cartSubtotal);
                      setCart([]);
                      setCartOpen(false);
                      setOrderConfirmed(true);
                    }}
                    className="w-full bg-[#db2777] hover:bg-[#be185d] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-300 shadow-md shadow-pink-100/50"
                  >
                    Place Cash on Delivery Order
                  </button>
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    By checking out you acknowledge that we guarantee 100% genuine products sourced directly from official global partners.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* INTERACTIVE COMPONENT: TRACK ORDER MODAL */}
      {/* ================================================= */}
      {trackOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="track-order-modal">
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/40 w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="p-5 bg-white/45 backdrop-blur-md border-b border-pink-100/40 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#db2777]" />
                Track Your Shipment
              </h3>
              <button 
                onClick={() => { setTrackOrderOpen(false); setTrackingResult(null); setTrackingNumber(""); }}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your Shajerghor invoice or tracking code (e.g. SG-1025) to check the real-time shipping status.
              </p>

              <form onSubmit={handleTrackOrder} className="relative">
                <input
                  id="tracking-input-field"
                  type="text"
                  placeholder="Enter Tracking Number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-full border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm font-semibold uppercase"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-[#db2777] hover:bg-black text-white p-2 rounded-full transition duration-300"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* tracking results display */}
              {trackingResult && (
                <div className="p-4 glass-pink rounded-2xl text-left space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400">Order Ref: {trackingResult.id}</span>
                    <span className="bg-[#db2777] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {trackingResult.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 leading-snug">{trackingResult.description}</h4>
                    <span className="text-[10px] text-gray-500 block mt-1">Location: {trackingResult.location}</span>
                    <span className="text-[10px] text-gray-500 block">Updated: {trackingResult.date}</span>
                  </div>
                  <div className="border-t border-pink-200 pt-2 flex items-center gap-1.5 text-[10px] text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#db2777]" />
                    <span>Temperature-controlled courier storage confirmed</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* INTERACTIVE COMPONENT: LOGIN MODAL */}
      {/* ================================================= */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="login-modal">
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/40 w-full max-w-sm overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="p-5 bg-white/45 backdrop-blur-md border-b border-pink-100/40 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#db2777]" />
                Secure User Login
              </h3>
              <button 
                onClick={() => setLoginOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Secret Password</label>
                <input
                  type="password"
                  placeholder="Enter your password..."
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#db2777] hover:bg-[#be185d] text-white text-xs font-bold py-3 rounded-xl transition duration-300 uppercase tracking-wider shadow-md shadow-pink-100/50"
              >
                Sign In To Shajerghor
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-gray-400">
                  Don't have an account? <a href="#" className="text-[#db2777] font-bold hover:underline">Sign up now</a>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* PREMIUM INTERACTIVE COMPONENT: ORDER SUCCESS TOAST */}
      {/* ================================================= */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="order-success-modal">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-200 w-full max-w-sm p-6 text-center shadow-2xl relative animate-in zoom-in duration-300 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Order Placed Successfully!</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Thank you for choosing <span className="font-extrabold text-[#db2777]">SHAJERGHOR</span>! Your Cash on Delivery order of <span className="font-black text-gray-900">৳{confirmedAmount.toLocaleString()} BDT</span> has been registered.
            </p>
            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-left text-[11px] text-emerald-800 space-y-1">
              <p className="font-bold">Estimated Delivery: 24-48 Hours</p>
              <p>Your package will be handled in temperature-controlled boxes to maintain product viability.</p>
            </div>
            <button 
              onClick={() => setOrderConfirmed(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-md shadow-emerald-100"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Simulated User logged-in floating notice */}
      {userLoggedIn && (
        <div className="fixed bottom-6 left-6 z-40 bg-black text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-pink-400/20 animate-bounce">
          <UserCheck className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <span className="text-[9px] uppercase font-bold text-gray-400 block leading-none">Welcome back</span>
            <span className="text-xs font-extrabold text-pink-300 block">{userLoggedIn}</span>
          </div>
          <button 
            onClick={() => setUserLoggedIn(null)}
            className="hover:text-[#db2777] font-black text-sm ml-2"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
