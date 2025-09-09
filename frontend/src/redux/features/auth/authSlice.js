import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage
const getUserInfoFromStorage = () => {
    try {
        const userInfo = localStorage.getItem('webUserInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
        return null;
    }
};

const initialState = {
    userInfo: getUserInfoFromStorage(),
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials:(state, action)=>{
            state.userInfo = action.payload;
            localStorage.setItem('webUserInfo', JSON.stringify(action.payload));
        },
        logOut:(state)=>{
            state.userInfo = null;
            localStorage.removeItem('webUserInfo');
            localStorage.removeItem('webToken');
            localStorage.removeItem('cartItems');
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export const authReducer = authSlice.reducer;
