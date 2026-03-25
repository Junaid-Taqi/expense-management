import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, selectCategories } from "../store/slices/categorySlice";
import { fetchBudgets, setBudget, selectAllBudgets } from "../store/slices/budgetSlice";
import { selectCurrencySymbol } from "../store/slices/currencySlice";
import { MdSave, MdOutlineAccountBalanceWallet, MdTrendingUp } from "react-icons/md";

const ManageBudgets = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const budgets = useSelector(selectAllBudgets);
  const currencySymbol = useSelector(selectCurrencySymbol);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budgetValues, setBudgetValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  useEffect(() => {
    // Populate form with existing budgets
    const values = {};
    categories.forEach(cat => {
      const budget = budgets.find(b => b.category === cat.name);
      values[cat.name] = budget ? budget.amount : "";
    });
    setBudgetValues(values);
  }, [categories, budgets]);

  const handleInputChange = (categoryName, value) => {
    setBudgetValues(prev => ({
      ...prev,
      [categoryName]: value
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const promises = Object.entries(budgetValues).map(([category, amount]) => {
        if (amount === "" || amount === null) return null;
        return dispatch(setBudget({
          category,
          amount: parseFloat(amount),
          month: selectedMonth,
          year: selectedYear
        })).unwrap();
      }).filter(p => p !== null);

      await Promise.all(promises);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gradient">Manage Monthly Budgets</h4>
        <div className="d-flex gap-2">
          <select 
            className="form-select form-select-sm" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select 
            className="form-select form-select-sm" 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 col-xl-7">
          <div className="table-container p-4">
            <div className="d-flex align-items-center mb-4 text-primary">
              <MdOutlineAccountBalanceWallet size={24} className="me-2" />
              <h5 className="mb-0 fw-bold">Allocate Funds per Category</h5>
            </div>

            {success && (
              <div className="alert alert-success d-flex align-items-center py-2 px-3 mb-4">
                <MdTrendingUp className="me-2" />
                <span>Budgets updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="table-responsive">
                <table className="table table-borderless align-middle">
                  <thead>
                    <tr className="text-muted border-bottom">
                      <th className="pb-3 ps-0" style={{ width: '60%' }}>Category</th>
                      <th className="pb-3 text-end" style={{ width: '40%' }}>Monthly Budget ({currencySymbol})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-bottom">
                        <td className="ps-0 py-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-3" 
                              style={{ width: '10px', height: '10px', backgroundColor: cat.color || '#6366f1' }}
                            ></div>
                            <span className="fw-semibold text-main">{cat.name}</span>
                          </div>
                        </td>
                        <td className="pe-0 py-3">
                          <div className="input-group input-group-sm justify-content-end">
                            <input
                              type="number"
                              className="form-control text-end fs-6"
                              style={{ maxWidth: '150px', border: 'none', background: '#f8fafc', borderRadius: '8px' }}
                              placeholder="0.00"
                              value={budgetValues[cat.name] || ""}
                              onChange={(e) => handleInputChange(cat.name, e.target.value)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categories.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No categories found. Please add categories first.</p>
                </div>
              )}

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center justify-content-center py-2"
                  disabled={loading || categories.length === 0}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <MdSave className="me-2" />
                  )}
                  Save All Budgets
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4 col-xl-5 mt-4 mt-lg-0">
          <div className="bg-light p-4 rounded-4 border border-opacity-10 border-primary h-100">
            <h6 className="fw-bold mb-3 d-flex align-items-center text-primary">
              <MdTrendingUp className="me-2" /> Why set a budget?
            </h6>
            <p className="text-muted small mb-0">
              Setting budgets helps you stay on track with your financial goals. 
              Once set, your dashboard will show progress bars for each category, 
              alerting you if you're approaching or exceeding your limits.
            </p>
            <hr className="my-4" />
            <div className="p-3 bg-white rounded-3 shadow-sm mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="small fw-semibold">Groceries</span>
                <span className="small text-danger fw-bold">95%</span>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-3 shadow-sm">
              <div className="d-flex justify-content-between mb-1">
                <span className="small fw-semibold">Rent</span>
                <span className="small text-success fw-bold">100%</span>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBudgets;
