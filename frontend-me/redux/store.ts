import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import screenSlice from "./features/screenSize/screenSlice";

export const store = configureStore({
    reducer : {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth : authSlice,
        screen : screenSlice
    },
    devTools : true,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});


