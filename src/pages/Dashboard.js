import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllExpenses, fetchExpenses } from "../store/slices/expenseSlice";
import { selectAllIncomes, fetchIncomes } from "../store/slices/incomeSlice";
import { selectAllBudgets, fetchBudgets } from "../store/slices/budgetSlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import { selectCurrencySymbol } from "../store/slices/currencySlice";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  FiTrendingUp,
  FiCreditCard,
  FiEdit3,
  FiInfo,
  FiTrendingDown,
} from "react-icons/fi";

import DashboardSkeleton from "../components/Common/DashboardSkeleton";
import ConvertedAmount from "../components/Common/ConvertedAmount";

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
  const budgets = useSelector(selectAllBudgets);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);

  const { loading: expensesLoading } = useSelector((state) => state.expenses);
  const { loading: incomesLoading } = useSelector((state) => state.incomes);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchIncomes());

    // Fetch budgets for the selected filter
    const m =
      monthFilter === "All" ? new Date().getMonth() : parseInt(monthFilter);
    const y =
      yearFilter === "All" ? new Date().getFullYear() : parseInt(yearFilter);
    dispatch(fetchBudgets({ month: m, year: y }));
  }, [dispatch, monthFilter, yearFilter]);

  const { code: currentCode, rates } = useSelector((state) => state.currency);
  const convert = (amt) => {
    if (!rates || !rates[currentCode]) return amt;
    return amt * rates[currentCode]; // Assumes base is USD
  };

  if (expensesLoading || incomesLoading) {
    return <DashboardSkeleton />;
  }

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

  // Total budget is sum of all category budgets
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.amount, 0);
  const overallBudgetPercentage =
    totalBudgetLimit > 0 ? (totalExpenses / totalBudgetLimit) * 100 : 0;
  // Group expenses by category and attach budget info
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category);
    const convertedAmount = convert(parseFloat(expense.amount));

    if (existing) {
      existing.value += convertedAmount;
    } else {
      const categoryBudget = budgets.find(
        (b) => b.category === expense.category,
      );
      acc.push({
        name: expense.category,
        value: convertedAmount,
        budget: categoryBudget ? convert(categoryBudget.amount) : 0,
      });
    }
    return acc;
  }, []);

  // Also include categories that have a budget but NO expenses yet
  budgets.forEach((b) => {
    const hasExpenses = categoryData.find((cd) => cd.name === b.category);
    if (!hasExpenses) {
      categoryData.push({
        name: b.category,
        value: 0,
        budget: b.amount,
      });
    }
  });

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

  const getProgressColor = (percent) => {
    if (percent > 90) return "bg-danger";
    if (percent > 75) return "bg-warning";
    return "bg-success";
  };

  const overallProgressColor = getProgressColor(overallBudgetPercentage);

  // Advanced Financial Insights Logic
  const savingsRate =
    totalIncomes > 0
      ? ((totalIncomes - totalExpenses) / totalIncomes) * 100
      : 0;

  const getMoMComparison = () => {
    const currentMonth =
      monthFilter === "All" ? new Date().getMonth() : parseInt(monthFilter);
    const currentYear =
      yearFilter === "All" ? new Date().getFullYear() : parseInt(yearFilter);

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthExpenses = rawExpenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((sum, item) => sum + parseFloat(item.amount), 0);

    if (lastMonthExpenses === 0) return { diff: 0, trend: "neutral" };

    const diff =
      ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    return {
      diff: Math.abs(diff).toFixed(1),
      trend: diff > 0 ? "up" : "down",
    };
  };

  getMoMComparison();
  const topSpentCategory =
    categoryData.length > 0
      ? [...categoryData].sort((a, b) => b.value - a.value)[0]
      : null;

  // Prepare data for Highcharts Monthly Summary
  const getMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);

    const currentYear =
      yearFilter === "All" ? new Date().getFullYear() : parseInt(yearFilter);

    rawIncomes.forEach((inc) => {
      const d = new Date(inc.date);
      if (d.getFullYear() === currentYear) {
        incomeData[d.getMonth()] += convert(parseFloat(inc.amount));
      }
    });

    rawExpenses.forEach((exp) => {
      const d = new Date(exp.date);
      if (d.getFullYear() === currentYear) {
        expenseData[d.getMonth()] += convert(parseFloat(exp.amount));
      }
    });

    return { months, incomeData, expenseData };
  };

  const { months, incomeData, expenseData } = getMonthlyData();

  const chartOptions = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Open Sans, sans-serif",
      },
    },
    title: {
      text: `Monthly Overview - ${yearFilter === "All" ? new Date().getFullYear() : yearFilter}`,
      align: "left",
      style: { fontWeight: "bold" },
    },
    xAxis: {
      categories: months,
      gridLineWidth: 0,
      labels: {
        style: { color: "#6c757d" },
      },
    },
    yAxis: {
      title: { text: null },
      labels: {
        formatter: function () {
          return currencySymbol + this.value;
        },
        style: { color: "#6c757d" },
      },
      gridLineDashStyle: "Dash",
    },
    tooltip: {
      shared: true,
      valuePrefix: currencySymbol,
      borderRadius: 10,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#eee",
    },
    credits: { enabled: false },
    legend: {
      itemStyle: {
        fontFamily: "'Open Sans', sans-serif",
        color: "#6c757d",
      },
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.1,
        marker: {
          enabled: false,
          states: {
            hover: { enabled: true },
          },
        },
      },
    },
    series: [
      {
        name: "Income",
        data: incomeData,
        color: "#06d6a0",
      },
      {
        name: "Expenses",
        data: expenseData,
        color: "#ef4444",
      },
    ],
  };

  const pieChartOptions = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 300,
      style: {
        fontFamily: "Open Sans, sans-serif",
      },
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>",
      valuePrefix: currencySymbol,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        innerSize: "60%", // for donut effect
        colors: COLORS,
      },
    },
    legend: {
      itemStyle: {
        fontSize: "11px",
        fontWeight: "normal",
        fontFamily: "'Open Sans', sans-serif",
        color: "#666",
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: "Expenses",
        colorByPoint: true,
        data: categoryData.map((item) => ({
          name: item.name,
          y: item.value,
        })),
      },
    ],
  };

  return (
    <div className="container-fluid py-2">
      <h4 className="mb-4 text-gradient">Enterprise Dashboard</h4>

      <div className="row mb-4 g-4">
        {/* Net Balance Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div
              className={`icon-wrapper ${balance < 0 ? "danger" : "success"} me-3`}
            >
              <FiCreditCard />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Net Balance
              </p>
              <h5
                className={`m-0 ${balance < 0 ? "text-danger" : "text-success"}`}
              >
                {balance < 0 ? "-" : ""}
                <ConvertedAmount amount={Math.abs(balance)} />
              </h5>
            </div>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper success me-3">
              <FiTrendingUp />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Total Income
              </p>
              <h5 className="m-0 text-success">
                +<ConvertedAmount amount={totalIncomes} />
              </h5>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper danger me-3">
              <FiTrendingDown />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Total Expenses
              </p>
              <h5 className="mb-0 text-danger">
                -<ConvertedAmount amount={totalExpenses} />
              </h5>
            </div>
          </div>
        </div>

        {/* Savings Rate Card */}
        <div className="col-md-3">
          <div className="stat-card p-4 d-flex align-items-center h-100">
            <div className="icon-wrapper primary me-3">
              <FiTrendingUp />
            </div>
            <div>
              <p
                className="text-muted mb-1 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Savings Rate
              </p>
              <h5 className="m-0 text-primary">{savingsRate.toFixed(1)}%</h5>
              <small
                className="text-muted fw-semibold"
                style={{ fontSize: "0.7rem" }}
              >
                {balance > 0 ? (
                  <span>
                    <ConvertedAmount amount={balance} /> saved
                  </span>
                ) : (
                  "Negative cashflow"
                )}
              </small>
            </div>
          </div>
        </div>

        {/* Total Expenses Card with MoM */}
        {/* <div className="col-md-3">
          <div className="stat-card p-4 h-100 position-relative border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)' }}>
            <div className="d-flex align-items-center mb-1">
              <div className="icon-wrapper danger me-2" style={{ transform: 'scale(0.8)' }}>
                <MdAttachMoney />
              </div>
              <p
                className="text-muted mb-0 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Expenses
              </p>
            </div>
            <h5 className="m-0 fw-bold">
              <ConvertedAmount amount={totalExpenses} />
            </h5>
            {mom.diff > 0 && (
              <div className={`mt-2 d-flex align-items-center ${mom.trend === 'up' ? 'text-danger' : 'text-success'}`} style={{ fontSize: '0.75rem' }}>
                <span className="fw-bold">{mom.trend === 'up' ? '↑' : '↓'} {mom.diff}%</span>
                <span className="text-muted ms-1">vs last month</span>
              </div>
            )}
          </div>
        </div> */}

        {/* Monthly Budget Tracker */}
        <div className="col-md-3">
          <div className="stat-card p-4 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <p
                className="text-muted mb-0 fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                Total Budget
              </p>
              <div className="d-flex align-items-center">
                <span className="fw-bold me-2" style={{ fontSize: "0.9rem" }}>
                  <ConvertedAmount amount={totalBudgetLimit} />
                </span>
                <button
                  className="btn btn-sm btn-link p-0 text-primary"
                  onClick={() => (window.location.href = "/budgets")}
                >
                  <FiEdit3 size={14} />
                </button>
              </div>
            </div>

            <div
              className="progress mt-1 rounded-pill"
              style={{ height: "8px" }}
            >
              <div
                className={`progress-bar ${overallProgressColor} rounded-pill`}
                role="progressbar"
                style={{
                  width: `${Math.min(overallBudgetPercentage, 100)}%`,
                  transition: "width 1s ease",
                }}
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small
                className="text-muted fw-semibold"
                style={{ fontSize: "0.65rem" }}
              >
                {overallBudgetPercentage.toFixed(0)}% used
              </small>
              <small
                style={{ fontSize: "0.65rem" }}
                className={
                  overallBudgetPercentage > 100
                    ? "text-danger fw-bold"
                    : "text-muted fw-semibold"
                }
              >
                {overallBudgetPercentage > 100 ? (
                  "Over Budget!"
                ) : (
                  <span>
                    <ConvertedAmount
                      amount={totalBudgetLimit - totalExpenses}
                    />{" "}
                    left
                  </span>
                )}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="row mb-4 g-4">
        <div className="col-12">
          <div
            className="p-3 bg-gradient-premium rounded-4 text-white d-flex align-items-center shadow-lg"
            style={{
              background: "linear-gradient(90deg, #4361ee 0%, #7209b7 100%)",
            }}
          >
            <FiInfo size={24} className="me-3" />
            <div className="flex-grow-1">
              <span className="fw-semibold">Financial Highlight: </span>
              {topSpentCategory ? (
                <span>
                  Your biggest expense this month is{" "}
                  <span className="fw-bold text-warning">
                    {topSpentCategory.name}
                  </span>{" "}
                  consuming{" "}
                  {((topSpentCategory.value / totalExpenses) * 100).toFixed(1)}%
                  of your spending.
                </span>
              ) : (
                <span>
                  Add some expenses to see your daily financial highlights!
                </span>
              )}
            </div>
            <div className="d-none d-md-block">
              <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-bold">
                Smart Insights
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Budgets Row */}
      {budgets.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="table-container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <FiInfo className="text-primary me-2" /> Budget Status
                  by Category
                </h5>
                <small className="text-muted">
                  Filtered for{" "}
                  {monthFilter === "All"
                    ? months[new Date().getMonth()]
                    : months[parseInt(monthFilter)]}{" "}
                  {yearFilter === "All" ? new Date().getFullYear() : yearFilter}
                </small>
              </div>
              <div className="row g-4">
                {categoryData
                  .filter((cd) => cd.budget > 0)
                  .map((cat, idx) => {
                    const percent = (cat.value / cat.budget) * 100;
                    return (
                      <div className="col-md-4 col-xl-3" key={idx}>
                        <div className="p-3 border rounded-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold text-main small">
                              {cat.name}
                            </span>
                            <span
                              className={`small fw-bold ${percent > 100 ? "text-danger" : "text-muted"}`}
                            >
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                          <div
                            className="progress mb-2"
                            style={{ height: "6px" }}
                          >
                            <div
                              className={`progress-bar ${getProgressColor(percent)}`}
                              role="progressbar"
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.7rem" }}
                            >
                              <ConvertedAmount amount={cat.value} /> used
                            </small>
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.7rem" }}
                            >
                              <ConvertedAmount amount={cat.budget} /> limit
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-container h-100">
            <h5 className="mb-4">Recent Activity</h5>
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
                      <tr key={item._id || item.id}>
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
                          className={`fw-semibold ${item.type === "income" ? "text-success" : "text-danger"}`}
                        >
                          {item.type === "income" ? "+" : "-"}
                          <ConvertedAmount amount={item.amount} />
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
            <h5 className="mb-4">Expenses by Category</h5>
            {categoryData.length > 0 ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={pieChartOptions}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Highcharts Analytics Row */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="table-container p-4">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
