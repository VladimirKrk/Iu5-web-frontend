import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import workshopReducer from './slices/workshopSlice';
import userReducer from './slices/userSlice';
import applicationReducer from './slices/applicationSlice';

export const store = configureStore({
  // Здесь мы регистрируем все наши reducers. Пока что у нас только один.
  reducer: {
    filter: filterReducer,
    workshops: workshopReducer,
    user: userReducer,
    application: applicationReducer,
  },
});

// Эти типы нужны для строгой типизации в TypeScript,
// чтобы ваш редактор кода давал подсказки.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;