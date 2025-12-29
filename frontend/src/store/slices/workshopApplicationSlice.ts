// src/store/slices/applicationSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { ApiTypesApplicationDetailedResponse as WorkshopApplicationDetails } from '../../api/Api';
import { fetchOrdersHistoryAsync } from './ordersHistorySlice';

interface WorkshopApplicationState {
  details: WorkshopApplicationDetails | null;
  loading: 'idle' | 'pending';
  error: string | null;
  nameUpdateStatus: 'idle' | 'pending';
}

const initialState: WorkshopApplicationState = {
  details: null,
  loading: 'idle',
  error: null,
  nameUpdateStatus: 'idle',
};

// --- THUNKS ---

export const fetchCartInfoAsync = createAsyncThunk(
  'workshopApplication/fetchCartInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.infoList({ secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить корзину');
    }
  }
);

export const fetchWorkshopApplicationDetailsAsync = createAsyncThunk(
  'workshopApplication/fetchDetails',
  async (appId: number, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.workshopApplicationsDetail(appId, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось загрузить детали заявки');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'workshopApplication/addToCart',
  async (workshopId: number, { dispatch, rejectWithValue }) => {
    try {
      await api.workshopProduction.itemsCreate({ workshop_id: workshopId }, { secure: true });
      dispatch(fetchCartInfoAsync()); 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось добавить в корзину');
    }
  }
);

export const removeItemFromCartAsync = createAsyncThunk(
  'workshopApplication/removeItem',
  async ({ appId, workshopId }: { appId: number, workshopId: number }, { dispatch, rejectWithValue }) => {
    try {
      await api.workshopProduction.itemsDelete(appId, workshopId, { secure: true });
      dispatch(fetchCartInfoAsync());
      return { workshopId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось удалить элемент');
    }
  }
);

export const updateProductionNameAsync = createAsyncThunk(
  'workshopApplication/updateName',
  async ({ appId, name }: { appId: number, name: string }, { rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.workshopApplicationsUpdate(appId, { production_name: name }, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось обновить имя');
    }
  }
);

export const submitWorkshopApplicationAsync = createAsyncThunk(
  'workshopApplication/submit',
  async (appId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.formCreate(appId, { secure: true });
      dispatch(fetchCartInfoAsync());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось оформить заявку');
    }
  }
);

export const deleteWorkshopApplicationAsync = createAsyncThunk(
  'workshopApplication/delete',
  async (appId: number, { rejectWithValue }) => {
    try {
      await api.workshopApplications.workshopApplicationsDelete(appId, { secure: true });
      return { appId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось удалить заявку');
    }
  }
);

export const updateItemDefectsAsync = createAsyncThunk(
  'workshopApplication/updateItemDefects',
  async ({ appId, workshopId, defects }: { appId: number, workshopId: number, defects: number }, { rejectWithValue }) => {
    try {
      const response = await api.workshopProduction.itemsUpdate(appId, workshopId, { found_defects: defects }, { secure: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось обновить данные о браке');
    }
  }
);

export const completeWorkshopApplicationAsync = createAsyncThunk(
  'workshopApplication/complete',
  async (appId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.completeCreate(appId, { secure: true });
      dispatch(fetchOrdersHistoryAsync(false));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось завершить заявку');
    }
  }
);

export const rejectWorkshopApplicationAsync = createAsyncThunk(
  'workshopApplication/reject',
  async (appId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.workshopApplications.rejectCreate(appId, { secure: true });
      dispatch(fetchOrdersHistoryAsync(false));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Не удалось отклонить заявку');
    }
  }
);

const workshopApplicationSlice = createSlice({
  name: 'workshopApplication',
  initialState,
  reducers: {
    setProductionName(state, action: PayloadAction<string>) {
        if (state.details) {
            state.details.production_name = action.payload;
        }
    },
    updateItemDefects(state, action: PayloadAction<{ workshopId: number; defects: number }>) {
      const item = state.details?.items?.find(i => i.workshop?.id === action.payload.workshopId);
      if (item) {
        item.found_defects = action.payload.defects;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Details
      .addCase(fetchWorkshopApplicationDetailsAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchWorkshopApplicationDetailsAsync.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.details = action.payload;
      })
      .addCase(fetchWorkshopApplicationDetailsAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })
      // Remove Item
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        if (state.details?.items) {
          state.details.items = state.details.items.filter(
            item => item.workshop?.id !== action.payload.workshopId
          );
        }
      })
      // Update Name
      .addCase(updateProductionNameAsync.pending, (state) => {
        state.nameUpdateStatus = 'pending';
      })
      .addCase(updateProductionNameAsync.fulfilled, (state, action) => {
        state.nameUpdateStatus = 'idle';
        if (state.details) {
          state.details.production_name = action.payload.production_name;
        }
      })
      .addCase(updateProductionNameAsync.rejected, (state) => {
        state.nameUpdateStatus = 'idle';
      })
      // Submit Application
      .addCase(submitWorkshopApplicationAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(submitWorkshopApplicationAsync.fulfilled, (state) => {
        state.loading = 'idle';
        // После отправки черновика, у нас его больше нет. Очищаем details.
        state.details = null; 
      })
      .addCase(submitWorkshopApplicationAsync.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })
      // Delete Application
      .addCase(deleteWorkshopApplicationAsync.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      // Update Item Defects
      .addCase(updateItemDefectsAsync.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        if (state.details?.items && updatedItem.workshop?.id) {
          const itemIndex = state.details.items.findIndex(i => i.workshop?.id === updatedItem.workshop?.id);
          if (itemIndex !== -1) {
            state.details.items[itemIndex] = updatedItem;
          }
        }
      });
  },
});

export const { setProductionName, updateItemDefects } = workshopApplicationSlice.actions;
export default workshopApplicationSlice.reducer;