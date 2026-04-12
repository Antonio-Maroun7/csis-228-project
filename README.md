# Project 228 Backend API

Salon Appointment and Service Management Backend

## Project Overview

This backend is a role-based salon operations API built with Node.js, Express, and PostgreSQL.
It supports the full lifecycle of salon operations:

- user registration and login
- category and service catalog management
- assigning services to staff with optional staff-specific overrides
- appointment creation and scheduling validation
- appointment item management linked to appointments

The system is designed for three user roles:

- admin: platform and management control
- staff: operational access within assigned scope
- client: end-user booking and self-service operations

The backend provides structured validation, layered architecture, and middleware-driven security to keep business logic consistent and endpoints protected.

---

## Project Idea and Purpose

The core idea is to centralize salon booking operations in a single backend API where:

- clients can register, authenticate, browse offerings, and create/manage their own appointments
- staff can view and operate within their own assignment/scheduling boundaries
- admins can manage the entire system (users, services, categories, assignments, reports-like queries)

The booking flow enforces business safety rules such as:

- role checks before actions
- self-access checks for user/staff/client scoped operations
- schedule conflict prevention for staff appointments
- restrictions on updating cancelled/completed appointments and items

---

## Key Features

- Authentication and token-based session flow
- User management with profile and password operations
- Category management (create/update/disable/read)
- Service management (create/update/disable/read/filter by category)
- Staff-service assignment with optional override duration/price
- Appointment management:
  - create, get, update, cancel, status update
  - conflict checking for staff schedule overlap
  - date-range retrieval with client join data
- Appointment item management linked to appointment ownership
- Request validation using express-validator
- Role-based access control and self-authorization middleware
- Centralized error mapping with consistent HTTP status handling

---

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (pg)
- dotenv
- bcrypt
- express-validator
- cors
- http-errors
- jsonwebtoken (installed dependency; current token implementation uses custom HMAC utility in code)

---

## Project Architecture

This backend follows a layered architecture:

- Routes: define endpoint paths and attach middleware/validators/controller handlers
- Controllers: translate HTTP requests into service calls and HTTP responses
- Services: enforce business rules and coordinate repository calls
- Repositories: execute SQL against PostgreSQL
- Entities: database-shaped models (snake_case)
- DTOs/Mappers: response/request transformation and contract shaping
- Validators: input rules per endpoint/module
- Middleware:
  - authenticate: verifies token and injects req.user
  - authorize: role checks + self-access helpers
- Utils:
  - token utility (signed token generation/verification)
  - error handler (maps known errors to status codes)
- DB layer:
  - shared Pool client for PostgreSQL connection

---

## Folder Structure

```text
project-228/
├─ package.json
├─ README.md
└─ src/
	 ├─ app.js
	 ├─ server.js
	 ├─ db/
	 │  └─ pool.js
	 ├─ middleware/
	 │  ├─ auth.middleware.js
	 │  └─ authorize.middleware.js
	 ├─ utils/
	 │  ├─ errorHandler.js
	 │  └─ token.js
	 ├─ routes/
	 │  ├─ auth.routes.js
	 │  ├─ user.route.js
	 │  ├─ category.route.js
	 │  ├─ services.route.js
	 │  ├─ staffService.route.js
	 │  ├─ appointment.route.js
	 │  └─ appointment_item.route.js
	 ├─ controllers/
	 │  ├─ auth.controller.js
	 │  ├─ user.controller.js
	 │  ├─ category.controller.js
	 │  ├─ service.controller.js
	 │  ├─ staffService.controller.js
	 │  ├─ appointment.controller.js
	 │  └─ appointment_item.controller.js
	 ├─ services/
	 │  ├─ auth.service.js
	 │  ├─ user.service.js
	 │  ├─ category.service.js
	 │  ├─ services.service.js
	 │  ├─ staffService.service.js
	 │  ├─ appointment.service.js
	 │  └─ appointment_item.service.js
	 ├─ repositories/
	 │  ├─ auth.repository.js
	 │  ├─ user.repository.js
	 │  ├─ category.repository.js
	 │  ├─ services.repository.js
	 │  ├─ staffService.repository.js
	 │  ├─ appointment.repository.js
	 │  └─ appointment_item.repository.js
	 ├─ entities/
	 │  ├─ user.entity.js
	 │  ├─ category.entity.js
	 │  ├─ service.entity.js
	 │  ├─ staffService.entity.js
	 │  ├─ appointment.entity.js
	 │  ├─ appointment_item.entity.js
	 │  └─ appointmentWithClient.entity.js
	 ├─ dto/
	 │  ├─ user.dto.js
	 │  ├─ category.dto.js
	 │  ├─ service.dto.js
	 │  ├─ staffService.dto.js
	 │  ├─ appointment.dto.js
	 │  ├─ appointment_item.dto.js
	 │  └─ appointmentWithClient.dto.js
	 ├─ mappers/
	 │  ├─ user.mapper.js
	 │  ├─ category.mapper.js
	 │  ├─ service.mapper.js
	 │  ├─ staffService.mapper.js
	 │  ├─ appointment.mapper.js
	 │  └─ appointment_item.mapper.js
	 └─ validators/
			├─ auth.validator.js
			├─ user.validator.js
			├─ category.validator.js
			├─ service.validator.js
			├─ staffService.validator.js
			├─ appointment.validator.js
			└─ appointment_item.validator.js
```

---

## Database Overview

### Core Tables

- users
  Stores identity, credentials (hashed), role, activation status.

- categories
  Logical grouping for services (active/inactive support).

- services
  Service catalog linked to categories with default duration/price.

- staff_services
  Many-to-many relation between staff and services, with optional override duration/price per staff member.

- appointments
  Main booking record linking client and staff with start/end, status, notes, created timestamp.

- appointment_items
  Line items for an appointment (service-level pricing/duration details).

### Main Relationships

- categories 1 -> many services
- users (staff) many <-> many services via staff_services
- users (client/staff) -> appointments (client_id, staff_id)
- appointments 1 -> many appointment_items

---

## Authentication and Authorization

### Authentication

- Login validates email/password (bcrypt compare) and returns signed token.
- Registration creates user accounts as client role by default.
- Protected routes require Authorization Bearer token.
- Token payload includes user id, email, role, and expiration.

Important note:
The project uses a custom HMAC-signed token utility (JWT-like shape), not jsonwebtoken runtime APIs in current code.

### Authorization

Role model:

- admin
- staff
- client

Authorization strategy:

- Role-based checks per route via authorize([roles])
- Self-access checks for ownership/scoped access via helpers:
  - selfByIdOrRoles
  - selfByEmailOrRoles
  - selfByBodyIdOrRoles
  - selfByParamIdOrRoles
  - selfByAppointmentIdOrRoles
  - selfByAppointmentBodyIdOrRoles
  - selfByAppointmentItemIdOrRoles

This enables patterns like:

- admin full bypass
- staff/client restricted to their own user/appointment/appointment-item context where applicable

---

## API Endpoints

Base URL:

- /api

### Auth

| Method | Path           | Description                           | Auth Required | Roles  | Self Check |
| ------ | -------------- | ------------------------------------- | ------------- | ------ | ---------- |
| POST   | /auth/login    | Authenticate user and return token    | No            | Public | No         |
| POST   | /auth/register | Register new user (created as client) | No            | Public | No         |

### Users

| Method | Path                                     | Description              | Auth Required | Roles                | Self Check         |
| ------ | ---------------------------------------- | ------------------------ | ------------- | -------------------- | ------------------ |
| GET    | /users                                   | Get all users            | Yes           | admin                | No                 |
| GET    | /users/:id                               | Get user by id           | Yes           | admin, staff, client | Yes (admin bypass) |
| GET    | /users/email/:user_email                 | Get user by email        | Yes           | admin, staff, client | Yes (admin bypass) |
| PUT    | /users/UpdateUser/:id                    | Update user profile      | Yes           | admin, staff, client | Yes (admin bypass) |
| PUT    | /users/changePasswordByEmail/:user_email | Change password by email | Yes           | admin, staff, client | Yes (admin bypass) |
| DELETE | /users/deleteUser/:id                    | Delete user              | Yes           | admin                | No                 |

### Categories

| Method | Path                            | Description        | Auth Required | Roles                | Self Check |
| ------ | ------------------------------- | ------------------ | ------------- | -------------------- | ---------- |
| GET    | /categories/GetAllCategories    | List categories    | Yes           | admin, staff, client | No         |
| GET    | /categories/GetCategoryById/:id | Get category by id | Yes           | admin, staff, client | No         |
| POST   | /categories/CreateCategory      | Create category    | Yes           | admin                | No         |
| PUT    | /categories/UpdateCategory/:id  | Update category    | Yes           | admin                | No         |
| PUT    | /categories/DisableCategory/:id | Disable category   | Yes           | admin                | No         |

### Services

| Method | Path                                | Description               | Auth Required | Roles                | Self Check |
| ------ | ----------------------------------- | ------------------------- | ------------- | -------------------- | ---------- |
| GET    | /services/getAllServices            | List services             | Yes           | admin, staff, client | No         |
| GET    | /services/ServiceById/:id           | Get service by id         | Yes           | admin, staff, client | No         |
| GET    | /services/getServicesByCategory/:id | List services by category | Yes           | admin, staff, client | No         |
| POST   | /services/createService             | Create service            | Yes           | admin                | No         |
| PUT    | /services/updateService/:id         | Update service            | Yes           | admin                | No         |
| PUT    | /services/disableService/:id        | Disable service           | Yes           | admin                | No         |

### Staff Services

| Method | Path                                         | Description                        | Auth Required | Roles                | Self Check                         |
| ------ | -------------------------------------------- | ---------------------------------- | ------------- | -------------------- | ---------------------------------- |
| GET    | /staffServices/getAllStaffServices           | List all staff-service assignments | Yes           | admin                | No                                 |
| POST   | /staffServices/assignServiceToStaff          | Assign service to staff            | Yes           | admin                | No                                 |
| PUT    | /staffServices/updateStaffService            | Update override duration/price     | Yes           | admin, staff         | Yes (staff_id body, admin bypass)  |
| DELETE | /staffServices/removeServiceFromStaff        | Remove assignment                  | Yes           | admin                | No                                 |
| GET    | /staffServices/getStaffByService/:service_id | List staff by service              | Yes           | admin, staff, client | No                                 |
| GET    | /staffServices/getStaffServices/:staff_id    | List services for one staff member | Yes           | admin, staff         | Yes (staff_id param, admin bypass) |

### Appointments

| Method | Path                                         | Description                         | Auth Required | Roles                | Self Check                                |
| ------ | -------------------------------------------- | ----------------------------------- | ------------- | -------------------- | ----------------------------------------- |
| POST   | /appointments/CreateAppointment              | Create appointment                  | Yes           | admin, client        | Yes (client_id body, admin bypass)        |
| GET    | /appointments/GetAllAppointmentsByClient/:id | Get appointments by client          | Yes           | admin, client        | Yes (id param, admin bypass)              |
| GET    | /appointments/GetAllAppointmentsByStaff/:id  | Get appointments by staff           | Yes           | admin, staff         | Yes (id param, admin bypass)              |
| GET    | /appointments/GetAppointmentById/:id         | Get appointment by id               | Yes           | admin, staff, client | Yes (appointment ownership, admin bypass) |
| PUT    | /appointments/UpdateAppointmentStatus/:id    | Update appointment status           | Yes           | admin, staff         | Yes (appointment ownership, admin bypass) |
| PUT    | /appointments/CancelAppointment/:id          | Cancel appointment                  | Yes           | admin, staff, client | Yes (appointment ownership, admin bypass) |
| PUT    | /appointments/UpdateAppointment/:id          | Update appointment details          | Yes           | admin, staff, client | Yes (appointment ownership, admin bypass) |
| POST   | /appointments/CheckAppointmentConflict       | Check staff time conflict           | Yes           | admin, staff         | Yes (staff_id body, admin bypass)         |
| GET    | /appointments/GetAppointmentsBetweenDates    | Retrieve appointments in date range | Yes           | admin                | No                                        |

### Appointment Items

| Method | Path                                                     | Description                | Auth Required | Roles                | Self Check                                                       |
| ------ | -------------------------------------------------------- | -------------------------- | ------------- | -------------------- | ---------------------------------------------------------------- |
| POST   | /appointmentItems/CreateAppointmentItem                  | Create appointment item    | Yes           | admin, staff, client | Yes (appointment ownership by body appointment_id, admin bypass) |
| GET    | /appointmentItems/GetAppointmentItemById/:id             | Get appointment item by id | Yes           | admin, staff, client | Yes (parent appointment ownership, admin bypass)                 |
| GET    | /appointmentItems/GetAppointmentItemsByAppointmentId/:id | List items for appointment | Yes           | admin, staff, client | Yes (appointment ownership by param, admin bypass)               |
| PUT    | /appointmentItems/UpdateAppointmentItem/:id              | Update appointment item    | Yes           | admin, staff, client | Yes (parent appointment ownership, admin bypass)                 |
| DELETE | /appointmentItems/DeleteAppointmentItem/:id              | Delete appointment item    | Yes           | admin, staff, client | Yes (parent appointment ownership, admin bypass)                 |

---

## Secure Endpoints / Protection Summary

- Public endpoints:
  - POST /api/auth/login
  - POST /api/auth/register

- Admin-only management:
  - category create/update/disable
  - service create/update/disable
  - user delete, users list
  - assign/remove staff-service
  - get all staff-service assignments
  - date-range appointment report endpoint

- Scoped protected endpoints:
  - user profile/password/email lookups use self-check with admin override
  - appointment routes enforce ownership (client_id/staff_id relationship)
  - appointment item routes enforce parent appointment ownership

This gives least-privilege access while keeping operational routes usable.

---

## Request Validation

Validation is implemented using express-validator in module-specific validator files.
Typical validation patterns include:

- required fields
- integer and boolean checks
- email format checks
- password complexity constraints
- date format checks (ISO8601)
- custom body rules (for example, requiring at least one override field)

Validators are attached at route level before controller logic.

---

## Error Handling

The backend uses a centralized error helper that maps known business errors to HTTP status codes:

- 400 for validation/business-rule violations
- 401 for invalid credentials/token
- 403 for inactive user and forbidden role access
- 404 for missing resources
- 409 for conflict-style errors (including overlap constraints when database code is raised)
- 500 fallback for unclassified errors

This keeps controller code clean and response handling consistent.

---

## Setup and Installation

1. Clone repository

   git clone <your-repository-url>
   cd project-228

2. Install dependencies

   npm install

3. Configure environment variables
   Create a .env file at project root.

4. Prepare PostgreSQL database
   Ensure your schema/tables exist and match repository SQL usage.

5. Start server

   npm start

6. Development mode

   npm run dev

Default server port:

- 4000 (or PORT from environment)

---

## Environment Variables

Based on current code, configure:

- PORT
  Server listening port (optional; defaults to 4000)

- PG_USER
  PostgreSQL username

- PG_PASSWORD
  PostgreSQL password

- PG_HOST
  PostgreSQL host

- PG_PORT
  PostgreSQL port

- PG_DATABASE
  PostgreSQL database name

- AUTH_SECRET
  Token signing secret used by token utility

- AUTH_TOKEN_TTL_SECONDS
  Token lifetime in seconds (optional; defaults to 3600)

---

## Running and Testing the API

Current scripts:

- npm start: run server
- npm run dev: run server with nodemon
- npm test: placeholder script (no automated tests configured yet)

Manual API testing (Postman):

1. Register user via POST /api/auth/register
2. Login via POST /api/auth/login and copy token
3. Set Authorization header:
   Bearer <token>
4. Call protected endpoints according to role
5. Validate forbidden/ownership scenarios by changing token role and route payload ids

---

## Example Workflow

1. Client registers and logs in
2. Client browses categories and services
3. Admin assigns services to staff (if not already assigned)
4. Client creates appointment with:
   - client_id
   - staff_id
   - starts_at
   - service_items
5. System calculates total duration/price and checks staff conflict
6. Appointment is created
7. Appointment items can be added/updated/deleted only by authorized owner (or admin)
8. Staff/admin can update appointment status and operational fields
9. Admin can retrieve appointment date-range data for reporting/monitoring

---

## Security Considerations

Implemented practices:

- Password hashing with bcrypt
- Signed token authentication with expiration
- Role-based route authorization
- Self-ownership authorization helpers to prevent horizontal privilege abuse
- Input validation on payloads and params
- Centralized error responses to avoid leaking stack traces

Recommended operational hardening:

- rotate AUTH_SECRET per environment
- enforce HTTPS in production
- add rate limiting on auth endpoints
- introduce automated security and integration tests
- add audit logging for admin actions

---

## Future Improvements

- Add automated test suite (unit + integration) and replace placeholder npm test
- Introduce API documentation standard (OpenAPI/Swagger)
- Add migration tooling and schema versioning
- Improve consistency of naming conventions across DTO response shapes
- Add pagination/filtering for list endpoints
- Add refresh token / token revocation strategy
- Add global logging/monitoring and structured observability

---

## Conclusion

Project 228 backend is a layered, role-aware appointment management API that models real salon workflows with strong operational rules.
It combines business validation, conflict prevention, and ownership-based access control to support admin, staff, and client interactions safely and predictably.
With automated tests and deployment hardening added next, this project is well-positioned for both academic evaluation and practical team development.
