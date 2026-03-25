import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense, selectAllExpenses, fetchExpenses } from '../store/slices/expenseSlice';
import { selectCurrencySymbol } from '../store/slices/currencySlice';
import { selectCategories, fetchCategories } from '../store/slices/categorySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { MdSave, MdArrowBack } from 'react-icons/md';

const AddExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // URL parama to check if edit mode
  const { items: allExpenses, error: apiError } = useSelector(state => state.expenses);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const dynamicCategories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const expenseToEdit = allExpenses.find(exp => exp._id === id);
      if (expenseToEdit) {
        setFormData({
          title: expenseToEdit.title,
          amount: expenseToEdit.amount,
          category: expenseToEdit.category,
          date: new Date(expenseToEdit.date).toISOString().split('T')[0]
        });
      } else {
        navigate('/expenses'); // Redirect if not found
      }
    }
  }, [id, isEditMode, allExpenses, navigate]);

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        dispatch(updateExpense({
          id,
          ...formData,
          // ensure saving full iso string date structure if needed, or keeping it as is 
          // usually backend receives standard iso, so let's convert back to standard iso or just keep it simple string
          date: new Date(formData.date).toISOString() 
        }));
      } else {
        dispatch(addExpense({
          ...formData,
          date: new Date(formData.date).toISOString()
        }));
      }
      navigate('/expenses');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear error on typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
          <MdArrowBack />
        </button>
        <h2 className="fw-bold m-0">{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>
      </div>

      {apiError && <div className="alert alert-danger mb-4">{apiError}</div>}

      <div className="row">
        <div className="col-lg-8 col-xl-6">
          <div className="table-container">
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input 
                  type="text" 
                  className={`form-control p-3 ${errors.title ? 'is-invalid' : ''}`}
                  name="title"
                  placeholder="e.g. Weekly Groceries"
                  value={formData.title} 
                  onChange={handleChange} 
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-semibold">Amount ({currencySymbol})</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className={`form-control p-3 ${errors.amount ? 'is-invalid' : ''}`}
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount} 
                    onChange={handleChange} 
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date</label>
                  <input 
                    type="date" 
                    className={`form-control p-3 ${errors.date ? 'is-invalid' : ''}`}
                    name="date"
                    value={formData.date} 
                    onChange={handleChange} 
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Category</label>
                <select 
                  className={`form-select p-3 ${errors.category ? 'is-invalid' : ''}`}
                  name="category"
                  value={formData.category} 
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {dynamicCategories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg d-flex align-items-center justify-content-center">
                  <MdSave className="me-2" />
                  {isEditMode ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
