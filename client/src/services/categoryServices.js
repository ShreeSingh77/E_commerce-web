import api from "./api";

// Get All Categories
export const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Create Category
export const createCategory = async (data) => {
  const response = await api.post("/categories", data, {
    withCredentials: true,
  });
  return response.data;
};

// Update Category
export const updateCategory = async (id, data) => {
  const response = await api.patch(
    `/categories/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/categories/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};