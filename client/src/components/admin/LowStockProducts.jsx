import { useEffect, useState } from "react";
import { getLowStockProducts } from "../../services/dashboardService";

const LowStockProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const response = await getLowStockProducts();
      

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="low-stock-card">

      <h2>⚠️ Low Stock Products</h2>

  {products.map((product) => (
  <div key={product._id} className="low-stock-card-item">

    <div className="low-stock-header">

      <div>
        <h4>{product.name}</h4>
        <p>{product.category.name}</p>
      </div>

      <span className="stock-badge">
        {product.stock} Left
      </span>

    </div>

    <div className="stock-info">
      <span>Stock: {product.stock}</span>
      <span>{product.stock * 10}%</span>
    </div>

    <div className="progress">
      <div
        className="progress-fill"
        style={{
          width: `${product.stock * 10}%`,
        }}
      />
    </div>

  </div>
))}

    </div>
  );
};

export default LowStockProducts;