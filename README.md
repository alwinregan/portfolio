# Alwin Regan — Portfolio

Full-stack developer portfolio built with React + Vite (frontend) and Express + MongoDB (backend). One server handles both the API and the static frontend.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Storage | Local disk (or S3 / Cloudflare R2) |

---

## Project Structure

```
portfolio/
├── portfolio-backend/      # Express API
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── app.js          # Entry point
│   ├── seed.js             # Database seeder
│   ├── reset-admin.js      # Reset admin credentials
│   └── .env.example        # Environment variable template
├── portfolio-frontend/     # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── .env.production     # Production API URL
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Clone the repo

```bash
git clone https://github.com/alwinregan/portfolio.git
cd portfolio
```

### 2. Backend setup

```bash
cd portfolio-backend
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=4000
JWT_SECRET=any-long-random-string
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=alwin_regan
ADMIN_PASSWORD=Alwin@2527
STORAGE_TYPE=local
```

```bash
npm install
npm run seed      # populate database with profile, skills, experience, projects
npm run dev       # starts backend on http://localhost:4000
```

### 3. Frontend setup

```bash
cd ../portfolio-frontend
npm install
npm run dev       # starts frontend on http://localhost:3000
```

Frontend connects to the backend at `http://localhost:4000/api` (set in `.env`).

---

## Production Deployment

### First time on a fresh server

```bash
# Clone
git clone https://github.com/alwinregan/portfolio.git
cd portfolio

# Configure environment
cp portfolio-backend/.env.example portfolio-backend/.env
nano portfolio-backend/.env
```

Set these values in `.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio
PORT=4000
JWT_SECRET=<generate a long random string>
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=alwin_regan
ADMIN_PASSWORD=Alwin@2527
STORAGE_TYPE=local
```

```bash
# Install dependencies
cd portfolio-backend && npm install
cd ../portfolio-frontend && npm install

# Build frontend (bundles into portfolio-frontend/dist/)
npm run build

# Seed the database (run ONCE on a fresh database)
cd ../portfolio-backend
npm run seed

# Start the server
npm start
```

Visit `http://your-server-ip:4000` — the Express server serves both the React app and the API.

Admin panel: `http://your-server-ip:4000/admin/login`

---

### Keeping it running with PM2

```bash
npm install -g pm2

cd portfolio/portfolio-backend
pm2 start src/app.js --name portfolio
pm2 save
pm2 startup    # auto-start on server reboot
```

---

### Updating the server (after pushing new code)

```bash
cd portfolio

# Pull latest code
git pull origin main

# Install any new backend dependencies
cd portfolio-backend
npm install --omit=dev

# Rebuild the frontend
cd ../portfolio-frontend
npm install
npm run build

# Restart the backend
cd ../portfolio-backend
pm2 restart portfolio
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `PORT` | ✅ | Server port (default: 4000) |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | ✅ | Token expiry (e.g. `7d`) |
| `ADMIN_USERNAME` | ✅ | Admin login username |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `STORAGE_TYPE` | ✅ | `local`, `s3`, or `r2` |
| `B2_*` | only if `STORAGE_TYPE=s3` | Backblaze B2 credentials |
| `R2_*` | only if `STORAGE_TYPE=r2` | Cloudflare R2 credentials |

---

## Scripts

### Backend (`portfolio-backend/`)

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run in production |
| Dev | `npm run dev` | Run with nodemon (auto-reload) |
| Seed | `npm run seed` | Wipe and repopulate database |
| Reset admin | `npm run reset-admin` | Reset admin credentials only |

> ⚠️ `npm run seed` wipes all data — only run on a fresh database.

### Frontend (`portfolio-frontend/`)

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start Vite dev server on port 3000 |
| Build | `npm run build` | Build for production into `dist/` |
| Preview | `npm run preview` | Preview the production build locally |

---

## Admin Panel

| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Username | `alwin_regan` |
| Password | `Alwin@2527` |

From the admin panel you can manage: Profile, Projects, Skills, Experience, Certifications, Blog, Settings, and Theme.

---

## API

All API routes are prefixed with `/api`.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/profile` | Public profile |
| GET | `/api/projects` | Public projects |
| GET | `/api/skills` | Public skills |
| GET | `/api/experience` | Public experience |
| GET | `/api/settings` | Site settings |
| GET | `/api/admin/*` | Admin CRUD (JWT required) |

---

## Image Uploads

Uploaded files are stored in `portfolio-backend/uploads/`. This folder is excluded from git.

After deploying, upload images through the admin panel (Profile → avatar, Projects → edit).

To use cloud storage instead of local disk, set `STORAGE_TYPE=s3` or `STORAGE_TYPE=r2` and fill in the corresponding credentials in `.env`.
