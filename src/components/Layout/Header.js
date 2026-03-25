import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectTheme } from "../../store/slices/themeSlice";
import {
  setCurrency,
  selectCurrencyCode,
} from "../../store/slices/currencySlice";
import {
  setMonthFilter,
  setYearFilter,
  selectMonthFilter,
  selectYearFilter,
} from "../../store/slices/filterSlice";
import { selectAllExpenses } from "../../store/slices/expenseSlice";
import { selectAllIncomes } from "../../store/slices/incomeSlice";
import { exportToCSV } from "../../utils/exportCsv";
import {
  MdDarkMode,
  MdLightMode,
  MdDownload,
  MdMenu,
  MdLogout,
} from "react-icons/md";
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
  const expensesList = useSelector(selectAllExpenses);
  const incomesList = useSelector(selectAllIncomes);
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
  };

  // Generate dynamic years based on current date (e.g., last 5 years + next 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <header
      className="d-flex align-items-center justify-content-between p-3 mb-4 bg-card border-bottom sticky-top"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
        zIndex: 50,
      }}
    >
      {/* Left side: Mobile Toggle & Title (for mobile) */}
      <div className="d-flex align-items-center">
        <button
          className="toggle-btn me-3 d-md-none"
          onClick={() => setIsMobileOpen(true)}
        >
          <MdMenu />
        </button>
        <h4 className="m-0 fw-bold text-gradient d-md-none">Expense Wallet</h4>
      </div>

      {/* Right side: Controls */}
      <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto flex-wrap justify-content-end">
        {/* Date Filters */}
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{
              width: "auto",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
            }}
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
            style={{
              width: "auto",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
            }}
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

        {/* Currency Selector */}
        <div className="d-flex align-items-center">
          <span className="me-2 text-muted fw-semibold d-none d-sm-inline">
            Currency:
          </span>
          <select
            className="form-select form-select-sm"
            style={{
              width: "auto",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
            }}
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

        {/* CSV Export Button */}
        <button
          className="btn btn-sm btn-outline-primary d-flex align-items-center"
          onClick={() => {
            exportToCSV(expensesList, "All_Expenses");
            exportToCSV(incomesList, "All_Incomes");
          }}
          title="Export CSV"
        >
          <MdDownload className="me-1" />{" "}
          <span className="d-none d-sm-inline">Export</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          className="toggle-btn"
          style={{ width: "35px", height: "35px" }}
          onClick={() => dispatch(toggleTheme())}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? (
            <MdDarkMode size={20} />
          ) : (
            <MdLightMode size={20} />
          )}
        </button>

        {/* User Profile & Logout */}
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
              onClick={logoutHandler}
              title="Logout"
            >
              <MdLogout size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
