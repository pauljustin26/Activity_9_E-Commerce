const API_URL = "http://localhost:3000";

// --- Products ---
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
};

export const createProduct = async (productData) => {
  await fetch(`${API_URL}/products`, {
    method: "POST",
    body: productData, 
  });
};

export const updateProduct = async (id, productData) => {
  await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: productData,
  });
};

export const deleteProduct = async (id) => {
  await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
};

export const getOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch (error) {
    return []; 
  }
};
