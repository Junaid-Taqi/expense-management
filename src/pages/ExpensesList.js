import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllExpenses,
  deleteExpense,
  fetchExpenses,
} from "../store/slices/expenseSlice";
import {
  selectCategories,
  fetchCategories,
} from "../store/slices/categorySlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit, MdDownload } from "react-icons/md";
import ConvertedAmount from "../components/Common/ConvertedAmount";

const ExpensesList = () => {
  const expenses = useSelector(selectAllExpenses);
  const dynamicCategories = useSelector(selectCategories);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);
  const dispatch = useDispatch();

  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Extract unique categories for filter
  const categories = ["All", ...dynamicCategories.map((c) => c.name)];

  const filteredExpenses = expenses.filter((exp) => {
    const d = new Date(exp.date);
    const matchM =
      monthFilter === "All" || d.getMonth() === parseInt(monthFilter);
    const matchY =
      yearFilter === "All" || d.getFullYear() === parseInt(yearFilter);
    const matchC = filterCategory === "All" || exp.category === filterCategory;
    return matchM && matchY && matchC;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Category", "Date", "Amount"];
    const csvData = filteredExpenses.map(exp => [
      `"${exp.title.replace(/"/g, '""')}"`,
      `"${exp.category}"`,
      new Date(exp.date).toLocaleDateString(),
      exp.amount
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-sm-center flex-column flex-sm-row mb-4 gap-3">
        <h4 className="mb-2 text-gradient">All Expenses</h4>

        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            onClick={handleExportCSV}
            disabled={filteredExpenses.length === 0}
          >
            <MdDownload className="me-1" /> Export CSV
          </button>
          
          <div className="d-flex align-items-center gap-2">
            <label className="fw-semibold text-muted mb-0 small">
              Category:
            </label>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No expenses found for this category.</h5>
            <Link to="/add-expense" className="btn btn-primary mt-3">
              Add New Expense
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredExpenses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((exp) => (
                    <tr key={exp._id}>
                      <td className="fw-semibold text-main">{exp.title}</td>
                      <td>
                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 border border-primary border-opacity-25">
                          {exp.category}
                        </span>
                      </td>
                      <td className="text-muted">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="fw-bold fs-6">
                        <ConvertedAmount amount={exp.amount} />
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/edit-expense/${exp._id}`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          <MdEdit />
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(exp._id)}
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

export default ExpensesList;
