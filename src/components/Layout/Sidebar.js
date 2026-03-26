import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  FiGrid,
  FiFileText,
  FiMenu,
  FiX,
  FiLogOut,
  FiLayers,
  FiTrendingUp,
  FiCreditCard,
  FiUser,
  FiRepeat,
  FiPieChart,
} from "react-icons/fi";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const menuItems = [
    { path: "/", icon: <FiGrid />, label: "Dashboard", end: true },
    { path: "/expenses", icon: <FiFileText />, label: "All Expenses" },
    { type: "divider" },
    { path: "/incomes", icon: <FiTrendingUp />, label: "All Incomes" },
    { type: "divider" },
    { path: "/categories", icon: <FiLayers />, label: "Categories" },
    { path: "/budgets", icon: <FiCreditCard />, label: "Budgets" },
    { path: "/recurring", icon: <FiRepeat />, label: "Recurring" },
    { path: "/reports", icon: <FiPieChart />, label: "Reports" },
    { path: "/profile", icon: <FiUser />, label: "Profile" },
  ];

  return (
    <>
      <div
        className={`sidebar d-flex flex-column py-4 ${collapsed ? "collapsed" : ""} ${isMobileOpen ? "show" : ""}`}
      >
        <div className="d-flex justify-content-between align-items-center px-4 mb-4">
          <div
            className={`d-flex align-items-center ${collapsed ? "d-none" : ""}`}
          >
            <div
              className="icon-wrapper primary me-2"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                fontSize: "16px",
              }}
            >
              <FiCreditCard />
            </div>
            <h5 className="m-0 fw-bold">Wallet</h5>
          </div>

          <button
            className="toggle-btn d-none d-md-block hamburgerIcon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FiMenu />
          </button>

          <button
            className="toggle-btn d-md-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <nav className="nav flex-column mt-2">
          {menuItems.map((item, index) =>
            item.type === "divider" ? (
              <hr
                key={index}
                className="my-2 mx-4 border-secondary opacity-10"
              />
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link text-decoration-none ${isActive ? "active" : ""}`
                }
                onClick={handleLinkClick}
                end={item.end}
              >
                {item.icon}
                <span className="link-text">{item.label}</span>
              </NavLink>
            ),
          )}
        </nav>

        <div className="mt-auto px-3 pb-4">
          <button
            className="btn btn-outline-danger border-0 w-100 d-flex align-items-center py-2 px-3"
            onClick={handleLogout}
            title="Logout"
            style={{ borderRadius: "12px", transition: "all 0.3s ease" }}
          >
            <FiLogOut className={collapsed ? "" : "me-2"} size={20} />
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
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
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
