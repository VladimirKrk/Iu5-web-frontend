import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  searchTerm: string;
}

// Начальное состояние
const initialState: FilterState = {
  searchTerm: '',
};

const filterSlice = createSlice({
  name: 'filter', // Имя среза
  initialState,
  //функции, которые могут изменять состояние
  reducers: {
    // Action 'setSearchTerm' будет принимать новую строку
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

// Экспортируем action
export const { setSearchTerm } = filterSlice.actions;

// Экспортируем reducer
export default filterSlice.reducer;