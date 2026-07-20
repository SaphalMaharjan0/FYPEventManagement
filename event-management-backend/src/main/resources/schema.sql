-- ============================================================
-- Event Management and Ticket Booking System
-- PostgreSQL Database Schema
-- ============================================================
-- Design notes (matching the ERD):
--   - VENDORS extends USERS (1:1, vendor-specific profile data)
--   - BOOKINGS link to TICKETS, not directly to EVENTS
--   - SERVICE_REQUESTS is a join table between EVENTS and SERVICES
-- ============================================================

-- Drop tables if re-running during development (safe order: children first)
DROP TABLE IF EXISTS SERVICE_REQUESTS CASCADE;
DROP TABLE IF EXISTS PAYMENTS CASCADE;
DROP TABLE IF EXISTS BOOKINGS CASCADE;
DROP TABLE IF EXISTS TICKETS CASCADE;
DROP TABLE IF EXISTS SERVICES CASCADE;
DROP TABLE IF EXISTS EVENTS CASCADE;
DROP TABLE IF EXISTS VENDORS CASCADE;
DROP TABLE IF EXISTS USERS CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS service_request_status CASCADE;

-- Enum types for controlled vocabularies
CREATE TYPE user_role AS ENUM ('guest', 'customer', 'vendor', 'administrator');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('card', 'esewa', 'khalti', 'bank_transfer', 'cash');
CREATE TYPE service_request_status AS ENUM ('requested', 'accepted', 'rejected', 'completed');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE USERS (
    user_id         SERIAL PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    role            user_role       NOT NULL DEFAULT 'customer',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- VENDORS (extends USERS)
-- ============================================================
CREATE TABLE VENDORS (
    vendor_id       SERIAL PRIMARY KEY,
    user_id         INTEGER         NOT NULL UNIQUE REFERENCES USERS(user_id) ON DELETE CASCADE,
    business_name   VARCHAR(150)    NOT NULL,
    business_desc   TEXT,
    contact_email   VARCHAR(150),
    contact_phone   VARCHAR(20),
    business_address TEXT,
    payout_method   VARCHAR(50),
    payout_account  VARCHAR(150),
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE EVENTS (
    event_id        SERIAL PRIMARY KEY,
    organizer_id    INTEGER         NOT NULL REFERENCES USERS(user_id) ON DELETE RESTRICT,
    title           VARCHAR(150)    NOT NULL,
    description     TEXT,
    category        VARCHAR(50),
    venue           VARCHAR(200),
    event_date      DATE            NOT NULL,
    start_time      TIME            NOT NULL,
    end_time        TIME,
    capacity        INTEGER         NOT NULL CHECK (capacity >= 0),
    status          event_status    NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TICKETS
-- ============================================================
CREATE TABLE TICKETS (
    ticket_id           SERIAL PRIMARY KEY,
    event_id            INTEGER     NOT NULL REFERENCES EVENTS(event_id) ON DELETE CASCADE,
    ticket_type         VARCHAR(50) NOT NULL,          -- e.g. General, VIP, Early Bird
    price               NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    quantity_available  INTEGER     NOT NULL CHECK (quantity_available >= 0),
    quantity_sold       INTEGER     NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),
    sales_start         TIMESTAMP,
    sales_end           TIMESTAMP,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_sold_not_exceed_available CHECK (quantity_sold <= quantity_available)
);

-- ============================================================
-- BOOKINGS (linked to TICKETS, not directly to EVENTS)
-- ============================================================
CREATE TABLE BOOKINGS (
    booking_id      SERIAL PRIMARY KEY,
    customer_id     INTEGER         NOT NULL REFERENCES USERS(user_id) ON DELETE RESTRICT,
    ticket_id       INTEGER         NOT NULL REFERENCES TICKETS(ticket_id) ON DELETE RESTRICT,
    quantity        INTEGER         NOT NULL CHECK (quantity > 0),
    total_amount    NUMERIC(10,2)   NOT NULL CHECK (total_amount >= 0),
    status          booking_status  NOT NULL DEFAULT 'pending',
    booking_date    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE PAYMENTS (
    payment_id      SERIAL PRIMARY KEY,
    booking_id      INTEGER         NOT NULL REFERENCES BOOKINGS(booking_id) ON DELETE CASCADE,
    amount          NUMERIC(10,2)   NOT NULL CHECK (amount >= 0),
    method          payment_method  NOT NULL,
    status          payment_status  NOT NULL DEFAULT 'pending',
    transaction_ref VARCHAR(100),
    paid_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SERVICES (offered by vendors)
-- ============================================================
CREATE TABLE SERVICES (
    service_id      SERIAL PRIMARY KEY,
    vendor_id       INTEGER         NOT NULL REFERENCES VENDORS(vendor_id) ON DELETE CASCADE,
    service_name    VARCHAR(150)    NOT NULL,
    description     TEXT,
    category        VARCHAR(50),        -- e.g. Catering, Photography, Decoration
    price           NUMERIC(10,2)   NOT NULL CHECK (price >= 0),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SERVICE_REQUESTS (join table: EVENTS <-> SERVICES)
-- ============================================================
CREATE TABLE SERVICE_REQUESTS (
    request_id      SERIAL PRIMARY KEY,
    event_id        INTEGER                 NOT NULL REFERENCES EVENTS(event_id) ON DELETE CASCADE,
    service_id      INTEGER                 NOT NULL REFERENCES SERVICES(service_id) ON DELETE CASCADE,
    status          service_request_status  NOT NULL DEFAULT 'requested',
    requested_by    INTEGER                 NOT NULL REFERENCES USERS(user_id) ON DELETE RESTRICT,
    request_date    TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_date   TIMESTAMP,
    UNIQUE (event_id, service_id)
);

-- ============================================================
-- Indexes for common lookups / reporting queries
-- ============================================================
CREATE INDEX idx_events_organizer ON EVENTS(organizer_id);
CREATE INDEX idx_events_date      ON EVENTS(event_date);
CREATE INDEX idx_tickets_event    ON TICKETS(event_id);
CREATE INDEX idx_bookings_customer ON BOOKINGS(customer_id);
CREATE INDEX idx_bookings_ticket  ON BOOKINGS(ticket_id);
CREATE INDEX idx_payments_booking ON PAYMENTS(booking_id);
CREATE INDEX idx_services_vendor  ON SERVICES(vendor_id);
CREATE INDEX idx_srequests_event  ON SERVICE_REQUESTS(event_id);
CREATE INDEX idx_srequests_service ON SERVICE_REQUESTS(service_id);

-- ============================================================
-- Trigger function to auto-update "updated_at" columns
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON USERS
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON EVENTS
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
