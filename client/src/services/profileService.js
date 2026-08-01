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
export const forgotPassword = async (data) => {
  const response = await api.post(
    "/users/forget-password",
    data
  );


  return response.data;
};
export const resetPassword = async (token, data) => {
  const response = await api.post(
    `/users/forget-password/${token}`,
    data
  );

  return response.data;
};
export const updateAvatar = async (formData) => {
  const response = await api.patch(
    "/users/avatar",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
