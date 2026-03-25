import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllIncomes, deleteIncome, fetchIncomes } from '../store/slices/incomeSlice';
import { selectCurrencySymbol } from '../store/slices/currencySlice';
import { selectMonthFilter, selectYearFilter } from '../store/slices/filterSlice';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { formatCurrency } from '../utils/formatCurrency';

const IncomeList = () => {
  const { items: incomes, error: apiError } = useSelector(state => state.incomes);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  const [filterSource, setFilterSource] = useState('All');

  const sources = ['All', ...new Set(incomes.map(item => item.source))];

  const filteredIncomes = incomes.filter(inc => {
    const d = new Date(inc.date);
    const matchM = monthFilter === 'All' || d.getMonth() === parseInt(monthFilter);
    const matchY = yearFilter === 'All' || d.getFullYear() === parseInt(yearFilter);
    const matchC = filterSource === 'All' || inc.source === filterSource;
    return matchM && matchY && matchC;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      dispatch(deleteIncome(id));
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-sm-center flex-column flex-sm-row mb-4 gap-3">
        <h2 className="fw-bold m-0 text-success">All Incomes</h2>
        
        <div className="d-flex align-items-center gap-2">
          <label className="fw-semibold text-muted mb-0">Filter by source:</label>
          <select 
            className="form-select form-select-sm" 
            style={{ width: 'auto' }}
            value={filterSource} 
            onChange={(e) => setFilterSource(e.target.value)}
          >
            {sources.map((src, i) => (
              <option key={i} value={src}>{src}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container border-top border-success border-4">
        {filteredIncomes.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No income records found.</h5>
            <Link to="/add-income" className="btn btn-success mt-3">Add New Income</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredIncomes].sort((a,b) => new Date(b.date) - new Date(a.date)).map(inc => (
                  <tr key={inc._id}>
                    <td className="fw-semibold text-main">{inc.title}</td>
                    <td><span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 border border-success border-opacity-25">{inc.source}</span></td>
                    <td className="text-muted">{new Date(inc.date).toLocaleDateString()}</td>
                    <td className="fw-bold fs-6 text-success">
                      +{formatCurrency(inc.amount, currencySymbol)}
                    </td>
                    <td className="text-end">
                      <Link to={`/edit-income/${inc._id}`} className="btn btn-sm btn-outline-secondary me-2">
                        <MdEdit />
                      </Link>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(inc._id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
