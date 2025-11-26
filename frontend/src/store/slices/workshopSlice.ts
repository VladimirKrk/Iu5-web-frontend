// src/store/slices/workshopSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { ApiTypesWorkshopResponse as WorkshopResponse } from '../../api/Api'; // <-- ИСПРАВЛЕНО
import { WORKSHOPS_MOCK } from '../../modules/mock';
import type { RootState } from '../store'; 

interface WorkshopState {
  list: WorkshopResponse[];
  loading: boolean;
}

const initialState: WorkshopState = {
  list: [],
  loading: false,
};

// Создаем Thunk для загрузки мастерских
export const fetchWorkshopsAsync = createAsyncThunk(
  'workshops/fetchWorkshops',
  async (_, { getState, rejectWithValue }) => {
    // Получаем состояние всего приложения, чтобы достать searchTerm из filterSlice
    const state = getState() as RootState;
    const searchTerm = state.filter.searchTerm; // <-- Берем поисковый запрос из filterSlice

    try {
      const response = await api.workshops.workshopsList({ name: searchTerm }, { secure: true });
      return response.data;
    } catch (error) {
      console.error("ОШИБКА: Бэкенд не отвечает. Используем моковые данные.");
      // Фильтруем моки на стороне клиента, раз уж бэкенд не работает
      const filteredMocks = WORKSHOPS_MOCK.filter(ws => 
        ws.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return rejectWithValue(filteredMocks);
    }
  }
);

const workshopSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {
    // Здесь пока нет синхронных редьюсеров
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkshopsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkshopsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Записываем загруженные данные
      })
      .addCase(fetchWorkshopsAsync.rejected, (state, action) => {
        state.loading = false;
        state.list = action.payload as WorkshopResponse[]; // Записываем отфильтрованные моки
      });
  },
});

export default workshopSlice.reducer;