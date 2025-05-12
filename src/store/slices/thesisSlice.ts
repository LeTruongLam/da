import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ThesisResponse } from "@/services/api/thesis";

// Extended Thesis interface with progress
interface Thesis extends ThesisResponse {
  progress?: number;
}

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
  },
});

export const { setTheses, setSelectedThesis, setLoading, setError } =
  thesisSlice.actions;
export default thesisSlice.reducer;
