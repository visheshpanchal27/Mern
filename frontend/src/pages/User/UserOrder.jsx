import { useMemo, useState } from "react";
import Message from "../../components/Massage";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { format } from "date-fns";

// Icons
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import { MdRefresh, MdInfoOutline, MdExpandMore, MdExpandLess, MdClose } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";

const UserOrder = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [customPrice, setCustomPrice] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Group order items by order ID
  const groupedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    return [...orders].reverse().map(order => ({
      orderId: order._id,
      customId: order.customId,
      trackingId: order.trackingId,
      createdAt: order.createdAt,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      isDelivered: order.isDelivered,
      isPaid: order.isPaid,
      items: order.orderItems,
      itemCount: order.orderItems.length,
      deliveredAt: order.deliveredAt
    }));
  }, [orders]);

  // Filter and search functionality
  const filteredOrders = useMemo(() => {
    if (!groupedOrders) return [];
    
    return groupedOrders.filter(order => {
      // Search term matches
      const matchesSearch = 
        searchTerm === "" ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customId && order.customId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.trackingId && order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter matches
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "delivered" && order.isDelivered) ||
        (statusFilter === "processing" && !order.isDelivered);
      
      // Payment method filter matches
      const normalizedMethod = order.paymentMethod?.toLowerCase();

      const matchesPayment = 
        paymentFilter === "all" ||
        (paymentFilter === "paypal" && normalizedMethod.includes("paypal")) ||
        (paymentFilter === "cod" && normalizedMethod.includes("cash"));
      
      // Price filter matches
      let matchesPrice = true;
      if (priceFilter === "under50") {
        matchesPrice = order.totalPrice < 50;
      } else if (priceFilter === "50to100") {
        matchesPrice = order.totalPrice >= 50 && order.totalPrice <= 100;
      } else if (priceFilter === "over100") {
        matchesPrice = order.totalPrice > 100;
      } else if (priceFilter === "custom" && customPrice) {
        matchesPrice = order.totalPrice >= parseFloat(customPrice);
      }
      
      return matchesSearch && matchesStatus && matchesPayment && matchesPrice;
    });
  }, [groupedOrders, searchTerm, statusFilter, paymentFilter, priceFilter, customPrice]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleRowClick = (customId, trackingId, orderId) => {
    if (customId) {
      navigate(`/order-summary/${customId}`);
    } else if (trackingId) {
      navigate(`/order-summary/${trackingId}`);
    } else {
      navigate(`/order-summary/${orderId}`);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setPriceFilter("all");
    setCustomPrice("");
  };

  const activeFilterCount = [statusFilter, paymentFilter, priceFilter].filter(
    f => f !== "all"
  ).length + (priceFilter === "custom" && customPrice ? 1 : 0);

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-400">My Orders</h2>
        </div>
        <Message variant="danger">
          {error?.data?.error || error.error || "Failed to load orders"}
          <button 
            onClick={refetch} 
            className="ml-2 text-pink-400 hover:underline flex items-center"
          >
            <MdRefresh className="mr-1" /> Try again
          </button>
        </Message>
      </div>
    );
  }

  if (groupedOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-400">My Orders</h2>
        </div>
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
            <span className="underline text-pink-400 cursor-pointer">Go Shop Something!</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-pink-400">My Orders</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID, name, tracking..."
              className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition cursor-pointer"
          >
            <FiFilter />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Advanced Filters</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white"
            >
              <MdClose size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Order Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm ${statusFilter === "all" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("processing")}
                  className={`px-3 py-1 rounded-full text-sm ${statusFilter === "processing" ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Processing
                </button>
                <button
                  onClick={() => setStatusFilter("delivered")}
                  className={`px-3 py-1 rounded-full text-sm ${statusFilter === "delivered" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Delivered
                </button>
              </div>
            </div>
            
            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPaymentFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm ${paymentFilter === "all" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setPaymentFilter("paypal")}
                  className={`px-3 py-1 rounded-full text-sm ${paymentFilter === "paypal" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  PayPal
                </button>
                <button
                  onClick={() => setPaymentFilter("cod")}
                  className={`px-3 py-1 rounded-full text-sm ${paymentFilter === "cod" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price Range</label>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => {
                    setPriceFilter("all");
                    setCustomPrice("");
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${priceFilter === "all" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setPriceFilter("under50");
                    setCustomPrice("");
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${priceFilter === "under50" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Under $50
                </button>
                <button
                  onClick={() => {
                    setPriceFilter("50to100");
                    setCustomPrice("");
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${priceFilter === "50to100" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  $50 - $100
                </button>
                <button
                  onClick={() => {
                    setPriceFilter("over100");
                    setCustomPrice("");
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${priceFilter === "over100" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Over $100
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="Min price"
                    className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                    value={priceFilter === "custom" ? customPrice : ""}
                    onChange={(e) => {
                      setPriceFilter("custom");
                      setCustomPrice(e.target.value);
                    }}
                  />
                  <span className="text-sm text-gray-400">+</span>
                </div>
              </div>
            </div>
          </div>
          
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 text-pink-400 hover:underline text-sm flex items-center gap-1"
            >
              <MdClose size={16} /> Reset all filters
            </button>
          )}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
          <MdInfoOutline className="mx-auto text-4xl text-pink-400 mb-3" />
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-gray-400">
            {searchTerm 
              ? `No orders match your search for "${searchTerm}"`
              : statusFilter !== "all" || paymentFilter !== "all" || priceFilter !== "all"
                ? "No orders match your current filters"
                : "No orders available"}
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 text-pink-400 hover:underline flex items-center gap-1 mx-auto"
          >
            <MdRefresh /> Reset filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-900 text-pink-400">
              <tr>
                <th className="text-left p-4">Items</th>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Payment</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrders[order.orderId];
                const firstItem = order.items[0];
                const imageUrl = firstItem.image?.startsWith("http")
                  ? firstItem.image
                  : `${import.meta.env.VITE_API_URL}${firstItem.image}`;

                return (
                  <>
                    {/* Main Order Row */}
                    <tr
                      key={order.orderId}
                      className="border-t border-gray-700 hover:bg-gray-800 transition duration-200 cursor-pointer"
                      onClick={() => toggleOrderExpand(order.orderId)}
                    >
                      <td className="p-4 flex items-center gap-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleOrderExpand(order.orderId)}
                            className="mr-2 text-gray-400 hover:text-white"
                          >
                            {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                          </button>
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={
                                    item.image?.startsWith("http")
                                      ? item.image
                                      : `${import.meta.env.VITE_API_URL}${item.image}`
                                  }
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-full border-2 border-gray-700 hover:border-pink-500 transition-all cursor-pointer"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/48?text=No+Image";
                                  }}
                                />
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {item.name}
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-700 flex items-center justify-center text-xs">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">
                          {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        <span 
                          className="font-mono text-sm opacity-90 hover:opacity-100 cursor-pointer"
                          onClick={() => handleRowClick(order.customId, order.trackingId, order.orderId)}
                        >
                          {order.orderId.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {order.createdAt ? format(new Date(order.createdAt), "PP") : "N/A"}
                      </td>
                      <td className="p-4 text-gray-300 font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === "PayPal" ? (
                            <>
                              <FaPaypal className="text-blue-500" />
                              <span className={order.isPaid ? "" : "text-yellow-400"}>
                                PayPal {!order.isPaid && "(Pending)"}
                              </span>
                            </>
                          ) : (
                            <>
                              <FaMoneyBillWave className="text-green-500" />
                              <span>Cash on Delivery</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-xs font-semibold py-1 px-3 rounded-full text-center w-[7rem] ${
                              order.isDelivered
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {order.isDelivered ? "Delivered" : "Processing"}
                          </span>
                          {order.isDelivered && order.deliveredAt && (
                            <span className="text-xs text-gray-400 text-center">
                              {format(new Date(order.deliveredAt), "MMM dd")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleRowClick(order.customId, order.trackingId, order.orderId)}
                          className="text-pink-400 hover:text-pink-300 px-3 py-1 rounded-md bg-pink-500/10"
                        >
                          Details
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Items Row */}
                    {isExpanded && (
                      <tr key={`${order.orderId}-expanded`} className="bg-gray-900/50">
                        <td colSpan="7" className="p-4">
                          <div className="pl-12 pr-4">
                            <h4 className="font-medium text-gray-300 mb-3">
                              Order Items ({order.itemCount})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {order.items.map((item, index) => {
                                const itemImageUrl = item.image?.startsWith("http")
                                  ? item.image
                                  : `${import.meta.env.VITE_API_URL}${item.image}`;

                                return (
                                  <div 
                                    key={index} 
                                    className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                                  >
                                    <div className="relative group">
                                      <img
                                        src={itemImageUrl}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg bg-gray-800 p-1 hover:scale-105 transition-transform cursor-pointer"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                        <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                          View
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <div className="text-sm text-gray-400 mt-1">
                                        {item.color && <p>Color: {item.color}</p>}
                                        {item.size && <p>Size: {item.size}</p>}
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                        <p>Quantity: {item.qty}</p>
                                        <p>Subtotal: ${(item.qty * item.price).toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredOrders.length} of {groupedOrders.length} orders
          {activeFilterCount > 0 && (
            <button 
              onClick={resetFilters}
              className="ml-2 text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MdClose size={14} /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrder;