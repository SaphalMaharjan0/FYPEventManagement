import React from "react";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

export default function VendorLayout({ children, currentPage, onNavigate, currentUser, onLogout }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--color-slate-50)" }}>
      {/* Sidebar - fixed width */}
      <VendorSidebar 
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      {/* Main Content Area - pushed to the right of the sidebar */}
      <div style={{ flex: 1, marginLeft: "250px", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <VendorTopbar currentUser={currentUser} onNavigate={onNavigate} />
        
        {/* Page Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
