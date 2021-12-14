import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import flagReducer from "../components/SubmitFlag/FlagSlice";

export const store = configureStore({
  reducer: {
    flag: flagReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
