import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import { Outlet } from "react-router-dom";

export default function VendorLayout({ children, currentPage, onNavigate, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-no-scroll');
      document.documentElement.classList.add('mobile-no-scroll');
    } else {
      document.body.classList.remove('mobile-no-scroll');
      document.documentElement.classList.remove('mobile-no-scroll');
    }
    return () => {
      document.body.classList.remove('mobile-no-scroll');
      document.documentElement.classList.remove('mobile-no-scroll');
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar - fixed width */}
      <VendorSidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
      />
      
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Main Content Area - pushed to the right of the sidebar */}
      <div className="dashboard-main">
        {/* Topbar */}
        <VendorTopbar currentUser={currentUser} onNavigate={onNavigate} onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* Page Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
