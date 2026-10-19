# Vehicle Service Booking System

A full-stack vehicle service and maintenance booking application.

## Tech Stack
- **Frontend**: React.js, React Router, Lucide Icons, Axios, Vite
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT-based secure login & bcrypt password hashing

---

## Folder Structure

```
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, profile
│   │   ├── bookingController.js# Appointment scheduling & tracking
│   │   ├── serviceController.js# Service catalog management
│   │   └── vehicleController.js# User vehicle management
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & role authorization
│   │   └── errorMiddleware.js  # 404 & global exception handler
│   ├── models/
│   │   ├── Booking.js          # Appointment schema
│   │   ├── Service.js          # Service package schema
│   │   ├── User.js             # User account schema
│   │   └── Vehicle.js          # Vehicle details schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── bookingRoutes.js    # /api/bookings endpoints
│   │   ├── serviceRoutes.js    # /api/services endpoints
│   │   └── vehicleRoutes.js    # /api/vehicles endpoints
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express application entrypoint
│
└── frontend/
    └── src/
        ├── api/
        │   └── apiClient.js    # Axios client with JWT interceptor
        ├── components/
        │   ├── Footer.js       # App footer
        │   ├── Navbar.js       # Navigation bar
        │   └── ProtectedRoute.js # Route guard for logged-in users
        ├── context/
        │   └── AuthContext.js  # User authentication context & state
        ├── pages/
        │   ├── BookingPage.js  # Service appointment booking form
        │   ├── HomePage.js     # Landing page with service highlights
        │   ├── LoginPage.js    # User sign-in
        │   ├── MyBookingsPage.js # User appointment history & cancellations
        │   ├── RegisterPage.js # User registration
        │   └── ServicesPage.js # Available service catalog
        ├── App.js              # Main React router application
        ├── index.css           # Modern custom styling
        └── main.jsx            # React root DOM mount
```

---

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000` and automatically proxies `/api` calls to the backend.
