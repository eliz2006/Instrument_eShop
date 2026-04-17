# Instrument_eshop

Full-stack e-commerce platform for musical instruments using React + Vite + Tailwind + Axios + React Router, and Node.js + Express + MySQL.

## Folder structure

- `client`: frontend app
- `server`: backend REST API and MySQL schema

## Backend features

- JWT authentication and Google OAuth login
- Role-based access (`user`, `admin`)
- CRUD APIs for products, categories, users, and orders
- Protected routes via middleware

## Frontend features

- Login/register and Google auth flow
- Product listing and details
- Cart and checkout
- Order history and profile
- Admin dashboard for products, users, and orders

## Setup

1. Install dependencies:
   - `npm install`
   - `npm install --prefix server`
   - `npm install --prefix client`
2. Create env files:
   - `copy server/.env.example server/.env`
   - `copy client/.env.example client/.env`
3. Create database and run schema:
   - create MySQL DB named `instrument_eshop`
   - execute `server/sql/schema.sql`
   - execute `server/sql/seed.sql` (adds sample categories, instruments, and admin account)
4. Run full stack:
   - `npm run dev`

## Important OAuth setup

In Google Cloud Console, add these URLs:
- Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
- Authorized JavaScript origin: `http://localhost:5173`

## Seeded admin account

- Email: `admin@instrument-eshop.com`
- Password: `Admin123!`
