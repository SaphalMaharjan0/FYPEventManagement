import React, { useState, useEffect } from "react";
import { X, Calendar, CheckCircle } from "lucide-react";
import Navbar from "./components/common/Navbar";
import Hero from "./components/common/Hero";
import StatCard from "./components/dashboard/StatCard";
import BrowseCategories from "./components/common/BrowseCategories";
import EventCard from "./components/event/EventCard";
import HostBanner from "./components/common/HostBanner";
import Testimonials from "./components/common/Testimonials";
import Footer from "./components/common/Footer";
import TicketSelector from "./components/booking/TicketSelector";
import AuthLayout from "./components/common/AuthLayout";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordForm from "./pages/auth/ResetPasswordForm";
import EventListingPage from "./pages/guest/EventListingPage";
import DiscoverPage from "./pages/guest/DiscoverPage";
import EventDetailsPage from "./pages/customer/EventDetailsPage";
import CustomerLayout from "./components/dashboard/CustomerLayout";
import DashboardPage from "./pages/customer/DashboardPage";
import MyBookingsPage from "./pages/customer/MyBookingsPage";
import BookingHistoryPage from "./pages/customer/BookingHistoryPage";
import FavoritesPage from "./pages/customer/FavoritesPage";
import SettingsPage from "./pages/customer/SettingsPage";
import ProfilePage from "./pages/customer/ProfilePage";
import BookingPage from "./pages/customer/BookingPage";
import NotificationsPage from "./pages/customer/NotificationsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorLayout from "./components/vendor/VendorLayout";
import ServiceListingsPage from "./pages/vendor/ServiceListingsPage";
import AddServicePage from "./pages/vendor/AddServicePage";
import VendorRequestsPage from "./pages/vendor/RequestsPage";
import VendorAvailabilityPage from "./pages/vendor/AvailabilityPage";
import VendorSettingsPage from "./pages/vendor/SettingsPage";
import VendorProfilePage from "./pages/vendor/ProfilePage";
import { eventsData, categoriesData, testimonialsData } from "./data/events";

const pageToUrl = (page) => {
  if (!page || page === "landing") return "/";
  if (page.startsWith("customer-")) return `/customer/${page.replace("customer-", "")}`;
  if (page.startsWith("admin-")) return `/admin/${page.replace("admin-", "")}`;
  if (page.startsWith("vendor-")) return `/vendor/${page.replace("vendor-", "")}`;
  return `/${page}`;
};

const urlToPage = (path) => {
  if (!path || path === "/" || path === "") return "landing";
  if (path.startsWith("/customer/")) return `customer-${path.replace("/customer/", "")}`;
  if (path.startsWith("/admin/")) return `admin-${path.replace("/admin/", "")}`;
  if (path.startsWith("/vendor/")) return `vendor-${path.replace("/vendor/", "")}`;
  return path.substring(1);
};

export default function App() {
  const [events, setEvents] = useState(() => {
    // Attempt load from localStorage if exists
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

  // Auth Routing & Session state
  const [currentPage, setCurrentPage] = useState(() => {
    // 1. Check URL first
    const path = window.location.pathname;
    if (path && path !== "/") {
      return urlToPage(path);
    }
    
    // 2. Check local storage if no URL
    const savedPage = localStorage.getItem("eventpulse_page");
    if (savedPage) {
      // If we are recovering from storage on root path, replace the URL silently
      window.history.replaceState({}, "", pageToUrl(savedPage));
      return savedPage;
    }
    
    // 3. Fallback based on user role
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
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem("eventpulse_theme", "dark");
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem("eventpulse_theme", "light");
    }
  }, [isDarkMode]);

  // Sync events with localStorage
  useEffect(() => {
    localStorage.setItem("eventpulse_events", JSON.stringify(events));
  }, [events]);

  // Sync user with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("eventpulse_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("eventpulse_user");
    }
  }, [currentUser]);

  // Sync current page with localStorage and URL
  useEffect(() => {
    localStorage.setItem("eventpulse_page", currentPage);
    const url = pageToUrl(currentPage);
    if (window.location.pathname !== url) {
      window.history.pushState({}, "", url);
    }
  }, [currentPage]);

  // Listen for Browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(urlToPage(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Filter events whenever criteria changes
  const applyFilters = () => {
    let result = events;

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter(
        (e) => e.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    // Filter by Location
    if (locationQuery.trim() !== "") {
      const loc = locationQuery.toLowerCase();
      result = result.filter((e) => e.venue.toLowerCase().includes(loc));
    }

    setFilteredEvents(result);

    // If search returns nothing, display a toast warning
    if (result.length === 0 && (searchQuery.trim() !== "" || locationQuery.trim() !== "")) {
      showToast("No events found matching your criteria.");
    }
  };

  // Run filter on activeCategory change immediately
  useEffect(() => {
    applyFilters();
  }, [activeCategory, events]);

  const handleSearchSubmit = () => {
    setEventsPageSearch(searchQuery);
    setEventsPageLocation(locationQuery);
    setEventsPageCategory("all");
    setCurrentPage("events");
  };

  // Trigger Toast Notification
  const showToast = (message) => {
    setToast(message);
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Booking seat updates
  const handleBookingSuccess = (eventId, quantity) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id === eventId) {
          const newSeatsLeft = Math.max(0, evt.seatsLeft - quantity);
          const newPercent = Math.round((newSeatsLeft / evt.totalSeats) * 100);
          return {
            ...evt,
            seatsLeft: newSeatsLeft,
            percentAvailable: newPercent
          };
        }
        return evt;
      })
    );
    showToast(`Tickets successfully reserved!`);
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
      setRedirectAfterLogin({ page: "customer-booking", event: eventItem, quantity: qty });
      setCurrentPage("login");
      return;
    }
    setSelectedEvent(eventItem);
    setBookingQuantity(qty);
    setCurrentPage("customer-booking");
  };

  // Auth Action Handlers
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
      role: userData.role
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
    } else {
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

  const handleResetSuccess = (email) => {
    showToast(`Password reset link sent to ${email}`);
    setCurrentPage("login");
  };

  // Split events for grid display
  const featuredEvents = filteredEvents.filter((e) => e.featured);
  const upcomingEvents = filteredEvents.filter((e) => !e.featured);

  const isCustomerPage = currentPage.startsWith("customer-");
  const isAdminPage = currentPage === "admin-dashboard";
  const isVendorPage = currentPage.startsWith("vendor-");

  if (isCustomerPage) {
    return (
      <CustomerLayout 
        currentPage={currentPage} 
        onNavigate={(page) => {
          if (page === "events" || page === "discover" || page === "customer-events") {
            setEventsPageCategory("all");
            setEventsPageSearch("");
            setEventsPageLocation("");
          }
          setCurrentPage(page);
        }} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      >
        {currentPage === "customer-dashboard" && (
          <DashboardPage currentUser={currentUser} events={events} onBookClick={handleBookClick} onNavigate={setCurrentPage} />
        )}
        {currentPage === "customer-events" && (
          <EventListingPage
            events={events}
            onBookClick={handleBookClick}
            initialCategory={eventsPageCategory}
            initialSearchQuery={eventsPageSearch}
            initialLocationQuery={eventsPageLocation}
            isDashboardContext={true}
          />
        )}
        {currentPage === "customer-bookings" && (
          <MyBookingsPage events={events} />
        )}
        {currentPage === "customer-history" && (
          <BookingHistoryPage events={events} />
        )}
        {currentPage === "customer-favorites" && (
          <FavoritesPage events={events} onBookClick={handleBookClick} />
        )}
        {currentPage === "customer-settings" && (
          <SettingsPage />
        )}
        {currentPage === "customer-profile" && (
          <ProfilePage currentUser={currentUser} onUpdateUser={setCurrentUser} />
        )}
        {currentPage === "customer-notifications" && (
          <NotificationsPage />
        )}
        {currentPage === "customer-booking" && (
          <BookingPage 
            event={selectedEvent} 
            initialQuantity={bookingQuantity} 
            onBookingSuccess={handleBookingSuccess} 
            onNavigate={setCurrentPage} 
          />
        )}
        {currentPage === "customer-event-details" && (
          <EventDetailsPage
            event={selectedEvent}
            allEvents={events}
            onNavigate={(page, evt) => {
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
            }}
            onInitiateBooking={handleInitiateBooking}
            currentUser={currentUser}
            isDashboardContext={true}
          />
        )}
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
        {currentPage === "vendor-dashboard" && <VendorDashboard currentUser={currentUser} />}
        {currentPage === "vendor-services" && <ServiceListingsPage onNavigate={setCurrentPage} />}
        {currentPage === "vendor-add-service" && <AddServicePage />}
        {currentPage === "vendor-requests" && <VendorRequestsPage />}
        {currentPage === "vendor-availability" && <VendorAvailabilityPage />}
        {currentPage === "vendor-settings" && <VendorSettingsPage />}
        {currentPage === "vendor-profile" && <VendorProfilePage currentUser={currentUser} onUpdateUser={setCurrentUser} />}
      </VendorLayout>
    );
  }

  return (
    <>
      {/* Scrollable container & Header */}
      {!isAdminPage && (
        <Navbar 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onMobileDrawerOpen={() => setMobileDrawerOpen(true)} 
          onNavigate={(page) => {
            if (page === "events" || page === "discover") {
              setEventsPageCategory("all");
              setEventsPageSearch("");
              setEventsPageLocation("");
            }
            setCurrentPage(page);
          }} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          isAuthPage={currentPage !== "landing"}
        />
      )}
      
      {isAdminPage && (
        <Navbar 
          onMobileDrawerOpen={() => setMobileDrawerOpen(true)} 
          onNavigate={setCurrentPage} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          isAuthPage={true}
        />
      )}

      {currentPage !== "landing" ? (
        <>
          {currentPage === "admin-dashboard" && <AdminDashboard currentUser={currentUser} />}
          {currentPage === "events" && (
            <EventListingPage
              events={events}
              onBookClick={handleBookClick}
              initialCategory={eventsPageCategory}
              initialSearchQuery={eventsPageSearch}
              initialLocationQuery={eventsPageLocation}
            />
          )}
          {currentPage === "discover" && (
            <DiscoverPage
              events={events}
              categories={categoriesData}
              onBookClick={handleBookClick}
              setActiveCategory={(cat) => {
                setEventsPageCategory(cat);
                setCurrentPage("events");
              }}
            />
          )}
          {currentPage === "event-details" && (
            <EventDetailsPage
              event={selectedEvent}
              allEvents={events}
              onNavigate={(page, evt) => {
                if (evt) {
                  setSelectedEvent(evt);
                }
                setCurrentPage(page);
              }}
              onInitiateBooking={handleInitiateBooking}
              currentUser={currentUser}
            />
          )}
          {(currentPage === "login" || currentPage === "register" || currentPage === "forgot") && (
            <AuthLayout onLogoClick={() => setCurrentPage("landing")}>
              {currentPage === "login" && (
                <LoginPage
                  onNavigateToRegister={() => setCurrentPage("register")}
                  onNavigateToForgotPassword={() => setCurrentPage("forgot")}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {currentPage === "register" && (
                <RegisterPage
                  onNavigateToLogin={() => setCurrentPage("login")}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              )}
              {currentPage === "forgot" && (
                <ResetPasswordForm
                  onNavigateToLogin={() => setCurrentPage("login")}
                  onResetSuccess={handleResetSuccess}
                />
              )}
            </AuthLayout>
          )}
          {(currentPage === "events" || currentPage === "discover" || currentPage === "event-details") && (
            <Footer />
          )}
        </>
      ) : (
        <>

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Stats Counter Row */}
      <StatCard />

      {/* Main Events Grid section */}
      <main className="container" id="featured" style={{ minHeight: "20rem" }}>
        
        {/* Category-based header info if filter is active */}
        {activeCategory !== "all" && (
          <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Filtering by:</span>
            <span style={{
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.35rem 0.75rem",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}>
              {activeCategory.toUpperCase()}
              <X 
                size={14} 
                style={{ cursor: "pointer" }} 
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                  setLocationQuery("");
                }} 
              />
            </span>
          </div>
        )}

        {/* Featured Events Grid */}
        <div className="section-header">
          <div className="section-title-area">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">Hand-picked experiences you won't want to miss</p>
          </div>
          <span style={{ cursor: "pointer" }} onClick={() => { setEventsPageCategory("all"); setCurrentPage("events"); }} className="section-link">
            <span>View all</span>
            <span>&rarr;</span>
          </span>
        </div>

        {featuredEvents.length > 0 ? (
          <div className="cards-grid">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onBookClick={handleBookClick} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
            No featured events match the active filters.
          </p>
        )}

        {/* Categories Carousel / Browse Area */}
        <BrowseCategories
          activeCategory={activeCategory}
          setActiveCategory={(cat) => {
            setEventsPageCategory(cat);
            setCurrentPage("events");
          }}
          categories={categoriesData}
        />

        {/* Upcoming Events Grid */}
        <div className="section-header" style={{ marginTop: "4rem" }}>
          <div className="section-title-area">
            <h2 className="section-title">Upcoming This Month</h2>
            <p className="section-subtitle">Trending events in your neighborhood</p>
          </div>
          <span style={{ cursor: "pointer" }} onClick={() => { setEventsPageCategory("all"); setCurrentPage("events"); }} className="section-link">
            <span>See more</span>
            <span>&rsaquo;</span>
          </span>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="cards-grid">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onBookClick={handleBookClick} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
            No upcoming events match the active filters.
          </p>
        )}

        {/* Host Event Banner invitation */}
        <div id="host" style={{ paddingTop: "2rem" }} onClick={() => setCurrentPage("register")}>
          <HostBanner />
        </div>

        {/* Testimonials Review Feed */}
        <Testimonials testimonials={testimonialsData} />
      </main>

      {/* Footer Details */}
      <Footer />

      {/* Booking Overlay Modal dialog */}
      {isBookingModalOpen && selectedEvent && (
        <TicketSelector
          event={selectedEvent}
          initialQuantity={bookingQuantity}
          onClose={() => setIsBookingModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
        </>
      )}

      {/* Interactive Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setMobileDrawerOpen(false)}></div>
          <div className={`mobile-nav-drawer ${mobileDrawerOpen ? "open" : ""}`}>
            <button 
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", color: "var(--color-white)", cursor: "pointer" }}
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
                  setEventsPageCategory("all");
                  setEventsPageSearch("");
                  setEventsPageLocation("");
                  setCurrentPage("events");
                }}
              >
                Events
              </span>
              <span 
                className="mobile-nav-link" 
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setEventsPageCategory("all");
                  setEventsPageSearch("");
                  setEventsPageLocation("");
                  setCurrentPage("events");
                }}
              >
                Discover
              </span>
            </div>
            
            <div className="mobile-actions">
              {currentUser ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: currentUser.role === "admin" ? "var(--color-red-500)" : currentUser.role === "vendor" ? "#16a34a" : "var(--color-blue-600)",
                      color: "var(--color-white)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700
                    }}>
                      {currentUser.fullName ? currentUser.fullName.split(" ").map(n => n[0]).join("") : "U"}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ color: "var(--color-white)", fontSize: "0.85rem", fontWeight: 700 }}>{currentUser.fullName}</span>
                      <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.7rem", textTransform: "uppercase" }}>{currentUser.role}</span>
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
                  <button className="btn-mobile-login" onClick={() => { setMobileDrawerOpen(false); setCurrentPage("login"); }}>Log In</button>
                  <button className="btn-mobile-getstarted" onClick={() => { setMobileDrawerOpen(false); setCurrentPage("register"); }}>Get Started</button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast Notification alert */}
      {toast && (
        <div className="toast-notif">
          <CheckCircle size={16} className="toast-icon" />
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
