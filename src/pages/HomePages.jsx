import React, { useEffect, useState } from "react";
import CategorySection from "../components/CategorySection";
import { getCategoryWiseProducts } from "../services/api"; 

export default function HomePages() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await getCategoryWiseProducts();
        setCategories(data);
      } catch (err) {
        console.error("Home Page Fetch Error:", err);
        setError("Products load korte somossha hoyechhe.");
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, []);

  // Cart click handle korar dummy handler
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
    // Ekhane apnar cart state / context / Redux dispatch execute korben
  };

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        {[1, 2].map((n) => (
          <div key={n} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  // 3. UI Render
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {categories.length > 0 ? (
        categories.map((category) => (
          <CategorySection 
            key={category.category_id} 
            category={category} 
            onAddToCart={handleAddToCart}
          />
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          Kono category product pawa zayni.
        </div>
      )}
    </main>
  );
}