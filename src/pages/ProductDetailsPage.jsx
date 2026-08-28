import React, { useState } from 'react';

const ProductDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);

  const images = [
    '/products/product-1.jpg',
    '/products/product-2.jpg',
    '/products/product-3.jpg',
    '/products/product-6.jpg',
  ];

  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase') {
      setQuantity(quantity + 1);
    }
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="bg-white font-sans text-gray-800">
   
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-1">
          <a href="#" className="hover:underline">Home</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Shop</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Skin</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Serum & Essence</a>
          <span>&gt;</span>
          <span className="text-gray-800 font-medium">Anua Niacinamide 10% + TXA 4% Dark Spot Correcting Serum</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <div>
            <div className="w-full aspect-square bg-pink-100 rounded-lg overflow-hidden mb-3 border">
              <img src={images[selectedImage]} alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square border-2 rounded-md overflow-hidden ${selectedImage === idx ? 'border-pink-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Anua Niacinamide 10% + TXA 4% Dark Spot Correcting Serum
            </h1>
            <p className="text-sm text-gray-600 mb-3"><span className="font-semibold text-gray-800">Size:</span> 30 ml</p>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-semibold">4.8/5</span>
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="text-xs text-gray-500">(25 Reviews)</span>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold text-pink-600">৳ 2449.00</span>
              <span className="text-sm text-gray-400 line-through">৳ 2800.00</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">13% OFF</span>
            </div>

            <p className="text-xs text-green-600 font-semibold mb-4">✓ In stock</p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mb-8">
              <button className="p-2 border rounded-md hover:bg-gray-50 text-pink-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <div className="flex items-center border rounded-md">
                <button onClick={() => handleQuantityChange('decrease')} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold">-</button>
                <span className="px-4 py-1.5 text-sm font-semibold">{quantity}</span>
                <button onClick={() => handleQuantityChange('increase')} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold">+</button>
              </div>

              <button className="flex-1 bg-pink-500 text-white font-bold py-2 px-6 rounded-md hover:bg-pink-600 transition uppercase text-sm">
                Add To Cart
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t text-sm">
              {[
                { title: 'Description', content: 'Formulated with 10% Niacinamide and 4% Tranexamic Acid to help fade dark spots, hyperpigmentation, and post-acne marks.' },
                { title: 'How to use', content: 'Apply a few drops to affected areas after cleansing and toning. Pat gently for better absorption.' },
                { title: 'Q & A', content: 'Ask a question about this product.' },
                { title: 'Payment & Return', content: 'Cash on delivery available. Easy 7-day return policy.' },
              ].map((item, index) => (
                <div key={index} className="border-b">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full py-3 flex justify-between items-center text-left font-medium text-gray-700 hover:text-pink-600"
                  >
                    <span>{item.title}</span>
                    <span>{openAccordion === index ? '−' : '+'}</span>
                  </button>
                  {openAccordion === index && (
                    <div className="pb-3 text-xs text-gray-600">{item.content}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center mt-6 pt-4 border-t text-xs text-gray-500">
              <div className="flex flex-col items-center">
                <div className="p-2 bg-gray-100 rounded-full mb-1">🛡️</div>
                <span>100% Genuine Products</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 bg-gray-100 rounded-full mb-1">💳</div>
                <span>100% Secure Payments</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 bg-gray-100 rounded-full mb-1">🎧</div>
                <span>Help Center +8809600000000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Grid */}
        <section className="mb-12">
          <h2 className="text-center font-bold text-lg mb-6 uppercase tracking-wider">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border rounded-md p-2 flex flex-col items-center bg-gray-50">
                <div className="w-full aspect-square bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-3 bg-gray-200 rounded mb-1"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Products Grid */}
        <section className="mb-12">
          <h2 className="text-center font-bold text-lg mb-6 uppercase tracking-wider">Recommended For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border rounded-md p-2 flex flex-col items-center bg-gray-50">
                <div className="w-full aspect-square bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-3 bg-gray-200 rounded mb-1"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </section>
      </main>

    
    </div>
  );
};

export default ProductDetailsPage;