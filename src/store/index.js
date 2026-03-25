import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';
import themeReducer from './slices/themeSlice';
import currencyReducer from './slices/currencySlice';
import incomeReducer from './slices/incomeSlice';
import budgetReducer from './slices/budgetSlice';
import categoryReducer from './slices/categorySlice';
import filterReducer from './slices/filterSlice';

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    theme: themeReducer,
    currency: currencyReducer,
    incomes: incomeReducer,
    budget: budgetReducer,
    categories: categoryReducer,
    filters: filterReducer,
  },
});

export default store;
