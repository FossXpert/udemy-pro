import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    sSize: "",
    isMobile: false
}

const screenSlice = createSlice({
    name: "screen",
    initialState,
    reducers: {
        setScreen: (state, action) => {
            state.sSize = action.payload.screenSize;
            state.isMobile = action.payload.isMobile;
        }
    }
})

export const {setScreen} = screenSlice.actions;
export default screenSlice.reducer;