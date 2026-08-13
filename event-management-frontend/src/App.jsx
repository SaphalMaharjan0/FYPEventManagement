import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useFetch } from "./hooks/useFetch";

const pageToUrl = (page) => {
  if (!page || page === "landing") return "/";
  if (page.startsWith("customer-")) return `/customer/${page.replace("customer-", "")}`;
  if (page.startsWith("admin-")) return `/admin/${page.replace("admin-", "")}`;
  if (page.startsWith("vendor-")) return `/vendor/${page.replace("vendor-", "")}`;
  if (page === "events") return "/events";
  if (page === "discover") return "/discover";
  if (page === "event-details") return "/event-details";
  if (page === "login") return "/login";
  if (page === "register") return "/register";
  if (page === "forgot") return "/forgot";
  return `/${page}`;
};
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import ConfirmModal from "./components/common/ConfirmModal";

export default function App() {
  const navigate = useNavigate();
  const fetchWithAuth = useFetch();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchWithAuth('/api/events');
        if (data && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to load events from backend", err);
      }
    };
    loadEvents();
  }, [fetchWithAuth]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [customAlert, setCustomAlert] = useState(null);

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      // Ensure we don't try to render objects directly
      const textMessage = typeof message === 'object' ? JSON.stringify(message) : String(message);
      setCustomAlert(textMessage);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const [eventsPageCategory, setEventsPageCategory] = useState("all");
  const [eventsPageSearch, setEventsPageSearch] = useState("");
  const [eventsPageLocation, setEventsPageLocation] = useState("");

  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const sessionStart = localStorage.getItem('session_start_time');
      const SIX_HOURS = 6 * 60 * 60 * 1000;
      
      if (sessionStart && Date.now() - parseInt(sessionStart, 10) > SIX_HOURS) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('session_start_time');
        return null;
      }

      if (savedUser && savedUser !== 'undefined') {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user');
    }
    return null;
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

  // Session validation & Server connectivity check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && currentUser) {
      // Use a public or role-appropriate endpoint to check token and backend connectivity
      const endpoint = currentUser.role?.toLowerCase() === 'administrator' ? '/api/admin/dashboard' : '/api/customer/dashboard-stats';
      fetch(`http://localhost:8080${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('session_start_time');
          setCurrentUser(null);
          window.location.reload();
        }
      })
      .catch(err => {
        console.error("Backend server is unreachable. Logging out.", err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('session_start_time');
        setCurrentUser(null);
      });
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
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    onNavigate("landing");
    showToast("Logged out successfully.");
    setShowLogoutModal(false);
  };

  const handleRegisterSuccess = (userData) => {
    if (!userData) {
      showToast("Account created successfully!");
      return;
    }
    const name = userData.fullName || userData.name || "User";
    showToast(`Account created! Welcome, ${name}.`);
    setCurrentUser({ name: name, email: userData.email, role: userData.role });
    if (redirectAfterLogin) {
      setSelectedEvent(redirectAfterLogin.event);
      setBookingQuantity(redirectAfterLogin.quantity);
      setIsBookingModalOpen(true);
      onNavigate(redirectAfterLogin.page);
      setRedirectAfterLogin(null);
    } else {
      if (userData.role === "admin" || userData.role === "administrator") onNavigate("admin-dashboard");
      else if (userData.role === "vendor") onNavigate("vendor-dashboard");
      else if (userData.role === "customer") onNavigate("customer-dashboard");
      else onNavigate("landing");
    }
  };

  const handleLoginSuccess = (userData) => {
    showToast(`Welcome back, ${userData.fullName}!`);
    setCurrentUser(userData);
    if (redirectAfterLogin) {
      setSelectedEvent(redirectAfterLogin.event);
      setBookingQuantity(redirectAfterLogin.quantity);
      setIsBookingModalOpen(true);
      onNavigate(redirectAfterLogin.page);
      setRedirectAfterLogin(null);
    } else {
      if (userData.role === "admin" || userData.role === "administrator") onNavigate("admin-dashboard");
      else if (userData.role === "vendor") onNavigate("vendor-dashboard");
      else if (userData.role === "customer") onNavigate("customer-dashboard");
      else onNavigate("landing");
    }
  };

  const handleResetSuccess = (email) => {
    showToast(`Password reset link sent to ${email}`);
    onNavigate("login");
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const upcomingEvents = filteredEvents.filter(e => !e.featured);

  return (
    <SettingsProvider currentUser={currentUser}>
    <FavoritesProvider currentUser={currentUser}>
      <AppRoutes
        onUpdateUser={handleUpdateUser}
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

      {customAlert && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "0.75rem",
            padding: "2rem", width: "400px", maxWidth: "90%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>
              Notification
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "1.5rem", whiteSpace: "pre-wrap" }}>
              {customAlert}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setCustomAlert(null)}
                style={{
                  padding: "0.5rem 1.5rem", backgroundColor: "#3b82f6",
                  color: "white", border: "none",
                  borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmModal 
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        confirmText="Log Out"
        confirmColor="#ef4444"
      />
    </FavoritesProvider>
    </SettingsProvider>
  );
}
