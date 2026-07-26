import api from "./api";

export const getAllProducts = async (params ={}) => {
  try {
    const response = await api.get("/products",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};