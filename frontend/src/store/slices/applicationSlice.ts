// frontend/src/store/slices/applicationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { RootState } from '../store';

interface AppState {
  itemCount: number;
  loading: 'idle' | 'pending';
  error: string | null;
}

const initialState: AppState = {
  itemCount: 0,
  loading: 'idle',
  error: null,
};

// Thunk для fetch from Cart
export const fetchCartInfoAsync = createAsyncThunk(
  'application/fetchCartInfo',
  async (_, { rejectWithValue }) => {
    try {
      // У этого эндпоинта в Api.ts нет аргументов, поэтому просто передаем secure
      const response = await api.workshopApplications.infoList({ secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить корзину');
    }
  }
);

// Thunk для добавления в корзину
export const addToCartAsync = createAsyncThunk(
  'application/addToCart',
  async (workshopId: number, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).user.token;
    if (!token) {
      return rejectWithValue('Пользователь не авторизован');
    }
    // Настраиваем авторизацию для сгенерированного клиента
    //api.setSecurityData(`Bearer ${token}`); не нужно?
    
    try {
      await api.workshopProduction.itemsCreate({ workshop_id: workshopId }, { secure: true });//
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось добавить в корзину');
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.loading = 'idle';
        state.itemCount += 1; // Увеличиваем счетчик при успехе
      })
      .addCase(fetchCartInfoAsync.fulfilled, (state, action) => {
        state.itemCount = action.payload.item_count || 0;
      })
      .addCase(fetchCartInfoAsync.rejected, (state, action) => {
        console.error("Ошибка загрузки корзины:", action.payload);
        state.itemCount = 0;
      });
  },
});

export default applicationSlice.reducer;