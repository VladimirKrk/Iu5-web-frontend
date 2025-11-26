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

// Thunk для добавления в корзину
export const addToCartAsync = createAsyncThunk(
  'application/addToCart',
  async (workshopId: number, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).user.token;
    if (!token) {
      return rejectWithValue('Пользователь не авторизован');
    }
    
    // Настраиваем авторизацию для сгенерированного клиента
    api.setSecurityData(`Bearer ${token}`);
    
    try {
      await api.workshopProduction.itemsCreate({ workshop_id: workshopId });
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
        state.itemCount += 1; // Оптимистично увеличиваем счетчик
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      });
  },
});

export default applicationSlice.reducer;