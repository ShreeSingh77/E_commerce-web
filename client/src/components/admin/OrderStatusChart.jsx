import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getOrderStatusStats } from "../../services/dashboardService";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = () => {
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await getOrderStatusStats();
      setStatusData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const data = {
    labels: statusData.map((item) => item._id),
    datasets: [
      {
        data: statusData.map((item) => item.count),
        backgroundColor: [
          "#f59e0b", // Pending
          "#22c55e", // Delivered
          "#ef4444", // Cancelled
          "#3b82f6", // Processing
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h2>📊 Orders by Status</h2>

      <Doughnut data={data} />
    </div>
  );
};

export default OrderStatusChart;