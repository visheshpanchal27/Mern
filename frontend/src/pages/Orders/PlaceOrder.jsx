import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useGetCartQuery, useClearCartMutation } from "../../redux/api/cartApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Massage";
import ProgressSteps from "../../components/ProgressSteps";

const PlaceOrder = () => {
  const navigate = useNavigate();

  // Fetch cart from backend
  const { data: cart, isLoading: cartLoading, isError } = useGetCartQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  const cartItems = cart?.items || [];

  const shippingAddress =
    cart?.shippingAddress || JSON.parse(localStorage.getItem("shippingAddress")) || {};

  const paymentMethod =
    cart?.paymentMethod || localStorage.getItem("paymentMethod") || "CashOnDelivery";

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.product.price,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  // Place Order Handler
  const placeOrderHandler = async () => {
  // Validate shipping address
  const { address, city, postalCode, country } = shippingAddress || {};
  if (!address || !city || !postalCode || !country) {
    toast.error("Please complete your shipping address before placing the order.");
    return;
  }

  try {
    const res = await createOrder({
      orderItems: cartItems.map((item) => ({
        _id: item.product._id || item.product,
        qty: item.qty,
        price: item.product.price || item.product,
        name: item.product.name || item.product,
        image: item.product.image || item.product,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    }).unwrap();

    await clearCart().unwrap();
    navigate(`/order-summary/${res.trackingId}`);
  } catch (err) {
    toast.error(err?.data?.error || "Something went wrong");
  }
};


  if (cartLoading) return <Loader />;
  if (isError) return <Message variant="danger">Failed to load cart</Message>;

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8">
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <>
            {/* Cart Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <td className="px-1 py-2 text-left">Image</td>
                    <td className="px-1 py-2 text-left">Product</td>
                    <td className="px-1 py-2 text-left">Qty</td>
                    <td className="px-1 py-2 text-left">Price</td>
                    <td className="px-1 py-2 text-left">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product._id}>
                      <td className="p-2">
                        <img
                          src={
                            item.product.image?.startsWith("http")
                              ? item.product.image
                              : `${import.meta.env.VITE_API_URL}${item.product.image}`
                          }
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">${item.product.price.toFixed(2)}</td>
                      <td className="p-2">
                        ${(item.qty * item.product.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
              <div className="flex justify-between flex-wrap p-8 bg-[#181818] text-white rounded-lg">
                <ul className="text-lg">
                  <li>Items: ${itemsPrice.toFixed(2)}</li>
                  <li>Shipping: ${shippingPrice.toFixed(2)}</li>
                  <li>Tax: ${taxPrice.toFixed(2)}</li>
                  <li>Total: ${totalPrice}</li>
                </ul>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping</h2>
                  <p>
                    <strong>Address:</strong> {shippingAddress.address},{" "}
                    {shippingAddress.city} {shippingAddress.postalCode},{" "}
                    {shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment</h2>
                  <strong>Method:</strong> {paymentMethod}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                className="cursor-pointer bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full text-lg w-full mt-4 flex items-center justify-center transition duration-200 disabled:opacity-50"
                disabled={cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <div className=" w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
