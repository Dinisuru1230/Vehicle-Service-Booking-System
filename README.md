# Vehicle Service Booking System (ApexDrive)

A full-stack, enterprise-grade vehicle service and maintenance booking application with modern glassmorphism aesthetics, comprehensive administration dashboard, and Prisma ORM database layer.

## Tech Stack
- **Frontend**: React.js, React Router v6, Lucide Icons, Axios, Vite
- **Backend**: Node.js, Express.js REST API
- **Database ORM**: **Prisma ORM** with **SQLite** (`dev.db`) (zero-config, relational schema with type-safety)
- **Authentication**: JWT-based authentication with bcrypt password hashing and role-based guards

---

## Folder Structure

```
├── backend/
│   ├── config/
│   │   └── prisma.js           # PrismaClient singleton instance
│   ├── controllers/
│   │   └── authController.js   # User registration, login, profile (Prisma)
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & role authorization (Prisma)
│   │   └── errorMiddleware.js  # 404 & Prisma P2002 error handler
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma relational schema (User, Vehicle, Service, Booking)
│   │   └── dev.db              # SQLite relational database file
│   ├── routes/
│   │   └── authRoutes.js       # /api/auth endpoints
│   ├── .env                    # Environment variables (DATABASE_URL, JWT_SECRET, PORT)
│   ├── package.json            # Backend dependencies & Prisma scripts
│   ├── server.js               # Express app entrypoint with auto-seed logic
│   └── test-auth.cjs           # Automated test suite for auth API
│
└── frontend/
    └── src/
        ├── api/
        │   └── apiClient.js    # Axios client with JWT bearer interceptor
        ├── components/
        │   ├── Footer.js       # Premium dark-theme footer
        │   ├── Navbar.js       # Navigation bar with user badge & quick actions
        │   └── ProtectedRoute.js # Route guard for logged-in users & admins
        ├── context/
        │   └── AuthContext.js  # Auth state, login/logout methods, token management
        ├── pages/
        │   ├── AdminDashboard.js # Executive workshop analytics & telemetry
        │   ├── BookingManagement.js # Appointment scheduling & kanban status tracker
        │   ├── ServicePricing.js # Dynamic service pricing & tiers
        │   ├── StaffTechnicians.js # Master technician rosters & bay assignments
        │   ├── CustomerDirectory.js # VIP customer profiles & vehicle fleets
        │   ├── AdminSettings.js # System configurations & security preferences
        │   ├── AdminProfile.js # Admin account credentials & preferences
        │   ├── LoginPage.js    # ApexDrive sign-in portal
        │   ├── RegisterPage.js # Customer account registration
        │   ├── BookingPage.js  # Client booking interface
        │   ├── ServicesPage.js # Public catalog
        │   └── HomePage.js     # Hero landing page
        ├── App.js              # Application router with Admin & Client layouts
        └── index.css           # Glassmorphism design tokens & responsive CSS
```

---

## Getting Started

### 1. Backend Setup (Prisma + SQLite)
```bash
cd backend
npm install

# Push schema to SQLite database (dev.db) & generate Prisma client
npx prisma db push

# (Optional) Open Prisma Studio visual DB GUI in your browser:
# npx prisma studio

# Start backend server
npm run dev
# or
node server.js
```
The backend starts on `http://localhost:5000`. On first launch, it automatically seeds:
- **Super Administrator**: `m.vance@apexdrive.io` / Password: `ApexAdmin2026!`
- **Demo Customer**: `alexander@example.com` / Password: `Customer2026!`

To run automated verification tests:
```bash
# Auth API tests
node test-auth.cjs

# Complete User Account & Garage API tests
node test-user-account.cjs

# Admin Customer Management API tests
node test-admin-customers.cjs
```

---

## User Account & Admin Customer REST API Endpoints

### 1. Authenticated User Account (`/api/user`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/user/profile` | Private | Full profile details, active garage vehicles, recent bookings, and lifetime stats |
| `PUT` | `/api/user/profile` | Private | Update personal details (name, phone, address, city, state, zip, bio) |
| `PUT` | `/api/user/password` | Private | Change account password with current master password verification |
| `PUT` | `/api/user/preferences` | Private | Update notification settings (SMS, email, promo) and Two-Factor Authentication (2FA) |
| `GET` | `/api/user/dashboard` | Private | User dashboard overview, active appointments, and tier perks |
| `DELETE` | `/api/user/account` | Private | Permanent user account deletion |

### 2. Connected Garage Vehicles (`/api/user/vehicles`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/user/vehicles` | Private | Get all vehicles saved in the user's garage (sorted by primary first) |
| `POST` | `/api/user/vehicles` | Private | Add a new vehicle to the user's garage (auto-formats name & handles primary flag) |
| `GET` | `/api/user/vehicles/:id` | Private | Get single vehicle details and service history |
| `PUT` | `/api/user/vehicles/:id` | Private | Update vehicle information (mileage, license, color, notes) |
| `PUT` | `/api/user/vehicles/:id/primary` | Private | Set vehicle as the user's primary vehicle |
| `DELETE` | `/api/user/vehicles/:id` | Private | Remove vehicle from garage |

### 3. Administrator Customer Management (`/api/admin/customers` or `/api/admin/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/customers` | Admin | Search across name/email/phone/plate, filter (tier, status), sort (spend, vehicles, name, visits), and paginate |
| `GET` | `/api/admin/customers/metrics` | Admin | Aggregate customer & garage telemetry (total customers, active, in-bay, VIPs, revenue) |
| `GET` | `/api/admin/customers/:id` | Admin | Detailed customer profile with complete vehicle fleet & booking history |
| `POST` | `/api/admin/customers` | Admin | Register new customer with optional vehicle intake |
| `PUT` | `/api/admin/customers/:id` | Admin | Update customer coordinates, tier (`VIP Platinum`, `Gold`, `Standard`, `Fleet`), and status |
| `DELETE` | `/api/admin/customers/:id` | Admin | Permanently archive & remove customer profile |
| `PUT` | `/api/admin/customers/:id/notes` | Admin | Fast-update technician notes & special requests |
| `PUT` | `/api/admin/customers/:id/status` | Admin | Fast-toggle customer workshop status (`Active`, `In-Bay`, `Inactive`) |
| `POST` | `/api/admin/customers/:id/vehicles` | Admin | Add a vehicle directly to customer's connected garage |
| `PUT` | `/api/admin/customers/:id/vehicles/:vehId` | Admin | Update customer vehicle details, mileage, or bay status |
| `DELETE` | `/api/admin/customers/:id/vehicles/:vehId` | Admin | Remove a vehicle from customer's garage |
| `GET` | `/api/admin/customers/:id/bookings` | Admin | Retrieve complete service ledger for customer |
| `POST` | `/api/admin/customers/:id/bookings` | Admin | Schedule a service appointment for customer |

---

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:3000` with hot module replacement and automated proxy to port 5000.



