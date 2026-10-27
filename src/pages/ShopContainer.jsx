import React, { useEffect, useRef, useState } from "react";
import ShopPage from "./ShopPage";
import { getShopProducts, getNavMenu } from "../services/api";
import ShopPageSkeleton from "../loader/ShopPageSkeleton";

// UI sort value -> backend `sort` value
const SORT_MAP = {
  default: "default",
  lowToHigh: "price_low",
  highToLow: "price_high",
  newest: "newest",
};

const DEBOUNCE_MS = 400;

// Menu (category > sub category) -> sidebar tree. Ids are prefixed so a category
// and a sub category with the same numeric id never look "active" together.
const toCategoryTree = (menu) =>
  (Array.isArray(menu) ? menu : []).map((cat) => ({
    id: `c-${cat.id}`,
    apiId: cat.id,
    type: "category",
    name: cat.name,
    slug: cat.slug,
    children: (cat.sub_categories || []).map((sub) => ({
      id: `s-${sub.id}`,
      apiId: sub.id,
      type: "sub_category",
      name: sub.name,
      slug: sub.slug,
    })),
  }));

const findCategory = (tree, id) => {
  for (const cat of tree) {
    if (cat.id === id) return cat;
    const sub = cat.children.find((c) => c.id === id);
    if (sub) return sub;
  }
  return null;
};

// The API has no filter-list endpoint, so brands (with counts) and the price
// limits are built from the products of the first, unfiltered response.
const buildMetaFromProducts = (products) => {
  const brandMap = new Map();
  let min = Infinity;
  let max = -Infinity;

  products.forEach((p) => {
    if (p?.brand?.id != null) {
      const existing = brandMap.get(p.brand.id);
      if (existing) existing.count += 1;
      else brandMap.set(p.brand.id, { id: p.brand.id, name: p.brand.name, count: 1 });
    }
    [p?.offer_price, p?.price, p?.min_price, p?.max_price].forEach((v) => {
      const n = Number(v);
      if (v != null && Number.isFinite(n) && n > 0) {
        min = Math.min(min, n);
        max = Math.max(max, n);
      }
    });
  });

  return {
    brands: [...brandMap.values()],
    priceRange: Number.isFinite(min) ? { min: Math.floor(min), max: Math.ceil(max) } : null,
  };
};

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
  const [category, setCategory] = useState(null); // tree id ("c-146" / "s-46")
  const [brandIds, setBrandIds] = useState([]);
  const [priceRange, setPriceRange] = useState(null); // [min, max] | null (= untouched)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(searchQuery, DEBOUNCE_MS);
  const debouncedPrice = useDebounced(priceRange, DEBOUNCE_MS);

  const requestId = useRef(0);

  // Category tree for the sidebar comes from the menu API
  useEffect(() => {
    let active = true;
    getNavMenu()
      .then((menu) => {
        if (active) setMeta((prev) => ({ ...prev, categories: toCategoryTree(menu) }));
      })
      .catch((err) => console.error("Shop categories load failed:", err));
    return () => { active = false; };
  }, []);

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
          search: debouncedSearch.trim() || null,
          sort: SORT_MAP[sortBy] || "default",
        };
        const selectedCategory = category ? findCategory(meta.categories, category) : null;
        if (selectedCategory?.type === "category") params.category_id = [selectedCategory.apiId];
        if (selectedCategory?.type === "sub_category") params.sub_category_id = [selectedCategory.apiId];
        if (brandIds.length) params.brand_id = brandIds;
        if (debouncedPrice) {
          params.min_price = debouncedPrice[0];
          params.max_price = debouncedPrice[1];
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

        // Only the first (unfiltered) response is used for the brand / price lists,
        // so they don't collapse when a filter is applied.
        setMeta((prev) =>
          prev.priceRange || prev.brands.length ? prev : { ...prev, ...buildMetaFromProducts(rawProducts) }
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

  const toggleCategory = (id) =>
    withReset(setCategory)(category === id ? null : id);

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
      activeCategory={category ? findCategory(meta.categories, category) : null}
      onSelectCategory={(cat) => toggleCategory(cat.id)}
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
