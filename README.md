# Property Management System (PMS)

## Project Overview
This is a centralized internal Property Management System designed to manage properties, owners, and projects. It includes a Node.js/Express backend and a React/Vite frontend, fully dockerized.

## Prerequisites
- **Node.js**: You MUST install **Node.js LTS (v20 or v22)**.
  - **WARNING**: Do NOT use Node.js v24 or later, as it currently causes critical failures with Prisma ORM on Windows.
  - Download LTS here: [https://nodejs.org/](https://nodejs.org/)
  - Verify installation: `node -v` (Should be v20.x or v22.x)

## Setup & Running (Local)

### 1. Install Node.js
If the commands `npm` or `npx` are not recognized, you have not installed Node.js yet. Please install it first.

### 2. Backend Setup
1. Navigate to `/server`:
   ```bash
   cd server
   npm install
   ```
2. Run migrations (creates `dev.db`):
   ```bash
   npx prisma migrate dev --name init
   ```
3. Start server:
   ```bash
   npm run dev
   ```
   (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Open a new terminal.
2. Navigate to `/client`:
   ```bash
   cd client
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
   (Runs on `http://localhost:5173`)

## Default Credentials
- **Register a new user** at `/login` (there is no default seeder for users yet, you must register first).

## Key Features implemented
- **Authentication**: JWT-based auth with Role (ADMIN/TEAM).
- **Properties**: CRUD operations for properties.
- **Projects**: Project management with real-time updates via Socket.io.
- **Leads**: Lead tracking with automation (Auto-create project when Owner Signs).
- **Dashboard**: KPI cards and basic charts/activity.

## Database Schema
The database schema is defined in `server/prisma/schema.prisma`. It includes models for Users, Properties, Leads, Projects, RentRecords, and Platforms.

## Troubleshooting
- If you see `npx: not found` or similar errors during setup, ensure Node.js is installed or use the Docker method which handles dependencies for you.
- Ensure ports 5000, 5173, and 5432 are free.
