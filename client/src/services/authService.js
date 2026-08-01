import api from "./api";

export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(
    "/users/register",
    userData
  );

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post(
    "/users/forgot-password",
    { email }
  );

  return response.data;
};