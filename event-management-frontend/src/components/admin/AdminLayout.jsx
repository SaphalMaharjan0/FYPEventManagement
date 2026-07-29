import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children, currentPage, onNavigate, currentUser, onLogout }) {
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
      {/* Sidebar */}
      <AdminSidebar 
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
      
      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Topbar */}
        <AdminTopbar currentUser={currentUser} onNavigate={onNavigate} onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* Page Content */}
        <main style={{ flex: 1, padding: "2rem", overflowX: "hidden" }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
