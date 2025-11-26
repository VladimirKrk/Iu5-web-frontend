// src/store/slices/applicationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { RootState } from '../store';
import type { ApiTypesProductionItemResponse as ProductionItem, ApiTypesApplicationDetailedResponse as ApplicationDetails } from '../../api/Api';

interface AppState {
  details: ApplicationDetails | null;
  loading: 'idle' | 'pending';
  error: string | null;
}

const initialState: AppState = {
  details: null,
  loading: 'idle',
  error: null,
};

// --- THUNKS ---

// Загрузка информации о корзине (ID и itemCount). Переносим сюда из userSlice.
export const fetchCartInfoAsync = createAsyncThunk(
  'application/fetchCartInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.infoList({ secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить корзину');
    }
  }
);

// Загрузка ДЕТАЛЬНОЙ информации о заявке (по ее ID)
export const fetchApplicationDetailsAsync = createAsyncThunk(
  'application/fetchDetails',
  async (appId: number, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.workshopApplicationsDetail(appId, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить детали заявки');
    }
  }
);

// Добавление в корзину
export const addToCartAsync = createAsyncThunk(
  'application/addToCart',
  async (workshopId: number, { rejectWithValue }) => {
    try {
      await api.workshopProduction.itemsCreate({ workshop_id: workshopId }, { secure: true });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось добавить в корзину');
    }
  }
);

// Удаление элемента из заявки
export const removeItemFromCartAsync = createAsyncThunk(
  'application/removeItem',
  async ({ appId, workshopId }: { appId: number, workshopId: number }, { rejectWithValue }) => {
    try {
      await api.workshopProduction.itemsDelete(appId, workshopId, { secure: true });
      return { workshopId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось удалить элемент');
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateItemDefects(state, action: { payload: { workshopId: number; defects: number } }) {
      const item = state.details?.items?.find(i => i.workshop?.id === action.payload.workshopId);
      if (item) {
        item.found_defects = action.payload.defects;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationDetailsAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchApplicationDetailsAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.details = action.payload;
      })
      .addCase(fetchApplicationDetailsAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        if (state.details?.items) {
          state.details.items = state.details.items.filter(
            item => item.workshop?.id !== action.payload.workshopId
          );
        }
      });
  },
});

export const { updateItemDefects } = applicationSlice.actions;
export default applicationSlice.reducer;