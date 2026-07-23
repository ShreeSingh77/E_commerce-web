import api from "./api";

export const addToCart = async (cartData) => {
  try {
    const response = await api.post("/cart/add", cartData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// Get Cart
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

// Update Quantity
export const updateCart = async (cartId, quantity) => {
  const response = await api.patch(`/cart/${cartId}`, {
    quantity,
  });
  return response.data;
};

// Remove Item
export const removeCartItem = async (cartId) => {
  const response = await api.delete(`/cart/${cartId}`);
  return response.data;
};

// Clear Cart
export const clearCart = async () => {
  const response = await api.delete("/cart/clear/all");
  return response.data;
};