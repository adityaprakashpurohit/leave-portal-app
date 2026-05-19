# Leave Application Workflow (Linear / Modern Style)

## Overview
This project is a comprehensive leave application workflow system with role-based access control (Student, Faculty, Admin). It includes a robust Node.js/Express backend, SQLite database, and a React.js (Vite) frontend featuring a premium, cinematic "Linear" design system with deep ambient lighting and responsive bento grid layouts.

## New Features (Phase 2)
- **Analytics Dashboard**: Faculty and Admins can view comprehensive real-time leave statistics (Pending, Approved, Rejected) and department-wise request aggregation.
- **Notifications System**: In-app notifications inform students instantly when their leave requests are approved or rejected.
- **Remarks & Feedback**: Approvers can add contextual remarks when processing applications, which instantly reflect on the student's dashboard.
- **Advanced Filtering & Search**: Admins and faculty can filter requests by status or search for specific student names and reasons.

## Tech Stack
- **Frontend**: React (Vite), React Router, Vanilla CSS (Linear-style Design System), Lucide React (Icons).
- **Backend**: Node.js, Express.js, SQLite (Database), JSON Web Tokens (Auth).

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Run the database migration/seed script: `node migrate.js` and `node seed.js`
4. Run the server: `node server.js`
5. The API will be available at `http://localhost:5000`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the app in your browser at the provided localhost URL (usually `http://localhost:5173`).

## Deployment Instructions

### Frontend Deployment (Vercel)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `frontend`.
5. Click **Deploy**.

### Backend Deployment (Render.com)
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `node server.js`.
6. Add an Environment Variable: `PORT = 5000`.
7. **Important for SQLite**: Since Render's free tier has ephemeral storage, the SQLite database will reset on every deploy. For a production deployment, consider migrating to a PostgreSQL database hosted on Render, Railway, or Supabase.

## Database Schema (Updated)
- **users**: id, name, email, password, role, department_id, created_at
- **departments**: id, name
- **leave_requests**: id, student_id, start_date, end_date, reason, **remarks**, status, created_at
- **notifications**: id, user_id, message, is_read, created_at
