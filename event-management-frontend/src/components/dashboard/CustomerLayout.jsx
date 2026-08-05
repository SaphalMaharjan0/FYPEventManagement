import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function CustomerLayout({
  children,
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  isDarkMode, // <-- Added prop
  toggleDarkMode, // <-- Added prop
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-body, #0f172a);
          position: relative;
        }

        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }

        .dashboard-content {
          flex: 1;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .dashboard-content {
            padding: 2rem;
          }
        }

        /* Mobile Backdrop Overlay */
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          z-index: 999;
        }

        @media (min-width: 768px) {
          .mobile-backdrop {
            display: none;
          }
        }
      `}</style>

      {/* Backdrop for Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="dashboard-main">
        <Topbar
          currentUser={currentUser}
          onNavigate={onNavigate}
          isDarkMode={isDarkMode} /* <-- Passed prop */
          toggleDarkMode={toggleDarkMode} /* <-- Passed prop */
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="dashboard-content">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
