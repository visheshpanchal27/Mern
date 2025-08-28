import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import { FaDollarSign, FaUsers, FaClipboardList } from "react-icons/fa";

import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        background: "#1a1a1a",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: { color: "#ffffff" },
      },
      grid: {
        borderColor: "#333",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: { color: "#ccc" },
        },
        labels: {
          style: {
            colors: "#ccc",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: { color: "#ccc" },
        },
        labels: {
          style: {
            colors: "#ccc",
          },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: false,
        labels: {
          colors: "#ccc",
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const StatCard = ({ icon, title, value }) => (
    <div className="rounded-xl bg-black/50 backdrop-blur-md p-4 sm:p-6 w-full sm:w-[16rem] lg:w-[18rem] mt-3 sm:mt-5 shadow-md border border-gray-700 transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-pink-500 text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-lg sm:text-xl">
        {icon}
      </div>
      <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base">{title}</p>
      <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">{value}</h1>
    </div>
  );

  return (
    <>
      <section className="ml-12 sm:ml-16 lg:ml-20 p-3 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <StatCard
            icon={<FaDollarSign />}
            title="Sales"
            value={
              isLoading ? <Loader /> : `$${sales?.totalSales.toFixed(2) || 0}`
            }
          />
          <StatCard
            icon={<FaUsers />}
            title="Customers"
            value={loading ? <Loader /> : customers?.length || 0}
          />
          <StatCard
            icon={<FaClipboardList />}
            title="All Orders"
            value={loadingTwo ? <Loader /> : orders?.totalOrders || 0}
          />
        </div>

        <div className="mt-8 sm:mt-12 col-span-full">
          <div className="bg-black/60 p-4 sm:p-6 rounded-xl shadow-md border border-gray-700 w-full overflow-x-auto">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={window.innerWidth < 640 ? 250 : 350}
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-10 col-span-full">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
