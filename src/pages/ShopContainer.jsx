import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

// Menu (category > sub category > child category) -> sidebar tree. Ids are prefixed
// so levels with the same numeric id never look "active" together. `query` holds the
// `urlPath` is the node's slug path ("skin/cleansers/facial-wash"), one `cat` URL param each.
const toCategoryTree = (menu) =>
  (Array.isArray(menu) ? menu : []).map((cat) => ({
    id: `c-${cat.id}`,
    apiId: cat.id,
    type: "category",
    name: cat.name,
    slug: cat.slug,
    urlPath: cat.slug,
    children: (cat.sub_categories || []).map((sub) => ({
      id: `s-${sub.id}`,
      apiId: sub.id,
      type: "sub_category",
      name: sub.name,
      slug: sub.slug,
      urlPath: `${cat.slug}/${sub.slug}`,
      children: (sub.child_categories || []).map((child) => ({
        id: `ch-${child.id}`,
        apiId: child.id,
        type: "child_category",
        name: child.name,
        slug: child.slug,
        urlPath: `${cat.slug}/${sub.slug}/${child.slug}`,
      })),
    })),
  }));

// Node named by a slug path. `path` lists the ids of it and all its parents, so
// every level above a selected node is active too.
const resolveSelection = (tree, urlPath) => {
  const [catSlug, subSlug, childSlug] = urlPath.split("/");
  const cat = tree.find((c) => c.slug === catSlug);
  if (!cat) return null;
  const sub = subSlug ? cat.children.find((s) => s.slug === subSlug) : null;
  const child = sub && childSlug ? (sub.children || []).find((c) => c.slug === childSlug) : null;
  const node = child || sub || cat;
  return { ...node, path: [cat.id, sub?.id, child?.id].filter(Boolean) };
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

  // Category filter lives in the URL as repeated `cat` params (?cat=skin&cat=hair) so
  // menu links, refresh and back/forward all select the same thing.
  const [searchParams, setSearchParams] = useSearchParams();
  const catKey = searchParams.getAll("cat").join(",");
  const [categoriesReady, setCategoriesReady] = useState(false);
  const selectedCategories = useMemo(() => {
    const seen = new Set();
    return (catKey ? catKey.split(",") : [])
      .map((urlPath) => resolveSelection(meta.categories, urlPath))
      .filter((node) => node && !seen.has(node.id) && seen.add(node.id));
  }, [meta.categories, catKey]);
  const selectedKey = selectedCategories.map((c) => c.id).join(",");

  // Filter state
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
      .catch((err) => console.error("Shop categories load failed:", err))
      .finally(() => { if (active) setCategoriesReady(true); });
    return () => { active = false; };
  }, []);

  // Every filter change goes back to page 1
  const withReset = (setter) => (value) => {
    setPage(1);
    setter(value);
  };

  // A menu link changes the URL without remounting this page, so reset the page here too
  const [prevCatKey, setPrevCatKey] = useState(catKey);
  if (prevCatKey !== catKey) {
    setPrevCatKey(catKey);
    setPage(1);
  }

  useEffect(() => {
    // A category in the URL can only be turned into an id once the menu has loaded
    if (catKey && !categoriesReady) return;

    const id = ++requestId.current;

    const load = async () => {
      try {
        setFetching(true);

        const params = {
          page,
          search: debouncedSearch.trim() || null,
          sort: SORT_MAP[sortBy] || "default",
        };
        // Ids of one level are OR-ed by the API, different levels are AND-ed
        // (hence toggleCategory only mixes nodes of the same level).
        const idsOf = (type) =>
          selectedCategories.filter((c) => c.type === type).map((c) => c.apiId);
        if (idsOf("category").length) params.category_id = idsOf("category");
        if (idsOf("sub_category").length) params.sub_category_id = idsOf("sub_category");
        if (idsOf("child_category").length) params.child_category_id = idsOf("child_category");
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
  }, [page, selectedKey, categoriesReady, brandIds, debouncedSearch, debouncedPrice, sortBy]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setCategoryPaths = (nodes) =>
    setSearchParams({ cat: nodes.map((n) => n.urlPath) });

  // Select / unselect a node. Nodes of the same level add up (like brands); picking
  // a node of another level starts a new selection, because the API would
  // intersect different levels instead of merging them.
  const toggleCategory = (node) => {
    if (selectedCategories.some((c) => c.id === node.id)) {
      setCategoryPaths(selectedCategories.filter((c) => c.id !== node.id));
    } else if (selectedCategories.every((c) => c.type === node.type)) {
      setCategoryPaths([...selectedCategories, node]);
    } else {
      setCategoryPaths([node]);
    }
  };

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
      activeCategory={selectedCategories}
      onSelectCategory={toggleCategory}
      onClearCategory={() => setSearchParams({})}
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
