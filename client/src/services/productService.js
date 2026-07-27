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

export const createProduct = async (formData) => {
  const response = await api.post(
    "/products/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateProduct = async (productId, formData) => {
  const response = await api.patch(
    `/products/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};