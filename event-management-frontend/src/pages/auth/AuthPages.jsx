import React from "react";
import AuthLayout from "../../components/common/AuthLayout";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AuthPages({
  currentPage,
  onLogoClick,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToLogin,
  onLoginSuccess,
  onRegisterSuccess,
  onResetSuccess,
}) {
  if (!["login", "register", "forgot"].includes(currentPage)) {
    return null;
  }

  return (
    <AuthLayout onLogoClick={onLogoClick}>
      {currentPage === "login" && (
        <LoginPage
          onNavigateToRegister={onNavigateToRegister}
          onNavigateToForgotPassword={onNavigateToForgotPassword}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {currentPage === "register" && (
        <RegisterPage
          onNavigateToLogin={onNavigateToLogin}
          onRegisterSuccess={onRegisterSuccess}
        />
      )}
      {currentPage === "forgot" && (
        <ResetPasswordForm
          onNavigateToLogin={onNavigateToLogin}
          onResetSuccess={onResetSuccess}
        />
      )}
    </AuthLayout>
  );
}
