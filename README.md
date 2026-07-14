# Student Course Enrollment System

A full-stack web app where students browse a course catalog and enroll themselves,
and an admin manages the catalog and views all enrollments.

**Stack:** Node.js + Express (backend) · MySQL (database) · HTML/CSS/JavaScript (frontend, no framework)

---

## Features

**Student**
- Register / log in
- Browse all available courses (with live seat counts)
- Enroll in a course (blocked automatically once it's full or already enrolled)
- View and cancel their own enrollments

**Admin**
- Separate admin login
- Add, edit, delete courses
- View every student's enrollments in one table
- Dashboard stats (total courses, enrolled students, seats filled)

---

## Project Structure

```
enrollment-system/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json
│   ├── .env.example           # Copy to .env and fill in your values
│   ├── config/db.js           # MySQL connection pool
│   ├── middleware/auth.js     # JWT verification + role guard
│   ├── routes/
│   │   ├── auth.js            # register / login / admin login
│   │   ├── courses.js         # course CRUD
│   │   └── enrollments.js     # enroll / unenroll / view
│   └── database/
│       ├── schema.sql         # tables + sample course data
│       └── seed-admin.js      # creates the default admin login
└── frontend/
    ├── index.html              # landing page + student/admin login
    ├── register.html           # student sign up
    ├── dashboard.html          # student dashboard
    ├── admin.html               # admin panel
    ├── css/style.css
    └── js/
        ├── api.js               # shared fetch/auth helpers
        ├── student.js
        └── admin.js
```

---

## Setup

### 1. Install MySQL and create the database
Make sure MySQL is installed and running locally, then load the schema:

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `enrollment_system` database, all four tables, and seeds 5 sample courses.

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and set your MySQL username/password:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=enrollment_system
JWT_SECRET=change_this_to_a_long_random_string
```

### 3. Install dependencies and seed the admin account

```bash
npm install
npm run seed-admin
```

This creates the default admin login:
- **Username:** `admin`
- **Password:** `admin123`

(Change this password in a real deployment — it's only meant to get you started.)

### 4. Start the server

```bash
npm start
```

Or for auto-restart during development:

```bash
npm run dev
```

The app is now running at **http://localhost:5000** — the backend also serves the frontend directly, so you don't need a separate static server.

---

## How It Works

- Passwords are hashed with **bcrypt** before being stored — nothing is ever saved in plain text.
- Login issues a **JWT token** (valid 2 days), stored in the browser's `localStorage` and sent with every API request in the `Authorization: Bearer <token>` header.
- The backend checks that token on every protected route and confirms the user's **role** (`student` or `admin`) before allowing the action — so a student can never hit an admin-only endpoint, even by calling the API directly.
- Enrollment capacity is enforced **server-side**: even if two students click "Enroll" on the last seat at the same time, the database's unique constraint and capacity check prevent overbooking.

## API Reference

| Method | Endpoint                    | Access  | Description                     |
|--------|------------------------------|---------|----------------------------------|
| POST   | `/api/auth/register`         | Public  | Student sign up                 |
| POST   | `/api/auth/login`            | Public  | Student login                   |
| POST   | `/api/auth/admin/login`      | Public  | Admin login                     |
| GET    | `/api/courses`               | Logged in | List all courses              |
| POST   | `/api/courses`               | Admin   | Add a course                    |
| PUT    | `/api/courses/:id`           | Admin   | Edit a course                   |
| DELETE | `/api/courses/:id`           | Admin   | Delete a course                 |
| POST   | `/api/enrollments`           | Student | Enroll in a course              |
| GET    | `/api/enrollments/my`        | Student | View my enrollments             |
| DELETE | `/api/enrollments/:id`       | Student | Cancel an enrollment            |
| GET    | `/api/enrollments`           | Admin   | View every enrollment           |

---

## For Your Project Report

If this is for a college submission, here's a one-line summary you can reuse:

> "A full-stack student course enrollment system built with Node.js, Express, and MySQL on the backend and vanilla HTML/CSS/JavaScript on the frontend, featuring JWT-based authentication, role-based access control for students and admins, and real-time seat availability tracking."
