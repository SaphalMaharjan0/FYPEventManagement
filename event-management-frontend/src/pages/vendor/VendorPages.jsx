import React from "react";
import VendorDashboard from "./VendorDashboard";
import ServiceListingsPage from "./ServiceListingsPage";
import AddServicePage from "./AddServicePage";
import RequestsPage from "./RequestsPage";
import AvailabilityPage from "./AvailabilityPage";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";

export default function VendorPages({
  currentPage,
  currentUser,
  onNavigate,
  onUpdateUser,
}) {
  if (currentPage === "vendor-dashboard") {
    return <VendorDashboard currentUser={currentUser} />;
  }

  if (currentPage === "vendor-services") {
    return <ServiceListingsPage onNavigate={onNavigate} />;
  }

  if (currentPage === "vendor-add-service") {
    return <AddServicePage />;
  }

  if (currentPage === "vendor-requests") {
    return <RequestsPage />;
  }

  if (currentPage === "vendor-availability") {
    return <AvailabilityPage />;
  }

  if (currentPage === "vendor-settings") {
    return <SettingsPage />;
  }

  if (currentPage === "vendor-profile") {
    return (
      <ProfilePage currentUser={currentUser} onUpdateUser={onUpdateUser} />
    );
  }

  return null;
}
