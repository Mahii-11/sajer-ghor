import React from 'react'

export default function Search() {
  return (
    
      
          <div className="glass p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Active Filters:</span>
              {selectedCategory && (
                <span className="bg-brand-pink text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  Category: 
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-black font-extrabold cursor-pointer">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  Search:
                  <button  className="hover:text-pink-300 font-extrabold cursor-pointer">×</button>
                </span>
              )}
            </div>
            <button 
              onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
              className="text-xs text-brand-pink font-black uppercase tracking-wider hover:underline"
            >
              Clear All
            </button>
          </div>
    
  )
}
