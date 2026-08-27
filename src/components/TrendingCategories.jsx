import { categories } from '../data/categories';
import SectionTitle from './SectionTitle';

export default function TrendingCategories() {
  return (
    <div>
       <section id="trending-categories" className="space-y-8">
              <SectionTitle title="TRENDING CATEGORIES" subtitle="Shop By Aesthetic" />
              
              {/* 4 columns, 2 rows matching screenshot */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    id={`trending-cat-card-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer shadow-md border border-white/40"
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
    </div>
  )
}
