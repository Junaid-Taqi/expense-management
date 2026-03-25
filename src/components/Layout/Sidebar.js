import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  MdDashboard,
  MdOutlineReceiptLong,
  MdMenu,
  MdClose,
  MdLogout,
  MdOutlineCategory,
  MdOutlineSavings,
  MdOutlineAccountBalanceWallet,
  MdPerson,
  MdEventRepeat,
  MdAssessment,
} from "react-icons/md";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <>
      <div
        className={`sidebar d-flex flex-column py-4 ${collapsed ? "collapsed" : ""} ${isMobileOpen ? "show" : ""}`}
      >
        <div className="d-flex justify-content-between align-items-center px-4 mb-4">
          <h5 className={`m-0 fw-bold ${collapsed ? "d-none" : ""}`}>
            Expense Wallet
          </h5>
          <button
            className="toggle-btn d-none d-md-block hamburgerIcon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <MdMenu />
          </button>

          <button
            className="toggle-btn d-md-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <MdClose />
          </button>
        </div>

        <nav className="nav flex-column mt-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
            end
          >
            <MdDashboard />
            <span className="link-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdOutlineReceiptLong />
            <span className="link-text">All Expenses</span>
          </NavLink>

          <hr className="my-2 border-secondary" />

          <NavLink
            to="/incomes"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdOutlineSavings className="" />
            <span className="link-text">All Incomes</span>
          </NavLink>

          <hr className="my-2 border-secondary" />

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdOutlineCategory className="" />
            <span className="link-text">Categories</span>
          </NavLink>

          <NavLink
            to="/budgets"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdOutlineAccountBalanceWallet className="" />
            <span className="link-text">Budgets</span>
          </NavLink>

          <NavLink
            to="/recurring"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdEventRepeat className="" />
            <span className="link-text">Recurring</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdAssessment className="" />
            <span className="link-text">Reports</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link text-decoration-none ${isActive ? "active" : ""}`
            }
            onClick={handleLinkClick}
          >
            <MdPerson className="" />
            <span className="link-text">Profile</span>
          </NavLink>
        </nav>

        {/* Logout Section at the Bottom */}
        <div className="mt-auto px-3 pb-4">
          <button
            className="btn btn-outline-danger border-0 w-100 d-flex align-items-center py-2"
            onClick={handleLogout}
            title="Logout"
          >
            <MdLogout className={collapsed ? "" : "me-2"} size={20} />
            <span className={`fw-semibold ${collapsed ? "d-none" : ""}`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          className="d-md-none"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
