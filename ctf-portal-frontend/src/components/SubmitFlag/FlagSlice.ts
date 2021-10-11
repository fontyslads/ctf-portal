import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import Team from "../../models/enums/Team";
import Flag from "../../models/Flag";
import { submitFlag, listFlags } from "./FlagAPI";

export interface FlagState {
  flags: Flag[];
}

const initialState: FlagState = {
  flags: [],
};

export const listFlagsAsync = createAsyncThunk(
  "flag/listFlags",
  async (team: Team = Team.Blue) => {
    return await listFlags(team);
  }
);

export const submitFlagAsync = createAsyncThunk(
  "flag/submitFlag",
  async (flag: string) => {
    return await submitFlag(flag);
  }
);

export const flagSlice = createSlice({
  name: "flag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //listFlagsAsync
      .addCase(listFlagsAsync.fulfilled, (state, action) => {
        state.flags = action.payload;
      });
    //submitFlagAsync
    // .addCase(submitFlagAsync.fulfilled, (state, action) => {
    //   const valid = action.payload;
    //   if (valid) state.flagStatus = "valid";
    //   else state.flagStatus = "invalid";
    // })
    // .addCase(submitFlagAsync.rejected, (state) => {
    //   state.flagStatus = "invalid";
    // });
  },
});

export const selectFlags = (state: RootState) => state.flag.flags;

export default flagSlice.reducer;
