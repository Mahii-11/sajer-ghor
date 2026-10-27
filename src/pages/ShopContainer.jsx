import React, { useEffect, useRef, useState } from "react";
import ShopPage from "./ShopPage";
import { getShopProducts } from "../services/api";
import ShopPageSkeleton from "../loader/ShopPageSkeleton";

// UI sort value -> backend `sort` value
const SORT_MAP = {
  default: "default",
  lowToHigh: "price_low",
  highToLow: "price_high",
  newest: "newest",
};

const DEBOUNCE_MS = 400;

// Small helper: returns `value` only after it stopped changing for `delay` ms
function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ShopContainer() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  // Sidebar lists (categories / brands / price limits) come from the first,
  // unfiltered response so they don't collapse when a filter is applied.
  const [meta, setMeta] = useState({ categories: [], brands: [], priceRange: null });

  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  // Filter state
  const [category, setCategory] = useState(null); // slug
  const [brandIds, setBrandIds] = useState([]);
  const [priceRange, setPriceRange] = useState(null); // [min, max] | null (= untouched)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(searchQuery, DEBOUNCE_MS);
  const debouncedPrice = useDebounced(priceRange, DEBOUNCE_MS);

  const requestId = useRef(0);

  // Every filter change goes back to page 1
  const withReset = (setter) => (value) => {
    setPage(1);
    setter(value);
  };

  useEffect(() => {
    const id = ++requestId.current;

    const load = async () => {
      try {
        setFetching(true);

        const params = {
          page,
          category,
          brands: brandIds.length ? brandIds.join(",") : null,
          search: debouncedSearch.trim() || null,
          sort: SORT_MAP[sortBy] || "default",
        };
        if (debouncedPrice) {
          params.price_min = debouncedPrice[0];
          params.price_max = debouncedPrice[1];
        }

        const res = await getShopProducts(params);
        if (id !== requestId.current) return; // a newer request replaced this one

        const rawProducts = Array.isArray(res?.products) ? res.products : [];
        setProducts(
          rawProducts.map((p) => ({
            ...p,
            rating: p?.rating ?? p?.avg_rating ?? p?.reviews_avg_rating ?? 4.5,
          }))
        );
        setPagination(res?.pagination || {});

        setMeta((prev) =>
          prev.priceRange
            ? prev
            : {
                categories: Array.isArray(res?.filters?.categories) ? res.filters.categories : [],
                brands: Array.isArray(res?.filters?.brands) ? res.filters.brands : [],
                priceRange: res?.filters?.price_range || null,
              }
        );
      } catch (err) {
        if (id !== requestId.current) return;
        console.error("Shop Fetch Error:", err);
        setProducts([]);
      } finally {
        if (id === requestId.current) {
          setFetching(false);
          setInitialLoading(false);
        }
      }
    };

    load();
  }, [page, category, brandIds, debouncedSearch, debouncedPrice, sortBy]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (slug) =>
    withReset(setCategory)(category === slug ? null : slug);

  const toggleBrand = (brandId) =>
    withReset(setBrandIds)(
      brandIds.includes(brandId)
        ? brandIds.filter((b) => b !== brandId)
        : [...brandIds, brandId]
    );

  if (initialLoading) return <ShopPageSkeleton />;

  return (
    <ShopPage
      products={products}
      categories={meta.categories}
      brands={meta.brands}
      priceLimits={meta.priceRange}
      fetching={fetching}
      pagination={pagination}
      onPageChange={handlePageChange}
      activeCategory={meta.categories.find((c) => c.slug === category) || null}
      onSelectCategory={(cat) => toggleCategory(cat.slug)}
      onClearCategory={() => withReset(setCategory)(null)}
      activeBrandIds={brandIds}
      onToggleBrand={toggleBrand}
      priceRange={priceRange}
      onPriceChange={withReset(setPriceRange)}
      searchQuery={searchQuery}
      onSearchChange={withReset(setSearchQuery)}
      sortBy={sortBy}
      onSortChange={withReset(setSortBy)}
    />
  );
}
