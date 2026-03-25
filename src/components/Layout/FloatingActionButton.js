import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdAttachMoney, MdTrendingUp } from 'react-icons/md';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: <MdAttachMoney />,
      label: 'Add Expense',
      onClick: () => {
        navigate('/add-expense');
        setIsOpen(false);
      },
      color: 'bg-danger'
    },
    {
      icon: <MdTrendingUp />,
      label: 'Add Income',
      onClick: () => {
        navigate('/add-income');
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
            <span className="fab-label px-3 py-1 bg-white shadow-sm rounded-pill small fw-bold me-3">
              {action.label}
            </span>
            <div className={`fab-sub-icon ${action.color} text-white shadow`}>
              {action.icon}
            </div>
          </div>
        ))}
      </div>
      <button 
        className={`fab-main-btn bg-primary text-white shadow-lg ${isOpen ? 'rotate' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <MdAdd size={32} />
      </button>
    </div>
  );
};

export default FloatingActionButton;
