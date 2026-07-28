import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import toast from "react-hot-toast";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();

      console.log("my orders",response);
      
      setOrders(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };
const handleCancel = async (orderId) => {
  try {
    await cancelOrder(orderId);

    toast.success("Order cancelled successfully");

    fetchOrders();

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to cancel order"
    );
  }
};
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
  <h1>My Orders</h1>

  {orders.length === 0 ? (

    <div className="empty-orders">
      <h2>📦 No Orders Yet</h2>
      <p>You haven't placed any orders yet.</p>
    </div>

  ) : (

    orders.map((order) => (
      <div className="order-card" key={order._id}>

        <div className="order-header">
          <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>

          <span className={`status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>

        <div className="order-details">
  <div>
    <span>Date</span>
    <h4>{new Date(order.createdAt).toLocaleDateString()}</h4>
  </div>

  <div>
    <span>Total</span>
    <h4>₹{Math.round(order.totalAmount)}</h4>
  </div>
  <div>
  <span>Items</span>
  <h4>{order.items.length}</h4>
</div>
</div>

        

       <div className="order-items">


 {order.items.map((item) => (

  <div className="order-item" key={item._id}>

    <img
      src={
        item.product?.images?.length
          ? item.product.images[0]
          : "https://via.placeholder.com/150?text=No+Image"
      }
      alt={item.product?.name || "Product"}
    />

    <div className="order-item-info">

      <h5>
        {item.product?.name || "Product unavailable"}
      </h5>

      <p className="qty">
        Quantity: {item.quantity}
      </p>

      <h4 className="item-price">
        ₹{item.product?.price || 0}
      </h4>

    </div>

  </div>

))}

</div>
    <div className="order-actions">
  {order.status === "Pending" && (
    <button
      className="cancel-btn"
      onClick={() => handleCancel(order._id)}
    >
      Cancel Order
    </button>
  )}
</div>
      </div>
    ))

  )}

</div>
  );
};

export default Orders;