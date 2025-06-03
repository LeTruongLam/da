import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  currentRequest: number | number[] | null;
}

const initialState: AppState = {
  currentRequest: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentRequest: (
      state: AppState,
      action: PayloadAction<number | number[] | null>
    ) => {
      state.currentRequest = action.payload;
    },
  },
});

export const { setCurrentRequest } = appSlice.actions;
export default appSlice.reducer;
