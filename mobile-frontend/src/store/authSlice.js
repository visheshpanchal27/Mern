import { createSlice } from '@reduxjs/toolkit'

// Get initial state from localStorage
const getUserInfoFromStorage = () => {
  try {
    const userInfo = localStorage.getItem('mobileUserInfo')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('Error parsing userInfo from localStorage:', error)
    return null
  }
}

const initialState = {
  userInfo: getUserInfoFromStorage(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload
      localStorage.setItem('mobileUserInfo', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.userInfo = null
      localStorage.removeItem('mobileUserInfo')
      localStorage.removeItem('mobileToken')
      localStorage.removeItem('cartItems')
    },

  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer