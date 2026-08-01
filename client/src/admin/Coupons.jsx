import "./Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../services/couponService";




const Coupons=()=>{
   const [coupons, setCoupons] = useState([]);
const [showModal, setShowModal] = useState(false);

const [formData, setFormData] = useState({
  code: "",
  discount: "",
  expiryDate: "",
});

const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);


const fetchCoupons = async () => {
  try {
    const response = await getAllCoupons();
    setCoupons(response.data || []);
  } catch (error) {
    toast.error("Failed to fetch coupons");
  }
};
const handleSaveCoupon = async () => {
  try {
    if (
      !formData.code ||
      !formData.discount ||
      !formData.expiryDate
    ) {
      return toast.error("All fields are required");
    }

    let response;

    if (isEditing) {
      response = await updateCoupon(editId, formData);

      toast.success(
        response.message || "Coupon updated successfully"
      );
    } else {
      response = await createCoupon(formData);

      toast.success(
        response.message || "Coupon created successfully"
      );
    }

    setShowModal(false);
    setIsEditing(false);
    setEditId(null);

    setFormData({
      code: "",
      discount: "",
      expiryDate: "",
    });

    fetchCoupons();

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};
const handleEdit = (coupon) => {
  setIsEditing(true);
  setEditId(coupon._id);

  setFormData({
    code: coupon.code,
    discount: coupon.discount,
    expiryDate: coupon.expiryDate.split("T")[0],
  });

  setShowModal(true);
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this coupon?"
  );

  if (!confirmDelete) return;

  try {
    const response = await deleteCoupon(id);

    toast.success(
      response.message || "Coupon deleted successfully"
    );

    fetchCoupons();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to delete coupon"
    );
  }
};
useEffect(() => {
  fetchCoupons();
}, []);
   return (
  <div className="admin-layout">
    <AdminSidebar />

    <div className="admin-content">
<div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>Coupons</h2>
          <p>Manage all discount coupons</p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Coupon
        </button>
      </div>
       <div className="table-wrapper">
      <table className="admin-table">

  <thead>
    <tr>
      <th>#</th>
      <th>Code</th>
      <th>Discount</th>
      <th>Expiry Date</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>

    {coupons.map((coupon, index) => (

      <tr key={coupon._id}>

        <td>{index + 1}</td>

        <td>{coupon.code}</td>

        <td>{coupon.discount}%</td>

        <td>
          {new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
        </td>

        <td>
  <span
    className={
      new Date(coupon.expiryDate) < new Date() || !coupon.isActive
        ? "status-badge expired"
        : "status-badge active"
    }
  >
    {new Date(coupon.expiryDate) < new Date() || !coupon.isActive
      ? "Expired"
      : "Active"}
  </span>
</td>

        <td>

          <button className="edit-btn"
          onClick={()=>handleEdit(coupon)}
          >
            Edit
          </button>

          <button className="delete-btn"
          onClick={()=>handleDelete(coupon._id)}
          >
            Delete
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>
</div>
{showModal && (
  <div className="coupon-modal-overlay">

    <div className="coupon-modal">

      <h2>
        {isEditing ? "Edit Coupon" : "Add Coupon"}
      </h2>

      <input
        type="text"
        placeholder="Coupon Code"
        value={formData.code}
        onChange={(e) =>
          setFormData({
            ...formData,
            code: e.target.value.toUpperCase(),
          })
        }
      />

      <input
        type="number"
        placeholder="Discount (%)"
        value={formData.discount}
        onChange={(e) =>
          setFormData({
            ...formData,
            discount: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={formData.expiryDate}
        onChange={(e) =>
          setFormData({
            ...formData,
            expiryDate: e.target.value,
          })
        }
      />

      <div className="coupon-modal-buttons">

        <button
          className="coupon-cancel-btn"
          onClick={() => {
            setShowModal(false);
            setIsEditing(false);
            setEditId(null);

            setFormData({
              code: "",
              discount: "",
              expiryDate: "",
            });
          }}
        >
          Cancel
        </button>

        <button
  className="coupon-save-btn"
  onClick={handleSaveCoupon}
>
  {isEditing ? "Update Coupon" : "Save Coupon"}
</button>

      </div>

    </div>

  </div>
)}
</div>
    </div>
  </div>
);

};

export default Coupons;