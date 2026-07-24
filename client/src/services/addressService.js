import api from "./api";

export const getAddresses = async () => {
  const response = await api.get("/address");
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await api.post("/address/add", addressData);
  return response.data;
};
export const setDefaultAddress = async (addressId) => {
  const response = await api.patch(`/address/${addressId}/default`);
  return response.data;
};