import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Default monthly budget
  limit: parseFloat(localStorage.getItem('budget_limit')) || 2500.00,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudgetLimit: (state, action) => {
      state.limit = parseFloat(action.payload);
      localStorage.setItem('budget_limit', state.limit);
    }
  },
});

export const { setBudgetLimit } = budgetSlice.actions;

export const selectBudgetLimit = (state) => state.budget.limit;

export default budgetSlice.reducer;
