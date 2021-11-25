import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import FlagStatus from "../../models/enums/FlagStatus";
import Team from "../../models/enums/Team";
import Flag from "../../models/Flag";
import { submitFlag, listFlags } from "./FlagAPI";

export interface FlagState {
  initialized: boolean;
  flags: Flag[];
}

const initialState: FlagState = {
  initialized: false,
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
  async (submittedFlag: { id: number; value: string }) => {
    return await submitFlag(submittedFlag.id, submittedFlag.value);
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
      })
      //submitFlagAsync
      .addCase(submitFlagAsync.pending, (state, action) => {
        state.initialized = true;
        state.flags = state.flags.map((flag) => {
          if (flag.id === action.meta.arg.id) {
            flag = { ...flag, status: FlagStatus.Pending };
          }
          return flag;
        });
      })
      .addCase(submitFlagAsync.fulfilled, (state, action) => {
        state.flags = state.flags.map((flag) => {
          if (flag.id === action.payload.id) {
            flag = action.payload;
          }
          return flag;
        });
      })
      .addCase(submitFlagAsync.rejected, (state, action) => {
        state.flags = state.flags.map((flag) => {
          if (flag.id === action.meta.arg.id) {
            flag = { ...flag, status: FlagStatus.Errored };
          }
          return flag;
        });
      });
  },
});

export const selectFlags = (state: RootState) => state.flag.flags;
export const isInitialized = (state: RootState) => state.flag.initialized;

export default flagSlice.reducer;