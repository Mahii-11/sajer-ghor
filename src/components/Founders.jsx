import React from 'react'
import SectionTitle from './SectionTitle'

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


export default function Founders() {
  return (
     <section id="founders-section" className="space-y-8">
              <SectionTitle title="FOUNDERS" subtitle="Our Vision & Authenticity Pledge" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {founders.map((founder) => (
                  <div 
                    key={founder.id}
                    id={`founder-card-${founder.id}`}
                    className="glass border border-white/40 hover:border-brand-pink/30 rounded-3xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
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
                    <span className="text-xs font-semibold text-brand-pink uppercase tracking-wider block mt-1 mb-3">
                      {founder.role}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed italic max-w-xs">
                      "{founder.bio}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
  )
}
