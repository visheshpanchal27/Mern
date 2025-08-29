import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo')) : null,
    token: localStorage.getItem('token') || null,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials:(state, action)=>{
            state.userInfo = action.payload;
            state.token = action.payload.token;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
            localStorage.setItem("token", action.payload.token);
            const expirationTime = new Date().getTime()+30*24*60*60*1000;
            localStorage.setItem("expirationTime", expirationTime);
        },
        logOut:(state)=>{
            state.userInfo = null;
            state.token = null;
            localStorage.clear();
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export const authReducer = authSlice.reducer;
