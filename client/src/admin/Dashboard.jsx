import "./Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import toast from "react-hot-toast";
import MonthlySalesChart from "../components/admin/MonthlySalesChart";
import TopProducts from "../components/admin/TopProducts";
import LowStockProducts from "../components/admin/LowStockProducts";
import RecentOrders from "../components/admin/RecentOrders";
import OrderStatusChart from "../components/admin/OrderStatusChart";
import{
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiDollarSign
} from "react-icons/fi";
const Dashboard = () => {
  const [loading,setLoading] =useState(true);
    const [stats, setStats] = useState({
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
});
const fetchDashboard = async () => {
  try {
    const response = await getDashboardStats();
     console.log("response",response);
     console.log("Response.data",response.data);
     
   setStats(response.data)

  } catch (error) {
    console.log(error);
    
    toast.error(
      error.response?.data?.message ||
      "Failed to load dashboard"
    );
  } finally{
    setLoading(false);
  }
};


useEffect(()=>{
    fetchDashboard();
},[])
  return (

    <div className="admin-layout">

     <AdminSidebar />
      <div className="admin-content">

       <div className="dashboard-header">
    <div>
        <h1>Admin Dashboard 👋</h1>
        <p>Welcome back! Here's your store overview.</p>
    </div>
</div>
     
     {loading ? (
  <div className="dashboard-cards">
    {[1, 2, 3, 4].map((item) => (
      <div className="dashboard-card skeleton-card" key={item}>
        <div className="skeleton skeleton-icon"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-value"></div>
      </div>
    ))}
  </div>
) : (
  <div className="dashboard-cards">

    {/* Existing Dashboard Cards */}
   <div className="dashboard-cards">

          <div className="dashboard-card">
  <div className="card-header">
    <div className="card-icon blue">
      <FiBox />
    </div>
  </div>

  <h3>Total Products</h3>
  <h2>{stats.totalProducts}</h2>
</div>

          <div className="dashboard-card">
  <div className="card-header">
    <div className="card-icon orange">
      <FiShoppingCart />
    </div>
  </div>

  <h3>Total Orders</h3>
  <h2>{stats.totalOrders}</h2>
</div>

          <div className="dashboard-card">
  <div className="card-header">
    <div className="card-icon green">
      <FiUsers />
    </div>
  </div>

  <h3>Total Users</h3>
  <h2>{stats.totalUsers}</h2>
</div>

          <div className="dashboard-card">
  <div className="card-header">
    <div className="card-icon purple">
      <FiDollarSign />
    </div>
  </div>

  <h3>Total Revenue</h3>
  <h2>₹{Math.round(stats.totalRevenue)}</h2>
</div>

        </div>
  </div>
)}
        <div className="dashboard-grid" >
          <div className="left-panel">
        <MonthlySalesChart />
         <LowStockProducts />
         </div>

        <div className="right-panel">
          <OrderStatusChart />
           <TopProducts />
        </div>
        </div>
       
        <RecentOrders />
      </div>

    </div>
  );
};

export default Dashboard;