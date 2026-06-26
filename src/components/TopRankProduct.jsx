import React from 'react'
import SectionTitle from './SectionTitle'
import ProductCard from './ProductCard'

export const topRankingProducts = [
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
 
 
  {
    id: 11,
    name: "Baby Moisture Rich Lotion",
    brand: "Cetaphil Baby",
    price: 890,
    oldPrice: 1050,
    rating: 4.8,
    reviews: 94,
    badge: "Soft Touch",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop",
    category: "Mom & Baby"
  },
  {
    id: 12,
    name: "Wood Sage & Sea Salt Cologne",
    brand: "Jo Malone",
    price: 9500,
    oldPrice: 11000,
    rating: 4.9,
    reviews: 58,
    badge: "Luxury",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop",
    category: "Fragrance"
  },

 
  {
    id: 16,
    name: "Intense Repair Shea Body Butter",
    brand: "The Body Shop",
    price: 1650,
    oldPrice: 1950,
    rating: 4.8,
    reviews: 230,
    badge: "Winter Care",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop",
    category: "Personal Care"
  },
  {
    id: 17,
    name: "Classic Silk Red Lipstick",
    brand: "MAC Cosmetics",
    price: 2400,
    oldPrice: 2800,
    rating: 4.9,
    reviews: 312,
    badge: "Iconic",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500&auto=format&fit=crop",
    category: "Makeup"
  },
  {
    id: 18,
    name: "Ceramide Moisture Skin Barrier Cream",
    brand: "La Roche-Posay",
    price: 2800,
    oldPrice: 3200,
    rating: 4.8,
    reviews: 195,
    badge: "Barrier Repair",
    image: "/products/product-2.jpg",
    category: "Skin"
  },
 
  {
    id: 20,
    name: "Blue Oud Men Luxury Perfume Spray",
    brand: "Versace",
    price: 8900,
    oldPrice: 10500,
    rating: 4.9,
    reviews: 64,
    badge: "New Launch",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop",
    category: "Fragrance"
  },
 
  
 
];


export default function TopRankProduct() {
  return (
    <div>
          <section id="top-ranking-products" className="glass-pink rounded-3xl p-6 sm:p-10 space-y-8 border border-pink-200/40 shadow-sm">
              <SectionTitle title="TOP RANKING PRODUCTS" subtitle="Loved By Thousands" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topRankingProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
            </section>
    </div>
  )
}
