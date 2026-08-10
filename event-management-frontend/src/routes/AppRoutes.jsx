import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import CustomerLayout from '../components/dashboard/CustomerLayout';
import VendorLayout from '../components/vendor/VendorLayout';
import AuthLayout from '../components/common/AuthLayout';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// Pages
import DashboardPage from '../pages/customer/DashboardPage';
import EventListingPage from '../pages/guest/EventListingPage';
import MyBookingsPage from '../pages/customer/MyBookingsPage';
import BookingHistoryPage from '../pages/customer/BookingHistoryPage';
import FavoritesPage from '../pages/customer/FavoritesPage';
import SettingsPage from '../pages/customer/SettingsPage';
import ProfilePage from '../pages/customer/ProfilePage';
import NotificationsPage from '../pages/customer/NotificationsPage';
import BookingPage from '../pages/customer/BookingPage';
import EventDetailsPage from '../pages/customer/EventDetailsPage';
import EsewaSuccessPage from '../pages/customer/EsewaSuccessPage';
import EsewaFailurePage from '../pages/customer/EsewaFailurePage';
import MockEsewaPage from '../pages/customer/MockEsewaPage';
import MockKhaltiPage from '../pages/customer/MockKhaltiPage';
import KhaltiSuccessPage from '../pages/customer/KhaltiSuccessPage';

import VendorDashboard from '../pages/vendor/VendorDashboard';
import ServiceListingsPage from '../pages/vendor/ServiceListingsPage';
import AddServicePage from '../pages/vendor/AddServicePage';
import VendorRequestsPage from '../pages/vendor/RequestsPage';
import VendorAvailabilityPage from '../pages/vendor/AvailabilityPage';
import VendorSettingsPage from '../pages/vendor/SettingsPage';
import VendorProfilePage from '../pages/vendor/ProfilePage';
import VendorNotificationsPage from '../pages/vendor/VendorNotificationsPage';

import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import ManageVendorsPage from '../pages/admin/ManageVendorsPage';
import ManageBookingsPage from '../pages/admin/ManageBookingsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';

import DiscoverPage from '../pages/guest/DiscoverPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordForm from '../pages/auth/ResetPasswordForm';
import NewPasswordPage from '../pages/auth/NewPasswordPage';

// Home components
import Hero from '../components/common/Hero';
import StatCard from '../components/dashboard/StatCard';
import BrowseCategories from '../components/common/BrowseCategories';
import EventCard from '../components/event/EventCard';
import HostBanner from '../components/common/HostBanner';
import Testimonials from '../components/common/Testimonials';
import { categoriesData, testimonialsData } from '../data/events';
import { X } from 'lucide-react';

export default function AppRoutes({
  currentUser,
  onUpdateUser,
  events,
  activeCategory, setActiveCategory,
  searchQuery, setSearchQuery,
  locationQuery, setLocationQuery,
  eventsPageCategory, setEventsPageCategory,
  eventsPageSearch, setEventsPageSearch,
  eventsPageLocation, setEventsPageLocation,
  handleBookClick,
  handleInitiateBooking,
  handleBookingSuccess,
  selectedEvent, setSelectedEvent,
  bookingQuantity, setBookingQuantity,
  handleLoginSuccess,
  handleRegisterSuccess,
  handleResetSuccess,
  handleLogout,
  onNavigate,
  isDarkMode, toggleDarkMode,
  mobileDrawerOpen, setMobileDrawerOpen,
  featuredEvents, upcomingEvents,
  handleSearchSubmit
}) {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot', '/reset-password'].includes(location.pathname);
  const isDashboard = location.pathname.startsWith('/customer') || location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin');
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isDashboard && !isAuthPage && (
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
            onNavigate(page);
          }} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          isAuthPage={isAuthPage}
          solidBg={!isLandingPage}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onSearchSubmit={handleSearchSubmit}
            />
            <StatCard />
            <main className="container" id="featured" style={{ minHeight: "20rem" }}>
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

              <div className="section-header">
                <div className="section-title-area">
                  <h2 className="section-title">Featured Events</h2>
                  <p className="section-subtitle">Hand-picked experiences you won't want to miss</p>
                </div>
                <span style={{ cursor: "pointer" }} onClick={() => { setEventsPageCategory("all"); onNavigate("events"); }} className="section-link">
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

              <BrowseCategories
                activeCategory={activeCategory}
                setActiveCategory={(cat) => {
                  setEventsPageCategory(cat);
                  onNavigate("events");
                }}
                categories={categoriesData}
              />

              <div className="section-header" style={{ marginTop: "4rem" }}>
                <div className="section-title-area">
                  <h2 className="section-title">Upcoming This Month</h2>
                  <p className="section-subtitle">Trending events in your neighborhood</p>
                </div>
                <span style={{ cursor: "pointer" }} onClick={() => { setEventsPageCategory("all"); onNavigate("events"); }} className="section-link">
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

              <div id="host" style={{ paddingTop: "2rem" }} onClick={() => onNavigate("register")}>
                <HostBanner />
              </div>

              <Testimonials testimonials={testimonialsData} />
            </main>
            <Footer />
          </>
        } />

        <Route path="/events" element={
          <>
            <EventListingPage
              events={events}
              onBookClick={handleBookClick}
              initialCategory={eventsPageCategory}
              initialSearchQuery={eventsPageSearch}
              initialLocationQuery={eventsPageLocation}
            />
            <Footer />
          </>
        } />

        <Route path="/discover" element={
          <>
            <DiscoverPage
              events={events}
              categories={categoriesData}
              onBookClick={handleBookClick}
              setActiveCategory={(cat) => {
                setEventsPageCategory(cat);
                onNavigate("events");
              }}
            />
            <Footer />
          </>
        } />

        <Route path="/event-details" element={
          <>
            <EventDetailsPage
              event={selectedEvent}
              allEvents={events}
              onNavigate={(page, evt) => {
                if (evt) setSelectedEvent(evt);
                onNavigate(page);
              }}
              onInitiateBooking={handleInitiateBooking}
              currentUser={currentUser}
            />
            <Footer />
          </>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthLayout onLogoClick={() => onNavigate("landing")}>
            <LoginPage
              onNavigateToRegister={() => onNavigate("register")}
              onNavigateToForgotPassword={() => onNavigate("forgot")}
              onLoginSuccess={handleLoginSuccess}
            />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout onLogoClick={() => onNavigate("landing")}>
            <RegisterPage
              onNavigateToLogin={() => onNavigate("login")}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </AuthLayout>
        } />
        <Route path="/forgot" element={
          <AuthLayout onLogoClick={() => onNavigate("landing")}>
            <ResetPasswordForm
              onNavigateToLogin={() => onNavigate("login")}
              onResetSuccess={handleResetSuccess}
            />
          </AuthLayout>
        } />
        <Route path="/reset-password" element={
          <AuthLayout onLogoClick={() => onNavigate("landing")}>
            <NewPasswordPage
              onNavigateToLogin={() => onNavigate("login")}
            />
          </AuthLayout>
        } />

        {/* Customer Routes */}
        <Route path="/customer" element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={['customer']}>
            <CustomerLayout 
              currentPage={location.pathname.replace('/customer/', 'customer-')} 
              onNavigate={(page) => {
                if (page === "events" || page === "discover" || page === "customer-events") {
                  setEventsPageCategory("all");
                  setEventsPageSearch("");
                  setEventsPageLocation("");
                }
                onNavigate(page);
              }} 
              currentUser={currentUser} 
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage currentUser={currentUser} events={events} onBookClick={handleBookClick} onNavigate={onNavigate} />} />
          <Route path="events" element={<EventListingPage events={events} onBookClick={handleBookClick} initialCategory={eventsPageCategory} initialSearchQuery={eventsPageSearch} initialLocationQuery={eventsPageLocation} isDashboardContext={true} />} />
          <Route path="bookings" element={<MyBookingsPage events={events} onBookClick={handleBookClick} onContinuePurchase={handleInitiateBooking} />} />
          <Route path="history" element={<BookingHistoryPage events={events} />} />
          <Route path="favorites" element={<FavoritesPage events={events} onBookClick={handleBookClick} />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage currentUser={currentUser} onUpdateUser={onUpdateUser} />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="booking" element={<BookingPage event={selectedEvent} initialQuantity={bookingQuantity} onBookingSuccess={handleBookingSuccess} onNavigate={onNavigate} />} />
          <Route path="event-details" element={
            <EventDetailsPage
              event={selectedEvent}
              allEvents={events}
              onNavigate={(page, evt) => {
                if (evt) setSelectedEvent(evt);
                if (page === "landing") onNavigate("customer-dashboard");
                else if (page === "events") onNavigate("customer-events");
                else if (page === "event-details") onNavigate("customer-event-details");
                else onNavigate(page);
              }}
              onInitiateBooking={handleInitiateBooking}
              currentUser={currentUser}
              isDashboardContext={true}
            />
          } />
          <Route path="esewa-success" element={<EsewaSuccessPage onNavigate={onNavigate} />} />
          <Route path="esewa-failure" element={<EsewaFailurePage onNavigate={onNavigate} />} />
          <Route path="mock-esewa" element={<MockEsewaPage />} />
          <Route path="mock-khalti" element={<MockKhaltiPage />} />
          <Route path="khalti-success" element={<KhaltiSuccessPage />} />
        </Route>

        {/* Vendor Routes */}
        <Route path="/vendor" element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={['vendor']}>
            <VendorLayout 
              currentPage={location.pathname.replace('/vendor/', 'vendor-')}
              onNavigate={onNavigate}
              currentUser={currentUser}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<VendorDashboard currentUser={currentUser} />} />
          <Route path="services" element={<ServiceListingsPage onNavigate={onNavigate} />} />
          <Route path="add-service" element={<AddServicePage />} />
          <Route path="requests" element={<VendorRequestsPage />} />
          <Route path="availability" element={<VendorAvailabilityPage />} />
          <Route path="settings" element={<VendorSettingsPage />} />
          <Route path="profile" element={<VendorProfilePage currentUser={currentUser} onUpdateUser={onUpdateUser} />} />
          <Route path="notifications" element={<VendorNotificationsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={['admin', 'administrator']}>
            <AdminLayout 
              currentPage={location.pathname.replace('/admin/', 'admin-')}
              onNavigate={onNavigate}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard currentUser={currentUser} />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="events" element={<ManageEventsPage />} />
          <Route path="vendors" element={<ManageVendorsPage />} />
          <Route path="bookings" element={<ManageBookingsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="profile" element={<AdminProfilePage currentUser={currentUser} />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
