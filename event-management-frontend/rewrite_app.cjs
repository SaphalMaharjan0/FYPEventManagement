const fs = require('fs');

const content = `import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { eventsData } from "./data/events";

const pageToUrl = (page) => {
  if (!page || page === "landing") return "/";
  if (page.startsWith("customer-")) return \`/customer/\${page.replace("customer-", "")}\`;
  if (page.startsWith("admin-")) return \`/admin/\${page.replace("admin-", "")}\`;
  if (page.startsWith("vendor-")) return \`/vendor/\${page.replace("vendor-", "")}\`;
  if (page === "events") return "/events";
  if (page === "discover") return "/discover";
  if (page === "event-details") return "/event-details";
  if (page === "login") return "/login";
  if (page === "register") return "/register";
  if (page === "forgot") return "/forgot";
  return \`/\${page}\`;
};

export default function App() {
  const navigate = useNavigate();

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("eventpulse_events");
    return saved ? JSON.parse(saved) : eventsData;
  });

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [eventsPageCategory, setEventsPageCategory] = useState("all");
  const [eventsPageSearch, setEventsPageSearch] = useState("");
  const [eventsPageLocation, setEventsPageLocation] = useState("");

  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("eventpulse_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("eventpulse_theme");
    return saved === "dark";
  });

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem("eventpulse_theme", "dark");
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem("eventpulse_theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("eventpulse_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("eventpulse_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("eventpulse_user");
    }
  }, [currentUser]);

  const onNavigate = (page) => {
    navigate(pageToUrl(page));
  };

  const applyFilters = () => {
    let result = events;
    if (activeCategory !== "all") {
      result = result.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    if (locationQuery.trim() !== "") {
      const loc = locationQuery.toLowerCase();
      result = result.filter(e => e.venue.toLowerCase().includes(loc));
    }
    setFilteredEvents(result);
    if (result.length === 0 && (searchQuery.trim() !== "" || locationQuery.trim() !== "")) {
      showToast("No events found matching your criteria.");
    }
  };

  useEffect(() => {
    applyFilters();
  }, [activeCategory, events]);

  const handleSearchSubmit = () => {
    setEventsPageSearch(searchQuery);
    setEventsPageLocation(locationQuery);
    setEventsPageCategory("all");
    onNavigate("events");
  };

  const showToast = (message) => {
    setToast(message);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const handleBookingSuccess = (eventId, quantity) => {
    setEvents(prevEvents => prevEvents.map(evt => {
      if (evt.id === eventId) {
        const newSeatsLeft = Math.max(0, evt.seatsLeft - quantity);
        return { ...evt, seatsLeft: newSeatsLeft, percentAvailable: Math.round((newSeatsLeft / evt.totalSeats) * 100) };
      }
      return evt;
    }));
    showToast("Tickets successfully reserved!");
    setIsBookingModalOpen(false);
  };

  const handleBookClick = (eventItem) => {
    setSelectedEvent(eventItem);
    if (currentUser && currentUser.role === "customer") {
      onNavigate("customer-event-details");
    } else {
      onNavigate("event-details");
    }
  };

  const handleInitiateBooking = (eventItem, qty) => {
    if (!currentUser) {
      showToast("Please log in to book tickets.");
      setRedirectAfterLogin({ page: "customer-booking", event: eventItem, quantity: qty });
      onNavigate("login");
      return;
    }
    setSelectedEvent(eventItem);
    setBookingQuantity(qty);
    onNavigate("customer-booking");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setCurrentUser(null);
      onNavigate("landing");
      showToast("Logged out successfully.");
    }
  };

  const handleRegisterSuccess = (userData) => {
    showToast(\`Account created! Welcome, \${userData.firstName}.\`);
    setCurrentUser({ name: \`\${userData.firstName} \${userData.lastName}\`, email: userData.email, role: userData.role });
    if (redirectAfterLogin) {
      setSelectedEvent(redirectAfterLogin.event);
      setBookingQuantity(redirectAfterLogin.quantity);
      setIsBookingModalOpen(true);
      onNavigate(redirectAfterLogin.page);
      setRedirectAfterLogin(null);
    } else {
      if (userData.role === "admin") onNavigate("admin-dashboard");
      else if (userData.role === "vendor") onNavigate("vendor-dashboard");
      else if (userData.role === "customer") onNavigate("customer-dashboard");
      else onNavigate("landing");
    }
  };

  const handleLoginSuccess = (userData) => {
    showToast(\`Welcome back, \${userData.fullName}!\`);
    setCurrentUser(userData);
    if (redirectAfterLogin) {
      setSelectedEvent(redirectAfterLogin.event);
      setBookingQuantity(redirectAfterLogin.quantity);
      setIsBookingModalOpen(true);
      onNavigate(redirectAfterLogin.page);
      setRedirectAfterLogin(null);
    } else {
      if (userData.role === "admin") onNavigate("admin-dashboard");
      else if (userData.role === "vendor") onNavigate("vendor-dashboard");
      else if (userData.role === "customer") onNavigate("customer-dashboard");
      else onNavigate("landing");
    }
  };

  const handleResetSuccess = (email) => {
    showToast(\`Password reset link sent to \${email}\`);
    onNavigate("login");
  };

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const upcomingEvents = filteredEvents.filter(e => !e.featured);

  return (
    <>
      <AppRoutes
        currentUser={currentUser}
        events={events}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        eventsPageCategory={eventsPageCategory}
        setEventsPageCategory={setEventsPageCategory}
        eventsPageSearch={eventsPageSearch}
        setEventsPageSearch={setEventsPageSearch}
        eventsPageLocation={eventsPageLocation}
        setEventsPageLocation={setEventsPageLocation}
        handleBookClick={handleBookClick}
        handleInitiateBooking={handleInitiateBooking}
        handleBookingSuccess={handleBookingSuccess}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        bookingQuantity={bookingQuantity}
        setBookingQuantity={setBookingQuantity}
        handleLoginSuccess={handleLoginSuccess}
        handleRegisterSuccess={handleRegisterSuccess}
        handleResetSuccess={handleResetSuccess}
        handleLogout={handleLogout}
        onNavigate={onNavigate}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        mobileDrawerOpen={mobileDrawerOpen}
        setMobileDrawerOpen={setMobileDrawerOpen}
        featuredEvents={featuredEvents}
        upcomingEvents={upcomingEvents}
        handleSearchSubmit={handleSearchSubmit}
      />
      {toast && (
        <div className="toast-notif">
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
`;

fs.writeFileSync('src/App.jsx', content);
console.log('Rewrote App.jsx');
