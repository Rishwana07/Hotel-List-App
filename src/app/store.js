
import { configureStore } from "@reduxjs/toolkit";
import hotelsReducer from "../features/hotelsSlice";

export const store = configureStore({
  reducer: {
    hotels: hotelsReducer,
  },
});
