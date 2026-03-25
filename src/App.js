import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTheme } from './store/slices/themeSlice';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ExpensesList from './pages/ExpensesList';
import AddExpense from './pages/AddExpense';
import IncomeList from './pages/IncomeList';
import AddIncome from './pages/AddIncome';
import ManageCategories from './pages/ManageCategories';

function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/edit-expense/:id" element={<AddExpense />} />
          <Route path="/incomes" element={<IncomeList />} />
          <Route path="/add-income" element={<AddIncome />} />
          <Route path="/edit-income/:id" element={<AddIncome />} />
          <Route path="/categories" element={<ManageCategories />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
