import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import BottomNav from './components/BottomNav'
import MenuDrawer from './components/MenuDrawer'
import AuthCheck from './components/AuthCheck'
import RealTimeUpdates from './components/RealTimeUpdates'
import { redirectToDesktop, setupDesktopRedirect } from './utils/deviceDetection'

import Home from './pages/Home'
import Shop from './pages/Shop'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import Privacy from './pages/Privacy'
import Help from './pages/Help'
import About from './pages/About'
import AppPreferences from './pages/AppPreferences'
import AccountSettings from './pages/AccountSettings'
import Notifications from './pages/Notifications'
import ChangePassword from './pages/ChangePassword'
import Language from './pages/Language'

import UserOrder from './pages/UserOrder'
import Shipping from './pages/Shipping'

import PlaceOrder from './pages/PlaceOrder'
import ExpressCheckout from './pages/ExpressCheckout'
import Order from './pages/Order'
import OrderSummary from './pages/OrderSummary'

function App() {
  useEffect(() => {
    redirectToDesktop();
    setupDesktopRedirect();
  }, []);

  return (
    <AuthCheck>
      <RealTimeUpdates />
      <div className="min-h-screen bg-dark text-white">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/shop" element={<Shop />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/express-checkout" element={<ExpressCheckout />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/order-summary/:trackingId" element={<OrderSummary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="/app-preferences" element={<AppPreferences />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/language" element={<Language />} />
            <Route path="/user-orders" element={<UserOrder />} />
            <Route path="*" element={<div className="p-4 text-center text-red-500">Page Not Found</div>} />
          </Routes>
        </main>
        <MenuDrawer />
        <BottomNav />
      </div>
    </AuthCheck>
  )
}

export default App