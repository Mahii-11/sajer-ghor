

export default function SearchResult() {
  return (
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
  )
}
