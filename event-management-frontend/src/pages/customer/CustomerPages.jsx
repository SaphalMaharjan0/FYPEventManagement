import React from "react";
import DashboardPage from "./DashboardPage";
import EventListingPage from "../guest/EventListingPage";
import MyBookingsPage from "./MyBookingsPage";
import BookingHistoryPage from "./BookingHistoryPage";
import FavoritesPage from "./FavoritesPage";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";
import BookingPage from "./BookingPage";
import NotificationsPage from "./NotificationsPage";
import EventDetailsPage from "./EventDetailsPage";
import EsewaSuccessPage from "./EsewaSuccessPage";
import EsewaFailurePage from "./EsewaFailurePage";

export default function CustomerPages({
  currentPage,
  currentUser,
  events,
  selectedEvent,
  bookingQuantity,
  eventsPageCategory,
  eventsPageSearch,
  eventsPageLocation,
  onBookClick,
  onBookingSuccess,
  onNavigate,
  onUpdateUser,
  onInitiateBooking,
  onNavigateToCustomerDashboard,
}) {
  if (currentPage === "customer-dashboard") {
    return (
      <DashboardPage
        currentUser={currentUser}
        events={events}
        onBookClick={onBookClick}
        onNavigate={onNavigateToCustomerDashboard}
      />
    );
  }

  if (currentPage === "customer-events") {
    return (
      <EventListingPage
        events={events}
        onBookClick={onBookClick}
        initialCategory={eventsPageCategory}
        initialSearchQuery={eventsPageSearch}
        initialLocationQuery={eventsPageLocation}
        isDashboardContext={true}
      />
    );
  }

  if (currentPage === "customer-bookings") {
    return <MyBookingsPage events={events} />;
  }

  if (currentPage === "customer-history") {
    return <BookingHistoryPage events={events} />;
  }

  if (currentPage === "customer-favorites") {
    return <FavoritesPage events={events} onBookClick={onBookClick} />;
  }

  if (currentPage === "customer-settings") {
    return <SettingsPage />;
  }

  if (currentPage === "customer-profile") {
    return (
      <ProfilePage currentUser={currentUser} onUpdateUser={onUpdateUser} />
    );
  }

  if (currentPage === "customer-notifications") {
    return <NotificationsPage />;
  }

  if (currentPage === "customer-booking") {
    return (
      <BookingPage
        event={selectedEvent}
        initialQuantity={bookingQuantity}
        onBookingSuccess={onBookingSuccess}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentPage === "customer-event-details") {
    return (
      <EventDetailsPage
        event={selectedEvent}
        allEvents={events}
        onNavigate={(page, evt) => {
          if (evt) {
            onNavigate(page, evt);
          } else {
            onNavigate(page);
          }
        }}
        onInitiateBooking={onInitiateBooking}
        currentUser={currentUser}
        isDashboardContext={true}
      />
    );
  }

  if (currentPage === "esewa-success") {
    return <EsewaSuccessPage onNavigate={onNavigate} />;
  }

  if (currentPage === "esewa-failure") {
    return <EsewaFailurePage onNavigate={onNavigate} />;
  }

  return null;
}
