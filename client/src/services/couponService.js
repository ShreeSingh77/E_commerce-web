import api from "./api";

export const applyCoupon = async (code, totalAmount) => {
  const response = await api.post("/coupons/apply", {
    code,
    totalAmount,
  });

  return response.data;
};