# Intern Assignment – DevSamurai

A fullstack web application built with **React + Vite** for the frontend and **Express.js + PostgreSQL** for the backend.

## Live Demo

- **Frontend (Vercel)**: [https://intern-assignment-dev-samurai-6xmx.vercel.app](https://intern-assignment-dev-samurai-6xmx.vercel.app)
- **Backend (Render)**: [https://internassignment-devsamurai.onrender.com](https://internassignment-devsamurai.onrender.com)

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Redux Toolkit
- TanStack Query (React Query)

### Backend
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- CORS, Dotenv

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 12
- Git

### 1. Clone the repository

```
git clone https://github.com/Nagnie/InternAssignment_DevSamurai.git
cd InternAssignment_DevSamurai
```

### 2. Backend setup
```
cd backend
cp .env.sample .env
# Fill in your environment variables

npm install
npm run dev
```

### 3. Frontend setup
```
cd ../frontend
cp .env.production .env
# VITE_API_URL should point to your backend, e.g., http://localhost:5000

npm install
npm run dev
```
---

## Features
- JWT-based Authentication (Signup, Login, Get current user)
- Admin Dashboard: view user statistics, charts, pagination
- Realtime API integration using TanStack Query
- Responsive UI with Tailwind and reusable components
- Change profile details (name, email, passwordgit )

---

## Assumptions & Trade-offs
- Authentication is simplified for demonstration purposes (no refresh token, no email verification).
- No Docker or advanced CI/CD setup due to time constraints.
- Frontend and backend hosted separately; CORS is enabled on backend to allow cross-origin requests.
- Third-party login (e.g. Google) and routes like /settings and /contact are present in the UI but not functional in this version.
