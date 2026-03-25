import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="wrapper">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <main className="main-content d-flex flex-column p-0">
        <Header setIsMobileOpen={setIsMobileOpen} />
        
        <div className="px-4 pb-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
