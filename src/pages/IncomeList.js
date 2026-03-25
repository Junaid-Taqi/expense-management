import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteIncome,
  fetchIncomes,
} from "../store/slices/incomeSlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit, MdDownload } from "react-icons/md";
import ConvertedAmount from "../components/Common/ConvertedAmount";

const IncomeList = () => {
  const { items: incomes } = useSelector(
    (state) => state.incomes,
  );
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  const [filterSource, setFilterSource] = useState("All");

  const sources = ["All", ...new Set(incomes.map((item) => item.source))];

  const filteredIncomes = incomes.filter((inc) => {
    const d = new Date(inc.date);
    const matchM =
      monthFilter === "All" || d.getMonth() === parseInt(monthFilter);
    const matchY =
      yearFilter === "All" || d.getFullYear() === parseInt(yearFilter);
    const matchC = filterSource === "All" || inc.source === filterSource;
    return matchM && matchY && matchC;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      dispatch(deleteIncome(id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Source", "Date", "Amount"];
    const csvData = filteredIncomes.map(inc => [
      `"${inc.title.replace(/"/g, '""')}"`,
      `"${inc.source}"`,
      new Date(inc.date).toLocaleDateString(),
      inc.amount
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `incomes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-sm-center flex-column flex-sm-row mb-4 gap-3">
        <h4 className="mb-0 text-gradient">All Incomes</h4>

        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-sm btn-outline-success d-flex align-items-center"
            onClick={handleExportCSV}
            disabled={filteredIncomes.length === 0}
          >
            <MdDownload className="me-1" /> Export CSV
          </button>

          <div className="d-flex align-items-center gap-2">
            <label className="fw-semibold text-muted mb-0 small">
              Source:
            </label>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              {sources.map((src, i) => (
                <option key={i} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container border-top border-success border-1">
        {filteredIncomes.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No income records found.</h5>
            <Link to="/add-income" className="btn btn-success mt-3">
              Add New Income
            </Link>
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
                {[...filteredIncomes]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((inc) => (
                    <tr key={inc._id}>
                      <td className="fw-semibold text-main">{inc.title}</td>
                      <td>
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 border border-success border-opacity-25">
                          {inc.source}
                        </span>
                      </td>
                      <td className="text-muted">
                        {new Date(inc.date).toLocaleDateString()}
                      </td>
                      <td className="fw-bold fs-6 text-success">
                        +<ConvertedAmount amount={inc.amount} />
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/edit-income/${inc._id}`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
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
