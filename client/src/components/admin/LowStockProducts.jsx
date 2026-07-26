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
      console.log(response);

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="low-stock-card">

      <h2>⚠️ Low Stock Products</h2>

      {products.map((product) => (
  <div key={product._id}>

    <div className="low-stock-item">

      <div>
        <h4>{product.name}</h4>
        <p>{product.category.name}</p>
      </div>

      <span className="stock-badge">
        {product.stock} Left
      </span>

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