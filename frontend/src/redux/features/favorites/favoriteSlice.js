import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
        // Sync to localStorage for mobile
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
    removeFromFavorites: (state, action) => {
      const newState = state.filter((product) => product._id !== action.payload._id);
      // Sync to localStorage for mobile
      localStorage.setItem('favorites', JSON.stringify(newState));
      return newState;
    },
    setFavorites: (state, action) => {
      return action.payload;
    },
    clearFavorites: () => {
      return [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites, clearFavorites } =
  favoriteSlice.actions;

export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;
