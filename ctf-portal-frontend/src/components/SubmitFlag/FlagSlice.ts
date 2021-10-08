import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { submitFlag } from "./FlagAPI";

export interface FlagState {
  id: number;
  flag: string;
  flagStatus: "valid" | "invalid" | "not-submitted";
  status: "idle" | "loading" | "failed";
}

const initialState: FlagState = {
  id: 1,
  flag: "",
  flagStatus: "not-submitted",
  status: "idle",
};

export const submitFlagAsync = createAsyncThunk(
  "flag/submitFlag",
  async (flag: string) => {
    const response = await submitFlag(flag);
    console.log(response);
    return response;
  }
);

export const flagSlice = createSlice({
  name: "flag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitFlagAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitFlagAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const valid = action.payload;
        if (valid) state.flagStatus = "valid";
        else state.flagStatus = "invalid";
      })
      .addCase(submitFlagAsync.rejected, (state, action) => {
        state.status = "failed";
        state.flagStatus = "invalid";
      });
  },
});

export const selectFlagStatus = (state: RootState) => state.flag.flagStatus;

export default flagSlice.reducer;
