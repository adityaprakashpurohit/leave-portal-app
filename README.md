# Leave Application Workflow (Frontend Interface)

## Overview
This repository contains the frontend user interface for a comprehensive leave application workflow system. It features a premium, cinematic "Linear" design system with deep ambient lighting, responsive bento grid layouts, and smooth micro-interactions.

## Features
- **Role-Based Dashboards**: Distinct views tailored for Students, Faculty, and Admins.
- **Leave Management**: Intuitive forms for students to submit leave requests and for faculty/admins to process them.
- **Analytics Dashboard**: Real-time visual data representing leave statistics and department-wise request aggregation.
- **Notifications System**: In-app alerts to inform users of status updates instantly.
- **Advanced Filtering & Search**: Tools to effortlessly sift through applications by status, name, or reason.

## Tech Stack
- **Framework**: React (Vite)
- **Routing**: React Router DOM
- **Styling**: Vanilla CSS (Custom Linear-style Design System)
- **Icons**: Lucide React

## Setup Instructions

### Local Development
1. Navigate to the `frontend` directory (if not already at the root).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app in your browser at the provided localhost URL (usually `http://localhost:5173`).

*(Note: Ensure your backend API is running separately at `http://localhost:5000` for data persistence and authentication to function correctly).*

## Deployment Instructions (Vercel)

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `frontend` (or leave blank if the frontend code is at the root).
5. Click **Deploy**.
