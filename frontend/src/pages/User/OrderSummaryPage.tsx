import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Massage";
import { useGetOrderByTrackingIdQuery } from "../../redux/api/orderApiSlice";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const OrderSummaryPage = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useGetOrderByTrackingIdQuery(trackingId);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPaymentComplete = (order) => {
    return order.isPaid || (order.isDelivered && order.paymentMethod === "CashOnDelivery");
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8" style={{ backgroundColor: "#0f0f10", color: "#fff", minHeight: "100vh" }}>
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-pink-600 to-pink-800 text-white py-2 px-4 rounded-lg mt-4 flex items-center gap-2 hover:from-pink-700 hover:to-pink-900 transition-all duration-300 shadow-md"
        >
          <ArrowBackIcon /> Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8" style={{ backgroundColor: "#0f0f10", color: "#fff", minHeight: "100vh" }}>
        <Message variant="info">No order found</Message>
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-pink-600 to-pink-800 text-white py-2 px-4 rounded-lg mt-4 flex items-center gap-2 hover:from-pink-700 hover:to-pink-900 transition-all duration-300 shadow-md"
        >
          <ArrowBackIcon /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: "#0f0f10", color: "#e5e5e5", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:from-gray-700 hover:to-gray-800 shadow-sm"
        >
          <ArrowBackIcon /> Back
        </button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
          Order Summary
        </h1>
        <button
          onClick={() => alert("Download Invoice")}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:from-pink-600 hover:to-pink-800 shadow-md"
        >
          <ReceiptIcon /> Invoice
        </button>
      </div>

      {/* Order Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Info */}
        <div className="rounded-xl shadow-lg p-6 border border-gray-800 hover:shadow-xl transition duration-300" style={{ backgroundColor: "#1a1a1b" }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-400">
            <LocalShippingIcon className="text-pink-300" /> Order Info
          </h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex justify-between">
              <span>Tracking ID:</span>
              <span className="font-medium text-white">{order.trackingId}</span>
            </p>
            <p className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium text-white">{formatDate(order.createdAt)}</span>
            </p>
            <p className="flex justify-between items-center">
              <span>Status:</span>
              {order.isDelivered ? (
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
                  <CheckCircleIcon fontSize="small" /> Delivered
                </span>
              ) : (
                <span className="bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
                  <HourglassBottomIcon fontSize="small" /> Processing
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-xl shadow-lg p-6 border border-gray-800 hover:shadow-xl transition duration-300" style={{ backgroundColor: "#1a1a1b" }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-400">
            <PaymentIcon className="text-pink-300" /> Payment
          </h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex justify-between">
              <span>Method:</span>
              <span className="font-medium text-white capitalize">{order.paymentMethod}</span>
            </p>
            <p className="flex justify-between items-center">
              <span>Status:</span>
              {isPaymentComplete(order) ? (
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Paid
                </span>
              ) : (
                <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                  Not Paid
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-xl shadow-lg p-6 border border-gray-800 hover:shadow-xl transition duration-300" style={{ backgroundColor: "#1a1a1b" }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-400">
            <AttachMoneyIcon className="text-pink-300" /> Order Total
          </h3>
          <div className="space-y-2 text-gray-300">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium text-white">${order.itemsPrice?.toFixed(2) || order.totalPrice?.toFixed(2)}</span>
            </p>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <p className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-xl text-pink-400">${order.totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-xl shadow-lg p-6 mb-8 border border-gray-800" style={{ backgroundColor: "#1a1a1b" }}>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-pink-400">
          <ShoppingBagIcon /> Order Items ({order.orderItems.length})
        </h2>
        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-800 rounded-lg hover:bg-[#141415] transition duration-200 group"
            >
              <div className="w-full sm:w-40 h-40 flex-shrink-0 relative">
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${import.meta.env.VITE_API_URL}${item.image}`
                  }
                  alt={item.name}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.png';
                    e.target.className = 'w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white group-hover:text-pink-400 transition duration-200">
                  {item.name}
                </h3>
                <p className="font-bold text-lg text-pink-400">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:from-pink-600 hover:to-pink-800 shadow-md"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/user-orders")}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:from-gray-800 hover:to-gray-950 shadow-md"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
