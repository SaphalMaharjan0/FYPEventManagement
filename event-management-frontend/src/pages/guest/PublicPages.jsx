import React from "react";
import EventListingPage from "./EventListingPage";
import DiscoverPage from "./DiscoverPage";
import EventDetailsPage from "../customer/EventDetailsPage";

export default function PublicPages({
  currentPage,
  events,
  categories,
  selectedEvent,
  eventsPageCategory,
  eventsPageSearch,
  eventsPageLocation,
  onBookClick,
  onEventDetailsNavigate,
  onInitiateBooking,
  currentUser,
  onDiscoverCategorySelect,
}) {
  if (currentPage === "events") {
    return (
      <EventListingPage
        events={events}
        onBookClick={onBookClick}
        initialCategory={eventsPageCategory}
        initialSearchQuery={eventsPageSearch}
        initialLocationQuery={eventsPageLocation}
      />
    );
  }

  if (currentPage === "discover") {
    return (
      <DiscoverPage
        events={events}
        categories={categories}
        onBookClick={onBookClick}
        setActiveCategory={onDiscoverCategorySelect}
      />
    );
  }

  if (currentPage === "event-details") {
    return (
      <EventDetailsPage
        event={selectedEvent}
        allEvents={events}
        onNavigate={onEventDetailsNavigate}
        onInitiateBooking={onInitiateBooking}
        currentUser={currentUser}
      />
    );
  }

  return null;
}
