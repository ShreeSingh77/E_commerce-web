import api from "./api";

// Get Reviews of Product
export const getReviews = async (productId) => {
  const response = await api.get(`/reviews/${productId}`);
  return response.data;
};

// Add Review
export const addReview = async ( data) => {
  const response = await api.post(
    `/reviews/add`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

// Update Review
export const updateReview = async (reviewId, data) => {
  const response = await api.patch(
    `/reviews/${reviewId}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

// Delete Review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(
    `/reviews/${reviewId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};