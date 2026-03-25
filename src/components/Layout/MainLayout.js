import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingActionButton from './FloatingActionButton';

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
      <FloatingActionButton />
    </div>
  );
};

export default MainLayout;
