# Leave Application Workflow

## Overview
This project is a comprehensive leave application workflow system with role-based access control (Student, Faculty, Admin). It includes a robust Node.js/Express backend, SQLite database, and a React.js (Vite) frontend featuring a modern glassmorphism design.

## Features
- **Authentication**: JWT-based authentication for Students, Faculty, and Admins.
- **Role-Based Access**:
  - **Students**: Can apply for leaves and view their own leave history.
  - **Faculty/Admin**: Can view all leave requests and approve/reject them.
- **Modern UI**: Built with React, featuring a premium glassmorphism theme, fully responsive layout, and smooth interactions.

## Tech Stack
- **Frontend**: React (Vite), React Router, Vanilla CSS (Glassmorphism), Lucide React (Icons).
- **Backend**: Node.js, Express.js, SQLite (Database), JSON Web Tokens (Auth).

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Run the server: `node server.js`
4. The API will be available at `http://localhost:5000`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the app in your browser at the provided localhost URL.

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/auth/me`: Get current user profile (requires token).

### Leave Requests
- `POST /api/leave`: Apply for a new leave (Students only).
- `GET /api/leave`: Get leave history (Filtered by user role).
- `PATCH /api/leave/:id/status`: Update leave status to 'approved' or 'rejected' (Faculty/Admin only).

## Database Schema
- **users**: id, name, email, password, role, department_id, created_at
- **departments**: id, name
- **leave_requests**: id, student_id, start_date, end_date, reason, status, created_at
- **notifications**: id, user_id, message, is_read, created_at
