# EventPulse

EventPulse is a modern, comprehensive Event Management Platform designed to seamlessly connect event organizers (vendors) with attendees (customers). This repository contains the frontend application, built with React and Vite, featuring a sleek, responsive, and highly interactive user interface.

## Features

EventPulse is divided into several specialized portals to cater to different user roles:

### 🎭 Customer Portal
- **Discover Events:** Browse and search for upcoming events with category and location filters.
- **Event Details & Booking:** View comprehensive event pages and seamlessly book tickets.
- **My Bookings & History:** Manage upcoming reservations and view past digital tickets (with QR codes and payment receipts).
- **Favorites:** Save and track events you are interested in attending.
- **Profile & Settings:** Manage personal information, security preferences, and notification settings.

### 💼 Vendor Portal
- **Dashboard Overview:** Track key metrics such as total services, pending requests, and monthly revenue trends.
- **Service Management:** Create, edit, and manage event service listings (e.g., Photography, Catering, DJ Services).
- **Request Handling:** Review, approve, or reject incoming booking requests from clients.
- **Availability Scheduling:** Manage standard working hours and block out specific unavailable dates.
- **Business Profile:** Showcase your business details, contact information, and portfolio to prospective clients.

### 🛡️ Admin Portal (Coming Soon)
- Centralized dashboard for platform moderation and user management.

## Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Vanilla CSS with modern layout techniques (Flexbox/Grid)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** Custom React state-based routing architecture

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SaphalMaharjan0/FYPEventManagement.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd FYPAssignment/event-management-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173/`.

## Project Structure

```
src/
├── components/
│   ├── booking/       # Ticket selection and booking modals
│   ├── common/        # Shared UI (Navbar, Footer, Layouts)
│   ├── dashboard/     # Customer portal specific components
│   ├── event/         # Event cards and detailed views
│   └── vendor/        # Vendor portal specific components
├── pages/
│   ├── admin/         # Admin views
│   ├── auth/          # Login, Register, Password Reset
│   ├── customer/      # Customer-facing dashboard pages
│   ├── guest/         # Public-facing landing and discovery pages
│   └── vendor/        # Vendor-facing dashboard pages
├── data/              # Mock data for initial development
└── App.jsx            # Main routing and state management hub
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of a Final Year Project (FYP) and is for educational purposes.
