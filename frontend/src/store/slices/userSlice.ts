// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { ApiTypesUserLoginRequest as UserLoginRequest } from '../../api/Api';
import type { RootState } from '../store';

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null; // Будем хранить имя пользователя
  loading: 'idle' | 'pending';
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  username: null,
  loading: 'idle',
  error: null,
};

// --- THUNKS ---

export const loginUserAsync = createAsyncThunk(
  'user/login',
  async (credentials: UserLoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.login.loginCreate(credentials);
      return { token: response.data.token, username: credentials.login }; // Возвращаем токен и логин
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка авторизации');
    }
  }
);

export const logoutUserAsync = createAsyncThunk(
  'user/logout',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).user.token;
    if (!token) return; // Если токена нет, просто выходим

    try {
      // Устанавливаем токен для запроса
      api.setSecurityData(`Bearer ${token}`);
      await api.logout.logoutCreate();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка выхода');
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.isAuthenticated = true;
        state.token = action.payload.token || null;
        state.username = action.payload.username;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUserAsync.fulfilled, (state) => {
        // Сбрасываем все до начального состояния
        Object.assign(state, initialState);
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        // Даже если выход с ошибкой, разлогиниваем на фронте
        Object.assign(state, initialState);
        console.error('Ошибка при выходе на сервере:', action.payload);
      });
  },
});

export default userSlice.reducer;