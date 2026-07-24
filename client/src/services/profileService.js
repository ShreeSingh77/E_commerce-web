import api from "./api";
import axios from "./api";

export const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data;
};
export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};
export const updateProfile = async (data) => {
  const response = await api.patch("/users/update-account", data);
  return response.data;
};
export const changePassword = async (data) => {
  const response = await api.post("/users/change-password", data);
  return response.data;
};