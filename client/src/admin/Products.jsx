import "./Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryServices";


const Products = () => {

    const [products, setProducts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [search ,setSearch] = useState("");
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");
const [showForm ,setShowForm] =useState(false);

const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
});

const [images, setImages] = useState([]);

const fetchProducts = async (page = 1) => {
  try {
    const response = await getAllProducts({
         page:currentPage,
        search,
        category:selectedCategory,
     });
    console.log(response);
    setProducts(response.data.products);
    setCurrentPage(response.data.currentPage);
    setTotalPages(response.data.totalPages);
     
     
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to fetch products"
    );
  }
};
const fetchCategories = async () => {
  try {
    const response = await getAllCategories();

    console.log(response);

    setCategories(response.data);
  } catch (error) {
    toast.error("Failed to load categories");
  }
};
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleImageChange = (e) => {
    const files =Array.from(e.target.files);

    console.log(files);
    
  setImages(files);
};


useEffect(()=>{
    fetchProducts();
    fetchCategories();
},[search,
    selectedCategory,
    currentPage
]);
useEffect(()=>{
    fetchCategories();
   
},[]);
 console.log(images);
 
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <div className="products-header">

          <div>
            <h1>Products Management</h1>
            <p>Manage all products from here.</p>
          </div>

          <button
  className="add-btn"
  onClick={() => setShowForm(true)}
>
  + Add Product
</button>

        </div>

        <div className="products-toolbar">

         <input
  type="text"
  placeholder="🔍 Search products..."
  className="search-input"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

          <select
  className="category-filter"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
  <option value="">All Categories</option>

  {categories.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ))}
</select>

        </div>

       {
  showForm && (
    <div className="product-form">

      <h2>Add Product</h2>

      <div className="product-grid">

  <input
  type="text"
  name="name"
  placeholder="Product Name"
  value={formData.name}
  onChange={handleChange}
/>

 <input
  type="number"
  name="price"
  placeholder="Price"
  value={formData.price}
  onChange={handleChange}
/>

 <input
  type="number"
  name="stock"
  placeholder="Stock"
  value={formData.stock}
  onChange={handleChange}
/>

 <select
  name="category"
  value={formData.category}
  onChange={handleChange}
>
  <option value="">Select Category</option>

  {categories.map((category) => (
    <option key={category._id} value={category._id}>
      {category.name}
    </option>
  ))}
</select>

</div>

<textarea
  name="description"
  placeholder="Description"
  value={formData.description}
  onChange={handleChange}
/>

<label className="upload-box">

  <input
    type="file"
    multiple
    hidden
    onChange={handleImageChange}
  />

  {images.length === 0 ? (

    <div className="upload-content">

      <h3>📷 Upload Product Images</h3>

      <p>Click here to select images</p>

      <span>JPG, PNG, WEBP (Max 5 Images)</span>

    </div>

  ) : (

    <div className="preview-grid">

      {images.map((image, index) => (

        <img
          key={index}
          src={URL.createObjectURL(image)}
          alt="preview"
          className="preview-img"
        />

      ))}

      <div className="add-more">
        + Add More
      </div>

    </div>

  )}

</label>
  
      <div className="form-buttons">

        <button
  className="save-btn"
  onClick={() => console.log(formData, images)}
>
  Save
</button>

        <button
          className="cancel-btn"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>

      </div>

    </div>
  )
}
        <table className="products-table">
  <thead>
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Category</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {products.map((product) => (
      <tr key={product._id}>

        <td>
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-img"
          />
        </td>

        <td>{product.name}</td>

        <td>{product.category.name}</td>

        <td>₹{product.price.toLocaleString()}</td>

        <td>{product.stock}</td>

        <td>
          <button className="edit-btn">Edit</button>

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

export default Products;