import { createSlice } from "@reduxjs/toolkit";

//let logoutTime;
const calcRemainingTime = (expiresIn) => {
    const currentTime = new Date().getTime();
    const adjustedExpiresIn = new Date(expiresIn).getTime();
    const remainingTime = adjustedExpiresIn - currentTime;
    return remainingTime;
};

const initialState = {
    localId: localStorage.getItem("idToken"),
    isLoggedIn: localStorage.getItem("idToken") ? true : false,
    idToken: "",
    refreshToken: "",
    kind: "",
    expiresIn: ""
};
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logout(state) {
            state.isLoggedIn = false;
            state.localId = "";
            state.idToken = "";
            state.refreshToken = "";
            state.kind = "";
            state.expiresIn = "";
            localStorage.removeItem("idToken");
        },
        login(state, action) {
            if (action.payload.idToken != null && action.payload.idToken !== "" ) {
                state.isLoggedIn = true;
                state.localId = action.payload.localId;
                state.idToken = action.payload.idToken;
                state.refreshToken = action.payload.refreshToken;
                state.kind = action.payload.kind;
                state.expiresIn = action.payload.expiresIn;

                localStorage.setItem("idToken", action.payload.idToken);
                const remainingTime = calcRemainingTime(action.payload.expiresIn);
                //logoutTime = setTimeout(authSlice.caseReducers.logout.bind(null, state, action), remainingTime);
            }
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;