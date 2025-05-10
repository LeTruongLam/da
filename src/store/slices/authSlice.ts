import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "Student" | "Teacher" | "Admin";

export interface User {
  userId: string;
  email: string;
  name: string;
  faculty: string;
  major: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresIn: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  expiresIn: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; expiresIn: number }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiresIn = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
