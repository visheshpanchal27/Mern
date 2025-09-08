import ReactDOM from 'react-dom/client';
import { StrictMode, Suspense, lazy } from 'react';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import store from './redux/store.js';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loader from './components/Loader.jsx';

// Lazy load components for better performance
const App = lazy(() => import('./App.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute.jsx'));
const Login = lazy(() => import('./pages/Auth/Login.jsx'));
const Register = lazy(() => import('./pages/Auth/Register.jsx'));
const EmailVerification = lazy(() => import('./pages/Auth/EmailVerification.jsx'));
const Profile = lazy(() => import('./pages/User/Profile.jsx'));
const AdminRoute = lazy(() => import('./pages/Admin/AdminRoute.jsx'));
const UserList = lazy(() => import('./pages/Admin/UserList.jsx'));
const CategoryList = lazy(() => import('./pages/Admin/CategoryList.jsx'));
const ProductList = lazy(() => import('./pages/Admin/ProductList.jsx'));
const ProductUpdate = lazy(() => import('./pages/Admin/ProductUpdate.jsx'));
const AllProducts = lazy(() => import('./pages/Admin/AllProducts.jsx'));
const Favorites = lazy(() => import('./pages/Products/Favorites.jsx'));
const ProductDetails = lazy(() => import('./pages/Products/productDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const ShippingCountry = lazy(() => import('./pages/Orders/ShippingCountry.jsx'));
const PlaceOrder = lazy(() => import('./pages/Orders/PlaceOrder.jsx'));
const Order = lazy(() => import('./pages/Orders/Order.jsx'));
const UserOrder = lazy(() => import('./pages/User/UserOrder.jsx'));
const OrderList = lazy(() => import('./pages/Admin/OrderList.jsx'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.jsx'));
const OrderSummaryPage = lazy(() => import('./pages/User/OrderSummaryPage.jsx'));
const ExpressCheckout = lazy(() => import('./pages/Orders/ExpressCheckout.jsx'));
const ErrorPage = lazy(() => import('./components/ErrorPage.jsx'));

// Google Client ID from env
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 404 outside of layout */}
      <Route path="*" element={<ErrorPage />} />

      {/* All layout-based routes */}
      <Route path="/" element={
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      }>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route index element={<Home />} />
        <Route path="/favorite" element={<Favorites />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/user-orders" element={<UserOrder />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/shipping" element={<ShippingCountry />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/express-checkout" element={<ExpressCheckout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/order-summary/:trackingId" element={<OrderSummaryPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="userList" element={<UserList />} />
          <Route path="categoryList" element={<CategoryList />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="allProductsList" element={<AllProducts />} />
          <Route path="orderlist" element={<OrderList />} />
          <Route path="product/update/:id" element={<ProductUpdate />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PayPalScriptProvider options={{ "client-id": "Aeg2zlMRergds1TlbocZrTeAzY9VPV91ID_2QuxtQzfJXsrEu2HUO6Q3QG4_At9kGtAnB4rx7NBhlzUQ" }}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
