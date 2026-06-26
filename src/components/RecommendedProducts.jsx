import React from 'react'
import SectionTitle from './SectionTitle'

export default function RecommendedProducts() {
  return (
     <section id="recommended-products" className="space-y-8">
              <SectionTitle title="RECOMMENDED PRODUCTS" subtitle="Dermatologically Curated" />
              
              {/* 2-Column Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skin Routine Guide left */}
                <div className="glass border border-white/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center shadow-md">
                  <div className="w-full sm:w-1/3 aspect-square shrink-0 rounded-2xl overflow-hidden bg-white/70 border border-pink-100">
                    <img 
                      src="/products/product-2.jpg" 
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
            
                        className="bg-black hover:bg-[#db2777] text-white text-xs font-black px-4 py-2 rounded-full transition-all duration-300"
                      >
                        Buy Package
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
  )
}
