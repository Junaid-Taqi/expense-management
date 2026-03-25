import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchIncomes = createAsyncThunk(
  'incomes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/incomes');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addIncome = createAsyncThunk(
  'incomes/add',
  async (incomeData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/incomes', incomeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateIncome = createAsyncThunk(
  'incomes/update',
  async (incomeData, { rejectWithValue }) => {
    try {
      const { id, ...rest } = incomeData;
      const { data } = await api.put(`/incomes/${id}`, rest);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'incomes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/incomes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const incomeSlice = createSlice({
  name: 'incomes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAllIncomes = (state) => state.incomes.items;
export const selectTotalIncomes = (state) =>
  state.incomes.items.reduce((total, item) => total + parseFloat(item.amount), 0);

export default incomeSlice.reducer;
