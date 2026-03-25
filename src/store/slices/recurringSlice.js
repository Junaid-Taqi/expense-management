import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchRecurring = createAsyncThunk(
  'recurring/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/recurring');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createRecurring = createAsyncThunk(
  'recurring/create',
  async (recurringData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/recurring', recurringData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteRecurring = createAsyncThunk(
  'recurring/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/recurring/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const recurringSlice = createSlice({
  name: 'recurring',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecurring.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecurring.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecurring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRecurring.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteRecurring.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default recurringSlice.reducer;
