import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleTheme, selectTheme } from "../../store/slices/themeSlice";
import {
  setCurrency,
  selectCurrencyCode,
  fetchRates,
} from "../../store/slices/currencySlice";
import {
  setMonthFilter,
  setYearFilter,
  selectMonthFilter,
  selectYearFilter,
} from "../../store/slices/filterSlice";
import {
  FiMoon, FiSun, FiMenu, FiLogOut,
  FiGrid, FiFileText, FiTrendingUp, FiLayers,
  FiCreditCard, FiRepeat, FiPieChart, FiUser,
} from "react-icons/fi";
import { logout } from "../../store/slices/authSlice";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "PKR", symbol: "Rs" },
  { code: "INR", symbol: "₹" },
];

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

const Header = ({ setIsMobileOpen }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const currencyCode = useSelector(selectCurrencyCode);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRates(currencyCode));
  }, [dispatch, currencyCode]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const location = useLocation();
  const pageMap = {
    "/": { label: "Dashboard", icon: <FiGrid /> },
    "/expenses": { label: "All Expenses", icon: <FiFileText /> },
    "/incomes": { label: "Income", icon: <FiTrendingUp /> },
    "/budgets": { label: "Budget Management", icon: <FiCreditCard /> },
    "/categories": { label: "Manage Categories", icon: <FiLayers /> },
    "/recurring": { label: "Recurring Transactions", icon: <FiRepeat /> },
    "/reports": { label: "Financial Reports", icon: <FiPieChart /> },
    "/profile": { label: "User Profile", icon: <FiUser /> },
  };
  const currentPage = pageMap[location.pathname] || { label: "Wallet", icon: <FiGrid /> };

  return (
    <header
      className="d-flex align-items-center justify-content-between p-3 mb-4 sticky-top"
      style={{
        background: "var(--bg-card)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        borderBottom: "var(--glass-border)",
        zIndex: 50,
        margin: "12px 24px 24px 24px",
        borderRadius: "20px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          className="toggle-btn me-1 d-md-none"
          onClick={() => setIsMobileOpen(true)}
        >
          <FiMenu />
        </button>
        {/* Mobile */}
        <div className="d-flex align-items-center gap-2 d-md-none">
          <span style={{ color: "var(--primary-color)", fontSize: "1.1rem" }}>
            {currentPage.icon}
          </span>
          <h4 className="m-0 fw-bold text-gradient">{currentPage.label}</h4>
        </div>
        {/* Desktop */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              flexShrink: 0,
            }}
          >
            {currentPage.icon}
          </div>
          <h5 className="m-0 fw-bold text-gradient" style={{ fontSize: "1.1rem" }}>
            {currentPage.label}
          </h5>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto flex-wrap justify-content-end">
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={monthFilter}
            onChange={(e) => dispatch(setMonthFilter(e.target.value))}
          >
            <option value="All">All Months</option>
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={yearFilter}
            onChange={(e) => dispatch(setYearFilter(e.target.value))}
          >
            <option value="All">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center">
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={currencyCode}
            onChange={(e) => {
              const selected = currencies.find(
                (c) => c.code === e.target.value,
              );
              if (selected) dispatch(setCurrency(selected));
            }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* <button
          className="btn btn-sm btn-outline-primary d-flex align-items-center"
          style={{ borderRadius: "10px", padding: "0.4rem 0.8rem" }}
          onClick={() => {
            exportToCSV(expensesList, "All_Expenses");
            exportToCSV(incomesList, "All_Incomes");
          }}
          title="Export CSV"
        >
          <FiDownload className="me-1" />
          <span className="d-none d-sm-inline">Export</span>
        </button> */}

        <button
          className="toggle-btn"
          style={{
            width: "38px",
            height: "38px",
            borderColor: "var(--primary-color)",
          }}
          onClick={() => dispatch(toggleTheme())}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        {userInfo && (
          <div
            className="d-flex align-items-center gap-2 ms-2 ps-3 border-start"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="d-none d-lg-block text-end">
              <div
                className="fw-bold small"
                style={{ color: "var(--text-main)" }}
              >
                {userInfo.name}
              </div>
              <div
                className="text-muted smaller"
                style={{ fontSize: "0.7rem" }}
              >
                {userInfo.email}
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center"
              style={{ borderRadius: "10px", padding: "0.4rem 0.6rem" }}
              onClick={logoutHandler}
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
