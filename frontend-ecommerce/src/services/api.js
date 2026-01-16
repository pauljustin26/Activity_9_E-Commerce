const API_URL = "http://localhost:3000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return token 
    ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const register = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

// Update createOrder to include token if you decide to protect that route later
export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getHeaders(), // Send Token
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Order Failed");
  return res.json();
};

export const getProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
};

export const getOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Returns empty array so app doesn't crash
  }
};

// NEW: Fetch Cart from DB
export const getCart = async () => {
  const res = await fetch(`${API_URL}/cart`, {
    headers: getHeaders(),
  });
  if (!res.ok) return []; // Return empty if error (or not logged in)
  return res.json();
};

// NEW: Save Cart to DB
export const syncCart = async (cartItems) => {
  // Format cart for backend: just ID and Quantity
  const payload = cartItems.map(item => ({ 
    productId: item._id, 
    quantity: item.quantity 
  }));

  await fetch(`${API_URL}/cart`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ items: payload }),
  });
};