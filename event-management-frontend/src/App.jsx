import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import TicketSelector from "./components/booking/TicketSelector";
import CustomerLayout from "./components/dashboard/CustomerLayout";
import VendorLayout from "./components/vendor/VendorLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthPages from "./pages/auth/AuthPages";
import CustomerPages from "./pages/customer/CustomerPages";
import LandingPage from "./pages/guest/LandingPage";
import PublicPages from "./pages/guest/PublicPages";
import VendorPages from "./pages/vendor/VendorPages";
import { eventsData, categoriesData, testimonialsData } from "./data/events";

const pageToUrl = (page) => {
  if (!page || page === "landing") return "/";
  if (page.startsWith("customer-"))
    return `/customer/${page.replace("customer-", "")}`;
  if (page.startsWith("admin-")) return `/admin/${page.replace("admin-", "")}`;
  if (page.startsWith("vendor-"))
    return `/vendor/${page.replace("vendor-", "")}`;
  return `/${page}`;
};

const urlToPage = (path) => {
  if (!path || path === "/" || path === "") return "landing";
  if (path.startsWith("/customer/"))
    return `customer-${path.replace("/customer/", "")}`;
  if (path.startsWith("/admin/")) return `admin-${path.replace("/admin/", "")}`;
  if (path.startsWith("/vendor/"))
    return `vendor-${path.replace("/vendor/", "")}`;
  return path.substring(1);
};

export default function App() {
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
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path && path !== "/") {
      return urlToPage(path);
    }

    const savedPage = localStorage.getItem("eventpulse_page");
    if (savedPage) {
      window.history.replaceState({}, "", pageToUrl(savedPage));
      return savedPage;
    }

    const savedUserStr = localStorage.getItem("eventpulse_user");
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        if (user.role === "admin") return "admin-dashboard";
        if (user.role === "vendor") return "vendor-dashboard";
        if (user.role === "customer") return "customer-dashboard";
      } catch (e) {
        // Fallback on parse error
      }
    }
    return "landing";
  });

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

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("eventpulse_theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
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

  useEffect(() => {
    localStorage.setItem("eventpulse_page", currentPage);
    const url = pageToUrl(currentPage);
    if (window.location.pathname !== url) {
      window.history.pushState({}, "", url);
    }
  }, [currentPage]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(urlToPage(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const showToast = (message) => {
    setToast(message);
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const applyFilters = () => {
    let result = events;

    if (activeCategory !== "all") {
      result = result.filter(
        (e) => e.category.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q),
      );
    }

    if (locationQuery.trim() !== "") {
      const loc = locationQuery.toLowerCase();
      result = result.filter((e) => e.venue.toLowerCase().includes(loc));
    }

    setFilteredEvents(result);

    if (
      result.length === 0 &&
      (searchQuery.trim() !== "" || locationQuery.trim() !== "")
    ) {
      showToast("No events found matching your criteria.");
    }
  };

  useEffect(() => {
    applyFilters();
  }, [activeCategory, searchQuery, locationQuery, events]);

  const handleSearchSubmit = () => {
    setEventsPageSearch(searchQuery);
    setEventsPageLocation(locationQuery);
    setEventsPageCategory("all");
    setCurrentPage("events");
  };

  const handleBookingSuccess = (eventId, quantity) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id === eventId) {
          const newSeatsLeft = Math.max(0, evt.seatsLeft - quantity);
          const newPercent = Math.round((newSeatsLeft / evt.totalSeats) * 100);
          return {
            ...evt,
            seatsLeft: newSeatsLeft,
            percentAvailable: newPercent,
          };
        }
        return evt;
      }),
    );
    showToast("Tickets successfully reserved!");
  };

  const handleBookClick = (eventItem) => {
    setSelectedEvent(eventItem);
    if (currentUser && currentUser.role === "customer") {
      setCurrentPage("customer-event-details");
    } else {
      setCurrentPage("event-details");
    }
  };

  const handleInitiateBooking = (eventItem, qty) => {
    if (!currentUser) {
      showToast("Please log in to book tickets.");
      setRedirectAfterLogin({
        page: "customer-booking",
        event: eventItem,
        quantity: qty,
      });
      setCurrentPage("login");
      return;
    }
    setSelectedEvent(eventItem);
    setBookingQuantity(qty);
    setCurrentPage("customer-booking");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setCurrentUser(null);
      setCurrentPage("landing");
      showToast("Logged out successfully.");
    }
  };

  const handleRegisterSuccess = (userData) => {
    showToast(`Account created! Welcome, ${userData.firstName}.`);
    setCurrentUser({
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      role: userData.role,
    });

    if (redirectAfterLogin) {
      setSelectedEvent(redirectAfterLogin.event);
      setBookingQuantity(redirectAfterLogin.quantity);
      setIsBookingModalOpen(true);
      setCurrentPage(redirectAfterLogin.page);
      setRedirectAfterLogin(null);

      if (userData.role === "admin") {
        setCurrentPage("admin-dashboard");
      } else if (userData.role === "vendor") {
        setCurrentPage("vendor-dashboard");
      } else if (userData.role === "customer") {
        setCurrentPage("customer-dashboard");
      } else {
        setCurrentPage("landing");
      }
    }
  };

  const handleLoginSuccess = (userData) => {
    showToast(`Welcome back, ${userData.fullName}!`);
    setCurrentUser(userData);

    if (redirectAfterLogin) {
      setSelectedEvent(redirectAfterLogin.event);
      setBookingQuantity(redirectAfterLogin.quantity);
      setIsBookingModalOpen(true);
      setCurrentPage(redirectAfterLogin.page);
      setRedirectAfterLogin(null);
    } else if (userData.role === "admin") {
      setCurrentPage("admin-dashboard");
    } else if (userData.role === "vendor") {
      setCurrentPage("vendor-dashboard");
    } else if (userData.role === "customer") {
      setCurrentPage("customer-dashboard");
    } else {
      setCurrentPage("landing");
    }
  };

  const handleResetSuccess = (email) => {
    showToast(`Password reset link sent to ${email}`);
    setCurrentPage("login");
  };

  const resetEventFilters = () => {
    setEventsPageCategory("all");
    setEventsPageSearch("");
    setEventsPageLocation("");
  };

  const handleNavigate = (page) => {
    if (
      page === "events" ||
      page === "discover" ||
      page === "customer-events"
    ) {
      resetEventFilters();
    }
    setCurrentPage(page);
  };

  const handleDiscoverCategorySelect = (cat) => {
    setEventsPageCategory(cat);
    setCurrentPage("events");
  };

  const handleEventDetailsNavigate = (page, evt) => {
    if (evt) {
      setSelectedEvent(evt);
    }
    if (page === "landing") {
      setCurrentPage("customer-dashboard");
    } else if (page === "events") {
      setCurrentPage("customer-events");
    } else if (page === "event-details") {
      setCurrentPage("customer-event-details");
    } else {
      setCurrentPage(page);
    }
  };

  const featuredEvents = filteredEvents.filter((e) => e.featured);
  const upcomingEvents = filteredEvents.filter((e) => !e.featured);

  const isCustomerPage = currentPage.startsWith("customer-");
  const isAdminPage = currentPage === "admin-dashboard";
  const isVendorPage = currentPage.startsWith("vendor-");
  const shouldShowPublicFooter =
    currentPage === "events" ||
    currentPage === "discover" ||
    currentPage === "event-details";

  if (isCustomerPage) {
    return (
      <CustomerLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      >
        <CustomerPages
          currentPage={currentPage}
          currentUser={currentUser}
          events={events}
          selectedEvent={selectedEvent}
          bookingQuantity={bookingQuantity}
          eventsPageCategory={eventsPageCategory}
          eventsPageSearch={eventsPageSearch}
          eventsPageLocation={eventsPageLocation}
          onBookClick={handleBookClick}
          onBookingSuccess={handleBookingSuccess}
          onNavigate={handleEventDetailsNavigate}
          onUpdateUser={setCurrentUser}
          onInitiateBooking={handleInitiateBooking}
          onNavigateToCustomerDashboard={setCurrentPage}
        />
      </CustomerLayout>
    );
  }

  if (isVendorPage) {
    return (
      <VendorLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      >
        <VendorPages
          currentPage={currentPage}
          currentUser={currentUser}
          onNavigate={setCurrentPage}
          onUpdateUser={setCurrentUser}
        />
      </VendorLayout>
    );
  }

  return (
    <>
      {!isAdminPage && (
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onMobileDrawerOpen={() => setMobileDrawerOpen(true)}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          isAuthPage={currentPage !== "landing"}
          activePage={currentPage}
        />
      )}

      {isAdminPage && (
        <Navbar
          onMobileDrawerOpen={() => setMobileDrawerOpen(true)}
          onNavigate={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          isAuthPage={true}
          activePage={currentPage}
        />
      )}

      {currentPage !== "landing" ? (
        <>
          {currentPage === "admin-dashboard" && (
            <AdminDashboard currentUser={currentUser} />
          )}
          {(currentPage === "events" ||
            currentPage === "discover" ||
            currentPage === "event-details") && (
            <PublicPages
              currentPage={currentPage}
              events={events}
              categories={categoriesData}
              selectedEvent={selectedEvent}
              eventsPageCategory={eventsPageCategory}
              eventsPageSearch={eventsPageSearch}
              eventsPageLocation={eventsPageLocation}
              onBookClick={handleBookClick}
              onEventDetailsNavigate={handleEventDetailsNavigate}
              onInitiateBooking={handleInitiateBooking}
              currentUser={currentUser}
              onDiscoverCategorySelect={handleDiscoverCategorySelect}
            />
          )}
          <AuthPages
            currentPage={currentPage}
            onLogoClick={() => setCurrentPage("landing")}
            onNavigateToRegister={() => setCurrentPage("register")}
            onNavigateToForgotPassword={() => setCurrentPage("forgot")}
            onNavigateToLogin={() => setCurrentPage("login")}
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
            onResetSuccess={handleResetSuccess}
          />
          {shouldShowPublicFooter && <Footer />}
        </>
      ) : (
        <>
          <LandingPage
            categories={categoriesData}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            onSearchSubmit={handleSearchSubmit}
            featuredEvents={featuredEvents}
            upcomingEvents={upcomingEvents}
            onBookClick={handleBookClick}
            onViewAllEvents={() => {
              resetEventFilters();
              setCurrentPage("events");
            }}
            onCategorySelect={(cat) => {
              setEventsPageCategory(cat);
              setCurrentPage("events");
            }}
            onResetFilters={() => {
              setActiveCategory("all");
              setSearchQuery("");
              setLocationQuery("");
            }}
            onNavigateToRegister={() => setCurrentPage("register")}
            testimonials={testimonialsData}
          />
          <Footer />
        </>
      )}

      {isBookingModalOpen && selectedEvent && (
        <TicketSelector
          event={selectedEvent}
          initialQuantity={bookingQuantity}
          onClose={() => setIsBookingModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {mobileDrawerOpen && (
        <>
          <div
            className="drawer-overlay"
            onClick={() => setMobileDrawerOpen(false)}
          ></div>
          <div
            className={`mobile-nav-drawer ${mobileDrawerOpen ? "open" : ""}`}
          >
            <button
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                color: "var(--color-white)",
                cursor: "pointer",
              }}
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <div className="mobile-nav-links">
              <span
                className="mobile-nav-link"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  resetEventFilters();
                  setCurrentPage("events");
                }}
              >
                Events
              </span>
              <span
                className="mobile-nav-link"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  resetEventFilters();
                  setCurrentPage("discover");
                }}
              >
                Discover
              </span>
            </div>

            <div className="mobile-actions">
              {currentUser ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor:
                          currentUser.role === "admin"
                            ? "var(--color-red-500)"
                            : currentUser.role === "vendor"
                              ? "#16a34a"
                              : "var(--color-blue-600)",
                        color: "var(--color-white)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {currentUser.fullName
                        ? currentUser.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U"}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          color: "var(--color-white)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        {currentUser.fullName}
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.6)",
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-mobile-login"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      handleLogout();
                    }}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="btn-mobile-login"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setCurrentPage("login");
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className="btn-mobile-getstarted"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setCurrentPage("register");
                    }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="toast-notif">
          <CheckCircle size={16} className="toast-icon" />
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
