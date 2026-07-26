import { useEffect, useState } from "react";
import { getTopProducts } from "../../services/dashboardService";

const TopProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await getTopProducts();
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-card">

      <h2>🏆 Top Selling Products</h2>

      <table className="dashboard-table">

        <thead>
          <tr>
            <th>Rank</th>
            <th>Product</th>
            <th>Sold</th>
            <th>Price</th>
            <th>Revenue</th>
          </tr>
        </thead>

       <tbody>
  {products.map((product, index) => (

    <tr key={product._id}>

      <td>
        <span
          className={`rank-badge ${
            index === 0
              ? "gold"
              : index === 1
              ? "silver"
              : "bronze"
          }`}
        >
          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
        </span>
      </td>

      <td>{product.productName}</td>

      <td>
        <span className="sold-badge">
          {product.totalSold}
        </span>
      </td>

      <td>₹{product.price.toLocaleString()}</td>

      <td>
        ₹{(product.totalSold * product.price).toLocaleString()}
      </td>

    </tr>

  ))}
</tbody>

      </table>

    </div>
  );
};

export default TopProducts;