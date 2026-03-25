import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Check local storage for saved currency symbol, default to '$'
  symbol: localStorage.getItem('currency_symbol') || '$',
  code: localStorage.getItem('currency_code') || 'USD'
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
});

export const { setCurrency } = currencySlice.actions;
export const selectCurrencySymbol = (state) => state.currency.symbol;
export const selectCurrencyCode = (state) => state.currency.code;

export default currencySlice.reducer;
