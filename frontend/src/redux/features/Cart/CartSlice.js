import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { logOut } from "../auth/authSlice";

// ---------------------- Fetch Cart ----------------------
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      if (!userInfo?.token) {
        return rejectWithValue("User not authenticated");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${BASE_URL}/cart`, config);
      return data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------------------- Add to Cart ----------------------
export const addToCartBackend = createAsyncThunk(
  "cart/addToCartBackend",
  async (item, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      if (!userInfo?.token) {
        return rejectWithValue("User not authenticated");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/cart`,
        { productId: item._id, quantity: item.qty },
        config
      );

      return data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------------------- Remove from Cart ----------------------
export const removeFromCartBackend = createAsyncThunk(
  "cart/removeFromCartBackend",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      if (!userInfo?.token) {
        return rejectWithValue("User not authenticated");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${BASE_URL}/cart`,
        { items: [{ product: productId, qty: 0 }] },
        config
      );

      return data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------------------- Create Order ----------------------
export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const API_URL = BASE_URL;

      const {
        auth: { userInfo },
      } = getState();

      if (!userInfo?.token) {
        return rejectWithValue("User not authenticated");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ---------------------- Initial State ----------------------
const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "PayPal",
  loading: false,
  error: null,
  order: null,
  orderSuccess: false,
};

// ---------------------- Cart Slice ----------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    calculateCartPrices: (state) => {
      const itemsPrice = state.cartItems.reduce((acc, item) => {
        const price = Number(item.price);
        const qty = Number(item.qty);
        if (isNaN(price) || isNaN(qty)) return acc;
        return acc + price * qty;
      }, 0);
      state.itemsPrice = Number(itemsPrice.toFixed(2));
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      const taxRate = 0.15;
      state.taxPrice = Number((state.itemsPrice * taxRate).toFixed(2));
      state.totalPrice = Number(
        (state.itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
      );
    },
    clearCartItems: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.orderSuccess = true;
        state.cartItems = []; // Clear cart after successful order
        state.error = null; // Clear any previous errors
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderSuccess = false;
      })
      // Clear cart on logout
      .addCase(logOut, (state) => {
        return initialState;
      });
  },
});

// ---------------------- Exports ----------------------
export const {
  saveShippingAddress,
  savePaymentMethod,
  calculateCartPrices,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
