import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ currentUser, allowedRoles, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to their respective dashboard if they try to access an unauthorized role page
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}
