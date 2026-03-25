import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Pre-load with the default enterprise categories
  items: JSON.parse(localStorage.getItem('expense_categories')) || [
    'Rent', 'Utilities', 'Groceries', 'Insurance', 'Healthcare', 
    'Savings', 'Debt Management', 'Subscriptions', 'Education', 
    'Entertainment', 'Transportation', 'Personal Care', 'Other'
  ],
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = action.payload.trim();
      if (newCategory && !state.items.includes(newCategory)) {
        state.items.push(newCategory);
        localStorage.setItem('expense_categories', JSON.stringify(state.items));
      }
    },
    removeCategory: (state, action) => {
      state.items = state.items.filter(cat => cat !== action.payload);
      localStorage.setItem('expense_categories', JSON.stringify(state.items));
    }
  },
});

export const { addCategory, removeCategory } = categorySlice.actions;
export const selectCategories = (state) => state.categories.items;

export default categorySlice.reducer;
