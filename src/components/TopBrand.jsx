import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

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


export default function TopBrand() {
  return (
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
                    <div className={`absolute inset-0 bg-linear-to-br ${item.color} z-0`}></div>
                    
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

                      <span className="text-xs font-black text-brand-pink flex items-center gap-1 group-hover:gap-2 transition-all mt-4">
                        Claim Offer <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
  )
}
