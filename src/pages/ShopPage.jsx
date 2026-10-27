import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem, hideCartPopup } from "../cart/cartSlice"; 
import { FaBagShopping, FaCartPlus, FaStar } from "react-icons/fa6";
import {
  Search,
  X,
  ChevronDown,
  Zap,
} from "lucide-react";
import useTypewriterPlaceholder from "../hooks/useTypewriterPlaceholder";

const SEARCH_SUGGESTIONS = [
  "Search by product name...",
  "Search by brand...",
  "Try \"lipstick\"...",
  "Try \"sunscreen\"...",
  "Try \"face serum\"...",
];

/* ------------------------------------------------------------------ */
/* Price range slider                                                 */
/* ------------------------------------------------------------------ */

function PriceRangeSlider({ min = 0, max = 10000, value, onChange }) {
  const [lo, hi] = value;
  const pct = (v) => {
    if (max === min) return 0;
    return ((v - min) / (max - min)) * 100;
  };

  const handleLo = (e) => {
    const v = Math.min(Number(e.target.value), hi - 1);
    onChange([v, hi]);
  };
  const handleHi = (e) => {
    const v = Math.max(Number(e.target.value), lo + 1);
    onChange([lo, v]);
  };

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-pink-500"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={handleLo}
          className="range-thumb pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={handleHi}
          className="range-thumb pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-700 font-medium">
        <span>৳ {lo}</span>
        <span>৳ {hi}</span>
      </div>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          pointer-events: all;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */

function CountPill({ active, children }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-500"
      }`}
    >
      {children}
    </span>
  );
}

// Matched by item object or string item reference
const isCategoryActive = (item, active) => {
  const catName = typeof item === "string" ? item : item.name;
  return (
    active === catName ||
    (typeof active === "object" && active?.id === item.id) ||
    active === item.slug
  );
};

function CategoryRow({ item, depth, active, onSelect }) {
  const catName = typeof item === "string" ? item : item.name;
  const isActive = isCategoryActive(item, active);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const hasActiveChild = hasChildren && item.children.some((c) => isCategoryActive(c, active));

  // Sub categories live in a dropdown; open it by hand or when one of them is selected
  const [open, setOpen] = useState(false);
  const isOpen = open || hasActiveChild;

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelect(item)}
          className={`flex flex-1 items-center justify-between py-2 text-left transition-colors ${
            depth > 0 ? "pl-4 text-[13px]" : "text-[14px]"
          } ${
            isActive
              ? "font-semibold text-pink-600"
              : "text-gray-700 hover:text-pink-600"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {catName}
            {item.icon && (
              <Zap size={13} className="fill-amber-400 text-amber-400" />
            )}
          </span>
          {item.count !== undefined && (
            <CountPill active={isActive}>{item.count}</CountPill>
          )}
        </button>
        {hasChildren && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={isOpen ? `Hide ${catName} sub categories` : `Show ${catName} sub categories`}
            aria-expanded={isOpen}
            className="ml-1 rounded p-1.5 text-gray-400 hover:text-pink-600"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-pink-600" : ""}`}
            />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="mb-1 ml-1 border-l-2 border-pink-100">
          {item.children.map((child) => (
            <CategoryRow
              key={child.id || child.name}
              item={child}
              depth={depth + 1}
              active={active}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  categories = [],
  brands = [],
  priceRange,
  setPriceRange,
  priceMinLimits,
  priceMaxLimits,
  activeCategory,
  setActiveCategory,
  activeBrandIds,
  toggleBrand,
}) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands ? brands : brands.slice(0, 8);

  return (
    <aside className="w-full shrink-0 lg:w-64">
      {/* Price Filter */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
          Filter by Price
        </h3>
        <PriceRangeSlider
          min={priceMinLimits}
          max={priceMaxLimits}
          value={priceRange}
          onChange={setPriceRange}
        />
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-2 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
            Categories
          </h3>
          <div className="modern-scrollbar divide-y divide-gray-50 max-h-80 overflow-y-auto pr-2">
            {categories.map((cat) => (
              <CategoryRow
                key={cat.id || cat.slug || cat.name}
                item={cat}
                depth={0}
                active={activeCategory}
                onSelect={setActiveCategory}
              />
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
            Filter by Brand
          </h3>
          <div className="modern-scrollbar flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
            {visibleBrands.map((brand) => {
              const brandName = typeof brand === "string" ? brand : brand.name;
              return (
                <label
                  key={brand.id || brandName}
                  className="flex cursor-pointer items-center justify-between text-sm text-gray-700 hover:text-gray-900"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeBrandIds.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                      className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    {brandName}
                  </span>
                  {brand.count !== undefined && (
                    <span className="text-xs text-gray-400">
                      {brand.count}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
          {brands.length > 8 && (
            <button
              onClick={() => setShowAllBrands((s) => !s)}
              className="mt-3 text-xs font-semibold text-pink-600 hover:underline"
            >
              {showAllBrands ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Toolbar                                                            */
/* ------------------------------------------------------------------ */

function Toolbar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  activeCategory,
  onClearCategory,
}) {
  const searchPlaceholder = useTypewriterPlaceholder(SEARCH_SUGGESTIONS, !!searchQuery);
  const activeCatDisplay =
    typeof activeCategory === "object"
      ? activeCategory?.name
      : activeCategory;

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-base placeholder:font-semibold placeholder:text-gray-400 focus:border-pink-500 focus:outline-none shadow-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {activeCategory ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3.5 py-1.5 text-xs font-semibold text-pink-600 border border-pink-200">
            Category: {activeCatDisplay}
            <button
              onClick={onClearCategory}
              className="hover:text-pink-800"
              aria-label="Clear category filter"
            >
              <X size={14} />
            </button>
          </span>
        ) : (
          <span className="text-xs text-gray-500 font-medium">
            Showing all products
          </span>
        )}

        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-48 appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-gray-700 focus:border-pink-500 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="default">Default sorting</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product Card                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    id,
    slug,
    name,
    brand_name,
    brand,
    price,
    offer_price,
    price_min,
    price_max,
    image,
    thumb_image,
    type,
    isVariable,
    rating = 4.5,
    has_variants,
  } = product;

  const isVar = type === "variable" || isVariable || has_variants || false;
  const displayBrand =
    brand_name || (typeof brand === "object" ? brand?.name : brand) || "";
  const displayImage = image || thumb_image || "/placeholder.jpg";

  const currentPrice = offer_price || price || price_min;
  const oldPrice = offer_price ? price : null;

  const rawRating = product?.rating !== undefined ? Number(product.rating) : Number(rating);
  const currentRating = Math.min(5, Math.max(0, isNaN(rawRating) ? 4.5 : rawRating));
  const fillPercentage = (currentRating / 5) * 100;

  const handleCardClick = () => {
    if (slug) navigate(`/product-details/${slug}`);
    else if (id) navigate(`/product-details/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isVar) {
      handleCardClick();
    } else {
      dispatch(addItem(product));
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isVar) {
      handleCardClick();
    } else {
      dispatch(addItem({ ...product, silent: true }));
      dispatch(hideCartPopup());
      navigate("/checkout");
    }
  };

  const discountPercent =
    oldPrice && currentPrice && Number(oldPrice) > Number(currentPrice)
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : null;

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white border border-gray-200 rounded-[22px] overflow-hidden flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Discount Badge on Top Left */}
      {discountPercent && (
        <div className="absolute top-0 left-0 bg-[#E61C5C] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-br-lg z-10">
          {discountPercent}% OFF
        </div>
      )}

      {/* Responsive Image */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-gray-50">
        <img
          src={displayImage}
          alt={typeof name === "string" ? name : "Product Image"}
          className="w-full h-full object-cover block hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between text-center">
        <div className="flex flex-col gap-1.5">
          {/* Brand Name */}
          {displayBrand && (
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider truncate">
              {displayBrand}
            </p>
          )}

          {/* Product Title */}
          <h3 className="text-gray-900 text-xs font-normal line-clamp-2 min-h-[32px] sm:min-h-[36px] leading-snug">
            {typeof name === "string" ? name : ""}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-center gap-2">
            {isVar && price_min ? (
              <span className="text-[#E61C5C] font-extrabold text-sm sm:text-base">
                ৳{price_min} {price_max && price_max !== price_min ? `- ৳${price_max}` : ""}
              </span>
            ) : (
              <>
                {discountPercent && (
                  <span className="text-gray-400 line-through text-xs font-semibold">
                    ৳{oldPrice}
                  </span>
                )}
                <span className="text-[#E61C5C] font-extrabold text-base sm:text-lg">
                  ৳{currentPrice}
                </span>
              </>
            )}
          </div>

          {/* Dynamic 5-Star Rating Section */}
          <div className="flex items-center justify-center gap-1.5">
            <div className="relative inline-flex items-center">
              {/* Background Empty Stars */}
              <div className="flex text-gray-200 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-xs sm:text-sm" />
                ))}
              </div>

              {/* Filled Stars Layer (Percentage Clipped) */}
              <div
                className="absolute top-0 left-0 overflow-hidden h-full"
                style={{ width: `${fillPercentage}%` }}
              >
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-xs sm:text-sm shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Count */}
            <span className="text-[11px] font-medium text-gray-400 leading-none">
              ({product?.reviews_count ?? 124})
            </span>
          </div>

          {/* Size / Weight */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full inline-block">
              {product?.size || "50ml"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full pt-3">
          <button
            type="button"
            onClick={handleAddToCart}
            title="Add to Cart"
            className="bg-white border border-[#E61C5C] text-[#E61C5C] hover:bg-pink-50 font-medium py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors leading-tight cursor-pointer"
          >
            <FaCartPlus className="text-sm shrink-0" />
            <span className="hidden md:inline text-[10px] sm:text-[11px] font-semibold whitespace-nowrap">
              Add to Cart
            </span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            title="Buy Now"
            className="bg-[#E61C5C] hover:bg-pink-600 text-white font-medium py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors leading-tight cursor-pointer"
          >
            <FaBagShopping className="text-sm shrink-0" />
            <span className="hidden md:inline text-[10px] sm:text-[11px] font-semibold whitespace-nowrap">
              Buy Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination                                                         */
/* ------------------------------------------------------------------ */

function Pagination({ pagination, onPageChange }) {
  const current = Number(pagination?.current_page || 1);
  const last = Number(pagination?.last_page || 1);
  if (last <= 1) return null;

  // 1 … 4 5 6 … last  (window of 1 page around the current one)
  const pages = [];
  for (let p = 1; p <= last; p++) {
    if (p === 1 || p === last || Math.abs(p - current) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors";

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
        className={`${btn} border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:text-pink-600 disabled:opacity-40 disabled:pointer-events-none`}
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`${btn} ${
              p === current
                ? "border-[#E61C5C] bg-[#E61C5C] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:text-pink-600"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={current >= last}
        onClick={() => onPageChange(current + 1)}
        className={`${btn} border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:text-pink-600 disabled:opacity-40 disabled:pointer-events-none`}
      >
        Next
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Main Shop Page Component                                           */
/* ------------------------------------------------------------------ */

export default function ShopPage({
  products = [],
  categories = [],
  brands = [],
  priceLimits = null,
  fetching = false,
  pagination = {},
  onPageChange,
  activeCategory = null,
  onSelectCategory,
  onClearCategory,
  activeBrandIds = [],
  onToggleBrand,
  priceRange = null,
  onPriceChange,
  searchQuery = "",
  onSearchChange,
  sortBy = "default",
  onSortChange,
}) {
  const minPrice = Number(priceLimits?.min ?? 0);
  const maxPrice = Number(priceLimits?.max ?? 10000);
  // Slider shows the full range until the user touches it
  const sliderValue = priceRange || [minPrice, maxPrice];

  const handlePriceChange = ([lo, hi]) => {
    // Back at the full range = no price filter
    onPriceChange(lo <= minPrice && hi >= maxPrice ? null : [lo, hi]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row">
        <Sidebar
          categories={categories}
          brands={brands}
          priceRange={sliderValue}
          setPriceRange={handlePriceChange}
          priceMinLimits={minPrice}
          priceMaxLimits={maxPrice}
          activeCategory={activeCategory}
          setActiveCategory={onSelectCategory}
          activeBrandIds={activeBrandIds}
          toggleBrand={onToggleBrand}
        />

        <main className="min-w-0 flex-1">
          <Toolbar
            searchQuery={searchQuery}
            setSearchQuery={onSearchChange}
            sortBy={sortBy}
            setSortBy={onSortChange}
            activeCategory={activeCategory}
            onClearCategory={onClearCategory}
          />

          {products.length === 0 && !fetching ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm">
              <p className="text-base font-semibold text-gray-700">
                No products found
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 transition-opacity ${
                fetching ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          )}

          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </main>
      </div>
    </div>
  );
}
