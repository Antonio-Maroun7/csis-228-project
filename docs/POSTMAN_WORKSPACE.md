# Postman Workspace Guide

This document helps you organize and test the API quickly in Postman.

## 1. Create Workspace and Collection

Workspace name suggestion:

- Project 228 Backend

Collection name suggestion:

- project-228-api

Folder structure suggestion inside the collection:

- Auth
- Users
- Categories
- Services
- Staff Services
- Appointments
- Appointment Items

## 2. Environment Variables

Create a Postman environment (for example: local) with:

- baseUrl = http://localhost:4000/api
- token = (empty at first)
- adminUserEmail = (optional)
- adminUserPassword = (optional)

## 3. Authorization Setup

For protected routes, set Authorization as Bearer Token with:

- {{token}}

Or set header manually:

- Authorization: Bearer {{token}}

## 4. Auth Requests

### Login

- Method: POST
- URL: {{baseUrl}}/auth/login
- Body (JSON):

{
"user_email": "your_email@example.com",
"user_password": "YourPassword123!"
}

After login, copy token from response into environment variable token.

### Register

- Method: POST
- URL: {{baseUrl}}/auth/register
- Body (JSON):

{
"user_fullname": "Test User",
"user_email": "test.user@example.com",
"user_password": "YourPassword123!"
}

## 5. Quick Smoke Test Sequence

1. POST {{baseUrl}}/auth/login
2. GET {{baseUrl}}/services/getAllServices
3. GET {{baseUrl}}/categories/GetAllCategories
4. POST {{baseUrl}}/appointments/CreateAppointment
5. GET {{baseUrl}}/appointments/GetAppointmentById/:id
6. GET {{baseUrl}}/appointmentItems/GetAppointmentItemsByAppointmentId/:id

## 6. Module Endpoint Groups

## Auth

- POST /auth/login
- POST /auth/register

## Users

- GET /users
- GET /users/:id
- GET /users/email/:user_email
- PUT /users/UpdateUser/:id
- PUT /users/changePasswordByEmail/:user_email
- DELETE /users/deleteUser/:id

## Categories

- GET /categories/GetAllCategories
- GET /categories/GetCategoryById/:id
- POST /categories/CreateCategory
- PUT /categories/UpdateCategory/:id
- PUT /categories/DisableCategory/:id

## Services

- GET /services/getAllServices
- GET /services/ServiceById/:id
- GET /services/getServicesByCategory/:id
- POST /services/createService
- PUT /services/updateService/:id
- PUT /services/disableService/:id

## Staff Services

- GET /staffServices/getAllStaffServices
- POST /staffServices/assignServiceToStaff
- PUT /staffServices/updateStaffService
- DELETE /staffServices/removeServiceFromStaff
- GET /staffServices/getStaffByService/:service_id
- GET /staffServices/getStaffServices/:staff_id

## Appointments

- POST /appointments/CreateAppointment
- GET /appointments/GetAllAppointmentsByClient/:id
- GET /appointments/GetAllAppointmentsByStaff/:id
- GET /appointments/GetAppointmentById/:id
- PUT /appointments/UpdateAppointmentStatus/:id
- PUT /appointments/CancelAppointment/:id
- PUT /appointments/UpdateAppointment/:id
- POST /appointments/CheckAppointmentConflict
- GET /appointments/GetAppointmentsBetweenDates

## Appointment Items

- POST /appointmentItems/CreateAppointmentItem
- GET /appointmentItems/GetAppointmentItemById/:id
- GET /appointmentItems/GetAppointmentItemsByAppointmentId/:id
- PUT /appointmentItems/UpdateAppointmentItem/:id
- DELETE /appointmentItems/DeleteAppointmentItem/:id

## 7. Notes

- Use ISO datetime values for appointment payloads.
- For role-protected routes, token role must match endpoint policy.
- A 204 No Content response on delete endpoints is expected and returns no body.
