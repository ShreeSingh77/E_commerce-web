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



const statusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#60225c",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const data = {
  labels: statusData.map((item) => item._id),
  datasets: [
    {
      data: statusData.map((item) => item.count),
      backgroundColor: statusData.map(
        (item) =>
          statusColors[item._id?.toLowerCase()] || "#9ca3af"
      ),
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
return (
  <div className="chart-card">
    <h2>📊 Orders by Status</h2>

    <div style={{ height: "280px" }}>
      <Doughnut data={data} options={options} />
    </div>

  </div>
);
};

export default OrderStatusChart;