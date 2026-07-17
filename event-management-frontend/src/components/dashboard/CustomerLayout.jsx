import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function CustomerLayout({ children, currentPage, onNavigate, currentUser, onLogout }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        currentUser={currentUser} 
        onLogout={onLogout} 
      />
      
      <div style={{ flex: 1, marginLeft: "260px", display: "flex", flexDirection: "column" }}>
        <Topbar currentUser={currentUser} onNavigate={onNavigate} />
        
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
