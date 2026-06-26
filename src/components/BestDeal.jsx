import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";

export const products = [
  {
    id: 1,
    name: "Hydrating Hyaluronic Acid Serum",
    brand: "L'Oreal Paris",
    price: 1250,
    oldPrice: 1500,
    rating: 4.8,
    reviews: 142,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
    category: "Skin"
  },
  {
    id: 2,
    name: "Matte Liquid Lipstick - Rouge Echo",
    brand: "Maybelline New York",
    price: 850,
    oldPrice: 990,
    rating: 4.6,
    reviews: 98,
    badge: "BOGO",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500&auto=format&fit=crop",
    category: "Makeup"
  },
  {
    id: 3,
    name: "Vitamin C Radiance Face Cream",
    brand: "The Body Shop",
    price: 1850,
    oldPrice: 2200,
    rating: 4.7,
    reviews: 215,
    badge: "15% OFF",
    image: "/products/product-1.jpg",
    category: "Skin"
  },
  {
    id: 4,
    name: "Eclat De Rose Luxury Perfume",
    brand: "Versace",
    price: 7800,
    oldPrice: 8500,
    rating: 4.9,
    reviews: 74,
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop",
    category: "Fragrance"
  },
  {
    id: 5,
    name: "Ultra Gentle Baby Head-to-Toe Wash",
    brand: "Cetaphil Baby",
    price: 950,
    oldPrice: 1100,
    rating: 4.9,
    reviews: 188,
    badge: "Mom's Choice",
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=500&auto=format&fit=crop",
    category: "Mom & Baby"
  },
  {
    id: 6,
    name: "Men's Active Charcoal Face Wash",
    brand: "Nivea Men",
    price: 450,
    oldPrice: 550,
    rating: 4.5,
    reviews: 320,
    badge: "Hot Deal",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500&auto=format&fit=crop",
    category: "Men"
  },
  {
    id: 7,
    name: "Nourishing Avocado Hair Mask",
    brand: "Garnier",
    price: 680,
    oldPrice: 800,
    rating: 4.4,
    reviews: 105,
    badge: "Combo Deal",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    category: "Personal Care"
  },
  {
    id: 8,
    name: "Sunscreen SPF 50+ Dry Touch",
    brand: "La Roche-Posay",
    price: 2450,
    oldPrice: 2800,
    rating: 4.8,
    reviews: 412,
    badge: "Dermatologist Tested",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop",
    category: "Skin"
  },
 
];



export default function BestDeal() {
  return (
    <section id="best-deal-section" className="space-y-8 mb-7">
                 <SectionTitle title="BEST DEAL" subtitle="Unmissable Value" />
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {products.map((product) => (
                     <ProductCard 
                       key={product.id} 
                       product={product} 
                     />
                   ))}
                 </div>
               </section>
  )
}
