// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { ApiTypesUserLoginRequest as UserLoginRequest } from '../../api/Api';
import { fetchCartInfoAsync, addToCartAsync , deleteApplicationAsync} from './applicationSlice';  // Импортируем thunk из другого слайса
import type { ApiTypesUserRegisterRequest as UserRegisterRequest } from '../../api/Api';
interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  draftApplicationId: number | null; // ID активного черновика
  itemCount: number; // Общее количество товаров в черновике
  loading: 'idle' | 'pending';
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  username: null,
  draftApplicationId: null,
  itemCount: 0,
  loading: 'idle',
  error: null,
};

// --- THUNKS ---

export const loginUserAsync = createAsyncThunk(
  'user/login',
  async (credentials: UserLoginRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.login.loginCreate(credentials);
      const token = response.data.token;
      
      // Сразу после успешного логина, запускаем загрузку информации о корзине
      if (token) {
        api.setSecurityData(token); 
        dispatch(fetchCartInfoAsync());
      }
      
      return { token, username: credentials.login };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка авторизации');
    }
  }
);

export const logoutUserAsync = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      // securityWorker сам подставит токен, если он есть
      await api.logout.logoutCreate({ secure: true });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка выхода');
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  'user/register',
  async (credentials: UserRegisterRequest, { dispatch, rejectWithValue }) => {
    try {
      await api.register.registerCreate(credentials);
      // После успешной регистрации сразу логиним пользователя
      return dispatch(loginUserAsync(credentials)).unwrap();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка регистрации');
    }
  }
);

export const updatePasswordAsync = createAsyncThunk(
  'user/updatePassword',
  async (password: string, { rejectWithValue }) => {
    try {
      // securityWorker сам подставит токен
      const response = await api.users.putUsers({ password }, { secure: true });
      return response.data; // Возвращаем обновленные данные пользователя
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось сменить пароль');
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
        Object.assign(state, initialState);
        api.setSecurityData(null); // Очищаем токен в API клиенте
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        Object.assign(state, initialState);
        api.setSecurityData(null);
        console.error('Ошибка при выходе на сервере:', action.payload);
      })
      // Обновляем ID и количество из applicationSlice
      .addCase(fetchCartInfoAsync.fulfilled, (state, action) => {
          state.itemCount = action.payload.item_count || 0;
          state.draftApplicationId = action.payload.application_id || null;
      })
      // При добавлении в корзину, просто увеличиваем счетчик
      .addCase(deleteApplicationAsync.fulfilled, (state) => {
        state.itemCount = 0;
        state.draftApplicationId = null;
    })
    .addCase(updatePasswordAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updatePasswordAsync.fulfilled, (state) => {
        state.loading = 'idle';
        // Здесь можно, например, сбросить ошибку или показать сообщение об успехе
        state.error = null; 
      })
      .addCase(updatePasswordAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;