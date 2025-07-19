import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Massage";
import { useGetOrderByTrackingIdQuery } from "../../redux/api/orderApiSlice"; // 👈 Update this path if needed

const OrderSummaryPage = () => {
  const { trackingId } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByTrackingIdQuery(trackingId);

  return (
    <div className="container mx-auto px-4 py-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-pink-400">
        Order Summary
      </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="bg-gray-800 p-6 rounded shadow-lg space-y-4">
          <p><span className="font-semibold text-pink-400">Tracking ID:</span> {order.trackingId}</p>
          <p><span className="font-semibold text-pink-400">Order Date:</span> {order.createdAt.substring(0, 10)}</p>
          <p><span className="font-semibold text-pink-400">Total:</span> ${order.totalPrice}</p>
          <p><span className="font-semibold text-pink-400">Payment Method:</span> {order.paymentMethod}</p>
          <p>
            <span className="font-semibold text-pink-400">Status:</span>{" "}
            {order.isDelivered ? "Delivered" : "Processing"}
          </p>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-pink-300">Items:</h3>
            <ul className="space-y-2">
              {order.orderItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 bg-gray-700 p-2 rounded"
                >
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${import.meta.env.VITE_API_URL}${item.image}`
                    }
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded shadow"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-300">
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryPage;
