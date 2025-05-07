import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Thesis } from "../../types";

interface ThesisState {
  theses: Thesis[];
  selectedThesis: Thesis | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThesisState = {
  theses: [],
  selectedThesis: null,
  loading: false,
  error: null,
};

const thesisSlice = createSlice({
  name: "thesis",
  initialState,
  reducers: {
    setTheses: (state, action: PayloadAction<Thesis[]>) => {
      state.theses = action.payload;
    },
    setSelectedThesis: (state, action: PayloadAction<Thesis | null>) => {
      state.selectedThesis = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateThesisProgress: (
      state,
      action: PayloadAction<{ thesisId: string; progress: number }>
    ) => {
      const thesis = state.theses.find((t) => t.id === action.payload.thesisId);
      if (thesis) {
        thesis.progress = action.payload.progress;
      }
    },
  },
});

export const {
  setTheses,
  setSelectedThesis,
  setLoading,
  setError,
  updateThesisProgress,
} = thesisSlice.actions;
export default thesisSlice.reducer;
