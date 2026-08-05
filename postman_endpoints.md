# Backend API Endpoints for Postman

This document contains a comprehensive list of all REST API endpoints currently available in the backend for testing via Postman, including expected JSON request bodies.

Most protected endpoints will require an `Authorization: Bearer <token>` header, which you can obtain by hitting the `/api/auth/login` endpoint.

---

## 🔐 Auth (`/api/auth`)
*Endpoints for user authentication and password management.*

### `POST /api/auth/register` (Create a new account)
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "CUSTOMER" 
}
```
*(role defaults to CUSTOMER if not provided)*

### `POST /api/auth/login` (Authenticate and receive JWT token)
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### `POST /api/auth/forgot-password` (Initiate password reset)
```json
{
  "email": "john@example.com"
}
```

### `POST /api/auth/reset-password` (Complete password reset)
```json
{
  "token": "reset-token-received-in-email",
  "newPassword": "newPassword123"
}
```

---

## 👑 Admin (`/api/admin`)
*Endpoints for administrative tasks. Requires Admin role.*

- `GET /api/admin/dashboard` (Get dashboard statistics)
- `GET /api/admin/users` (List all users)
- `GET /api/admin/events` (List all events)
- `GET /api/admin/vendors` (List all vendors)
- `GET /api/admin/bookings` (List all bookings)
- `GET /api/admin/services` (List all available services)
- `DELETE /api/admin/events/{id}` (Delete an event)
- `DELETE /api/admin/users/{id}` (Delete a user)

### `PUT /api/admin/users/{id}` & `POST /api/admin/users` (Update/Create User)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "CUSTOMER",
  "status": "Active",
  "password": "password123",
  "isSuperAdmin": false
}
```

### `PUT /api/admin/events/{id}` & `POST /api/admin/events` (Update/Create Event)
```json
{
  "name": "Summer Music Festival",
  "category": "Music",
  "date": "2026-08-15",
  "venue": "Central Park",
  "imageUrl": "http://example.com/image.jpg",
  "price": "50.0",
  "seats": "500",
  "description": "A great summer music festival."
}
```

### `POST /api/admin/vendors/invite` (Send an invite to a new vendor)
```json
{
  "email": "vendor@example.com",
  "fullName": "Vendor Name",
  "businessName": "Vendor Business"
}
```

---

## 🛒 Customer (`/api/customer`)
*Endpoints for customer actions. Requires Customer role.*

- `GET /api/customer/dashboard-stats` (Get customer dashboard metrics)
- `GET /api/customer/bookings` (Get the customer's booking history)
- `GET /api/customer/favorites` (Get the customer's favorite events)
- `POST /api/customer/favorites/{eventId}` (Toggle an event as favorite)
- `GET /api/customer/bookings/esewa-callback` (Callback URL for eSewa payment verification)
- `POST /api/customer/bookings/{bookingId}/cancel` (Cancel a booking)

### `POST /api/customer/bookings/initiate-esewa` (Initiate an eSewa payment)
```json
{
  "eventId": 1,
  "quantity": 2
}
```

---

## 🏪 Vendor Profile & Dashboard (`/api/vendor`)
*Endpoints for vendor management. Requires Vendor role.*

- `GET /api/vendor/profile` (Get the vendor's profile)
- `GET /api/vendor/dashboard` (Get vendor dashboard statistics)

### `PUT /api/vendor/profile` (Update the vendor's profile)
*(Uses the UpdateProfileRequest format)*
```json
{
  "fullName": "Vendor Owner Name",
  "phone": "9876543210",
  "email": "vendor@example.com",
  "location": "Kathmandu, Nepal",
  "password": "optional_new_password"
}
```

## 📦 Vendor Services (`/api/vendor/services`)
- `GET /api/vendor/services` (List vendor's services)
- `DELETE /api/vendor/services/{id}` (Delete a service)

### `POST /api/vendor/services` & `PUT /api/vendor/services/{id}` (Create/Update service)
```json
{
  "serviceName": "Premium Photography",
  "description": "Event photography with drone coverage",
  "category": "Photography",
  "price": 500.00,
  "isActive": true,
  "imageUrl": "http://example.com/photo.jpg"
}
```

## 📅 Vendor Availability (`/api/vendor/availability`)
- `GET /api/vendor/availability` (Get current availability settings)
- `DELETE /api/vendor/availability/blocked/{date}` (Remove a blocked date)

### `POST /api/vendor/availability/blocked` (Add a specific blocked date)
```json
"2026-12-25"
```
*(Send just the raw date string in JSON format, or inside an object if the backend expects a specific DTO)*

## 🤝 Vendor Service Requests (`/api/vendor/requests`)
- `GET /api/vendor/requests` (Get list of service requests)

### `PUT /api/vendor/requests/{id}/status` (Accept or decline a service request)
```json
"ACCEPTED"
```
*(Raw string: ACCEPTED or DECLINED)*

---

## 📅 Public Events (`/api/events`)
- `GET /api/events` (List all active public events for browsing)

---

## 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` (List all notifications for the authenticated user)
- `GET /api/notifications/unread-count` (Get the count of unread notifications)
- `PUT /api/notifications/{id}/read` (Mark a specific notification as read)
- `PUT /api/notifications/read-all` (Mark all notifications as read)

---

## 👤 User Profile (`/api/users`)

### `PUT /api/users/profile` (Update the current user's general profile data)
```json
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "location": "City, Country",
  "password": "optional_new_password"
}
```

---

## 📁 File Uploads (`/api/upload`)
- `POST /api/upload` (Upload a file, e.g., image, and return its URL path)
*(Note: Requires `multipart/form-data` instead of `application/json`, with a file attached to the key `file`)*
