import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import toast from "react-hot-toast";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.map((order) => (
  <div className="order-card" key={order._id}>

    <div className="order-header">
      <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>

      <span className={`status ${order.status.toLowerCase()}`}>
        {order.status}
      </span>
    </div>

    <p>
      <strong>Date:</strong>{" "}
      {new Date(order.createdAt).toLocaleDateString()}
    </p>

    <p>
      <strong>Total:</strong> ₹{Math.round(order.totalAmount)}
    </p>

    <p>
      <strong>Items:</strong> {order.items.length}
    </p>

  </div>
))}
    </div>
  );
};

export default Orders;