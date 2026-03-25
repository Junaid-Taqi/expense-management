import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [
    // pre-fill with some dummy data for visual testing
    { id: uuidv4(), title: 'Groceries', amount: 120.50, category: 'Food', date: new Date().toISOString() },
    { id: uuidv4(), title: 'Internet Bill', amount: 60.00, category: 'Utilities', date: new Date().toISOString() },
    { id: uuidv4(), title: 'Gym Membership', amount: 45.00, category: 'Health', date: new Date().toISOString() },
  ],
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.items.push({
        ...action.payload,
        id: uuidv4(),
      });
    },
    deleteExpense: (state, action) => {
      state.items = state.items.filter(expense => expense.id !== action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.items.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addExpense, deleteExpense, updateExpense } = expenseSlice.actions;

export const selectAllExpenses = (state) => state.expenses.items;
export const selectTotalExpenses = (state) => 
  state.expenses.items.reduce((total, item) => total + parseFloat(item.amount), 0);

export default expenseSlice.reducer;
