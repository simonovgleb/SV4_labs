// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import firstSliceReducer from '../features/firstSlice/firstSlice';
import secondSliceReducer from '../features/secondSlice/secondSlice';

export const store = configureStore({
    reducer: {
        first: firstSliceReducer,
        second: secondSliceReducer,
    },
});
