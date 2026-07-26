import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getMonthlySales = async () => {
  const response = await api.get("/admin/dashboard/monthly-sales");
  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get("/admin/dashboard/top-products");
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get("/admin/dashboard/low-stock");
  return response.data;
};

export const getRecentOrders = async()=>{
  const response = await api.get("/admin/dashboard/recent-orders");
  return response.data;
}
export const getOrderStatusStats = async () => {
  const response = await api.get("/admin/dashboard/order-status");
  return response.data;
};
