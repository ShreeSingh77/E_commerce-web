import { useEffect, useState } from "react";
import { getMonthlySales } from "../../services/dashboardService";
import {Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import {Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const MonthlySalesChart = () => {

    const [sales,setSales] = useState([]);

    useEffect(()=>{
        fetchSales();
    },[]);

    const fetchSales = async ()=>{
        try{
            const response = await getMonthlySales();
            console.log(response);
            setSales(response.data);
        }catch(error){
            console.log(error);
        }
    }
const chartData = {
  labels: sales.map(
    (item) => `${item._id.month}/${item._id.year}`
  ),
  datasets: [
    {
      label: "Monthly Sales",
      data: sales.map((item) => item.totalSales),
      backgroundColor: "#ff7a00",
      borderRadius: 8,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },
};
    return (
  <div className="chart-card">
    <h2>Monthly Sales</h2>
    
  <div style={{ height: "280px" }}>
  <Bar data={chartData} options={options} />
</div>
  </div>
);
    
}

export default MonthlySalesChart;