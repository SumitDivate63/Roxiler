# Store Rating App

A full-stack web application that allows users to view registered stores and submit ratings from 1 to 5. The application uses role-based access control to provide different functionality for System Administrators, Normal Users, and Store Owners.

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Sequelize
* MySQL
* JWT
* bcrypt
* express-validator

### Database

* MySQL 8
* Sequelize ORM

---

## User Roles

The application supports three roles:

### System Administrator

* View dashboard statistics
* Add users and administrators
* Add store owners
* Add stores
* Assign stores to store owners
* View and manage users
* View and manage stores
* Filter, sort, and paginate users and stores
* View individual user details
* View store owner rating information

### Normal User

* Register and log in
* View registered stores
* Search stores by name and address
* Sort and paginate stores
* View overall store ratings
* Submit a rating from 1 to 5
* Modify an existing rating
* Update password
* Log out

### Store Owner

* Log in
* View their assigned store
* View average store rating
* View users who submitted ratings
* View rating details and dates
* Update password
* Log out

---

## Project Structure

```text
store-rating-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Store.js
│   │   │   ├── Rating.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── owner/
│   │   │   └── user/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Install the following before running the project:

* Node.js
* npm
* MySQL 8.x
* Git

Check the installations:

```bash
node --version
npm --version
mysql --version
git --version
```

---

## MySQL Setup

Start the MySQL server and open the MySQL client.

```bash
mysql -u root -p
```

Create the application database:

```sql
CREATE DATABASE store_rating_app;
```

Create the application database user:

```sql
CREATE USER 'store_app_user'@'localhost'
IDENTIFIED BY 'your_strong_password';
```

Grant access:

```sql
GRANT ALL PRIVILEGES ON store_rating_app.*
TO 'store_app_user'@'localhost';

FLUSH PRIVILEGES;
```

Verify the database:

```sql
USE store_rating_app;
SHOW TABLES;
```

The database can initially be empty.

### Automatic Table Creation

You do not need to manually create the application tables.

When the backend starts, Sequelize runs:

```javascript
sequelize.sync({ alter: true });
```

This creates and synchronizes the required tables:

```text
Users
Stores
Ratings
```

---

## Database Schema

### Users

| Field     | Description                 |
| --------- | --------------------------- |
| id        | Primary key                 |
| name      | User name                   |
| email     | Unique email                |
| password  | bcrypt hashed password      |
| address   | User address                |
| role      | admin, user, or store_owner |
| createdAt | Creation timestamp          |
| updatedAt | Last update timestamp       |

### Stores

| Field     | Description                    |
| --------- | ------------------------------ |
| id        | Primary key                    |
| name      | Store name                     |
| email     | Store email                    |
| address   | Store address                  |
| ownerId   | Optional Store Owner reference |
| createdAt | Creation timestamp             |
| updatedAt | Last update timestamp          |

### Ratings

| Field     | Description                   |
| --------- | ----------------------------- |
| id        | Primary key                   |
| userId    | User who submitted the rating |
| storeId   | Rated store                   |
| value     | Rating from 1 to 5            |
| createdAt | Rating timestamp              |
| updatedAt | Last update timestamp         |

A unique composite constraint on:

```text
(userId, storeId)
```

ensures that one user can have only one rating for a particular store. Submitting another rating updates the existing rating.

---

## Backend Environment Variables

Create:

```text
backend/.env
```

Use the following structure:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_app
DB_USER=store_app_user
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d

ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123!
```

Do not commit the `.env` file.

The repository contains `.env.example` as a template.

---

## Frontend Environment Variables

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend uses this value for Axios API requests.

Do not commit the frontend `.env` file.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd store-rating-app
```

### Backend

```bash
cd backend
npm install
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

---

## Seed the Administrator

Make sure the backend `.env` contains:

```env
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123!
```

From the `backend` directory:

```bash
npm run seed
```

The seed script:

* connects to MySQL
* checks whether the administrator already exists
* hashes the password using bcrypt
* creates the administrator with `role = admin`
* avoids creating duplicate administrator accounts

---

## Running the Application

### Start Backend

From:

```text
backend/
```

run:

```bash
node src/server.js
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is healthy",
  "database": "connected"
}
```

### Start Frontend

From:

```text
frontend/
```

run:

```bash
npm run dev
```

Vite will provide the local frontend URL, normally:

```text
http://localhost:5173
```

---

## Authentication

The application uses JWT-based authentication.

After login, the backend returns a JWT containing the authenticated user's:

* user ID
* role

The frontend stores the authentication state and Axios automatically attaches the token to protected requests:

```text
Authorization: Bearer <token>
```

Authentication middleware verifies the token before protected routes are accessed.

Role authorization is handled separately using:

```text
admin
user
store_owner
```

---

## Validation Rules

### Name

```text
Minimum: 20 characters
Maximum: 60 characters
```

### Address

```text
Maximum: 400 characters
```

### Password

```text
Minimum: 8 characters
Maximum: 16 characters
At least one uppercase letter
At least one special character
```

### Email

Must follow standard email validation rules.

### Rating

Ratings must be integers between:

```text
1 and 5
```

---

## API Endpoints

### Authentication

| Method | Endpoint                    | Access        |
| ------ | --------------------------- | ------------- |
| POST   | `/api/auth/register`        | Public        |
| POST   | `/api/auth/login`           | Public        |
| PUT    | `/api/auth/update-password` | Authenticated |

### Health

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | `/api/health` | Public |

### Admin

| Method | Endpoint               | Access |
| ------ | ---------------------- | ------ |
| GET    | `/api/admin/dashboard` | Admin  |
| POST   | `/api/admin/users`     | Admin  |
| GET    | `/api/admin/users`     | Admin  |
| GET    | `/api/admin/users/:id` | Admin  |
| POST   | `/api/admin/stores`    | Admin  |
| GET    | `/api/admin/stores`    | Admin  |

### Normal User

| Method | Endpoint       | Access      |
| ------ | -------------- | ----------- |
| GET    | `/api/stores`  | Normal User |
| POST   | `/api/ratings` | Normal User |

### Store Owner

| Method | Endpoint               | Access      |
| ------ | ---------------------- | ----------- |
| GET    | `/api/owner/dashboard` | Store Owner |

---

## API Features

### Admin

User and store listings support:

* filtering
* sorting
* ascending/descending order
* pagination

User filters include:

```text
name
email
address
role
```

Store filters include:

```text
name
email
address
```

### Normal User

Store listing supports:

```text
name search
address search
sorting
pagination
```

The store listing displays:

```text
Store Name
Address
Overall Rating
User's Rating
```

### Ratings

A normal user can submit or modify a rating through:

```text
POST /api/ratings
```

The backend automatically determines the user from the authenticated JWT.

The client does not provide `userId`.

If the user has already rated the store, the existing rating is updated.

---

## Error Handling

The API uses a consistent JSON response format.

Successful response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Validation errors may return:

```json
{
  "success": false,
  "errors": []
}
```

Other errors return:

```json
{
  "success": false,
  "message": "Error message"
}
```

Authentication failures return HTTP `401`.

Authorization failures return HTTP `403`.

Missing resources return HTTP `404`.

---

## Security

The application follows several basic security practices:

* Passwords are hashed using bcrypt.
* JWT is used for authentication.
* Role-based authorization protects restricted endpoints.
* Password hashes are never returned through the API.
* Public registration cannot create privileged accounts.
* Admin-only user creation supports role assignment.
* Store owner assignment is validated by the backend.
* Rating ownership is determined from the authenticated JWT.
* Duplicate user/store ratings are prevented using a database constraint.
* Environment credentials are stored outside source code.
* `.env` files are excluded from Git.
* Sortable database fields are restricted to approved fields.
* Pagination parameters are validated.
* Production error responses do not expose stack traces.

---

## Frontend Pages

### Public

```text
/login
/signup
/not-authorized
```

### Admin

```text
/admin/dashboard
/admin/users
/admin/users/add
/admin/users/:id
/admin/stores
/admin/stores/add
```

### Normal User

```text
/user/stores
/user/update-password
```

### Store Owner

```text
/owner/dashboard
/owner/update-password
```

Routes are protected according to the authenticated user's role.

---

## UI

The frontend uses a professional B2B-style interface with:

* corporate navy
* slate-gray secondary text
* muted gold rating accent
* white surfaces
* subtle borders
* responsive tables
* accessible forms
* loading states
* empty states
* error and success feedback

The application branding is centralized in:

```text
frontend/src/config/branding.js
```

The current logo is stored in:

```text
frontend/src/assets/logo.jpg
```

---

## Development Notes

The backend uses:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
Sequelize
   ↓
MySQL
```

The frontend uses:

```text
React
   ↓
React Router
   ↓
AuthContext
   ↓
Axios
   ↓
Express API
```

Business logic is kept separate from route definitions, and reusable frontend components are used for common UI patterns such as tables and authentication protection.

---

## Production Build

To create a production frontend build:

```bash
cd frontend
npm run build
```

The generated build is placed in the Vite build output directory.

---

## Git and Environment Files

The following files/directories should not be committed:

```text
node_modules/
.env
dist/
build/
```

The repository should contain environment templates such as:

```text
backend/.env.example
frontend/.env.example
```

These templates should contain placeholders rather than real credentials.

---

## Initial Test Flow

After starting MySQL, backend, and frontend:

1. Seed the administrator.
2. Log in as the administrator.
3. Create a Store Owner.
4. Create a store and assign the Store Owner.
5. Register a Normal User.
6. Log in as the Normal User.
7. Open the store listing.
8. Submit a rating from 1–5.
9. Modify the rating.
10. Log in as the Store Owner.
11. Verify the average rating and rater information.
12. Return to the administrator account and verify the dashboard statistics.

---

## Project Status

The application implements the requirements of the FullStack Intern Coding Challenge, including:

* role-based authentication
* MySQL database integration
* store management
* user management
* store owner management
* store ratings
* rating modification
* filtering
* sorting
* pagination
* responsive React frontend
* validation
* centralized error handling
* protected API routes

The project has been tested across the main user flows and role-based access scenarios.
