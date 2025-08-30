import { useParams, useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Massage";
import { useGetOrderByTrackingIdQuery } from "../../redux/api/orderApiSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
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

  const generateInvoice = () => {
    if (!order) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const currentDate = new Date();

    const primaryColor = [216, 27, 96];
    const secondaryColor = [60, 60, 60];
    const lightColor = [245, 245, 245];

    doc.setFontSize(20);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("Infinity Plaza", margin, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Business Street, City, Country", margin, 26);
    doc.text("Phone: +1 (123) 456-7890 | Email: info@infinityplaza.com", margin, 32);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, 36, pageWidth - margin, 36);

    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text("INVOICE", pageWidth - margin, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice #: ${order.trackingId}`, pageWidth - margin, 26, { align: "right" });
    doc.text(`Date: ${currentDate.toLocaleDateString()}`, pageWidth - margin, 32, { align: "right" });

    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("Order Information", margin, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id || "N/A"}`, margin, 56);
    doc.text(`Tracking ID: ${order.trackingId}`, margin, 62);
    doc.text(`Order Date: ${formatDate(order.createdAt)}`, margin, 68);
    doc.text(`Payment Method: ${order.paymentMethod}`, margin, 74);
    doc.text(`Payment Status: ${isPaymentComplete(order) ? "Paid" : "Pending"}`, margin, 80);

    if (order.shippingAddress) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Information", pageWidth / 2 + 10, 48);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Address: ${order.shippingAddress?.address || "N/A"}`, pageWidth / 2 + 10, 62);
      doc.text(`City: ${order.shippingAddress?.city || "N/A"}`, pageWidth / 2 + 10, 68);
      doc.text(`Postal Code: ${order.shippingAddress?.postalCode || "N/A"}`, pageWidth / 2 + 10, 74);
      doc.text(`Country: ${order.shippingAddress?.country || "N/A"}`, pageWidth / 2 + 10, 80);
    }

    autoTable(doc, {
      head: [["Product", "Quantity", "Unit Price", "Total"]],
      body: order.orderItems.map((item) => [
        item.name,
        item.qty,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.qty).toFixed(2)}`,
      ]),
      startY: 90,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
        textColor: secondaryColor,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: lightColor,
      },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });

    const shipping = order.shippingPrice || 0;
    const tax = order.taxPrice || 0;
    const subtotal = order.totalPrice - tax - shipping;

    const finalY = doc.lastAutoTable?.finalY || 90;
    autoTable(doc, {
      body: [
        ["Subtotal", `$${subtotal.toFixed(2)}`],
        ["Tax", `$${tax.toFixed(2)}`],
        ["Shipping", `$${shipping.toFixed(2)}`],
        ["Total", `$${order.totalPrice.toFixed(2)}`]
      ],
      startY: finalY + 10,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: pageWidth - 94 }
    });

    if (!isPaymentComplete(order)) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Payment Instructions:", margin, finalY + 40);
      doc.text("Please make payment within 7 days to avoid order cancellation.", margin, finalY + 46);
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for shopping with Vishesh WebStore!", pageWidth / 2, 280, { align: "center" });
    doc.text("For any inquiries, please contact support@visheshwebstore.com", pageWidth / 2, 286, { align: "center" });
    doc.text("Terms & Conditions apply", pageWidth / 2, 292, { align: "center" });

    doc.save(`Invoice_${order.trackingId}.pdf`);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Something went wrong!</Message>;

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
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <CheckCircleIcon className="text-green-400 text-2xl animate-pulse" />
          <h1 className="text-2xl font-bold text-green-400">Order Confirmed!</h1>
        </div>
        <p className="text-gray-400">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer flex items-center gap-2 text-gray-300 hover:text-white bg-transparent border border-gray-600 hover:border-pink-500 rounded-full py-2 px-5 transition duration-300"
        >
          <ArrowBackIcon /> Go Back
        </button>
        <button
          onClick={generateInvoice}
          className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:from-pink-600 hover:to-pink-800 shadow-lg hover:scale-105"
        >
          <ReceiptIcon /> Download Invoice
        </button>
      </div>

      {/* Order Progress */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Order Progress</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="text-white text-sm" />
            </div>
            <span className="ml-2 text-green-400 font-medium">Order Placed</span>
          </div>
          <div className="flex-1 h-1 bg-gray-700 mx-4">
            <div className={`h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded transition-all duration-1000 ${order.isDelivered ? 'w-full' : 'w-1/2'}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.isDelivered ? 'bg-green-500' : 'bg-gray-600'}`}>
              <LocalShippingIcon className="text-white text-sm" />
            </div>
            <span className={`ml-2 font-medium ${order.isDelivered ? 'text-green-400' : 'text-gray-400'}`}>Delivered</span>
          </div>
        </div>
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
                      : `${process.env.REACT_APP_API_URL}${item.image}`
                  }
                  alt={item.name}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-product.png';
                    target.className = 'w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white group-hover:text-pink-400 transition duration-200">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
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
          className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:from-pink-600 hover:to-pink-800 shadow-md"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/user-orders")}
          className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:from-gray-800 hover:to-gray-950 shadow-md"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
