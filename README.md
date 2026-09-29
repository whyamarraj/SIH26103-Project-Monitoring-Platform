# Project Monitoring Platform - SIH Prototype

An integrated project-monitoring platform built for the Smart India Hackathon. It helps project managers and monitoring teams track projects, milestones, tasks, progress, deadlines, and delays from one centralized dashboard.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (v4), React Router, Lucide React icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose

## Setup Instructions

### 1. Configure MongoDB
Ensure you have MongoDB running locally on `mongodb://127.0.0.1:27017` or update the connection string in `server/.env`.

**Note:** If MongoDB is unavailable or fails to connect, the application has an automated **Offline/Mock Data Mode** that continues to work flawlessly for demonstration purposes. 

### 2. Install Dependencies
Open a terminal in the root folder (where this README is), and install client/server dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Start Backend
In the `server` directory:

```bash
npm start
```
*The server runs on port 5000. On its first successful connection to the database, it automatically generates demo data (Projects, Milestones, Tasks, and Users).*

### 4. Start Frontend
In a new terminal window, in the `client` directory:

```bash
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

### 5. Login
Access local URL (`http://localhost:5173`) and use one of the demo credentials presented on the page:

**Admin:**
Email: `admin@example.com`
Password: `admin123`

**Project Manager:**
Email: `manager@example.com`
Password: `manager123`

**Team Member:**
Email: `member@example.com`
Password: `member123`

## Features Included
- **Mock DB Fallback:** The prototype guarantees a successful hackathon demonstration even without internet or local database setup.
- **Progress Tracking:** Overall project progress and individual milestone breakdown.
- **Overdue Task Monitoring:** Dashboard prominently features tasks whose deadlines have passed.
- **Automated Delay Engine:** Backend API requests trigger database checks marking passed timelines correctly.
