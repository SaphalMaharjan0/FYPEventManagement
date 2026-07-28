# EventPulse - Event Management & Ticket Booking System

EventPulse is a modern, premium full-stack Event Management and Ticket Booking web application designed for Customers, Vendors, and Administrators. It facilitates event hosting, service catalog management, ticket purchasing via integrated payments, and seamless event coordination.

---

## 🚀 Key Features

### 👤 Customer Features
- **Browse & Filter Events**: Explore published events by categories, search keywords, dates, and ticket prices.
- **Favorites & Saved Events**: Save favorite events to a personal wishlist.
- **Dynamic Seats Calculator**: Enforces real-time ticket capacities and seat availability when booking.
- **Mock eSewa Payment Integration**: Integrated local payment simulator allowing users to successfully checkout offline.
- **Secure Ticket QR Codes**: Unique, obfuscated booking codes (`BK-XXXX-XXXX`) mapped into high-contrast scannable QR codes.
- **PDF Ticket Download**: One-click download of the ticket card with transaction receipts and QR code using `html2pdf.js`.
- **Interactive Map Location Picker**: Set profile location coordinates dynamically using an integrated Leaflet-based Nominatim maps modal.
- **Booking Cancellation**: Instantly cancel confirmed/pending bookings, automatically releasing reserved seats.

### 💼 Vendor Features
- **Profile Configuration**: Set business details, verified markers, and payout details.
- **Availability Planner**: Plan and configure weekly service availability and block specific calendar dates dynamically.
- **Service Request Handler**: Respond to service coordination requests from event organizers.

### 🛡️ Administrator Panel
- **Comprehensive Dashboard**: View total bookings, total revenue, cumulative user growth charts, and active system summaries.
- **Booking & Revenue Analytics**: Filters out cancelled or failed bookings dynamically from reports and financial charts.
- **Manage Users, Events, and Bookings**: Create, view, update, delete, block, or verify accounts and event logs.
- **Booking Event Filters**: Filter booking logs instantly by specific events.

---

## 🛠️ Technology Stack

### Backend
- **Core**: Java 17, Spring Boot, Spring Security (JWT-based session authentication)
- **Database**: PostgreSQL / H2 Database Engine, Hibernate / Spring Data JPA
- **Communication & Notifications**: Spring Mail Service (automatic booking notifications to customer & admin alerts)

### Frontend
- **Core**: React, Vite, React Router DOM
- **UI & Icons**: Vanilla CSS custom variables design system, Lucide React icons
- **Libraries**: Leaflet.js (OpenStreetMap reverse geocoding picker), html2pdf.js (client-side PDF renderer), qrserver API

---

## ⚙️ Project Setup & Installation

### Prerequisite Tools
- **Java Development Kit (JDK 17)**
- **Node.js & npm**
- **Maven** (included wrapper `mvnw` is available)

---

### 1. Run the Backend Server
Navigate to the backend directory:
```bash
cd event-management-backend
```

Configure your email credentials in `src/main/resources/application.properties` to enable mail notifications:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

Run the application:
```bash
# On Windows PowerShell
.\mvnw spring-boot:run

# On Linux/macOS
./mvnw spring-boot:run
```
The backend server runs locally on **`http://localhost:8080`**.

---

### 2. Run the Frontend Client
Navigate to the frontend directory:
```bash
cd event-management-frontend
```

Install dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```
The application will open on **`http://localhost:5173`**.
