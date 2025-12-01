import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { api } from '../../api';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ApiTypesApplicationResponse as Application } from '../../api/Api';
import type { RootState } from '../store'; // Импортируем RootState


interface OrdersHistoryState {
  list: Application[];
  error: string | null;
  loading: 'idle' | 'pending';
  filters: {
    status: string; // 'formed', 'completed', или '' для всех
    dateFrom: string; // Формат YYYY-MM-DD
    dateTo: string;   // Формат YYYY-MM-DD
  };
}

const initialState: OrdersHistoryState = {
  list: [],
  loading: 'idle',
  error: null,
  filters: {
    status: '',
    dateFrom: '',
    dateTo: '',
  },
};
export const fetchOrdersHistoryAsync = createAsyncThunk(
  'ordersHistory/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    // Получаем фильтры из state
    const { filters } = (getState() as RootState).ordersHistory;
    
    try {
      // Передаем фильтры в API-запрос
      const response = await api.workshopApplications.workshopApplicationsList({
        status: filters.status || undefined, // Отправляем undefined если строка пустая
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
      }, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить историю');
    }
  }
);

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
  // --- НОВЫЕ РЕДЬЮСЕРЫ ДЛЯ УПРАВЛЕНИЯ ФИЛЬТРАМИ ---
  reducers: {
    setStatusFilter(state, action: PayloadAction<string>) {
      state.filters.status = action.payload;
    },
    setDateFromFilter(state, action: PayloadAction<string>) {
      state.filters.dateFrom = action.payload;
    },
    setDateToFilter(state, action: PayloadAction<string>) {
      state.filters.dateTo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersHistoryAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchOrdersHistoryAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchOrdersHistoryAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      });
  },
});

// Экспортируем новые actions
export const { setStatusFilter, setDateFromFilter, setDateToFilter } = ordersHistorySlice.actions;
export default ordersHistorySlice.reducer;