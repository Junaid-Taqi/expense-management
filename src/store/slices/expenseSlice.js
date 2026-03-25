import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/expenses');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/add',
  async (expenseData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/expenses', expenseData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async (expenseData, { rejectWithValue }) => {
    try {
      const { id, ...rest } = expenseData;
      const { data } = await api.put(`/expenses/${id}`, rest);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/expenses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAllExpenses = (state) => state.expenses.items;
export const selectTotalExpenses = (state) =>
  state.expenses.items.reduce((total, item) => total + parseFloat(item.amount), 0);

export default expenseSlice.reducer;
