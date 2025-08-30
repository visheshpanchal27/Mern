import React, { useState } from "react";
import Message from "../../components/Massage";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useDeleteOrderMutation } from "../../redux/api/orderApiSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaEye, FaCalendar, FaDollarSign } from "react-icons/fa";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
      <section className="xl:ml-[4rem] md:ml-0 p-5">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <FaShoppingCart className="text-pink-500 text-2xl" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Order Management
          </h1>
        </div>
        <p className="text-gray-400">Track and manage customer orders ({orders?.length || 0} total)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] p-4 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-2">
              <FaShoppingCart className="text-blue-400" />
              <span className="text-gray-400 text-sm">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{orders?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] p-4 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-green-400" />
              <span className="text-gray-400 text-sm">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">${orders?.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] p-4 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-purple-400" />
              <span className="text-gray-400 text-sm">Today</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{orders?.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString()).length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] p-4 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-2">
              <FaEye className="text-pink-400" />
              <span className="text-gray-400 text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{orders?.filter(order => !order.isDelivered).length || 0}</p>
          </div>
        </div>
      </motion.div>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl border border-gray-800/50 overflow-hidden">
          <table className="min-w-full text-white">
            <thead className="bg-black/60">
              <tr className="text-left text-gray-300">
                <th className="px-6 py-4 w-8"></th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[...orders].reverse().map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className={`hover:bg-gray-800 transition duration-200 ${expandedOrder === order._id ? 'bg-gray-800' : 'border-b border-gray-700'}`}
                  >
                    <td className="px-2 py-3 text-center">
                      <button 
                        onClick={() => toggleExpandOrder(order._id)}
                        className="text-gray-400 hover:text-white focus:outline-none"
                        aria-label={expandedOrder === order._id ? "Collapse order details" : "Expand order details"}
                      >
                        {expandedOrder === order._id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </button>
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      {order._id.substring(0, 8)}...
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      {order.user ? order.user.username : "N/A"}
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td 
                      className="px-4 py-3 font-medium cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      <div className="flex -space-x-2">
                        {order.orderItems.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={
                              item?.image?.startsWith("http")
                                ? item?.image
                                : `${import.meta.env.VITE_API_URL}${item?.image}`
                            }
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded-full border-2 border-gray-700"
                            title={item.name}
                          />
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-700 flex items-center justify-center text-xs">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.isPaid || order.paymentMethod === "CashOnDelivery"
                              ? "bg-green-500/90 text-black"
                              : "bg-red-500/90 text-white"
                          }`}
                        >
                          {order.isPaid || order.paymentMethod === "CashOnDelivery" ? "Paid" : "Unpaid"}
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.isDelivered
                              ? "bg-green-500/90 text-black"
                              : "bg-red-500/90 text-white"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Shipping"}
                        </span>
                      </div>
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-blue-400"
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      <span className="text-sm font-medium">
                        {order.paymentMethod === "CashOnDelivery"
                          ? "COD"
                          : order.paymentMethod || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link to={`/order/${order._id}`}>
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded-md transition text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Details
                        </button>
                      </Link>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-500/10"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                  
                  {expandedOrder === order._id && (
                    <tr className="bg-gray-900/50 border-b border-gray-700">
                      <td colSpan="9" className="px-4 py-3">
                        <div className="pl-12 pr-6 pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-300 mb-2">Shipping Information</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="text-gray-400">Name:</span> {order.shippingAddress?.fullName}</p>
                                <p><span className="text-gray-400">Address:</span> {order.shippingAddress?.address}</p>
                                <p><span className="text-gray-400">City:</span> {order.shippingAddress?.city}</p>
                                <p><span className="text-gray-400">Postal Code:</span> {order.shippingAddress?.postalCode}</p>
                                <p><span className="text-gray-400">Country:</span> {order.shippingAddress?.country}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-300 mb-2">Payment Details</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="text-gray-400">Method:</span> {order.paymentMethod === "CashOnDelivery" ? "Cash on Delivery" : order.paymentMethod}</p>
                                <p><span className="text-gray-400">Status:</span> 
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    order.isPaid || order.paymentMethod === "CashOnDelivery"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}>
                                    {order.isPaid || order.paymentMethod === "CashOnDelivery" ? "Completed" : "Pending"}
                                  </span>
                                </p>
                                {order.isPaid && (
                                  <p><span className="text-gray-400">Paid At:</span> {new Date(order.paidAt).toLocaleString()}</p>
                                )}
                                <p><span className="text-gray-400">Tax:</span> ${order.taxPrice.toFixed(2)}</p>
                                <p><span className="text-gray-400">Shipping:</span> ${order.shippingPrice.toFixed(2)}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-300 mb-2">Order Summary</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="text-gray-400">Order ID:</span> {order._id}</p>
                                <p><span className="text-gray-400">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                                <p><span className="text-gray-400">Items:</span> {order.orderItems.length}</p>
                                <p><span className="text-gray-400">Total:</span> ${order.totalPrice.toFixed(2)}</p>
                                <p><span className="text-gray-400">Status:</span> 
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    order.isDelivered
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}>
                                    {order.isDelivered ? "Delivered" : "In Progress"}
                                  </span>
                                </p>
                                {order.isDelivered && (
                                  <p><span className="text-gray-400">Delivered At:</span> {new Date(order.deliveredAt).toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-300 mb-3">Order Items ({order.orderItems.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                                <img
                                  src={
                                    item?.image?.startsWith("http")
                                      ? item?.image
                                      : `${import.meta.env.VITE_API_URL}${item?.image}`
                                  }
                                  alt={item.name}
                                  className="w-16 h-16 object-contain rounded-md bg-white"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <div className="text-sm text-gray-400 mt-1">
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                    <p>Quantity: {item.qty}</p>
                                    <p>Subtotal: ${(item.qty * item.price).toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
    </div>
  );
};

export default OrderList;