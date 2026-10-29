import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { addItem } from '../cart/cartSlice';
import { getProductDetailsBySlug, submitProductReview } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductDetailSkeleton from '../loading/ProductDetailSkeleton';
import { CreditCard, Headset, ShieldCheck, Star, X, ChevronDown, ChevronUp, Heart } from 'lucide-react';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  // State Management
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Thumbnail strip: custom arrows replace the native scrollbar
  const thumbsRef = useRef(null);
  const [thumbScroll, setThumbScroll] = useState({ up: false, down: false });

  const updateThumbScroll = useCallback(() => {
    const el = thumbsRef.current;
    if (!el) return;
    setThumbScroll({
      up: el.scrollTop > 4,
      down: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    });
  }, []);

  const scrollThumbs = (dir) => {
    thumbsRef.current?.scrollBy({ top: dir * 180, behavior: 'smooth' });
  };

  useEffect(() => {
    updateThumbScroll();
    window.addEventListener('resize', updateThumbScroll);
    return () => window.removeEventListener('resize', updateThumbScroll);
  }, [product, updateThumbScroll]);

  // Keep the active thumbnail visible when the selection changes
  useEffect(() => {
    const el = thumbsRef.current?.children[selectedImage];
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [selectedImage]);

  const [quantity, setQuantity] = useState(1);
  // Only one info tab is open at a time (kept as an array of indexes)
  const [openAccordions, setOpenAccordions] = useState([]);

  // Variant States
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Review Modal & Form States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewPhone, setReviewPhone] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Q & A form states
  const [questionName, setQuestionName] = useState('');
  const [questionPhone, setQuestionPhone] = useState('');
  const [questionText, setQuestionText] = useState('');

  // API Data Fetching
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProductDetailsBySlug(slug);
        const data = res?.data || res?.product;
        setProduct(data);
        const related = data?.related_products ?? res?.similar_products;
        setSimilarProducts(Array.isArray(related) ? related : []);

        // Reset selections on slug change
        setSelectedSize(null);
        setSelectedColor(null);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        setError(err.message || 'Product failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  // Handle Quantity Change
  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase') {
      setQuantity(quantity + 1);
    }
  };

  // Toggle Accordion
  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => (prev.includes(index) ? [] : [index]));  };

  // Submit Review Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingReview) return;

    if (!reviewName.trim() || !reviewPhone.trim() || !reviewNote.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields (Name, Phone & Note).',
        confirmButtonColor: '#ec4899',
      });
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await submitProductReview(slug, {
        name: reviewName,
        phone: reviewPhone,
        rating: reviewRating,
        review: reviewNote,
      });

      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: res?.msg || 'Thank you for sharing your feedback with us.',
        confirmButtonColor: '#ec4899',
      });

      // Reset Form & Close Modal
      setReviewName('');
      setReviewPhone('');
      setReviewRating(5);
      setReviewNote('');
      setIsReviewModalOpen(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Could not submit review',
        text: err.message || 'Please try again.',
        confirmButtonColor: '#ec4899',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Submit Question Handler (static for now - API hookup comes later)
  const handleQuestionSubmit = (e) => {
    e.preventDefault();

    if (!questionName.trim() || !questionPhone.trim() || !questionText.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in your name, phone number and question.',
        confirmButtonColor: '#ec4899',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Question Submitted!',
      text: 'We will get back to you soon.',
      timer: 2000,
      showConfirmButton: false,
    });

    setQuestionName('');
    setQuestionPhone('');
    setQuestionText('');
  };

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg font-semibold mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const questions = Array.isArray(product.questions) ? product.questions : [];

  // Gallery Images List setup
  const mainImage = product.image || product.thumb_image;
  const galleryImages = [];
  if (mainImage) {
    galleryImages.push({ id: 'main', url: mainImage, color_id: null });
  }
  (Array.isArray(product.gallery) ? product.gallery : []).forEach((img, i) => {
    const url = typeof img === 'string' ? img : img?.url || img?.image;
    if (url && url !== mainImage) {
      galleryImages.push({ id: `gallery-${i}`, url, color_id: null });
    }
  });
  // Each color carries its own photo, so selecting a color can swap the main image
  (Array.isArray(product.colors) ? product.colors : []).forEach((c) => {
    if (c.image && c.image !== mainImage) {
      galleryImages.push({ id: `color-${c.id}`, url: c.image, color_id: String(c.id) });
    }
  });

  // Variant options come straight from the API: sizes, colors and their combinations
  const isVariable = product.type === 'variable';
  const availableSizes = isVariable && Array.isArray(product.sizes) ? product.sizes : [];
  const availableColors = isVariable && Array.isArray(product.colors) ? product.colors : [];
  const combinations = isVariable && Array.isArray(product.combinations) ? product.combinations : [];

  // Finding Current Matched Variant (ids can be string or number across the API)
  const matchedVariant = isVariable
    ? combinations.find((v) => {
        const sizeMatch = selectedSize ? String(v.size_id) === String(selectedSize.id) : true;
        const colorMatch = selectedColor ? String(v.color_id) === String(selectedColor.id) : true;
        return sizeMatch && colorMatch;
      })
    : null;

  // Calculate Prices dynamically
  const regularPrice = isVariable
    ? matchedVariant?.regular_price || matchedVariant?.price || product.min_price || 0
    : product.price || 0;
  const finalPrice = isVariable
    ? matchedVariant?.price || product.min_price || 0
    : product.offer_price || regularPrice;
  const offerPrice = Number(regularPrice) > Number(finalPrice) ? finalPrice : null;

  // Stock status logic
  const currentStock = isVariable ? matchedVariant?.quantity : product.stock_qty;
  const inStock =
    product.in_stock !== false &&
    (currentStock === null || currentStock === undefined || currentStock > 0);

  // Handle Color click & auto swap photo
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const colorImgIndex = galleryImages.findIndex((img) => img.color_id === String(color.id));
    if (colorImgIndex !== -1) {
      setSelectedImage(colorImgIndex);
    }
  };

  // Add To Cart Dispatch Handler
  const handleAddToCart = () => {
    if (isVariable) {
      if (availableSizes.length > 0 && !selectedSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Please Select a Size',
          text: 'You need to choose a size before adding to cart.',
          confirmButtonColor: '#ec4899',
        });
        return;
      }
      if (availableColors.length > 0 && !selectedColor) {
        Swal.fire({
          icon: 'warning',
          title: 'Please Select a Color',
          text: 'You need to choose a color before adding to cart.',
          confirmButtonColor: '#ec4899',
        });
        return;
      }
    }

    const cartPayload = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      thumb_image: selectedColor?.image || mainImage,
      brand: product.brand,
      quantity: quantity,
      selected_price: finalPrice,
      has_variants: isVariable,
      // The API has no variant id; size+color is what identifies a cart line
      variant_id: isVariable ? `${selectedSize?.id ?? ''}-${selectedColor?.id ?? ''}` : 0,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
    };

    // The global CartToast shows the "added to cart" notification
    dispatch(addItem(cartPayload));
  };

  const infoSections = [
    { 
      title: 'Description', 
      content: product.description ? (
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      ) : 'No description available.' 
    },
    {
      title: 'Benefits',
      content: product.benefits ? (
        <div dangerouslySetInnerHTML={{ __html: product.benefits }} />
      ) : 'No benefits available.',
    },
    {
      title: 'How to use',
      content: product.how_to_use ? (
        <div dangerouslySetInnerHTML={{ __html: product.how_to_use }} />
      ) : 'No usage instructions available.',
    },
    {
      title: 'Q & A',
      content: (
        <div>
        {questions.length > 0 && (
          <div className="mb-3 space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
                <p className="text-sm font-semibold text-gray-800">Q: {q.question}</p>
                {q.answer && <p className="mt-1 text-xs text-gray-600 leading-relaxed">A: {q.answer}</p>}
                <p className="mt-1 text-[10px] text-gray-400">Asked by {q.name}</p>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleQuestionSubmit} className="py-2 space-y-3">
          <p className="text-xs text-gray-600">Have a question about this product? Ask us below!</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={questionName}
              onChange={(e) => setQuestionName(e.target.value)}
              placeholder="Your name"
              className="w-full min-w-0 border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
            />
            <input
              type="tel"
              value={questionPhone}
              onChange={(e) => setQuestionPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full min-w-0 border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
            />
          </div>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Add a question..."
            rows={3}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs resize-none focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white font-medium px-4 py-2 rounded-md hover:bg-pink-600 transition text-xs"
          >
            Submit Question
          </button>
        </form>
        </div>
      ),
    },
    { 
      title: 'Customer Reviews', 
      content: (
        <div className="py-2">
          <div className="mb-4 space-y-3">
            {reviews.length === 0 && (
              <p className="text-xs text-gray-500">No reviews yet. Be the first to review this product!</p>
            )}
            {reviews.map((review) => (
              <div key={review.id ?? review.name} className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex items-center gap-6">
                  <p className="text-sm font-semibold text-gray-800 uppercase">{review.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
          <p className="mb-3 text-xs text-gray-600">Have you used this product? Share your thoughts with other customers!</p>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-pink-500 text-white font-medium px-4 py-2 rounded-md hover:bg-pink-600 transition text-xs flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            Write a Review
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="bg-white font-sans text-gray-800 relative">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <a href="#" className="hover:text-pink-600 transition-colors">Shop</a>
          {product.category && (
            <>
              <span className="text-gray-300">/</span>
              <span className="hover:text-pink-600 transition-colors">{product.category.name}</span>
            </>
          )}
          {product.sub_category && (
            <>
              <span className="text-gray-300">/</span>
              <span className="hover:text-pink-600 transition-colors">{product.sub_category.name}</span>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-pink-600 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8 mb-10 lg:items-stretch">
          {/* Gallery (fixed size + sticky, so expanding the accordions never resizes the image) */}
          <div className="flex flex-col-reverse md:flex-row gap-3 lg:sticky lg:top-28">
            <div className="relative shrink-0 md:w-20">
              {thumbScroll.up && (
                <button
                  type="button"
                  onClick={() => scrollThumbs(-1)}
                  aria-label="Scroll thumbnails up"
                  className="hidden md:flex absolute top-0 inset-x-0 z-10 h-9 items-start justify-center rounded-t-lg bg-gradient-to-b from-white via-white/90 to-transparent"
                >
                  <span className="mt-0.5 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors">
                    <ChevronUp className="w-4 h-4" />
                  </span>
                </button>
              )}
              <div
                ref={thumbsRef}
                onScroll={updateThumbScroll}
                className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto md:absolute md:inset-0 pb-1 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-white ${
                    selectedImage === idx
                      ? 'border-pink-500 ring-2 ring-pink-100'
                      : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
              </div>
              {thumbScroll.down && (
                <button
                  type="button"
                  onClick={() => scrollThumbs(1)}
                  aria-label="Scroll thumbnails down"
                  className="hidden md:flex absolute bottom-0 inset-x-0 z-10 h-9 items-end justify-center rounded-b-lg bg-gradient-to-t from-white via-white/90 to-transparent"
                >
                  <span className="mb-0.5 w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
              )}
            </div>
            <div className="relative w-full md:flex-1 aspect-square overflow-hidden rounded-xl lg:cursor-zoom-in"
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
            >
              <img
                src={galleryImages[selectedImage]?.url || mainImage}
                alt={product.name}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: zoom.active ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-[1.65rem] font-bold text-gray-900 leading-snug mb-4 tracking-tight lg:-mt-1.5">
              {product.name}
            </h1>

            {/* Brand / Category display */}
            {product.brand && (
              <p className="text-lg text-gray-500 mb-3">
                Brand: <span className="font-semibold text-black">{product.brand.name}</span>
              </p>
            )}

            {/* Size Options (Conditional Render) */}
            {isVariable && availableSizes.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold text-gray-800">Size:</span> {selectedSize?.name || 'Select Size'}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 border text-xs font-semibold rounded-lg transition-colors ${
                        selectedSize?.id === size.id
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options (Conditional Render) */}
            {isVariable && availableColors.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold text-gray-800">Color:</span> {selectedColor?.name || 'Select Color'}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      className={`px-3.5 py-1.5 border text-xs font-semibold rounded-lg transition-colors ${
                        selectedColor?.id === color.id
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Placeholder */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-semibold text-gray-800">4.8/5</span>
              <div className="flex text-amber-400 text-[30px] leading-none tracking-tight">★★★★★</div>
              <span className="text-base text-gray-500">(25 Reviews)</span>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Pricing Section */}
            <div className="flex items-center flex-wrap gap-3 mt-3 mb-1">
              <span className="text-3xl font-bold text-pink-600">
                <span className="text-[26px] font-black mr-1.5 bg-gradient-to-br from-pink-500 to-rose-700 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(219,39,119,0.25)]">৳</span>{Number(finalPrice).toFixed(2)}
              </span>
              {offerPrice && Number(regularPrice) > Number(finalPrice) && (
                <>
                  <span className="text-xl text-gray-400 line-through">৳ {Number(regularPrice).toFixed(2)}</span>
                  <span className="text-lg font-semibold text-green-600">
                    Save ৳ {(Number(regularPrice) - Number(finalPrice)).toFixed(2)}
                  </span>
                  <span className="discount-badge shrink-0">
                  <span
                    className="relative inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-gradient-to-br from-pink-500 to-red-500 text-white"
                    style={{
                      clipPath:
                        'polygon(100% 50%, 86.7% 59.83%, 93.3% 75%, 76.87% 76.87%, 75% 93.3%, 59.83% 86.7%, 50% 100%, 40.17% 86.7%, 25% 93.3%, 23.13% 76.87%, 6.7% 75%, 13.3% 59.83%, 0% 50%, 13.3% 40.17%, 6.7% 25%, 23.13% 23.13%, 25% 6.7%, 40.17% 13.3%, 50% 0%, 59.83% 13.3%, 75% 6.7%, 76.87% 23.13%, 93.3% 25%, 86.7% 40.17%)',
                    }}
                  >
                    <span className="discount-badge-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    <span className="relative flex flex-col items-center leading-none -rotate-6">
                      <span className="text-[13px] font-extrabold">
                        {Math.round(((Number(regularPrice) - Number(finalPrice)) / Number(regularPrice)) * 100)}%
                      </span>
                      <span className="text-[8px] font-bold tracking-wide">OFF</span>
                    </span>
                  </span>
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {inStock ? (
              <p className="text-sm text-green-600 font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> In stock
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Out of stock
              </p>
            )}

            <div className="border-t border-gray-100 mb-3"></div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`h-12 w-12 shrink-0 flex items-center justify-center border rounded-xl transition-all duration-300 ease-in-out active:scale-95 ${
                  isLiked
                    ? 'bg-pink-500 border-pink-500 text-white shadow-md'
                    : 'border-gray-200 text-pink-500 hover:bg-pink-50'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isLiked ? 'fill-white text-white scale-110' : 'text-pink-500'
                  }`}
                />
              </button>

              <div className="flex items-center h-12 border border-gray-200 rounded-xl overflow-hidden shrink-0">
                <button onClick={() => handleQuantityChange('decrease')} className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold transition-colors">-</button>
                <span className="w-10 h-full flex items-center justify-center text-sm font-semibold border-x border-gray-200">{quantity}</span>
                <button onClick={() => handleQuantityChange('increase')} className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold transition-colors">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 h-12 font-bold rounded-xl transition-all uppercase text-sm tracking-wide shadow-sm ${
                  inStock
                    ? 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                Add To Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex-1 min-h-2" />
            <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white">
                <div className="p-3 bg-pink-50 rounded-full">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
                </div>
                <span className="leading-snug">100% Genuine Products</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white">
                <div className="p-3 bg-pink-50 rounded-full">
                  <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
                </div>
                <span className="leading-snug">100% Secure Payments</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white">
                <div className="p-3 bg-pink-50 rounded-full">
                  <Headset className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
                </div>
                <span className="leading-snug">Help Center (+8809666737475)</span>
              </div>
            </div>
          </div>
        </div>


        {/* Info Tabs: sit side by side, the active one expands below */}
        <section className="mb-14 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-2">
            {infoSections.map((item, index) => {
              const isOpen = openAccordions.includes(index);
              return (
                <button
                  key={item.title}
                  onClick={() => toggleAccordion(index)}
                  className={`py-2 text-[13px] uppercase tracking-[0.18em] border-b transition-colors duration-200 ${
                    isOpen
                      ? 'border-pink-500 text-pink-600 font-semibold'
                      : 'border-transparent text-gray-500 font-medium'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
          {openAccordions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
              {openAccordions.map((index) => (
                <div key={infoSections[index].title}>{infoSections[index].content}</div>
              ))}
            </div>
          )}
        </section>

        {/* Similar Products Grid */}
        {similarProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-center font-bold text-xl md:text-2xl mb-6 uppercase tracking-wide text-gray-900">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {similarProducts.map((sp) => (
                <ProductCard key={sp.id} product={sp} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modern Review Modal Popup */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-bold">Write a Review</h3>
                <p className="text-xs text-pink-100">Share your experience with this product</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              {/* Star Rating Selection */}
              <div className="text-center pb-2 border-b border-gray-100">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Your Rating
                </label>
                <div className="flex justify-center items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (reviewHoverRating || reviewRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={reviewPhone}
                  onChange={(e) => setReviewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                />
              </div>

              {/* Review Note / Comment Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Feedback / Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Write your detailed review about the quality, packaging, or experience..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 active:scale-[0.99] transition shadow-md hover:shadow-lg text-sm uppercase tracking-wider"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;