import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="container-fluid py-2 animate-pulse">
      <div className="skeleton mb-4" style={{ width: '250px', height: '32px' }}></div>

      <div className="row mb-4 g-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-md-3" key={i}>
            <div className="stat-card p-4 d-flex align-items-center h-100">
              <div className="skeleton rounded-circle me-3" style={{ width: '56px', height: '56px' }}></div>
              <div className="flex-grow-1">
                <div className="skeleton mb-2" style={{ width: '60%', height: '12px' }}></div>
                <div className="skeleton" style={{ width: '80%', height: '24px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="table-container">
            <div className="skeleton mb-4" style={{ width: '150px', height: '24px' }}></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton mb-3" style={{ width: '100%', height: '50px' }}></div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="table-container">
            <div className="skeleton mb-4" style={{ width: '150px', height: '24px' }}></div>
            <div className="skeleton rounded-circle mx-auto" style={{ width: '200px', height: '200px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
