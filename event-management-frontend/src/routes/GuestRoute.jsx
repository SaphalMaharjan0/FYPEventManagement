import React from 'react';
import { Navigate } from 'react-router-dom';

export default function GuestRoute({ currentUser, children }) {
  if (currentUser) {
    if (currentUser.role === 'administrator') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}
