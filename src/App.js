import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTheme } from './store/slices/themeSlice';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ExpensesList from './pages/ExpensesList';
import IncomeList from './pages/IncomeList';
import ManageCategories from './pages/ManageCategories';
import ManageBudgets from './pages/ManageBudgets';
import Profile from './pages/Auth/Profile';
import ManageRecurring from './pages/ManageRecurring';
import Reports from './pages/Reports';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/expenses" element={<ExpensesList />} />
                  <Route path="/incomes" element={<IncomeList />} />
                  <Route path="/categories" element={<ManageCategories />} />
                  <Route path="/budgets" element={<ManageBudgets />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/recurring" element={<ManageRecurring />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
