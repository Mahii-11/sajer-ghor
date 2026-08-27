import React from "react";

import ProductCard from "./ProductCard"; 
import SectionTitle from './SectionTitle'
const CategorySection = ({ category }) => {
  
  if (!category || !category.products || category.products.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
       <SectionTitle title={category.category_name} subtitle="Loved By Thousands" />

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {category.products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;