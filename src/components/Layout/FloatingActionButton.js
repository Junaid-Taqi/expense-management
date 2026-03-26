import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: <FiDollarSign />,
      label: 'Add Expense',
      onClick: () => {
        navigate('/expenses');
        setIsOpen(false);
      },
      color: 'bg-danger'
    },
    {
      icon: <FiTrendingUp />,
      label: 'Add Income',
      onClick: () => {
        navigate('/incomes');
        setIsOpen(false);
      },
      color: 'bg-success'
    }
  ];

  return (
    <div className={`fab-container ${isOpen ? 'active' : ''}`}>
      <div className="fab-options">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className="fab-option-wrapper d-flex align-items-center justify-content-end mb-3 cursor-pointer"
            onClick={action.onClick}
          >
            <span className="fab-label px-3 py-1 bg-white shadow-sm rounded-pill small fw-bold me-3 text-dark">
              {action.label}
            </span>
            <div className={`fab-sub-icon ${action.color} text-white shadow-lg d-flex align-items-center justify-content-center`} style={{ width: '45px', height: '45px', borderRadius: '14px' }}>
              {action.icon}
            </div>
          </div>
        ))}
      </div>
      <button 
        className={`fab-main-btn shadow-lg d-flex align-items-center justify-content-center ${isOpen ? 'rotate' : ''}`}
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          border: 'none',
          width: '60px',
          height: '60px',
          borderRadius: '18px',
          fontSize: '24px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <FiPlus size={32} />
      </button>
    </div>
  );
};

export default FloatingActionButton;
