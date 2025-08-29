import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Auth
      "login": "Login",
      "register": "Register",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "fullName": "Full Name",
      "createAccount": "Create Account",
      "signIn": "Sign in",
      "continueWithGoogle": "Continue with Google",
      "alreadyHaveAccount": "Already have an account?",
      
      // Navigation
      "home": "Home",
      "shop": "Shop",
      "cart": "Cart",
      "orders": "Orders",
      "profile": "Profile",
      "admin": "Admin",
      
      // Products
      "products": "Products",
      "addToCart": "Add to Cart",
      "price": "Price",
      "description": "Description",
      "reviews": "Reviews",
      "writeReview": "Write a Review",
      
      // Cart
      "shoppingCart": "Shopping Cart",
      "quantity": "Quantity",
      "total": "Total",
      "checkout": "Checkout",
      "emptyCart": "Your cart is empty",
      
      // Orders
      "orderHistory": "Order History",
      "orderDetails": "Order Details",
      "orderStatus": "Order Status",
      "shippingAddress": "Shipping Address",
      
      // Common
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "cancel": "Cancel",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "search": "Search",
      "filter": "Filter",
      "sort": "Sort"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;