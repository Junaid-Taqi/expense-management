import { createSlice } from '@reduxjs/toolkit';

const currentDate = new Date();

const initialState = {
  month: currentDate.getMonth().toString(), // '0' to '11', or 'All'
  year: currentDate.getFullYear().toString(), // '2023', '2024', etc., or 'All'
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMonthFilter: (state, action) => {
      state.month = action.payload;
    },
    setYearFilter: (state, action) => {
      state.year = action.payload;
    }
  },
});

export const { setMonthFilter, setYearFilter } = filterSlice.actions;

export const selectMonthFilter = (state) => state.filters.month;
export const selectYearFilter = (state) => state.filters.year;

export default filterSlice.reducer;
