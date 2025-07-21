import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const { data } = await axios.get("/api/cart");
  return data.items || [];
});

export const addToCartBackend = createAsyncThunk(
  "cart/addToCartBackend",
  async (item) => {
    const { data } = await axios.post("/api/cart", {
      productId: item._id,
      quantity: item.qty,
    });
    return data.items;
  }
);

export const removeFromCartBackend = createAsyncThunk(
  "cart/removeFromCartBackend",
  async (productId) => {
    const { data } = await axios.put("/api/cart", {
      items: [{ product: productId, qty: 0 }], // Or filter out
    });
    return data.items;
  }
);

const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "PayPal",
  loading: false,
  error: null,
};

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      });
  },
});

export const { saveShippingAddress, savePaymentMethod, calculateCartPrices } =
  cartSlice.actions;

export default cartSlice.reducer;
