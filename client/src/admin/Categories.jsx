import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getAllCategories,
} from "../services/categoryServices.js";
import toast from "react-hot-toast";
import "./Admin.css";




const Category=()=>{
const [categories, setCategories] = useState([]);
const [search, setSearch] = useState("");


const fetchCategories = async () => {
  try {
    const response = await getAllCategories();

    console.log(response);

    setCategories(response.data);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to load categories"
    );
  }
};
const filteredCategories = categories.filter((category) =>
  category.name
    .toLowerCase()
    .includes(search.toLowerCase())
);
useEffect(() => {
  fetchCategories();
}, []);
    return (
  <div className="admin-layout">

    <AdminSidebar />

    <div className="admin-content">

     <div className="products-header">
  <div>
    <h1>Categories Management</h1>
    <p>Total Categories: {categories.length}</p>
  </div>

  <button className="add-btn">
    + Add Category
  </button>
</div>

   <div className="products-toolbar">
  <input
    type="text"
    placeholder="Search category..."
    className="search-input"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

    <table className="products-table">

  <thead>
    <tr>
      <th>Name</th>
      <th>Slug</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>

    {filteredCategories.map((category) => (

      <tr key={category._id}>

        <td>{category.name}</td>

        <td>{category.slug}</td>

        <td>

          <button className="edit-btn">
            Edit
          </button>

          <button className="delete-btn">
            Delete
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>

    </div>

  </div>
);
};

export default Category;

