// Address book API (auth required)
//   GET    auth/addresses          -> { status, total, addresses: [...] }
//   POST   auth/addresses          -> { status, message, address }
//   POST   auth/addresses/{id}     -> { status, message, address }   (update)
//   DELETE auth/addresses/{id}     -> { status, message }

const BASE_URL = "https://dashboard.shajerghor.com/api/";

const authHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");
  return {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API (snake_case) -> UI (camelCase)
const mapAddress = (a) => ({
  id: a.id,
  name: a.name ?? "",
  phone: a.phone ?? "",
  email: a.email ?? "",
  districtId: a.district_id ?? null,
  district: a.district ?? "",
  zoneId: a.zone_id ?? null,
  zone: a.zone ?? "",
  address: a.address ?? "",
  type: a.type ?? "home",
  isDefault: Boolean(a.is_default),
});

// Turn a failed response into a readable Error (validation messages included)
const toError = (res, data) => {
  if (res.status >= 500) {
    return new Error("Something went wrong on our side. Please try again in a moment.");
  }
  const firstValidation = data?.errors
    ? Object.values(data.errors).flat()[0]
    : null;
  return new Error(firstValidation || data?.message || data?.msg || "Request failed");
};

export const getAddresses = async () => {
  try {
    const res = await fetch(`${BASE_URL}auth/addresses`, { headers: authHeaders() });
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.status === false) return [];
    return (data?.addresses ?? []).map(mapAddress);
  } catch (error) {
    console.error("getAddresses error:", error);
    return [];
  }
};

// Create (no id) or update (id) an address, then return the refreshed list
export const saveAddress = async (form) => {
  const body = new FormData();
  body.append("name", form.name.trim());
  body.append("phone", form.phone.trim());
  if (form.email?.trim()) body.append("email", form.email.trim());
  body.append("district_id", form.districtId);
  body.append("zone_id", form.zoneId);
  body.append("address", form.address.trim());

  const url = form.id
    ? `${BASE_URL}auth/addresses/${form.id}`
    : `${BASE_URL}auth/addresses`;

  const res = await fetch(url, { method: "POST", headers: authHeaders(), body });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.status === false) throw toError(res, data);

  return getAddresses();
};

export const deleteAddress = async (id) => {
  const res = await fetch(`${BASE_URL}auth/addresses/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.status === false) throw toError(res, data);

  return getAddresses();
};
