const API_URL = "http://localhost:3000";

// --- Products ---
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
};

export const createProduct = async (productData) => {
  await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
};

// --- NEW: Orders (This was likely missing) ---
export const getOrders = async () => {
  try {
    const res = await fetch("http://localhost:3000/orders");
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch (error) {
    return []; // Use empty array to prevent crash
  }
};

