# Finwisee - Financial Planning Platform

A full-stack financial planning platform: a React (Vite) website with client and admin dashboards,
backed by a Spring Boot + JWT REST API and MySQL.

## Features

### Public website
- Landing page, e-learning, gallery, about, contact, FAQ
- 12+ financial calculators (SIP, lumpsum, retirement, home/vehicle loan EMI, CAGR, net worth, ...)
- Plans & pricing with a cart and (simulated) checkout that creates real orders

### Client dashboard (`/user`)
- **Overview** – upcoming appointments, unread messages, goal progress, quick actions
- **Profile** – personal and financial profile (income, risk tolerance, experience, goals) with completeness tracking
- **Goals** – create financial goals; see progress and a projected completion date based on monthly savings and expected return
- **Appointments** – book consultations, see advisor assignment/status, cancel
- **Messages** – inbox/sent, write to advisors, reply
- **Documents** – drag-and-drop upload (stored on the server), download, delete, see review status and advisor notes
- **Purchases** – order history

### Admin dashboard (`/admin`)
- **Overview** – clients, revenue, appointments to confirm, documents to review
- **Users** – search/filter, create, edit, change role, delete (with all related data)
- **Appointments** – confirm/complete/cancel and assign advisors
- **Messages** – received/sent/all, reply to clients, compose new messages
- **Documents** – download, approve/reject with notes
- **Orders** – all orders, update status

## Technology stack
- **Frontend**: React 19, React Router 6, Vite 6, Bootstrap 5, Font Awesome
- **Backend**: Spring Boot 3.3, Spring Security with JWT, Spring Data JPA/Hibernate
- **Database**: MySQL 8 (or embedded H2 for quick local runs)

## Getting started

### 1. Backend (port 8080)
```bash
cd backend
set DB_PASSWORD=your_mysql_password
mvnw.cmd spring-boot:run
```
No MySQL? Use the embedded database instead: `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2`
(or double-click `backend/run-h2.bat`). See [backend/README.md](backend/README.md) for all options.

### 2. Frontend (port 5173)
```bash
npm install
npm run dev
```
Open http://localhost:5173. The dev server proxies `/api` to the backend.
If the backend runs on another port: `set BACKEND_URL=http://localhost:8081` before `npm run dev`.

For a production build hosted separately from the API, set `VITE_API_URL` (e.g. `https://api.example.com`)
before `npm run build`, and add the site's origin to the backend's `CORS_ORIGINS`.

## Demo credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@finwise.com | admin123 |
| User | john.doe@example.com | user123 |

The login page also has one-click buttons to fill these in.

## Project structure
```
backend/                       Spring Boot API (see backend/README.md)
src/
├── api/client.js              fetch wrapper (JWT header, JSON errors, uploads/downloads)
├── components/
│   ├── Dashboard/             shared dashboard layout, modal, badges (Dashboard.css)
│   ├── Header/ Footer/ Hero/  website chrome
│   └── ProtectedRoute/        role-based route guard
├── context/                   AuthContext (session), CartContext
├── hooks/useNotice.js         toast notifications
├── pages/
│   ├── admin/                 AdminDashboard + tabs/
│   ├── user/                  UserDashboard + tabs/
│   ├── calculator/ cart/ pricing/ login/ register/ ...
├── utils/format.js            currency/date formatting helpers
└── App.jsx                    routes
```

## Scripts
- `npm run dev` – start the frontend dev server
- `npm run build` – production build to `dist/`
- `npm run lint` – ESLint
- `npm run backend` – start the backend with Maven

## Notes
- Payments are simulated – checkout records a paid order but no money is charged.
- Uploaded documents are stored in `backend/uploads/` (max 10 MB per file).
