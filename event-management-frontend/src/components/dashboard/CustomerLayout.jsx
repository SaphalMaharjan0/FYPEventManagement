import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function CustomerLayout({
  children,
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-body-alt)",
      }}
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <div
        style={{
          flex: 1,
          marginLeft: "260px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar
          currentUser={currentUser}
          onNavigate={onNavigate}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>
    </div>
  );
}
