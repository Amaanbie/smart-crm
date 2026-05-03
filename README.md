# SmartCRM — Lead & Sales Pipeline Management System

A production-quality CRM web application for small businesses to manage leads, track deals, follow-ups, sales pipeline stages, and analytics. Built as a Fiverr portfolio showcase project.

![SmartCRM Dashboard](screenshots/dashboard.png)

---

## Features

- **JWT Authentication** — Register, login, protected routes, role-based access (Admin / Sales)
- **Lead Management** — Full CRUD, search, filter by status/priority/source, pagination
- **Kanban Pipeline** — Drag-and-drop board across 6 sales stages (dnd-kit), optimistic updates
- **Lead Detail** — Activity timeline, notes, status/priority, assigned user
- **Activities & Follow-ups** — Log calls, emails, meetings, notes; overdue tracking; complete toggle
- **Dashboard Analytics** — KPI cards, leads by status (PieChart), leads by source (BarChart), overdue follow-ups, hot leads
- **Lead Insights Panel** — Rule-based intelligence: win probability bar, close date alerts, stale lead warnings, overdue tasks
- **Seed Data** — 25 realistic leads across all stages, activities, notes, 2 demo users

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4                   |
| Routing    | React Router v6                                   |
| Forms      | React Hook Form                                   |
| Charts     | Recharts                                          |
| Drag-Drop  | @dnd-kit/core, @dnd-kit/sortable                  |
| Icons      | lucide-react                                      |
| HTTP       | Axios                                             |
| Backend    | Node.js, Express.js                               |
| Database   | PostgreSQL                                        |
| ORM        | Prisma                                            |
| Auth       | JWT (jsonwebtoken), bcryptjs                      |
| Validation | Zod (backend), React Hook Form (frontend)         |
| Dev Tools  | nodemon                                           |

---

## Project Structure

```
smart-crm/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── api/               # Axios API functions
│       ├── context/           # AuthContext (JWT state)
│       ├── hooks/             # Data-fetching hooks
│       ├── components/
│       │   ├── ui/            # Button, Input, Badge, Modal…
│       │   ├── layout/        # AppLayout, Sidebar, TopBar
│       │   ├── dashboard/     # KPI cards, charts
│       │   ├── leads/         # Table, filters, form
│       │   ├── kanban/        # Board, column, card
│       │   └── lead-detail/   # Info, timeline, notes, insights
│       └── pages/             # Route-level page components
└── server/                    # Express + Prisma backend
    ├── prisma/
    │   ├── schema.prisma      # PostgreSQL schema
    │   └── seed.js            # Demo seed data
    └── src/
        ├── modules/           # auth / leads / activities / notes / dashboard
        ├── middleware/        # auth, validate, error
        ├── utils/             # ApiError, asyncHandler, jwt
        └── config/            # env validation
```

---

## Screenshots

> Replace these with actual screenshots after running the app.

| Page | Preview |
|---|---|
| Login | `screenshots/login.png` |
| Dashboard | `screenshots/dashboard.png` |
| Leads List | `screenshots/leads.png` |
| Kanban Pipeline | `screenshots/kanban.png` |
| Lead Details | `screenshots/lead-detail.png` |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running locally or via Docker)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Amaanbie/smart-crm.git
cd smart-crm
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/smart_crm"
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Create the PostgreSQL database

```sql
CREATE DATABASE smart_crm;
```

### 4. Install dependencies & run migrations

```bash
# Backend
cd server
npm install
npx prisma migrate dev --name init
npx prisma db seed

# Frontend
cd ../client
npm install
```

### 5. Start development servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

App is now running at **http://localhost:5173**

---

## Environment Variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/smart_crm` |
| `JWT_SECRET` | Secret for signing JWT tokens (32+ chars) | `super_secret_key_abc123` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `PORT` | Express server port | `5000` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Database Setup

```bash
# Run migrations
npx prisma migrate dev --name init

# View database in browser
npx prisma studio

# Reset and reseed
npx prisma migrate reset
npx prisma db seed
```

---

## Seed Command

```bash
cd server
npx prisma db seed
```

Creates:
- **2 users** (Admin + Sales)
- **25 leads** across all 6 pipeline stages
- **~60 activities** (calls, emails, meetings, follow-ups; some overdue)
- **27 notes** with realistic deal context

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@crm.com | Password123! |
| Sales | sarah@crm.com | Password123! |

---

## API Reference

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | List all users |

### Leads
| Method | Route | Description |
|---|---|---|
| GET | `/api/leads` | List leads (filters: status, priority, source, search, assignedToId, page, limit) |
| GET | `/api/leads/:id` | Get lead with activities + notes |
| POST | `/api/leads` | Create lead |
| PATCH | `/api/leads/:id` | Update lead |
| PATCH | `/api/leads/:id/status` | Update lead status only |
| DELETE | `/api/leads/:id` | Delete lead (cascades) |

### Activities
| Method | Route | Description |
|---|---|---|
| GET | `/api/leads/:leadId/activities` | List lead activities |
| POST | `/api/leads/:leadId/activities` | Create activity |
| PATCH | `/api/activities/:id` | Update activity (e.g., mark complete) |
| DELETE | `/api/activities/:id` | Delete activity |

### Notes
| Method | Route | Description |
|---|---|---|
| GET | `/api/leads/:leadId/notes` | List lead notes |
| POST | `/api/leads/:leadId/notes` | Create note |
| DELETE | `/api/notes/:id` | Delete note |

### Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Get all analytics aggregates |

---

## Future Improvements

- [ ] Email notifications for overdue follow-ups
- [ ] CSV import/export for leads
- [ ] Team management (invite users, permissions)
- [ ] Deal pipeline revenue forecasting chart
- [ ] Dark mode toggle
- [ ] Mobile-responsive sidebar drawer
- [ ] Real AI lead scoring (OpenAI / Claude API integration)
- [ ] Activity reminders / calendar integration
- [ ] Multi-workspace / tenant support
- [ ] Document attachments on leads

---

## License

MIT — free to use and modify for personal and commercial projects.
