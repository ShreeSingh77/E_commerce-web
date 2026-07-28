import { useEffect, useState } from "react";
import { getAllCategories ,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryServices.js";
import "./Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import toast from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
const [editId, setEditId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  description: "",
});
 useEffect(() => {
    fetchCategories();
  }, []);
 
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();

      console.log("Categories:", response);

      setCategories(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading Categories...</h2>;
  }
  const handleEdit = (category) => {
  setIsEditing(true);
  setEditId(category._id);

  setFormData({
    name: category.name,
    description: category.description || "",
  });

  setShowModal(true);
};
const handleAddCategory = async () => {
  try {
    if (!formData.name.trim()) {
      return toast.error("Category name is required");
    }

    let response;

    if (isEditing) {
      response = await updateCategory(editId, formData);

      toast.success(
        response.message || "Category updated successfully"
      );
    } else {
      response = await createCategory(formData);

      toast.success(
        response.message || "Category added successfully"
      );
    }

    setShowModal(false);

    setFormData({
      name: "",
      description: "",
    });

    setEditId(null);
    setIsEditing(false);

    fetchCategories();

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  try {
    const response = await deleteCategory(id);

    toast.success(
      response.message || "Category deleted successfully"
    );

    fetchCategories();

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to delete category"
    );
  }
};


  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
    <div className="admin-page">
  
       <div className="admin-header">
  <div>
    <h1>Categories</h1>
    <p>Manage all product categories</p>
  </div>

  <button className="add-btn"
  
  onClick={()=>setShowModal(true)}>
    + Add Category
  </button>
</div>
<div className="admin-card">
  
    <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3">No Categories Found</td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.description || "-"}</td>
                <td>
  <button className="edit-btn"
  onClick={()=>handleEdit(category)}
  >
    Edit
  </button>

  <button className="delete-btn"
  onClick={()=>handleDelete(category._id)}
  >
    Delete
  </button>
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
{showModal && (
  <div className="category-modal-overlay">

    <div className="category-modal">

     <h2>
  {isEditing ? "Edit Category" : "Add Category"}
</h2>

      <input
        type="text"
        placeholder="Category Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Description"
        rows="4"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
      />

      <div className="category-modal-buttons">

        <button
  className="category-cancel-btn"
  onClick={() => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);

    setFormData({
      name: "",
      description: "",
    });
  }}
>
  Cancel
</button>

        <button className="category-save-btn"
        onClick={handleAddCategory}
        >
          {isEditing ? "Update Category" : "Save Category"}
        </button>

      </div>

    </div>

  </div>
)}
</div>
      
    </div>
    </div>
    </div>
  );
};

export default Categories;