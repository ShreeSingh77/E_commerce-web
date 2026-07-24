import api from "./api";

export const createOrder = async (addressId,couponCode) => {
  const response = await api.post("/orders/create", {
    addressId,
    couponCode,
  });

  return response.data;
};

export const getMyOrders = async () => {

  const response = await api.get("/orders/my-order");
  console.log(response);
  
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.patch(`/orders/cancel/${orderId}`);
  return response.data;
};