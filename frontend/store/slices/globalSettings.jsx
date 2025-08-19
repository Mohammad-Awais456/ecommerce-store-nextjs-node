// settingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GlobalSettingsAPI } from "../API/API_URL";
import { Fetch_Data } from "../../functions/methods";

import { toast } from "react-toastify";

// 1️⃣ Create async thunk
export const fetchSettingsAndUpdate = createAsyncThunk(
  "settings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { url, method } = GlobalSettingsAPI.getAllSetting;
      const response = await Fetch_Data(url, method);

      if (response.success) {
        // console.log(response.data, "Get all Settings response main function");
        
        return response.data; // This becomes payload
      } else {
        toast.warn(response.msg);
        return rejectWithValue(response.msg);
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2️⃣ Initial State
const initialState = {
  data: {},
  loading: false,
  error: null
};

// 3️⃣ Slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettingsAndUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettingsAndUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Auto-update state from backend
      })
      .addCase(fetchSettingsAndUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default settingsSlice.reducer;
