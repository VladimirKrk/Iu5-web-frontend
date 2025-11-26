// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import workshopReducer from './slices/workshopSlice';
import userReducer from './slices/userSlice';
import applicationReducer from './slices/applicationSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    workshops: workshopReducer,
    user: userReducer,
    application: applicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;