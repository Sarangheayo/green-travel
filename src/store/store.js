import { configureStore } from "@reduxjs/toolkit";
import festivalReducer from './slices/festivalSlice.js';

export default configureStore({
    reducer: {
      festival: festivalReducer,
    }
  });