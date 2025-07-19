import Message from "../../components/Massage";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

// Material UI icons
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-pink-400">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : orders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center mt-16 cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/shop")}
        >
          <ShoppingCartOutlinedIcon
            fontSize="large"
            className="text-pink-400 mb-2"
          />
          <p className="text-center text-gray-400">
            🛍️ You haven't placed any orders yet.{" "}
            <span className="underline text-pink-400">Go Shop Something!</span>
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-900 text-pink-400">
              <tr>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Payment Method</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {[...orders].reverse().map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/order/summary/${order.customId}`)}
                >
                  <td className="p-3">
                    <img
                      src={
                        order.orderItems[0]?.image?.startsWith("http")
                          ? order.orderItems[0].image
                          : `${import.meta.env.VITE_API_URL}${order.orderItems[0]?.image}`
                      }
                      alt="Product"
                      className="w-20 h-16 object-contain rounded shadow"
                    />
                  </td>
                  <td className="p-3 text-gray-300">{order._id}</td>
                  <td className="p-3 text-gray-300">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-3 text-gray-300">$ {order.totalPrice}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {order.paymentMethod === "PayPal" ? (
                        <>
                          <FaPaypal className="text-blue-500" />
                          <span>PayPal</span>
                        </>
                      ) : (
                        <>
                          <FaMoneyBillWave className="text-green-500" />
                          <span>Cash on Delivery</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-semibold py-1 px-3 rounded-full block text-center w-[6rem] ${
                        order.isDelivered
                          ? "bg-green-500 text-black"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
