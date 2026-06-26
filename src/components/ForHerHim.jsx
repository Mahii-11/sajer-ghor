import React from 'react'

export default function ForHerHim() {
  return (
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
                  <div className="absolute inset-0 bg-linear-to-t from-pink-950/90 via-transparent to-black/20"></div>
                  
                  {/* Text Corner Label */}
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <span className="bg-brand-pink text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-2 block w-max">
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
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-transparent to-black/20"></div>
                  
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
  )
}
