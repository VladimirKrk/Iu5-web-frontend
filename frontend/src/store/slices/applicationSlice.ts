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
  async (workshopId: number, { getState, dispatch, rejectWithValue }) => {

    try {
      await api.workshopProduction.itemsCreate({ workshop_id: workshopId }, { secure: true });
      dispatch(fetchCartInfoAsync()); 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось добавить в корзину');
    }
  }
);

// Удаление элемента из заявки
export const removeItemFromCartAsync = createAsyncThunk(
  'application/removeItem',
  async ({ appId, workshopId }: { appId: number, workshopId: number }, { dispatch, rejectWithValue }) => { // <-- Добавили dispatch
    try {
      await api.workshopProduction.itemsDelete(appId, workshopId, { secure: true });
      dispatch(fetchCartInfoAsync()); // <-- Вызываем обновление после удаления
      return { workshopId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось удалить элемент');
    }
  }
);
export const updateProductionNameAsync = createAsyncThunk(
  'application/updateName',
  async ({ appId, name }: { appId: number, name: string }, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.workshopApplicationsUpdate(appId, { production_name: name }, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось обновить имя');
    }
  }
);

// Thunk для оформления заявки (статус -> 'formed')
export const submitApplicationAsync = createAsyncThunk(
  'application/submit',
  async (appId: number, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.formCreate(appId, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось оформить заявку');
    }
  }
);

// Thunk для удаления всей заявки (черновика)
export const deleteApplicationAsync = createAsyncThunk(
  'application/delete',
  async (appId: number, { rejectWithValue }) => {
    try {
      await api.workshopApplications.workshopApplicationsDelete(appId, { secure: true });
      return { appId }; // Возвращаем ID для очистки состояния
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось удалить заявку');
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
      })
      .addCase(updateProductionNameAsync.fulfilled, (state, action) => {
        if (state.details) {
          state.details.production_name = action.payload.production_name;
        }
      })
      .addCase(submitApplicationAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(submitApplicationAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.details = action.payload; // Бэкенд вернет обновленную заявку со статусом 'formed'
      })
      .addCase(submitApplicationAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })
      
      // Delete Application
      .addCase(deleteApplicationAsync.fulfilled, (state) => {
        // При успешном удалении просто сбрасываем состояние слайса
        Object.assign(state, initialState);
      });
  },
});

export const { updateItemDefects } = applicationSlice.actions;
export default applicationSlice.reducer;