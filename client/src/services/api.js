import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-web-3vvb.onrender.com/api/v1",
  withCredentials: true,
});

export default api;