import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/budgets?month=${month}&year=${year}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const setBudget = createAsyncThunk(
  'budgets/setBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/budgets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set Budget
      .addCase(setBudget.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (b) => b.category === action.payload.category && 
                 b.month === action.payload.month && 
                 b.year === action.payload.year
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      // Delete Budget
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;
export const selectAllBudgets = (state) => state.budgets.items;
export default budgetSlice.reducer;
