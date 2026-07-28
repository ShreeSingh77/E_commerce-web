
import api from "./api";

// Get All Coupons
export const getAllCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data;
};

// Create Coupon
export const createCoupon = async (data) => {
  const response = await api.post("/coupons/create", data, {
    withCredentials: true,
  });
  return response.data;
};

// Update Coupon
export const updateCoupon = async (id, data) => {
  const response = await api.put(`/coupons/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const applyCoupon = async (data) => {
  const response = await api.post("/coupons/apply", data, {
    withCredentials: true,
  });

  return response.data;
};
// Delete Coupon
export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupons/${id}`, {
    withCredentials: true,
  });
  return response.data;
};