import { useEffect, useState } from "react";
import { getRecentOrders } from "../../services/dashboardService";

const RecentOrders = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getRecentOrders();
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";
      case "Pending":
        return "status-pending";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="table-card">

      <h2>📦 Recent Orders</h2>

      <table className="dashboard-table">

        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order._id}>

              <td>{order.user.fullName}</td>

              <td>₹{Math.round(order.totalAmount).toLocaleString()}</td>

              <td>
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </td>

              <td>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default RecentOrders;