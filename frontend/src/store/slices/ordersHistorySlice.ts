
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { ApiTypesApplicationResponse as Application } from '../../api/Api';

interface OrdersHistoryState {
  list: Application[];
  loading: 'idle' | 'pending';
}

const initialState: OrdersHistoryState = {
  list: [],
  loading: 'idle',
};

export const fetchOrdersHistoryAsync = createAsyncThunk(
  'ordersHistory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Запрашиваем все заявки, кроме черновиков
      const response = await api.workshopApplications.workshopApplicationsList({}, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить историю');
    }
  }
);

const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersHistoryAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchOrdersHistoryAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchOrdersHistoryAsync.rejected, (state) => {
        state.loading = 'idle';
      });
  },
});

export default ordersHistorySlice.reducer;