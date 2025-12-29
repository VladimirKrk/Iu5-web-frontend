import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { api } from '../../api';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ApiTypesApplicationResponse as Application } from '../../api/Api';
import type { RootState } from '../store'; 
import { getTodayDateString } from '../../utils/getDate';


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
    dateFrom: getTodayDateString(), 
    dateTo: getTodayDateString(), 
  },
};
export const fetchOrdersHistoryAsync = createAsyncThunk(
  'ordersHistory/fetchAll',
  async (isPolling: boolean = false, { getState, rejectWithValue }) => {
    const { filters } = (getState() as RootState).ordersHistory;
    
    try {
      const response = await api.workshopApplications.workshopApplicationsList({
        status: filters.status || undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
      }, { secure: true });
      
      return { data: response.data, isPolling }; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить историю');
    }
  }
);

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
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
      .addCase(fetchOrdersHistoryAsync.pending, (state, action) => {
        // V-- ПОКАЗЫВАЕМ СПИННЕР, ТОЛЬКО ЕСЛИ ЭТО НЕ ФОНОВОЕ ОБНОВЛЕНИЕ --V
        if (!action.meta.arg) { // action.meta.arg - это наш isPolling
            state.loading = 'pending';
        }
      })
      .addCase(fetchOrdersHistoryAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        // action.payload теперь объект { data, isPolling }
        state.list = action.payload.data;
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