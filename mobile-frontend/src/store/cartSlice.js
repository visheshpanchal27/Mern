import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload
      state.total = state.items.reduce((acc, item) => acc + item.qty * (item.product?.price || item.price || 0), 0)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const { setCartItems, clearCart } = cartSlice.actions
export default cartSlice.reducer