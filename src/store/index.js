import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';
import themeReducer from './slices/themeSlice';
import currencyReducer from './slices/currencySlice';
import incomeReducer from './slices/incomeSlice';
import budgetReducer from './slices/budgetSlice';
import categoryReducer from './slices/categorySlice';
import filterReducer from './slices/filterSlice';
import authReducer from './slices/authSlice';
import recurringReducer from './slices/recurringSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    theme: themeReducer,
    currency: currencyReducer,
    incomes: incomeReducer,
    budgets: budgetReducer,
    categories: categoryReducer,
    filters: filterReducer,
    recurring: recurringReducer,
  },
});

export default store;
