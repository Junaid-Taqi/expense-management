import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRates = createAsyncThunk(
  'currency/fetchRates',
  async (baseCode, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCode}`);
      const data = await response.json();
      return data.rates;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  symbol: localStorage.getItem('currency_symbol') || '$',
  code: localStorage.getItem('currency_code') || 'USD',
  rates: {},
  loading: false,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.symbol = action.payload.symbol;
      state.code = action.payload.code;
      localStorage.setItem('currency_symbol', state.symbol);
      localStorage.setItem('currency_code', state.code);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(fetchRates.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCurrency } = currencySlice.actions;
export const selectCurrencySymbol = (state) => state.currency.symbol;
export const selectCurrencyCode = (state) => state.currency.code;

export default currencySlice.reducer;
