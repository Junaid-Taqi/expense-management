import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecurring, createRecurring, deleteRecurring } from "../store/slices/recurringSlice";
import { fetchCategories, selectCategories } from "../store/slices/categorySlice";
import { selectCurrencySymbol } from "../store/slices/currencySlice";
import { MdDelete, MdAdd, MdEventRepeat } from "react-icons/md";
import { formatCurrency } from "../utils/formatCurrency";

const ManageRecurring = () => {
  const dispatch = useDispatch();
  const { items: recurring } = useSelector((state) => state.recurring);
  const categories = useSelector(selectCategories);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    dispatch(fetchRecurring());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRecurring({ type, title, amount: parseFloat(amount), category, frequency, startDate }));
    setTitle("");
    setAmount("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to stop this recurring transaction?")) {
      dispatch(deleteRecurring(id));
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gradient d-flex align-items-center">
          <MdEventRepeat className="me-2" /> Recurring Transactions
        </h4>
      </div>

      <div className="row g-4">
        {/* Form Container */}
        <div className="col-lg-4">
          <div className="table-container">
            <h5 className="mb-4">Schedule New</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Type</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${type === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setType('expense')}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm flex-grow-1 ${type === 'income' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setType('income')}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Netflix Subscription"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Frequency</label>
                  <select
                    className="form-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Category / Source</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                <MdAdd className="me-1" /> Schedule Transaction
              </button>
            </form>
          </div>
        </div>

        {/* List Container */}
        <div className="col-lg-8">
          <div className="table-container">
            <h5 className="mb-4">Active Schedules</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Frequency</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Next Due</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recurring.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No recurring transactions scheduled.
                      </td>
                    </tr>
                  ) : (
                    recurring.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="fw-bold">{item.title}</div>
                          <small className={`badge bg-${item.type === 'expense' ? 'danger' : 'success'} bg-opacity-10 text-${item.type === 'expense' ? 'danger' : 'success'}`}>
                            {item.type}
                          </small>
                        </td>
                        <td className="text-capitalize">{item.frequency}</td>
                        <td>{item.category}</td>
                        <td className={`fw-bold ${item.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                          {item.type === 'expense' ? '-' : '+'}
                          {formatCurrency(item.amount, currencySymbol)}
                        </td>
                        <td className="small text-muted">
                          {new Date(item.nextOccurrence).toLocaleDateString()}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRecurring;
