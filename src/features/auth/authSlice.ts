import { createSlice } from "@reduxjs/toolkit";
// import { AuthUser } from "@supabase/supabase-js";
// import { useSelector } from "react-redux";

// interface AuthState {
//     user: AuthUser| null;
// }

// const initialState: AuthState = {
//     user: null
// };

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null },
    reducers: {
        setUser: (state, action) => { state.user = action.payload; },
        clearUser: (state) => { state.user = null; }
    }
});

export const { setUser, clearUser} = authSlice.actions
export default authSlice.reducer;