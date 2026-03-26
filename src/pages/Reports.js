import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllExpenses, fetchExpenses } from "../store/slices/expenseSlice";
import { selectAllIncomes, fetchIncomes } from "../store/slices/incomeSlice";
import {
  FiBarChart2,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
} from "react-icons/fi";
import ConvertedAmount from "../components/Common/ConvertedAmount";

const Reports = () => {
  const dispatch = useDispatch();
  const rawExpenses = useSelector(selectAllExpenses);
  const rawIncomes = useSelector(selectAllIncomes);

  // Filter States
  const [month, setMonth] = useState("All");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterMode, setFilterMode] = useState("standard"); // 'standard' or 'custom'

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchIncomes());
  }, [dispatch]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  // Filtering Logic
  const filteredData = () => {
    const all = [
      ...rawExpenses.map((e) => ({ ...e, type: "expense" })),
      ...rawIncomes.map((i) => ({ ...i, type: "income", category: i.source })),
    ];

    return all
      .filter((item) => {
        const itemDate = new Date(item.date);

        if (filterMode === "custom") {
          if (!startDate || !endDate) return true;
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        } else {
          const matchYear =
            year === "All" || itemDate.getFullYear().toString() === year;
          const matchMonth =
            month === "All" || itemDate.getMonth().toString() === month;
          return matchYear && matchMonth;
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const data = filteredData();
  const totalExpenses = data
    .filter((d) => d.type === "expense")
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalIncomes = data
    .filter((d) => d.type === "income")
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const balance = totalIncomes - totalExpenses;

  const handleExport = () => {
    const headers = ["Date", "Type", "Category/Source", "Title", "Amount"];
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [
          new Date(item.date).toLocaleDateString(),
          item.type,
          `"${item.category}"`,
          `"${item.title.replace(/"/g, '""')}"`,
          item.amount,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Report_${filterMode === "custom" ? startDate + "_to_" + endDate : months[month] || "All"}_${year}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-gradient d-flex align-items-center">
          <FiBarChart2 className="me-2" /> Financial Reports
        </h4>
        <button
          className="btn btn-primary d-flex align-items-center fw-bold px-4 shadow-sm"
          style={{ borderRadius: "12px", padding: "0.6rem 1.2rem" }}
          onClick={handleExport}
        >
          <FiDownload className="me-2" size={20} /> Export CSV
        </button>
      </div>

      {/* Filter Section */}
      <div className="table-container p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-auto">
            <div className="btn-group rounded-3 overflow-hidden border">
              <button
                className={`btn btn-sm px-4 ${filterMode === "standard" ? "btn-primary" : "btn-light"}`}
                onClick={() => setFilterMode("standard")}
              >
                Standard
              </button>
              <button
                className={`btn btn-sm px-4 ${filterMode === "custom" ? "btn-primary" : "btn-light"}`}
                onClick={() => setFilterMode("custom")}
              >
                Custom Range
              </button>
            </div>
          </div>

          {filterMode === "standard" ? (
            <>
              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  Month
                </label>
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="All">All Months</option>
                  {months.map((m, i) => (
                    <option key={i} value={i.toString()}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  Year
                </label>
                <select
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="col text-end">
            <span className="text-muted small">
              <FiFilter className="me-1" /> {data.length} Transactions Found
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper success me-3">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-muted small mb-1 fw-bold">TOTAL INCOME</p>
              <h4 className="mb-0 fw-bold text-success">
                +<ConvertedAmount amount={totalIncomes} />
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper danger me-3">
              <FiTrendingDown />
            </div>
            <div>
              <p className="text-muted small mb-1 fw-bold">TOTAL EXPENSES</p>
              <h4 className="mb-0 fw-bold text-danger">
                -<ConvertedAmount amount={totalExpenses} />
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div
              className={`icon-wrapper ${balance >= 0 ? "primary" : "danger"} me-3`}
            >
              <FiCreditCard />
            </div>
            <div>
              <p className="text-muted small mb-1 fw-bold">NET CASHFLOW</p>
              <h4
                className={`mb-0 fw-bold ${balance >= 0 ? "text-primary" : "text-danger"}`}
              >
                <ConvertedAmount amount={balance} />
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <h5 className="mb-0 fw-bold">Transaction Breakdown</h5>
          <FiCalendar className="text-muted" />
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Title</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td className="text-muted small">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-1 border ${item.type === "income" ? "bg-success bg-opacity-10 text-success border-success" : "bg-primary bg-opacity-10 text-primary border-primary"}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="fw-semibold text-main">{item.category}</td>
                  <td>{item.title}</td>
                  <td
                    className={`text-end fw-bold ${item.type === "income" ? "text-success" : "text-danger"}`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    <ConvertedAmount amount={item.amount} />
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No transactions found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
