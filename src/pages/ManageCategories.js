import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, removeCategory, selectCategories } from '../store/slices/categorySlice';
import { selectAllExpenses } from '../store/slices/expenseSlice';
import { MdAdd, MdDelete, MdCategory } from 'react-icons/md';

const ManageCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const expenses = useSelector(selectAllExpenses);
  const [newCat, setNewCat] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const cleanCat = newCat.trim();
    if (!cleanCat) return;

    if (categories.some(c => c.toLowerCase() === cleanCat.toLowerCase())) {
      setError('Category already exists!');
      return;
    }

    dispatch(addCategory(cleanCat));
    setNewCat('');
    setError('');
  };

  const handleDelete = (category) => {
    // Check if category is actively being used
    const isUsed = expenses.some(exp => exp.category === category);
    
    if (isUsed) {
      if (!window.confirm(`Warning: The category "${category}" is currently being used by existing expenses. Deleting it will keep those expenses but you won't be able to assign this category again. Continue?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete "${category}"?`)) {
        return;
      }
    }
    
    dispatch(removeCategory(category));
  };

  return (
    <div className="container-fluid py-2">
      <h2 className="mb-4 fw-bold text-gradient">Manage Categories</h2>

      <div className="row">
        <div className="col-lg-6">
          <div className="stat-card p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <MdCategory className="text-primary me-2" size={24} /> 
              Add New Category
            </h5>
            
            <form onSubmit={handleAdd} className="mb-4 d-flex gap-2">
              <div className="flex-grow-1">
                <input 
                  type="text" 
                  className={`form-control ${error ? 'is-invalid border-danger' : 'border-primary'}`}
                  placeholder="e.g. Pet Care, Software Tools, Server Costs..."
                  value={newCat} 
                  onChange={(e) => {
                    setNewCat(e.target.value);
                    setError('');
                  }} 
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <button type="submit" className="btn btn-primary d-flex align-items-center px-4 rounded-2">
                <MdAdd className="me-1" /> Add
              </button>
            </form>

            <h5 className="fw-bold mb-3 mt-5">Existing Categories</h5>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <div 
                  key={idx} 
                  className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 d-flex align-items-center mb-2"
                  style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
                >
                  <span className="me-2">{cat}</span>
                  <button 
                    className="btn btn-sm btn-link text-danger p-0 border-0 ms-1 d-flex align-items-center justify-content-center hover-opacity"
                    onClick={() => handleDelete(cat)}
                    title="Delete Category"
                    style={{ textDecoration: 'none' }}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            {categories.length === 0 && (
              <p className="text-muted">No custom categories found. Add one above!</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
