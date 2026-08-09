import React from 'react';

export default function ConfirmModal({ 
  isOpen, 
  title = "Confirm Action", 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmColor = "#10b981", // default green (emerald-500)
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      backgroundColor: "rgba(0,0,0,0.5)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      zIndex: 9999 
    }}>
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "12px", 
        width: "90%", 
        maxWidth: "380px", 
        padding: "1.5rem",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" 
      }}>
        <h3 style={{ 
          fontSize: "1.25rem", 
          fontWeight: "700", 
          color: "#0f172a", // slate-900
          margin: "0 0 1rem 0" 
        }}>
          {title}
        </h3>
        <p style={{ 
          color: "#475569", // slate-600
          fontSize: "1rem",
          lineHeight: "1.5", 
          margin: "0 0 1.5rem 0" 
        }}>
          {message}
        </p>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem" 
        }}>
          <button 
            onClick={onCancel}
            disabled={isLoading}
            style={{ 
              flex: 1,
              padding: "0.75rem", 
              backgroundColor: "#f1f5f9", // slate-100
              color: "#334155", // slate-700
              border: "none", 
              borderRadius: "8px", 
              fontWeight: "600", 
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer" 
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            style={{ 
              flex: 1,
              padding: "0.75rem", 
              backgroundColor: confirmColor, 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              fontWeight: "600", 
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer", 
              opacity: isLoading ? 0.7 : 1 
            }}
          >
            {isLoading ? "Wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
