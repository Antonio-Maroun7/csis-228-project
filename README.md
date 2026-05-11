# Smart Booking System

**CSIS 228 Final Project — Full-Stack Node.js Web Application**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Roles and Features](#2-user-roles-and-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Installation and Setup](#5-installation-and-setup)
6. [Environment Variables](#6-environment-variables)
7. [Database Schema](#7-database-schema)
8. [Main Views (Frontend Pages)](#8-main-views-frontend-pages)
9. [API Endpoints](#9-api-endpoints)
10. [Authentication and Authorization](#10-authentication-and-authorization)
11. [Error Handling](#11-error-handling)
12. [External API Integration](#12-external-api-integration)
13. [Technical Method Documentation](#13-technical-method-documentation)
14. [Testing Guide](#14-testing-guide)
15. [Application Views Preview](#15-application-views-preview)
16. [Security Considerations](#16-security-considerations)
17. [Future Improvements](#17-future-improvements)

---

## 1. Project Overview

### Project Name

**Smart Booking System**

### Short Description

Smart Booking System is a full-stack web application that manages appointment scheduling for service-based businesses such as salons, clinics, and advisory offices. It allows clients to browse available services and book appointments with staff members, while giving staff members a personal dashboard to track their schedule and administrators full control over all system data.

### Purpose

The project demonstrates a complete server-rendered full-stack application built with Node.js, Express, EJS, and PostgreSQL. It includes a layered backend architecture (routes → controllers → services → repositories), role-based access control, cookie-based authentication, server-rendered EJS views, REST API endpoints, and an external API integration.

### Problem It Solves

Traditional appointment booking relies on phone calls and manual scheduling, which leads to conflicts, missed bookings, and poor client experience. Smart Booking System centralizes booking operations, enforces staff availability rules, prevents scheduling conflicts, and gives each user role a tailored interface.

### User Roles

| Role       | Description                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| **Admin**  | Platform manager. Full access to all users, categories, services, staff assignments, and appointments. |
| **Staff**  | Service provider. Sees only their own appointments and assigned services.                              |
| **Client** | End user. Browses categories, books appointments, and manages their own schedule.                      |

---

## 2. User Roles and Features

### Admin Features

- View admin dashboard with system-wide statistics (total users, categories, services, appointments)
- Manage all registered users (create, update, delete, view)
- Manage service categories (create, update, disable)
- Manage services (create, update, disable, filter by category)
- Manage staff-service assignments (assign, update overrides, remove)
- View and manage all appointments (update status, filter, search)
- Access personal profile (update name, email, phone, change password)
- Logout

### Staff Features

- View staff dashboard with today's schedule, calendar, upcoming appointments, recent activity, and stats
- View assigned appointments with date-based filtering via calendar
- View assigned services _(TODO: dedicated page)_
- View customer list _(TODO: dedicated page)_
- Access personal profile (update name, email, phone, change password)
- Logout

### Client Features

- View client home with service category cards and live weather widget
- Browse services by category
- Book appointments with a selected staff member and time slot
- View all personal appointments with status filtering (all, upcoming, completed, cancelled)
- Cancel upcoming appointments
- Access personal profile (update name, email, phone, change password)
- Logout

---

## 3. Technology Stack

| Technology            | Version                         | Purpose                                                                  |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| **Node.js**           | 18+                             | Server runtime                                                           |
| **Express.js**        | ^4.22.1                         | Web framework and routing                                                |
| **EJS**               | ^5.0.2                          | Server-side HTML templating                                              |
| **PostgreSQL**        | 18.x                            | Relational database                                                      |
| **pg**                | ^8.19.0                         | PostgreSQL client for Node.js                                            |
| **bcrypt**            | ^6.0.0                          | Password hashing                                                         |
| **dotenv**            | ^17.3.1                         | Environment variable management                                          |
| **express-validator** | ^7.3.1                          | Request input validation                                                 |
| **moment**            | ^2.30.1                         | Date and time formatting                                                 |
| **jsonwebtoken**      | ^9.0.3                          | Installed dependency (token signing implemented via custom HMAC utility) |
| **http-errors**       | ^2.0.1                          | HTTP error creation helpers                                              |
| **cors**              | ^2.8.6                          | Cross-Origin Resource Sharing                                            |
| **path**              | ^0.12.7                         | File path utilities                                                      |
| **nodemon**           | (devDependency via npm run dev) | Auto-restart in development                                              |
| **Native CSS**        | —                               | All styling (no CSS framework)                                           |
| **Node.js `crypto`**  | built-in                        | HMAC signing for custom token utility                                    |
| **Node.js `https`**   | built-in                        | External API HTTP requests (Open-Meteo)                                  |

---

## 4. Project Structure

```
project-228/
├── database/
│   └── csis-228.sql              # PostgreSQL schema and seed data
├── docs/
│   └── POSTMAN_WORKSPACE.md      # Postman collection guide for API testing
├── package.json
├── README.md
└── src/
    ├── app.js                    # Express app configuration and route mounting
    ├── server.js                 # Entry point — loads dotenv and starts HTTP server
    ├── db/
    │   └── pool.js               # Shared PostgreSQL connection pool
    ├── middleware/
    │   ├── auth.middleware.js     # Bearer token authentication for API routes
    │   ├── authorize.middleware.js # Role-based + self-ownership authorization helpers
    │   └── viewAuth.middleware.js  # Cookie-based auth and role guard for EJS view routes
    ├── routes/
    │   ├── view.routes.js         # All EJS view routes (GET/POST for pages)
    │   ├── auth.routes.js         # POST /api/auth/login, /api/auth/register
    │   ├── user.route.js          # /api/users/*
    │   ├── category.route.js      # /api/categories/*
    │   ├── services.route.js      # /api/services/*
    │   ├── staffService.route.js  # /api/staffServices/*
    │   ├── appointment.route.js   # /api/appointments/*
    │   └── appointment_item.route.js # /api/appointmentItems/*
    ├── controllers/
    │   ├── views/                 # View controllers — render EJS pages
    │   │   ├── authView.controller.js
    │   │   ├── clientView.controller.js
    │   │   ├── profileView.controller.js
    │   │   ├── adminDashboardView.controller.js
    │   │   ├── adminUserView.controller.js
    │   │   ├── adminCategoryView.controller.js
    │   │   ├── adminServiceView.controller.js
    │   │   ├── adminStaffServiceView.controller.js
    │   │   ├── adminAppointmentView.controller.js
    │   │   └── staffDashboardView.controller.js
    │   ├── auth.controller.js     # API auth handlers
    │   ├── user.controller.js
    │   ├── category.controller.js
    │   ├── service.controller.js
    │   ├── staffService.controller.js
    │   ├── appointment.controller.js
    │   └── appointment_item.controller.js
    ├── services/
    │   ├── auth.service.js
    │   ├── user.service.js
    │   ├── category.service.js
    │   ├── services.service.js
    │   ├── staffService.service.js
    │   ├── appointment.service.js
    │   └── appointment_item.service.js
    ├── repositories/
    │   ├── auth.repository.js
    │   ├── user.repository.js
    │   ├── category.repository.js
    │   ├── services.repository.js
    │   ├── staffService.repository.js
    │   ├── appointment.repository.js
    │   └── appointment_item.repository.js
    ├── entities/                  # Database row shape models (snake_case)
    │   ├── user.entity.js
    │   ├── category.entity.js
    │   ├── service.entity.js
    │   ├── staffService.entity.js
    │   ├── appointment.entity.js
    │   ├── appointment_item.entity.js
    │   └── appointmentWithClient.entity.js
    ├── dto/                       # Data Transfer Objects — request/response contracts
    │   ├── user.dto.js
    │   ├── category.dto.js
    │   ├── service.dto.js
    │   ├── staffService.dto.js
    │   ├── appointment.dto.js
    │   ├── appointment_item.dto.js
    │   └── appointmentWithClient.dto.js
    ├── mappers/                   # Maps entities to DTOs and view-ready objects
    │   ├── user.mapper.js
    │   ├── category.mapper.js
    │   ├── service.mapper.js
    │   ├── staffService.mapper.js
    │   ├── appointment.mapper.js
    │   └── appointment_item.mapper.js
    ├── validators/                # express-validator rule chains per module
    │   ├── auth.validator.js
    │   ├── user.validator.js
    │   ├── category.validator.js
    │   ├── service.validator.js
    │   ├── staffService.validator.js
    │   ├── appointment.validator.js
    │   └── appointment_item.validator.js
    ├── utils/
    │   ├── token.js               # Custom HMAC token generation and verification
    │   ├── dateFormat.js          # moment.js-based date/time formatting helpers
    │   ├── errorHandler.js        # Centralized HTTP error mapping for API controllers
    │   └── views/                 # View-layer utilities
    │       ├── feedback.util.js   # Flash message helpers (buildFeedbackState, buildRedirectPath)
    │       ├── userView.util.js   # getLoggedInUser, getFirstName, getUserRole helpers
    │       ├── authCookie.util.js # setAuthCookie / clearAuthCookie helpers
    │       ├── formatView.util.js # formatPrice, generateTimeSlots
    │       ├── appointmentView.mapper.js
    │       ├── categoryView.mapper.js
    │       └── serviceView.mapper.js
    ├── views/                     # EJS template files (feature-based subfolders)
    │   ├── partials/
    │   │   ├── dashboard-sidebar.ejs  # Shared sidebar (role-aware nav)
    │   │   ├── dashboard-topbar.ejs   # Shared topbar (breadcrumb, hamburger)
    │   │   └── feedback.ejs           # Reusable feedback/flash message banner
    │   ├── admin/
    │   │   ├── admin-dashboard.ejs
    │   │   ├── admin-categories.ejs
    │   │   ├── admin-services.ejs
    │   │   ├── admin-staff-services.ejs
    │   │   ├── admin-appointments.ejs
    │   │   └── manage-users.ejs
    │   ├── client/
    │   │   ├── client-home.ejs
    │   │   ├── services-by-category.ejs
    │   │   ├── book-appointment.ejs
    │   │   ├── my-appointments.ejs
    │   │   └── profile.ejs
    │   ├── staff/
    │   │   └── staff-dashboard.ejs
    │   ├── auth/
    │   │   ├── login.ejs
    │   │   └── register.ejs
    │   └── errors/
    │       ├── not-authorized.ejs
    │       └── not-found.ejs
    └── public/
        ├── styles/                # Per-page CSS files (no framework)
        │   ├── dashboard.css      # Shared dashboard layout (sidebar, topbar)
        │   ├── admin.css          # Admin-specific styles
        │   ├── staff-dashboard.css
        │   ├── login.css / register.css
        │   ├── client-home.css
        │   ├── services-by-category.css
        │   ├── book-appointment.css
        │   ├── my-appointments.css
        │   ├── profile.css
        │   ├── admin-categories.css
        │   ├── admin-services.css
        │   ├── admin-staff-services.css
        │   ├── admin-appointments.css
        │   ├── manage-users.css
        │   └── not-authorized.css
        ├── scripts/               # Per-page JavaScript files (no framework)
        │   ├── auth/
        │   │   ├── login.js       # Password show/hide toggle
        │   │   └── register.js    # Password show/hide toggle
        │   ├── client/
        │   │   ├── client-home.js
        │   │   ├── services-by-category.js
        │   │   ├── book-appointment.js
        │   │   ├── profile.js
        │   │   └── my-appointments.js
        │   ├── staff/
        │   │   └── staff-dashboard.js
        │   └── admin/
        │       ├── admin-categories.js
        │       ├── admin-services.js
        │       ├── admin-staff-services.js
        │       ├── admin-appointments.js
        │       └── manage-users.js
        └── images/                # Static images
```

---

## 5. Installation and Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- PostgreSQL 14 or higher

### Step-by-Step Setup

**1. Clone the repository**

```bash
git clone https://github.com/Antonio-Maroun7/csis-228-project.git
cd project-228
```

**2. Install dependencies**

```bash
npm install
```

**3. Create the `.env` file**

Create a file named `.env` in the project root directory. See [Section 6](#6-environment-variables) for all required variables.

**4. Set up the PostgreSQL database**

Create a new database in PostgreSQL, then import the provided SQL script:

```bash
psql -U your_db_user -d your_db_name -f database/csis-228.sql
```

Or open `database/csis-228.sql` in your database GUI (e.g., pgAdmin, DBeaver) and run it.

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application in your browser**

```
http://localhost:4000
```

You will be redirected to the login page automatically.

### Available Scripts

| Command       | Description                                       |
| ------------- | ------------------------------------------------- |
| `npm run dev` | Start with nodemon (auto-restart on file changes) |
| `npm start`   | Start without nodemon                             |

---

## 6. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=4000

# PostgreSQL Database
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=your_database_name
PG_USER=your_postgres_username
PG_PASSWORD=your_postgres_password

# Token Authentication
AUTH_SECRET=your_strong_secret_key_here
AUTH_TOKEN_TTL_SECONDS=3600

# External API — Open-Meteo Weather (optional, defaults to Beirut, Lebanon)
WEATHER_LAT=33.89
WEATHER_LON=35.50
```

| Variable                 | Required | Default                | Description                                     |
| ------------------------ | -------- | ---------------------- | ----------------------------------------------- |
| `PORT`                   | No       | `4000`                 | HTTP server port                                |
| `PG_HOST`                | Yes      | —                      | PostgreSQL host                                 |
| `PG_PORT`                | Yes      | —                      | PostgreSQL port                                 |
| `PG_DATABASE`            | Yes      | —                      | Database name                                   |
| `PG_USER`                | Yes      | —                      | Database username                               |
| `PG_PASSWORD`            | Yes      | —                      | Database password                               |
| `AUTH_SECRET`            | Yes      | `dev-secret-change-me` | Token signing secret. **Change in production.** |
| `AUTH_TOKEN_TTL_SECONDS` | No       | `3600`                 | Token lifetime in seconds                       |
| `WEATHER_LAT`            | No       | `33.89`                | Latitude for weather widget (client home)       |
| `WEATHER_LON`            | No       | `35.50`                | Longitude for weather widget (client home)      |

---

## 7. Database Schema

The database is in PostgreSQL. The SQL bootstrap script is located at `database/csis-228.sql`.

### Tables Overview

| Table               | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `users`             | All system users (admin, staff, client)                 |
| `categories`        | Service category groupings                              |
| `services`          | Individual service catalog entries                      |
| `staff_services`    | Many-to-many: staff members and their assigned services |
| `appointments`      | Booking records linking a client to a staff member      |
| `appointment_items` | Line-item services within an appointment                |

---

### `users`

Stores all registered users regardless of role.

| Column           | Type           | Description                        |
| ---------------- | -------------- | ---------------------------------- |
| `user_id`        | SERIAL PK      | Primary key                        |
| `user_fullname`  | VARCHAR        | Full display name                  |
| `user_email`     | VARCHAR UNIQUE | Login email                        |
| `user_password`  | VARCHAR        | bcrypt-hashed password             |
| `user_role`      | VARCHAR        | One of: `admin`, `staff`, `client` |
| `user_phone`     | VARCHAR        | Optional phone number              |
| `user_is_active` | BOOLEAN        | Whether the account is enabled     |

---

### `categories`

Groups services into logical categories.

| Column                 | Type      | Description          |
| ---------------------- | --------- | -------------------- |
| `category_id`          | SERIAL PK | Primary key          |
| `category_name`        | VARCHAR   | Display name         |
| `category_description` | TEXT      | Optional description |
| `category_is_active`   | BOOLEAN   | Active/disabled flag |

---

### `services`

Individual service offerings linked to a category.

| Column                         | Type                | Description                         |
| ------------------------------ | ------------------- | ----------------------------------- |
| `service_id`                   | SERIAL PK           | Primary key                         |
| `category_id`                  | INT FK → categories | Parent category                     |
| `service_name`                 | VARCHAR             | Service display name                |
| `service_description`          | TEXT                | Optional description                |
| `service_default_duration_min` | INT                 | Default service duration in minutes |
| `service_base_price_cents`     | INT                 | Default price in cents              |
| `service_is_active`            | BOOLEAN             | Active/disabled flag                |

---

### `staff_services`

Assigns services to staff members with optional per-staff overrides.

| Column               | Type              | Description                                    |
| -------------------- | ----------------- | ---------------------------------------------- |
| `staff_id`           | INT FK → users    | The staff member                               |
| `service_id`         | INT FK → services | The service                                    |
| `staff_duration_min` | INT               | Override duration (null = use service default) |
| `staff_price_cents`  | INT               | Override price (null = use service default)    |

**Composite PK:** `(staff_id, service_id)`

---

### `appointments`

Main booking record. Links a client and a staff member for a time window.

| Column                   | Type           | Description                                              |
| ------------------------ | -------------- | -------------------------------------------------------- |
| `appointment_id`         | SERIAL PK      | Primary key                                              |
| `client_id`              | INT FK → users | The client user                                          |
| `staff_id`               | INT FK → users | The staff user                                           |
| `appointment_start_at`   | TIMESTAMPTZ    | Appointment start time                                   |
| `appointment_ends_at`    | TIMESTAMPTZ    | Appointment end time (computed from duration)            |
| `appointment_status`     | VARCHAR        | One of: `pending`, `confirmed`, `completed`, `cancelled` |
| `appointment_notes`      | TEXT           | Optional client notes                                    |
| `appointment_created_at` | TIMESTAMPTZ    | Auto-set at creation                                     |

---

### `appointment_items`

Line items for services rendered within an appointment.

| Column                     | Type                  | Description                   |
| -------------------------- | --------------------- | ----------------------------- |
| `appointment_item_id`      | SERIAL PK             | Primary key                   |
| `appointment_id`           | INT FK → appointments | Parent appointment            |
| `service_id`               | INT FK → services     | Service provided              |
| `appointment_duration_min` | INT                   | Actual duration for this item |
| `appointment_price_cents`  | INT                   | Actual price for this item    |

---

### Relationships Diagram

```
categories  ──< services
users (staff) >──< services  (via staff_services)
users (client) ──< appointments ──> users (staff)
appointments ──< appointment_items ──> services
```

---

## 8. Main Views (Frontend Pages)

All frontend pages are rendered server-side using EJS. Authentication is verified via a cookie (`auth_token`) on every protected route.

### 8.1 Public Views (No Login Required)

| View           | Route                       | Purpose                     | Main Actions                 |
| -------------- | --------------------------- | --------------------------- | ---------------------------- |
| Login          | `GET /views/login`          | Authenticate existing users | Submit email + password form |
| Register       | `GET /views/register`       | Create a new client account | Submit registration form     |
| Not Authorized | `GET /views/not-authorized` | Shown when role check fails | Navigate to dashboard        |

### 8.2 Admin Views

All admin routes require: authenticated + role = `admin`.

| View                 | Route                             | Purpose                          | Main Data Displayed                                              | Main Actions                               |
| -------------------- | --------------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| Admin Dashboard      | `GET /views/admin-dashboard`      | System overview and statistics   | Total users, categories, services, appointments, recent bookings | Navigate to management sections            |
| Manage Users         | `GET /views/manage-users`         | List and manage all users        | User table with role, status, email                              | Create, update, delete users               |
| Admin Categories     | `GET /views/admin-categories`     | Manage service categories        | Category table with status                                       | Create, update, disable categories         |
| Admin Services       | `GET /views/admin-services`       | Manage services                  | Service table with price, duration, category                     | Create, update, disable services           |
| Admin Staff Services | `GET /views/admin-staff-services` | Manage staff-service assignments | Assignment table with override data                              | Assign, update, remove staff-service links |
| Admin Appointments   | `GET /views/admin-appointments`   | View and manage all appointments | All appointments with client/staff/status                        | Update appointment status                  |
| Admin Profile        | `GET /views/admin-profile`        | Admin personal profile           | Name, email, phone, role                                         | Update profile, change password            |

### 8.3 Staff Views

All staff routes require: authenticated + role = `staff`.

| View               | Route                           | Purpose                        | Main Data Displayed                                                                              | Main Actions                                                  |
| ------------------ | ------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Staff Dashboard    | `GET /views/staff-dashboard`    | Personal schedule overview     | Stats (today/week), schedule for selected date, calendar, upcoming appointments, recent activity | Click calendar day to view schedule, navigate calendar months |
| Staff Profile      | `GET /views/staff-profile`      | Staff personal profile         | Name, email, phone, role                                                                         | Update profile, change password                               |
| Staff Appointments | `GET /views/staff-appointments` | _(TODO)_ Full appointment list | —                                                                                                | —                                                             |
| Staff Services     | `GET /views/staff-services`     | _(TODO)_ Assigned services     | —                                                                                                | —                                                             |
| Staff Customers    | `GET /views/staff-customers`    | _(TODO)_ Customer list         | —                                                                                                | —                                                             |

### 8.4 Client Views

All client routes require: authenticated + role = `client`.

| View                 | Route                                         | Purpose                            | Main Data Displayed                                             | Main Actions                                   |
| -------------------- | --------------------------------------------- | ---------------------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| Client Home          | `GET /views/client-home`                      | Service category browser + weather | Category cards, upcoming appointment count, live weather widget | Click category to view services                |
| Services by Category | `GET /views/services-by-category/:categoryId` | Services in a selected category    | Service cards with price and duration                           | Click service to book                          |
| Book Appointment     | `GET /views/book-appointment/:serviceId`      | Appointment booking form           | Staff list, date picker, time slots                             | Select staff, date, time; submit booking       |
| My Appointments      | `GET /views/my-appointments`                  | Client's appointment history       | Appointment list with status, service, staff                    | Filter by status, cancel upcoming appointments |
| Client Profile       | `GET /views/profile`                          | Client personal profile            | Name, email, phone, role                                        | Update profile, change password                |

### 8.5 Shared View Actions

| Action                  | Route                               | Method | Role              |
| ----------------------- | ----------------------------------- | ------ | ----------------- |
| Login submit            | `/views/login`                      | POST   | Public            |
| Register submit         | `/views/register`                   | POST   | Public            |
| Logout                  | `/views/logout`                     | GET    | All authenticated |
| Update profile          | `/views/profile/update`             | POST   | All authenticated |
| Change password         | `/views/profile/change-password`    | POST   | All authenticated |
| Cancel appointment      | `/views/my-appointments/:id/cancel` | POST   | Client            |
| Book appointment submit | `/views/book-appointment`           | POST   | Client            |

---

## 9. API Endpoints

**Base URL:** `/api`

All API endpoints (except login and register) require an `Authorization: Bearer <token>` header.

### 9.1 Auth

| Method | Endpoint             | Role   | Description                    | Request Body                                           |
| ------ | -------------------- | ------ | ------------------------------ | ------------------------------------------------------ |
| POST   | `/api/auth/register` | Public | Register new client account    | `user_fullname, user_email, user_password, user_phone` |
| POST   | `/api/auth/login`    | Public | Authenticate and receive token | `user_email, user_password`                            |

**Login Response Example:**

```json
{
  "message": "login successful",
  "token": "eyJhbGc...",
  "data": { "id": 1, "email": "user@example.com", "role": "client" }
}
```

---

### 9.2 Users

| Method | Endpoint                                       | Role                        | Description         |
| ------ | ---------------------------------------------- | --------------------------- | ------------------- |
| GET    | `/api/users`                                   | admin                       | Get all users       |
| GET    | `/api/users/:id`                               | admin, staff, client (self) | Get user by ID      |
| GET    | `/api/users/email/:user_email`                 | admin, staff, client (self) | Get user by email   |
| PUT    | `/api/users/UpdateUser/:id`                    | admin, staff, client (self) | Update user profile |
| PUT    | `/api/users/changePasswordByEmail/:user_email` | admin, staff, client (self) | Change password     |
| DELETE | `/api/users/deleteUser/:id`                    | admin                       | Delete user         |

---

### 9.3 Categories

| Method | Endpoint                              | Role                 | Description         |
| ------ | ------------------------------------- | -------------------- | ------------------- |
| GET    | `/api/categories/GetAllCategories`    | admin, staff, client | List all categories |
| GET    | `/api/categories/GetCategoryById/:id` | admin, staff, client | Get category by ID  |
| POST   | `/api/categories/CreateCategory`      | admin                | Create new category |
| PUT    | `/api/categories/UpdateCategory/:id`  | admin                | Update category     |
| PUT    | `/api/categories/DisableCategory/:id` | admin                | Disable category    |

**Create Category Request Body:**

```json
{ "category_name": "Hair", "category_description": "Hair services" }
```

---

### 9.4 Services

| Method | Endpoint                                  | Role                 | Description               |
| ------ | ----------------------------------------- | -------------------- | ------------------------- |
| GET    | `/api/services/getAllServices`            | admin, staff, client | List all services         |
| GET    | `/api/services/ServiceById/:id`           | admin, staff, client | Get service by ID         |
| GET    | `/api/services/getServicesByCategory/:id` | admin, staff, client | List services by category |
| POST   | `/api/services/createService`             | admin                | Create service            |
| PUT    | `/api/services/updateService/:id`         | admin                | Update service            |
| PUT    | `/api/services/disableService/:id`        | admin                | Disable service           |

**Create Service Request Body:**

```json
{
  "service_name": "Haircut",
  "category_id": 1,
  "service_default_duration_min": 30,
  "service_base_price_cents": 2500
}
```

---

### 9.5 Staff Services

| Method | Endpoint                                           | Role                 | Description                             |
| ------ | -------------------------------------------------- | -------------------- | --------------------------------------- |
| GET    | `/api/staffServices/getAllStaffServices`           | admin                | List all assignments                    |
| POST   | `/api/staffServices/assignServiceToStaff`          | admin                | Assign service to staff                 |
| PUT    | `/api/staffServices/updateStaffService`            | admin, staff (self)  | Update override duration/price          |
| DELETE | `/api/staffServices/removeServiceFromStaff`        | admin                | Remove assignment                       |
| GET    | `/api/staffServices/getStaffByService/:service_id` | admin, staff, client | Get staff who can perform a service     |
| GET    | `/api/staffServices/getStaffServices/:staff_id`    | admin, staff (self)  | Get services assigned to a staff member |

**Assign Service Request Body:**

```json
{
  "staff_id": 2,
  "service_id": 3,
  "staff_duration_min": 45,
  "staff_price_cents": 3000
}
```

---

### 9.6 Appointments

| Method | Endpoint                                           | Role                         | Description                    |
| ------ | -------------------------------------------------- | ---------------------------- | ------------------------------ |
| POST   | `/api/appointments/CreateAppointment`              | admin, client (self)         | Create appointment             |
| GET    | `/api/appointments/GetAllAppointmentsByClient/:id` | admin, client (self)         | Get appointments by client     |
| GET    | `/api/appointments/GetAllAppointmentsByStaff/:id`  | admin, staff (self)          | Get appointments by staff      |
| GET    | `/api/appointments/GetAppointmentById/:id`         | admin, staff, client (owner) | Get appointment by ID          |
| PUT    | `/api/appointments/UpdateAppointmentStatus/:id`    | admin, staff (owner)         | Update appointment status      |
| PUT    | `/api/appointments/CancelAppointment/:id`          | admin, staff, client (owner) | Cancel appointment             |
| PUT    | `/api/appointments/UpdateAppointment/:id`          | admin, staff, client (owner) | Update appointment details     |
| POST   | `/api/appointments/CheckAppointmentConflict`       | admin, staff                 | Check staff availability       |
| GET    | `/api/appointments/GetAppointmentsBetweenDates`    | admin                        | Get appointments in date range |

**Create Appointment Request Body:**

```json
{
  "client_id": 5,
  "staff_id": 2,
  "starts_at": "2026-05-15T10:00:00",
  "service_items": [3, 4],
  "appointment_notes": "Please use organic products"
}
```

---

### 9.7 Appointment Items

| Method | Endpoint                                                       | Role                         | Description                |
| ------ | -------------------------------------------------------------- | ---------------------------- | -------------------------- |
| POST   | `/api/appointmentItems/CreateAppointmentItem`                  | admin, staff, client (owner) | Create item                |
| GET    | `/api/appointmentItems/GetAppointmentItemById/:id`             | admin, staff, client (owner) | Get item by ID             |
| GET    | `/api/appointmentItems/GetAppointmentItemsByAppointmentId/:id` | admin, staff, client (owner) | List items for appointment |
| PUT    | `/api/appointmentItems/UpdateAppointmentItem/:id`              | admin, staff, client (owner) | Update item                |
| DELETE | `/api/appointmentItems/DeleteAppointmentItem/:id`              | admin, staff, client (owner) | Delete item                |

---

## 10. Authentication and Authorization

### Login Flow

1. Client submits email and password to `POST /views/login` (view) or `POST /api/auth/login` (API).
2. Server validates credentials against the database using `bcrypt.compare`.
3. On success, a signed token is generated by the custom `token.js` utility using HMAC-SHA256.
4. The token is stored as an HTTP cookie (`auth_token`) for view routes, or returned as JSON for API routes.
5. Every subsequent request reads the cookie (view routes) or `Authorization: Bearer` header (API routes) and verifies the token.

### Token Structure

The custom token is built as:

```
base64url(JSON payload) . base64url(HMAC-SHA256 signature)
```

The payload contains: `{ id, email, role, exp }` where `exp` is a Unix timestamp.

### Logout Flow

`GET /views/logout` clears the `auth_token` cookie and redirects to the login page.

### Role-Based Access Control

| Resource Type | Enforcement Mechanism                                                                      |
| ------------- | ------------------------------------------------------------------------------------------ |
| View routes   | `requireViewAuth` + `requireViewRole(["role"])` in `viewAuth.middleware.js`                |
| API routes    | `authenticate` + `authorize(["role"])` in `auth.middleware.js` + `authorize.middleware.js` |

### Self-Ownership Helpers (API Layer)

The `authorize.middleware.js` exposes helpers to allow users to access only their own data while admins bypass all checks:

| Helper                                     | Use Case                                          |
| ------------------------------------------ | ------------------------------------------------- |
| `authorize.selfByIdOrRoles`                | Access by route param ID (e.g., `GET /users/:id`) |
| `authorize.selfByEmailOrRoles`             | Access by email param                             |
| `authorize.selfByBodyIdOrRoles`            | Access where owner ID is in request body          |
| `authorize.selfByParamIdOrRoles`           | Staff/client access by param ID                   |
| `authorize.selfByAppointmentIdOrRoles`     | Access by appointment ownership                   |
| `authorize.selfByAppointmentBodyIdOrRoles` | Appointment ownership via body                    |
| `authorize.selfByAppointmentItemIdOrRoles` | Appointment item ownership                        |

### Role Permission Summary

| Permission                  | Admin | Staff     | Client    |
| --------------------------- | ----- | --------- | --------- |
| All users CRUD              | ✅    | ❌        | ❌        |
| Categories CRUD             | ✅    | Read only | Read only |
| Services CRUD               | ✅    | Read only | Read only |
| Staff-service assign/remove | ✅    | ❌        | ❌        |
| All appointments            | ✅    | Own only  | Own only  |
| Update appointment status   | ✅    | Own only  | ❌        |
| Cancel appointment          | ✅    | Own only  | Own only  |
| Book appointment            | ✅    | ❌        | ✅        |

---

## 11. Error Handling

### Server-Side (API Layer)

All API controllers use a centralized `handleError(res, err)` utility in `src/utils/errorHandler.js`. It maps known error messages to standard HTTP status codes:

| Condition                                                     | HTTP Status |
| ------------------------------------------------------------- | ----------- |
| Invalid credentials or token                                  | 401         |
| Inactive user, access denied, role forbidden                  | 403         |
| Resource not found                                            | 404         |
| Duplicate entry, scheduling conflict, business rule violation | 409         |
| Validation failure, missing field, invalid format             | 400         |
| Unclassified errors                                           | 500         |

### View Layer (EJS Pages)

View controllers use a try/catch on every render function. On failure, a flash message is passed to the EJS view via redirect with `?message=...&type=error` query parameters, read by `buildFeedbackState(req)`. Every EJS view conditionally renders a color-coded feedback banner.

**Success banner:** green background, shown on create/update/cancel confirmation.
**Error banner:** red background, shown on validation failures, not-found errors, server errors.

### Form Validation

All API endpoints use `express-validator` rule chains defined in `src/validators/`. Validation errors cause a `400` response with a structured error list. View-layer forms report errors via the redirect flash message mechanism.

### Unauthorized Access

If a user visits a page they do not have permission to access:

- `requireViewAuth` → redirected to `/views/login`
- `requireViewRole` → rendered with `not-authorized.ejs` (403)
- API `authenticate` → `401 JSON`
- API `authorize` → `403 JSON`

---

## 12. External API Integration

### Open-Meteo Weather API

| Property                | Detail                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| **API Name**            | Open-Meteo (https://open-meteo.com)                                                          |
| **Authentication**      | None required — fully free and public                                                        |
| **Where Used**          | Client home page (`/views/client-home`)                                                      |
| **Purpose**             | Displays current temperature, wind speed, and weather condition icon on the client dashboard |
| **Implementation File** | `src/controllers/views/clientView.controller.js` — `fetchWeather()` function                 |
| **Env Variables**       | `WEATHER_LAT`, `WEATHER_LON` (optional; defaults to Beirut, Lebanon)                         |

**How it works:**

1. When the client home page is requested, `fetchWeather()` is called concurrently with the category database query using `Promise.all`.
2. A raw HTTPS request is made to the Open-Meteo forecast endpoint with latitude, longitude, and `current` fields for temperature, weather code, and wind speed.
3. The weather code is mapped to a human-readable label and emoji icon using an internal `WEATHER_CODE_MAP` lookup table.
4. The result is passed to the EJS template as the `weather` variable.

**Error Fallback:**

- The request has a 3-second timeout.
- If the API is unreachable, times out, or returns invalid JSON, `fetchWeather()` resolves to `null`.
- The EJS template checks `if (weather)` before rendering the weather card, so the page loads normally with no weather card if the API fails.
- The page is never blocked by an API failure.

**Weather Code Map (sample):**

| Code(s)    | Label         | Icon |
| ---------- | ------------- | ---- |
| 0          | Clear Sky     | ☀️   |
| 1–3        | Partly Cloudy | ⛅   |
| 45, 48     | Foggy         | 🌫️   |
| 51–67      | Rainy         | 🌧️   |
| 71–77      | Snowy         | ❄️   |
| 80–82      | Showers       | 🌦️   |
| 95, 96, 99 | Thunderstorm  | ⛈️   |

---

## 13. Technical Method Documentation

This section documents the key methods across each application layer using JSDoc-style conventions.

---

### 13.1 `src/utils/token.js`

| Method                   | Description                                                                    | Parameters                                | Returns                                               | Throws                                       |
| ------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| `generateToken(payload)` | Creates a signed HMAC-SHA256 token with expiration.                            | `payload: Object` — `{ id, email, role }` | `string` — token in `encodedPayload.signature` format | —                                            |
| `verifyToken(token)`     | Validates token structure, signature, and expiration. Returns decoded payload. | `token: string`                           | `Object` — decoded payload `{ id, email, role, exp }` | `Error` — "Invalid token" or "Token expired" |

**JSDoc:**

```js
/**
 * Creates a signed token containing payload data plus expiration.
 * @param {Object} payload - Data to encode: { id, email, role }
 * @returns {string} Signed token string.
 */
function generateToken(payload) { ... }

/**
 * Validates a signed token and returns the decoded payload.
 * @param {string} token - Token string from cookie or Authorization header.
 * @returns {Object} Decoded payload { id, email, role, exp }.
 * @throws {Error} If token is malformed, signature is invalid, or token has expired.
 */
function verifyToken(token) { ... }
```

---

### 13.2 `src/utils/dateFormat.js`

| Method                  | Description                           | Parameters                  | Returns        |
| ----------------------- | ------------------------------------- | --------------------------- | -------------- |
| `formatDate(value)`     | Formats a date as `DD-MM-YYYY`.       | `value: string\|Date\|null` | `string\|null` |
| `formatDateTime(value)` | Formats a date as `DD-MM-YYYY HH:mm`. | `value: string\|Date\|null` | `string\|null` |
| `formatTime(value)`     | Formats a value as `HH:mm`.           | `value: string\|Date\|null` | `string\|null` |

---

### 13.3 `src/utils/errorHandler.js`

| Method                  | Description                                                                  | Parameters                    | Returns                                    |
| ----------------------- | ---------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------ |
| `handleError(res, err)` | Maps a caught error to the correct HTTP status code and JSON error response. | `res: Response`, `err: Error` | `Response` — JSON with `{ error: string }` |

**Status Code Mapping:**

| Error Keywords                                                  | Status |
| --------------------------------------------------------------- | ------ |
| `"invalid email or password"`                                   | 401    |
| `"access denied"`, `"not active"`, `"forbidden"`                | 403    |
| `"not found"`                                                   | 404    |
| `"already exist"`, `"overlap"`, `"conflict"`, `"not available"` | 409    |
| `"required"`, `"invalid"`, `"update failed"`                    | 400    |
| All other errors                                                | 500    |

---

### 13.4 `src/middleware/auth.middleware.js`

| Method                         | Description                                                              | Parameters       | Returns                         |
| ------------------------------ | ------------------------------------------------------------------------ | ---------------- | ------------------------------- |
| `authenticate(req, res, next)` | Reads `Authorization: Bearer <token>`, verifies it, and sets `req.user`. | `req, res, next` | Calls `next()` or returns `401` |

---

### 13.5 `src/middleware/viewAuth.middleware.js`

| Method                            | Description                                                                             | Parameters               | Returns                                          |
| --------------------------------- | --------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------ |
| `requireViewAuth(req, res, next)` | Reads `auth_token` cookie, verifies it, sets `req.user`. Redirects to login on failure. | `req, res, next`         | Calls `next()` or redirects to `/views/login`    |
| `requireViewRole(allowedRoles)`   | Returns middleware that checks `req.user.role` against allowed roles.                   | `allowedRoles: string[]` | Calls `next()` or renders `not-authorized` (403) |

---

### 13.6 `src/services/AuthService`

File: `src/services/auth.service.js`

```js
/**
 * Registers a new user and generates an auth token.
 * @param {{ user_fullname: string, user_email: string, user_password: string, user_phone: string }} data
 * @returns {Promise<{ message: string, data: Object, token: string }>}
 * @throws {Error} "user already exist" — if email is taken.
 * @throws {Error} "create failed" — if database insert fails.
 */
static async register(data)

/**
 * Authenticates a user by email and password.
 * @param {{ user_email: string, user_password: string }} credentials
 * @returns {Promise<{ message: string, token: string, data: Object }>}
 * @throws {Error} "invalid email or password" — if credentials are wrong.
 * @throws {Error} "user is not active" — if account is disabled.
 */
static async login({ user_email, user_password })
```

---

### 13.7 `src/services/UserService`

File: `src/services/user.service.js`

| Method                                                     | Description                                         | Parameters                                                                                  | Returns                                      | Throws                                                    |
| ---------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `getAllUsers()`                                            | Returns all users as DTOs.                          | —                                                                                           | `Promise<Array<Object>>`                     | —                                                         |
| `getUserById(user_id)`                                     | Returns one user by ID.                             | `user_id: number\|string`                                                                   | `Promise<Object>`                            | "User not found"                                          |
| `getUserByEmail(user_email)`                               | Returns one user by email.                          | `user_email: string`                                                                        | `Promise<Object\|null>`                      | —                                                         |
| `UpdateUser(user_id, data)`                                | Updates a user after email uniqueness check.        | `user_id: number\|string`, `data: Object`                                                   | `Promise<Object>`                            | "user not found", "email already exists", "update failed" |
| `adminCreateUser(data)`                                    | Creates a user with any role (admin operation).     | `data: { user_fullname, user_email, user_password, user_role, user_phone, user_is_active }` | `Promise<Object>`                            | "email already exists", "create failed"                   |
| `deleteUser(user_id)`                                      | Deletes a user by ID.                               | `user_id: number\|string`                                                                   | `Promise<{ message: string, data: Object }>` | "user not found"                                          |
| `changePassword(user_email, currentPassword, newpassword)` | Validates current password and updates to new hash. | `user_email, currentPassword, newpassword: string`                                          | `Promise<Object>`                            | "user not found", "invalid current password"              |

---

### 13.8 `src/services/CategoryService`

File: `src/services/category.service.js`

| Method                     | Description                        | Parameters                                      | Returns                  | Throws                                            |
| -------------------------- | ---------------------------------- | ----------------------------------------------- | ------------------------ | ------------------------------------------------- |
| `getAllCategories()`       | Lists all categories.              | —                                               | `Promise<Array<Object>>` | —                                                 |
| `getCategoryById(id)`      | Returns one category.              | `id: number\|string`                            | `Promise<Object>`        | "Category not found"                              |
| `createCategory(data)`     | Creates a category.                | `data: { category_name, category_description }` | `Promise<Object>`        | —                                                 |
| `updateCategory(id, data)` | Updates a category.                | `id: number\|string`, `data: Object`            | `Promise<Object>`        | "Category not found", "Failed to update category" |
| `disableCategory(id)`      | Sets `category_is_active = false`. | `id: number\|string`                            | `Promise<Object>`        | "Category not found"                              |

---

### 13.9 `src/services/ServicesService`

File: `src/services/services.service.js`

| Method                      | Description                             | Parameters                           | Returns                  | Throws                               |
| --------------------------- | --------------------------------------- | ------------------------------------ | ------------------------ | ------------------------------------ |
| `getServices()`             | Lists all services.                     | —                                    | `Promise<Array<Object>>` | —                                    |
| `getServiceById(id)`        | Returns one service.                    | `id: number\|string`                 | `Promise<Object>`        | "Service not found"                  |
| `createService(data)`       | Creates a service.                      | `data: Object`                       | `Promise<Object>`        | —                                    |
| `updateService(id, data)`   | Updates a service.                      | `id: number\|string`, `data: Object` | `Promise<Object>`        | "Service not found", "update failed" |
| `disableService(id)`        | Sets `service_is_active = false`.       | `id: number\|string`                 | `Promise<Object>`        | "service not found"                  |
| `getServicesByCategory(id)` | Lists services belonging to a category. | `id: number\|string`                 | `Promise<Array<Object>>` | "Category not found"                 |

---

### 13.10 `src/services/StaffServiceService`

File: `src/services/staffService.service.js`

| Method                                                  | Description                                                                 | Parameters                                                                                       | Returns                                      | Throws                                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `assignServiceToStaff(staff_id, service_id, overrides)` | Assigns a service to a staff member with optional duration/price overrides. | `staff_id, service_id: number\|string`, `overrides: { staff_duration_min?, staff_price_cents? }` | `Promise<Object>`                            | "staff not found", "this user is not a staff member", "service not found"                   |
| `getStaffServices(staff_id)`                            | Lists services assigned to one staff member.                                | `staff_id: number\|string`                                                                       | `Promise<Array<Object>>`                     | "staff not found"                                                                           |
| `getStaffByService(service_id)`                         | Lists staff who can perform a service.                                      | `service_id: number\|string`                                                                     | `Promise<Array<Object>>`                     | "service not found"                                                                         |
| `removeServiceFromStaff(staff_id, service_id)`          | Removes a staff-service assignment.                                         | `staff_id, service_id: number\|string`                                                           | `Promise<{ message: string, data: Object }>` | "staff not found", "service not found", "This service is not assigned to this staff member" |
| `getAllStaffServices()`                                 | Lists all staff-service assignments.                                        | —                                                                                                | `Promise<Array<Object>>`                     | —                                                                                           |
| `updateStaffService(staff_id, service_id, overrides)`   | Updates override duration/price for a staff-service pair.                   | `staff_id, service_id: number\|string`, `overrides: Object`                                      | `Promise<Object>`                            | "staff not found", "service not found"                                                      |

---

### 13.11 `src/services/AppointmentService`

File: `src/services/appointment.service.js`

```js
/**
 * Creates an appointment from client request data. Validates client/staff roles,
 * service assignments, computes total duration and price, checks for scheduling
 * conflicts, and inserts the appointment row.
 *
 * @param {Object} appointmentData
 * @param {number} appointmentData.client_id - ID of the client user.
 * @param {number} appointmentData.staff_id - ID of the staff member.
 * @param {string} appointmentData.starts_at - ISO 8601 start datetime.
 * @param {number[]} appointmentData.service_items - Array of service IDs to book.
 * @param {string} [appointmentData.appointment_notes] - Optional notes.
 * @returns {Promise<{ message: string, data: Object, meta: { totalServices: number, totalDuration: number, totalPrice: number } }>}
 * @throws {Error} "Client not found" | "Staff not found" | "Service not assigned to staff" | "Staff is not available"
 */
static async createAppointment(appointmentData)
```

| Method                                | Description                                                                           | Parameters                             | Returns                  | Throws                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------ | ------------------------------------------------------------ |
| `createAppointment(data)`             | Full appointment creation with conflict check. See above.                             | `data: Object`                         | `Promise<Object>`        | Multiple business rule errors                                |
| `getAllAppointments()`                | Lists all appointments (admin).                                                       | —                                      | `Promise<Array<Object>>` | —                                                            |
| `getAppointmentsByClient(client_id)`  | Lists appointments for a client.                                                      | `client_id: number\|string`            | `Promise<Array<Object>>` | —                                                            |
| `getAppointmentsByStaff(staff_id)`    | Lists appointments for a staff member.                                                | `staff_id: number\|string`             | `Promise<Array<Object>>` | —                                                            |
| `getAppointmentById(id)`              | Returns one appointment.                                                              | `id: number\|string`                   | `Promise<Object>`        | "Appointment not found"                                      |
| `updateAppointmentStatus(id, status)` | Updates status field only.                                                            | `id: number\|string`, `status: string` | `Promise<Object>`        | "Appointment not found", "cannot update cancelled/completed" |
| `cancelAppointment(id)`               | Sets status to `cancelled`.                                                           | `id: number\|string`                   | `Promise<Object>`        | "Appointment not found", "already cancelled"                 |
| `getStaffAppointmentsRich(staff_id)`  | Returns staff appointments with joined client/service data (used by staff dashboard). | `staff_id: number\|string`             | `Promise<Array<Object>>` | —                                                            |

---

### 13.12 `src/services/AppointmentItemService`

File: `src/services/appointment_item.service.js`

| Method                                   | Description                                                                                            | Parameters                                                                                | Returns                                      | Throws                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `createAppointmentItem(data)`            | Creates an item linked to an appointment. Validates appointment exists and is not completed/cancelled. | `data: { appointment_id, service_id, appointment_duration_min, appointment_price_cents }` | `Promise<{ message: string, data: Object }>` | "Appointment not found", "Service not found", "cannot add item to cancelled/completed" |
| `getAppointmentItemById(id)`             | Returns one item by ID.                                                                                | `id: number\|string`                                                                      | `Promise<Object>`                            | "Appointment item not found"                                                           |
| `getAppointmentItemsByAppointmentId(id)` | Lists all items for one appointment.                                                                   | `id: number\|string`                                                                      | `Promise<Array<Object>>`                     | —                                                                                      |
| `updateAppointmentItem(id, data)`        | Updates an item's duration or price.                                                                   | `id: number\|string`, `data: Object`                                                      | `Promise<Object>`                            | "item not found", "cannot update item of cancelled/completed"                          |
| `deleteAppointmentItem(id)`              | Deletes one appointment item.                                                                          | `id: number\|string`                                                                      | `Promise<{ message: string, data: Object }>` | "item not found", "cannot delete item of cancelled/completed"                          |

---

### 13.13 `src/repositories/AppointmentRepository` (selected methods)

File: `src/repositories/appointment.repository.js`

| Method                                             | Description                                                             | Parameters                                                                                                  | Returns                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `createAppointment(data)`                          | Inserts one appointment row.                                            | `{ client_id, staff_id, appointment_start_at, appointment_ends_at, appointment_status, appointment_notes }` | `Promise<AppointmentEntity\|null>`           |
| `findAppointmentsByClient(client_id)`              | SELECT all appointments for a client, ordered by start time DESC.       | `client_id: number\|string`                                                                                 | `Promise<AppointmentEntity[]>`               |
| `findAppointmentsByStaff(staff_id)`                | SELECT all appointments for a staff member, ordered by start time DESC. | `staff_id: number\|string`                                                                                  | `Promise<AppointmentEntity[]>`               |
| `findAppointmentById(id)`                          | SELECT one appointment by primary key.                                  | `id: number\|string`                                                                                        | `Promise<AppointmentEntity\|null>`           |
| `checkStaffAvailability(staff_id, startAt, endAt)` | Checks for overlapping non-cancelled appointments.                      | `staff_id`, `startAt: Date`, `endAt: Date`                                                                  | `Promise<boolean>` — true if conflict exists |

---

### 13.14 View Controllers

File: `src/controllers/views/`

| Controller                            | Method                               | Description                                                                                                                                                                                             | Returns                              |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `authView.controller.js`              | `renderLogin(req, res)`              | Renders the login page with optional flash message.                                                                                                                                                     | `res.render("login")`                |
| `authView.controller.js`              | `login(req, res)`                    | Processes login form, sets cookie, redirects by role.                                                                                                                                                   | Redirect                             |
| `authView.controller.js`              | `renderRegister(req, res)`           | Renders the registration page.                                                                                                                                                                          | `res.render("register")`             |
| `authView.controller.js`              | `register(req, res)`                 | Processes registration, sets cookie, redirects to client home.                                                                                                                                          | Redirect                             |
| `authView.controller.js`              | `logout(req, res)`                   | Clears auth cookie and redirects to login.                                                                                                                                                              | Redirect                             |
| `clientView.controller.js`            | `renderClientHome(req, res)`         | Fetches categories and weather concurrently; renders client home.                                                                                                                                       | `res.render("client-home")`          |
| `clientView.controller.js`            | `renderServicesByCategory(req, res)` | Fetches services for a category; renders service list.                                                                                                                                                  | `res.render("services-by-category")` |
| `clientView.controller.js`            | `renderBookAppointment(req, res)`    | Fetches service, staff list, time slots; renders booking form.                                                                                                                                          | `res.render("book-appointment")`     |
| `clientView.controller.js`            | `bookAppointment(req, res)`          | Processes booking form submission, creates appointment via service.                                                                                                                                     | Redirect                             |
| `clientView.controller.js`            | `renderMyAppointments(req, res)`     | Fetches client's appointments; renders appointment list.                                                                                                                                                | `res.render("my-appointments")`      |
| `clientView.controller.js`            | `cancelMyAppointment(req, res)`      | Cancels one appointment for the logged-in client.                                                                                                                                                       | Redirect                             |
| `profileView.controller.js`           | `renderProfile(req, res)`            | Renders profile page for the logged-in user (any role).                                                                                                                                                 | `res.render("profile")`              |
| `profileView.controller.js`           | `updateProfile(req, res)`            | Processes profile update form submission.                                                                                                                                                               | Redirect                             |
| `profileView.controller.js`           | `changePassword(req, res)`           | Processes password change form submission.                                                                                                                                                              | Redirect                             |
| `staffDashboardView.controller.js`    | `renderStaffDashboard(req, res)`     | Fetches staff's full appointment list; computes today's schedule, stats, upcoming appointments, recent activity, and calendar data. Supports `?date=YYYY-MM-DD` and `?calYear=&calMonth=` query params. | `res.render("staff-dashboard")`      |
| `adminDashboardView.controller.js`    | `renderAdminDashboard(req, res)`     | Fetches global stats (users, categories, services, appointments) and renders admin dashboard.                                                                                                           | `res.render("admin-dashboard")`      |
| `adminUserView.controller.js`         | `renderManageUsers(req, res)`        | Fetches all users; renders user management table.                                                                                                                                                       | `res.render("manage-users")`         |
| `adminCategoryView.controller.js`     | `renderAdminCategories(req, res)`    | Fetches all categories; renders category management page.                                                                                                                                               | `res.render("admin-categories")`     |
| `adminServiceView.controller.js`      | `renderAdminServices(req, res)`      | Fetches all services; renders service management page.                                                                                                                                                  | `res.render("admin-services")`       |
| `adminStaffServiceView.controller.js` | `renderAdminStaffServices(req, res)` | Fetches all staff-service assignments; renders assignment page.                                                                                                                                         | `res.render("admin-staff-services")` |
| `adminAppointmentView.controller.js`  | `renderAdminAppointments(req, res)`  | Fetches all appointments; renders appointment management page.                                                                                                                                          | `res.render("admin-appointments")`   |

---

## 14. Testing Guide

### 14.1 Manual Testing — Frontend (Browser)

**Step 1: Client workflow**

1. Open `http://localhost:4000`
2. Click "Register" — fill in name, email, phone, password
3. After registration, you are redirected to the client home page
4. Click a service category card
5. Click a service card on the services page
6. Select a staff member, date, and time slot — submit the booking form
7. Navigate to "My Appointments" — verify the booking appears with status `pending`
8. Click "Cancel" on the appointment — verify status changes to `cancelled`
9. Click "Profile" — update name or phone — verify success message
10. Click "Logout" — verify redirect to login page

**Step 2: Admin workflow**

1. Login with an admin account
2. Verify redirect to admin dashboard
3. Navigate to "Categories" — create a new category, update it, disable it
4. Navigate to "Services" — create a service linked to a category
5. Navigate to "Staff Services" — assign a service to a staff member
6. Navigate to "Appointments" — find a booking — change its status to `confirmed`
7. Navigate to "Users" — create a new staff user
8. Click "Profile" — change password
9. Logout

**Step 3: Staff workflow**

1. Login with a staff account
2. Verify redirect to staff dashboard
3. Observe stats (today's count, week total) and calendar
4. Click a different calendar day — verify the schedule card updates for that date
5. Navigate to "Profile" — update information
6. Logout

**Step 4: Authorization testing**

1. While logged in as a client, manually visit `/views/admin-dashboard` — expect "Not Authorized" page
2. While logged in as a staff, visit `/views/client-home` — expect "Not Authorized" page
3. Logout, then try visiting `/views/admin-dashboard` directly — expect redirect to login

---

### 14.2 API Testing with Postman

A full Postman collection guide is available at: `docs/POSTMAN_WORKSPACE.md`

**Quick test sequence:**

```bash
# 1. Register
POST http://localhost:4000/api/auth/register
Content-Type: application/json
{ "user_fullname": "Test Client", "user_email": "client@test.com", "user_password": "Password123", "user_phone": "71000000" }

# 2. Login
POST http://localhost:4000/api/auth/login
Content-Type: application/json
{ "user_email": "client@test.com", "user_password": "Password123" }
# Copy the returned token

# 3. Get all categories (authenticated)
GET http://localhost:4000/api/categories/GetAllCategories
Authorization: Bearer <token>

# 4. Book appointment
POST http://localhost:4000/api/appointments/CreateAppointment
Authorization: Bearer <admin_or_client_token>
Content-Type: application/json
{ "client_id": 1, "staff_id": 2, "starts_at": "2026-06-01T10:00:00", "service_items": [1] }

# 5. Test forbidden access (use client token on admin route)
GET http://localhost:4000/api/users
Authorization: Bearer <client_token>
# Expect: 403 Access denied
```

**Test conflict detection:**

```bash
# Book the same staff at the same time twice
# Second request should return 409 "Staff is not available"
```

---

## 15. Application Views Preview

Screenshots are stored in `docs/screenshots/`. To add your own, capture the pages listed below and save them with the exact filenames shown.

| Screenshot file          | Page                                                     |
| ------------------------ | -------------------------------------------------------- |
| `login.png`              | `/views/login` — login form                              |
| `admin-dashboard.png`    | `/views/admin-dashboard` — admin stats overview          |
| `manage-users.png`       | `/views/manage-users` — user management table            |
| `admin-categories.png`   | `/views/admin-categories` — category management          |
| `admin-appointments.png` | `/views/admin-appointments` — appointment table          |
| `staff-dashboard.png`    | `/views/staff-dashboard` — staff calendar and schedule   |
| `client-home.png`        | `/views/client-home` — category browser + weather widget |
| `book-appointment.png`   | `/views/book-appointment` — booking form                 |
| `my-appointments.png`    | `/views/my-appointments` — client appointment history    |
| `profile.png`            | `/views/profile` — user profile and password form        |

> To make the screenshots appear in this README, place the PNG files in `docs/screenshots/` and uncomment the image references below.

<!--
### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Admin — Manage Users
![Manage Users](docs/screenshots/manage-users.png)

### Admin — Categories
![Admin Categories](docs/screenshots/admin-categories.png)

### Admin — Appointments
![Admin Appointments](docs/screenshots/admin-appointments.png)

### Staff Dashboard
![Staff Dashboard](docs/screenshots/staff-dashboard.png)

### Client Home
![Client Home](docs/screenshots/client-home.png)

### Book Appointment
![Book Appointment](docs/screenshots/book-appointment.png)

### My Appointments
![My Appointments](docs/screenshots/my-appointments.png)

### Profile
![Profile](docs/screenshots/profile.png)

### Login
![Login](docs/screenshots/login.png)
-->

## 16. Security Considerations

The following security practices are implemented:

| Practice                       | Implementation                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Password hashing               | `bcrypt` with default salt rounds on every registration and password change     |
| Signed token authentication    | Custom HMAC-SHA256 token with expiration — not stored server-side               |
| Role-based access control      | Every view and API route enforces role and ownership checks                     |
| Self-ownership authorization   | Users can only access their own data unless they are admin                      |
| Input validation               | `express-validator` on all API routes; HTML `required` attributes on view forms |
| Cookie-based session for views | `auth_token` HTTP cookie; not exposed to client JavaScript                      |
| Environment variable secrets   | `AUTH_SECRET`, database credentials loaded from `.env` — never hardcoded        |
| Centralized error responses    | `handleError` prevents stack trace leakage to API clients                       |

**Recommended for production deployment:**

- Rotate `AUTH_SECRET` per environment
- Enable HTTPS
- Add rate limiting on `/api/auth/*`
- Set `httpOnly` and `secure` flags on the auth cookie
- Add request logging and audit trails for admin actions

---

## 17. Future Improvements

| Item                    | Description                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Staff Appointments Page | Dedicated `/views/staff-appointments` page for staff to view their full schedule   |
| Staff Services Page     | Dedicated `/views/staff-services` page for staff to view assigned services         |
| Staff Customers Page    | Dedicated `/views/staff-customers` page for staff to view their client list        |
| Global 404 Handler      | Add a catch-all `app.use` handler in `app.js` for unknown routes                   |
| Automated Tests         | Replace the placeholder `npm test` script with a real test suite (Jest, Supertest) |
| Public Holiday Warning  | Integrate a public holiday API to warn users when selecting a holiday date         |
| OpenAPI / Swagger       | Generate interactive API documentation                                             |
| Pagination              | Add pagination to long lists (users, appointments, services)                       |
| Email Notifications     | Send booking confirmation emails to clients and staff                              |
| Token Refresh           | Add refresh token support to extend sessions without re-login                      |
| Appointment Reminders   | Scheduled job to notify staff/clients before appointments                          |

---

## Quick Start Summary

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env    # or create .env manually
# Edit .env with your database credentials and AUTH_SECRET

# 3. Set up database
psql -U postgres -d your_db -f database/csis-228.sql

# 4. Run
npm run dev

# 5. Open
http://localhost:4000
```

---

_Smart Booking System � CSIS 228 Final Project_
