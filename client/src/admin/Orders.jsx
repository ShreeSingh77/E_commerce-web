import "./Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { getAllOrders,
    updateOrderStatus
 } from "../services/orderService";

const Orders = () => {

    const [orders,setOrders] =useState([]);
    const [search,setSearch] = useState("");
    const [status,setStatus]=useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
 const [showModel,setShowModel] =useState(false);
 const [selectedOrder,setSelectedOrder]=useState(null);


    const fetchOrders = async () => {
  try {

   const response = await getAllOrders({
    page:currentPage,
    search,
    status,
   });

setOrders(response.data.orders);
setCurrentPage(response.data.currentPage);
setTotalPages(response.data.totalPages);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to fetch orders"
    );

  }
};
const handleStatusChange = async (orderId, status) => {
  try {

    const response = await updateOrderStatus(orderId, status);

    toast.success(response.message);

    fetchOrders();

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to update order status"
    );

  }
};
useEffect(()=>{
    fetchOrders();
},[search,status,currentPage]);
 
console.log(selectedOrder?.items?.[0]?.product);




  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <div className="products-header">
          <div>
            <h1>Orders Management</h1>
            <p>Manage all customer orders.</p>
          </div>
        </div>

        <div className="products-toolbar">

          <input
  type="text"
  placeholder="🔍 Search Orders..."
  className="search-input"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

         <select
  className="category-filter"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="">All Status</option>
  <option value="Pending">Pending</option>
  <option value="Processing">Processing</option>
  <option value="Shipped">Shipped</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
</select>

        </div>
        <div className="table-wrapper">
        <table className="products-table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
  {orders.map((order) => (
    <tr key={order._id}>

      <td>
        {order._id.slice(-6).toUpperCase()}
      </td>

      <td>
        {order.user?.fullName}
      </td>

      <td>
        ₹{order.totalAmount}
      </td>

      <td>
  <select
    className={`status-select ${order.status.toLowerCase()}`}
    value={order.status}
    onChange={(e)=>handleStatusChange(order._id,e.target.value)}
  >
    <option value="Pending">Pending</option>
    <option value="Processing">Processing</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</td>

      <td>
        {new Date(order.createdAt).toLocaleDateString()}
      </td>

      <td>
        <button className="edit-btn"
        
        onClick={()=>{
            setSelectedOrder(order);
            setShowModel(true);
        }}>
          View
        </button>
      </td>

    </tr>
  ))}
</tbody>

        </table>
</div> 

       {
  showModel && selectedOrder && (

    <div className="modal-overlay">

      <div className="order-modal">

       <div className="order-modal-header">
  <h2>📦 Order Details</h2>

  <button
    className="close-btn"
    onClick={() => setShowModel(false)}
  >
    &times;
  </button>
</div>

        <p>
          <strong>Customer:</strong> {selectedOrder.user?.fullName}
        </p>

        <p>
          <strong>Email:</strong> {selectedOrder.user?.email}
        </p>

        <p>
          <strong>Total:</strong> ₹{selectedOrder.totalAmount}
        </p>

        <p>
  <strong>Status:</strong>

  <span
    className={`status-badge ${selectedOrder.status.toLowerCase()}`}
  >
    {selectedOrder.status}
  </span>
</p>
<p>
  <strong>Order Date:</strong>{" "}
  {new Date(selectedOrder.createdAt).toLocaleString()}
</p>
 <div className="address-card">
  <h3>🚚 Shipping Address</h3>

  <p>
    <strong>{selectedOrder.shippingAddress?.fullName}</strong>
  </p>

  <p>{selectedOrder.shippingAddress?.address}</p>

  <p>
    {selectedOrder.shippingAddress?.city},
    {" "}{selectedOrder.shippingAddress?.state}
  </p>

  <p>
    {selectedOrder.shippingAddress?.postalCode},
    {" "}{selectedOrder.shippingAddress?.country}
  </p>
</div>


<h3>Products</h3>

{selectedOrder?.items?.map((item) => (
 <div key={item._id} className="order-item">

  <img
    src={item.product?.images?.[0]?.url || item.product?.images?.[0]}
    alt={item.product?.name}
    className="order-product-img"
  />

  <div className="order-item-info">
    <h4>{item.product?.name}</h4>
    <p>Qty: {item.quantity}</p>
    <p>₹{item.product?.price}</p>
  </div>

</div>
))}

<div className="order-summary">
  <h3>🧾 Order Summary</h3>

  <div className="summary-row">
    <span>Total Items</span>
    <span>{selectedOrder.items.length}</span>
  </div>

  <div className="summary-row total">
    <span>Total Amount</span>
    <span>₹{selectedOrder.totalAmount}</span>
  </div>
</div>


      </div>

    </div>
     
  )
  
}

       <div className="pagination">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>

</div>


      </div>

    </div>
  );
};

export default Orders;