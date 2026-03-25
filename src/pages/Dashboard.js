import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllExpenses } from "../store/slices/expenseSlice";
import { selectAllIncomes } from "../store/slices/incomeSlice";
import { selectBudgetLimit, setBudgetLimit } from "../store/slices/budgetSlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import { selectCurrencySymbol } from "../store/slices/currencySlice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  MdAttachMoney,
  MdTrendingUp,
  MdAccountBalanceWallet,
  MdEdit,
} from "react-icons/md";
import { formatCurrency } from "../utils/formatCurrency";

const COLORS = [
  "#4361ee",
  "#f72585",
  "#7209b7",
  "#3a0ca3",
  "#4cc9f0",
  "#06d6a0",
  "#ff9f1c",
  "#e63946",
  "#2a9d8f",
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const rawExpenses = useSelector(selectAllExpenses);
  const rawIncomes = useSelector(selectAllIncomes);
  const budgetLimit = useSelector(selectBudgetLimit);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budgetLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Apply filters to data
  const expenses = rawExpenses.filter((exp) => {
    const d = new Date(exp.date);
    const matchM =
      monthFilter === "All" || d.getMonth() === parseInt(monthFilter);
    const matchY =
      yearFilter === "All" || d.getFullYear() === parseInt(yearFilter);
    return matchM && matchY;
  });

  const incomes = rawIncomes.filter((inc) => {
    const d = new Date(inc.date);
    const matchM =
      monthFilter === "All" || d.getMonth() === parseInt(monthFilter);
    const matchY =
      yearFilter === "All" || d.getFullYear() === parseInt(yearFilter);
    return matchM && matchY;
  });

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0,
  );
  const totalIncomes = incomes.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0,
  );

  const balance = totalIncomes - totalExpenses;
  const budgetPercentage =
    budgetLimit > 0 ? (totalExpenses / budgetLimit) * 100 : 0;

  // Combine all transactions (expenses and incomes)
  const allTransactions = [
    ...expenses.map((e) => ({ ...e, type: "expense" })),
    ...incomes.map((i) => ({ ...i, type: "income", category: i.source })), // treating source as category for display
  ];

  // Pagination logic
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  // Ensure currentPage doesn't exceed totalPages if data changes (e.g. filter change)
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  const sortedTransactions = [...allTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const currentTransactions = sortedTransactions.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  // Progress bar color logic
  let progressColor = "bg-success";
  if (budgetPercentage > 75) progressColor = "bg-warning";
  if (budgetPercentage > 90) progressColor = "bg-danger";

  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category);
    if (existing) {
      existing.value += parseFloat(expense.amount);
    } else {
      acc.push({ name: expense.category, value: parseFloat(expense.amount) });
    }
    return acc;
  }, []);

  const handleBudgetSave = () => {
    if (!isNaN(tempBudget) && tempBudget > 0) {
      dispatch(setBudgetLimit(tempBudget));
    } else {
      setTempBudget(budgetLimit); // revert
    }
    setIsEditingBudget(false);
  };

  return (
    <div className="container-fluid py-2">
      <h2 className="mb-4 fw-bold text-gradient">Enterprise Dashboard</h2>

      <div className="row mb-4 g-4">
        {/* Total Balance Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper primary me-3">
              <MdAccountBalanceWallet />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Net Balance
              </p>
              <h4
                className={`m-0 fw-bold ${balance < 0 ? "text-danger" : "text-success"}`}
              >
                {balance < 0 ? "-" : ""}
                {formatCurrency(Math.abs(balance), currencySymbol)}
              </h4>
            </div>
          </div>
        </div>

        {/* Total Incomes Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper success me-3">
              <MdTrendingUp />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Total Income
              </p>
              <h4 className="m-0 fw-bold">
                {formatCurrency(totalIncomes, currencySymbol)}
              </h4>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper danger me-3">
              <MdAttachMoney />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Total Expenses
              </p>
              <h4 className="m-0 fw-bold">
                {formatCurrency(totalExpenses, currencySymbol)}
              </h4>
            </div>
          </div>
        </div>

        {/* Monthly Budget Tracker */}
        <div className="col-md-3">
          <div className="stat-card p-4 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <p
                className="text-muted mb-0 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Monthly Budget
              </p>
              {isEditingBudget ? (
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="form-control form-control-sm me-1 border-primary"
                    style={{ width: "80px" }}
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="btn btn-sm btn-primary py-0 px-2 rounded-2"
                    onClick={handleBudgetSave}
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div
                  className="d-flex align-items-center cursor-pointer"
                  onClick={() => setIsEditingBudget(true)}
                >
                  <span className="fw-bold me-2">
                    {formatCurrency(budgetLimit, currencySymbol)}
                  </span>
                  <MdEdit
                    className="text-primary hover-opacity"
                    style={{ cursor: "pointer", transition: "0.2s" }}
                  />
                </div>
              )}
            </div>

            <div
              className="progress mt-2 rounded-pill"
              style={{ height: "10px" }}
            >
              <div
                className={`progress-bar ${progressColor} rounded-pill`}
                role="progressbar"
                style={{
                  width: `${Math.min(budgetPercentage, 100)}%`,
                  transition: "width 1s ease",
                }}
                aria-valuenow={budgetPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted fw-semibold">
                {budgetPercentage.toFixed(1)}% used
              </small>
              <small
                className={
                  budgetPercentage > 100
                    ? "text-danger fw-bold"
                    : "text-muted fw-semibold"
                }
              >
                {budgetPercentage > 100
                  ? "Over Budget!"
                  : `${formatCurrency(budgetLimit - totalExpenses, currencySymbol)} left`}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-container h-100">
            <h5 className="fw-bold mb-4">Recent Activity</h5>
            {allTransactions.length === 0 ? (
              <p className="text-muted">No activity found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle" responsive>
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Category/Source</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((item) => (
                      <tr key={item.id}>
                        <td
                          className="fw-semibold text-truncate text-main"
                          style={{ maxWidth: "200px" }}
                        >
                          {item.title}
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 border ${
                              item.type === "income"
                                ? "bg-success bg-opacity-10 text-success border-success border-opacity-25"
                                : "bg-primary bg-opacity-10 text-primary border-primary border-opacity-25"
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="text-muted">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td
                          className={`fw-bold ${item.type === "income" ? "text-success" : "text-danger"}`}
                        >
                          {item.type === "income" ? "+" : "-"}
                          {formatCurrency(item.amount, currencySymbol)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="text-muted small fw-semibold">
                  Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(safePage * itemsPerPage, allTransactions.length)} of{" "}
                  {allTransactions.length} entries
                </span>
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${safePage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link shadow-none"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                    >
                      Prev
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${safePage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link shadow-none"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${safePage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link shadow-none"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="table-container h-100">
            <h5 className="fw-bold mb-4">Expenses by Category</h5>
            {categoryData.length > 0 ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value, currencySymbol)
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
