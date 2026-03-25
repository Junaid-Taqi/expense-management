import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [
    // pre-fill with dummy data
    { id: uuidv4(), title: 'Monthly Salary', amount: 4500.00, source: 'Salary', date: new Date().toISOString() },
    { id: uuidv4(), title: 'Freelance Design', amount: 800.00, source: 'Business', date: new Date().toISOString() },
  ],
};

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    addIncome: (state, action) => {
      state.items.push({
        ...action.payload,
        id: uuidv4(),
      });
    },
    deleteIncome: (state, action) => {
      state.items = state.items.filter(income => income.id !== action.payload);
    },
    updateIncome: (state, action) => {
      const index = state.items.findIndex(income => income.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addIncome, deleteIncome, updateIncome } = incomeSlice.actions;

export const selectAllIncomes = (state) => state.incomes.items;
export const selectTotalIncomes = (state) => 
  state.incomes.items.reduce((total, item) => total + parseFloat(item.amount), 0);

export default incomeSlice.reducer;
