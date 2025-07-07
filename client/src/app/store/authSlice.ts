// User autentication, to store their signup and login details
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: null | User;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials: { name: string; email: string; password: string }) => {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // loadUserFromStorage: (state) => {
    //   const token = localStorage.getItem("token");
    //   const user = localStorage.getItem("user");

    //   if (token && user) {
    //     state.token = token;
    //     state.user = JSON.parse(user);
    //   }
    // },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        // After successful login/signup
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.token = action.payload.token;
      });
  },
});

// export const { loadUserFromStorage, logout } = authSlice.actions;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
