import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create order
export const createOrder = createAsyncThunk("order/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/api/orders", orderData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
