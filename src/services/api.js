import axios from "axios";

const BASE_URL = "https://dashboard.shajerghor.com/api/";

// 💡 Universal Response Normalizer Helper
export const normalizeResponse = (res, fallback = null) => {
  if (!res) return fallback;
  return res?.data?.data ?? res?.data ?? res?.menu_data ?? res?.product ?? res ?? fallback;
};

/* Universal Fetch Request */
const fetchData = async (endpoint, option = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...option,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the API returned an explicit failure status
    if (data?.success === false || data?.status === false) {
      throw new Error(data?.message || `Fetch unsuccessful for ${endpoint}`);
    }

    return data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
};

/* ================= GET REQUESTS ================= */

// Fixed spelling: getNavMeny -> getNavMenu
export const getNavMenu = async () => 
  normalizeResponse(await fetchData("menu"), []);

export const getSocialData = async () =>
  normalizeResponse(await fetchData("social-data"), []);

// settings API call handler
// Backend sends site_name / phone / phone2 / description; map them to the keys
// Navbar and Footer read (name / contact / alternative_conatct / note).
export const getSiteSettings = async () => {
  const s = normalizeResponse(await fetchData("setting-data"), {});
  return {
    ...s,
    name: s.name ?? s.site_name,
    note: s.note ?? s.description,
    contact: s.contact ?? s.phone,
    alternative_conatct: s.alternative_conatct ?? s.phone2,
  };
};

// This endpoint returns { status, categories: [...] } instead of { data: [...] }
export const getTrendingCategory = async () => {
  const res = await fetchData("trending-category");
  return res?.categories ?? normalizeResponse(res, []);
};


export const getCampaigns = async () =>
  normalizeResponse(await fetchData("campaign-data"), []);


export const getSliders = async () => 
  normalizeResponse(await fetchData("slider-data"), []);



export const getTopBrandOffers = async () =>
  normalizeResponse(await fetchData("top-brand-offer-data"), []);

// Fetch products for a single brand (used by TopBrands / TopBrandsSection cards)
export const getBrandProducts = async (slug) =>
  await fetchData(`brand-products/${slug}`);

// Fetch products for a single campaign (used by DealsSection cards)
export const getCampaignProducts = async (slug) =>
  await fetchData(`campaigns/${slug}/products`);

// Fetch products for a single showcase (used by ForHerHim cards)
export const getShowcaseProducts = async (slug) =>
  await fetchData(`showcases/${slug}/products`);

export const getTopBrands = async () => 
  normalizeResponse(await fetchData("top-brand-data"), []);









export const getTopRankedProduct = async () => 
  normalizeResponse(await fetchData("top-ranked-products"), []);

// Full list for the "Top Ranking Products" page (the banner links there)
export const getAllTopRankedProducts = async () =>
  normalizeResponse(await fetchData("all-top-ranked-products"), []);

// Full list for the "Recommended Products" page (the banner links there)
export const getAllRecommendedProducts = async () =>
  normalizeResponse(await fetchData("all-recommended-products"), []);

export const getRecommendProduct = async () =>
  normalizeResponse(await fetchData("recommended-products"), []);

export const getWhyShopWithUs = async () => 
  normalizeResponse(await fetchData("why-shop-data"), []);

export const getOfferBanner = async () => 
  normalizeResponse(await fetchData("offer-banner-data"), []);

export const getPremimumCategories = async () => 
  normalizeResponse(await fetchData("popular-category-data"), []);

export const getProductsByEndpoint = async (endpoint) => 
  normalizeResponse(await fetchData(endpoint), []);

export const getMostViewedProducts = async () => 
  normalizeResponse(await fetchData("most-viewed-products"), []);

export const getOnlineSaleProducts = async () => 
  normalizeResponse(await fetchData("offer-products"), []);

export const getOurLocations = async () =>
  normalizeResponse(await fetchData("our-store-data"), []);

export const getTestimonials = async () =>
  normalizeResponse(await fetchData("product-testimonial-data"), []);

export const getShowcaseData = async () =>
  normalizeResponse(await fetchData("showcase-data"), []);

/**
 * 🛒 Shop Products API (Supports Query Parameters for Filtering & Pagination)
 */
export const getShopProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        if (Array.isArray(params[key])) {
          params[key].forEach((val) => queryParams.append(`${key}[]`, val));
        } else {
          queryParams.append(key, params[key]);
        }
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `shop?${queryString}` : "shop";

    const response = await fetchData(endpoint);
    const rawData = response?.data ?? response;

    return {
      products: rawData?.products?.data || rawData?.products || [],
      filters: rawData?.filters || {},
      pagination: rawData?.pagination || rawData?.products || {},
    };
  } catch (error) {
    console.error("Error fetching shop products:", error);
    throw error;
  }
};

// Fetch product details by slug
export const getProductDetailsBySlug = async (slug) => {
  if (!slug) throw new Error("Slug is required");

  try {
    const res = await fetch(`${BASE_URL}product-details/${slug}`);

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      throw new Error("Invalid response type from API");
    }

    const data = await res.json();
    const productData = data?.data || data?.product;

    if (!productData) {
      throw new Error("Product not found or invalid response structure");
    }

    return data;
  } catch (error) {
    console.error("getProductDetailsBySlug error:", error.message);
    throw error;
  }
};

/* ================= POST & AUTH REQUESTS ================= */

// Submit a customer review (goes live after admin approval)
export const submitProductReview = async (slug, { name, phone, rating, review }) => {
  const formData = new FormData();
  formData.append("name", name.trim());
  formData.append("phone", phone.trim());
  formData.append("rating", rating);
  formData.append("review", review.trim());

  const response = await fetch(`${BASE_URL}product-reviews/${slug}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const data = await response.json().catch(() => null);
  // Never show raw server/database errors to customers
  if (response.status >= 500) {
    throw new Error("Something went wrong on our side. Please try again in a moment.");
  }
  if (!response.ok || data?.status === false) {
    throw new Error(data?.msg || data?.message || "Failed to submit review");
  }
  return data;
};

export async function createOrder(orderData) {
  try {
    const response = await fetch(`${BASE_URL}store-order`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: orderData,
    });

    const text = await response.text();
    if (!text) {
      return { success: false, msg: "Empty response from server" };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}

export const registerApi = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => 
      formData.append(key, typeof data[key] === "string" ? data[key].trim() : data[key])
    );

    const res = await axios.post(`${BASE_URL}register-api`, formData);
    return res.data;
  } catch (error) {
    console.error("REGISTER ERROR:", error.response?.data);
    return error.response?.data || { status: false, message: "Server Error" };
  }
};

export const loginApi = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());

    const response = await fetch(`${BASE_URL}store-login-api`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    throw error;
  }
};

export const logoutApi = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}logout-api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}get-profile-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};

export const updateUserProfile = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}update-user-profile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { notification: text };
  }
};

export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}get-all-orders`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Failed to fetch orders");

    return data;
  } catch (error) {
    console.error("getUserOrders Error:", error);
    throw error;
  }
};

export const getSingleOrder = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}order-details/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching single order:", error.response?.data || error);
    return { success: false };
  }
};