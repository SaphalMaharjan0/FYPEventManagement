import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children, currentPage, onNavigate, currentUser, onLogout }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: "260px", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <AdminTopbar currentUser={currentUser} />
        
        {/* Page Content */}
        <main style={{ flex: 1, padding: "2rem", overflowX: "hidden" }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
