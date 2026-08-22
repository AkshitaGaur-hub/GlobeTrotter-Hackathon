<div align="center">

# 🌍 GlobeTrotter

**AI-Powered Multi-City Travel Planner**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)

*Plan smarter · Travel better · Explore more*

</div>

---

## ✨ What is GlobeTrotter?

GlobeTrotter is a full-stack travel planning platform that uses **Google Gemini AI** to help travelers build personalized, multi-city itineraries. Instead of juggling spreadsheets and browser tabs, users can discover destinations, build day-by-day plans, track budgets, and share trips — all from one app.

### Key Highlights

- 🤖 **AI Trip Generation** — Describe your ideal trip and Gemini generates a complete itinerary with activities, timing, and budget estimates
- 🔄 **AI Trip Optimization** — Get intelligent suggestions to improve your existing itinerary (with before/after comparison)
- 📊 **Smart Budgeting** — Visual expense breakdown across transport, stay, activities, and meals with per-day cost analysis
- 🔗 **Shareable Itineraries** — Generate public links so friends can view (or clone) your trip
- 🏆 **GlobeScore** — A unique scoring system that rates your trip across adventure, culture, relaxation, and value dimensions

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React + Vite                      │
│  Dashboard · Trip Planner · Itinerary · Public View │
│         Tailwind CSS · Recharts · Lucide            │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│                Express.js (Node.js)                 │
│  Auth · Trips · Cities · Activities · AI · Budget   │
│         JWT · bcrypt · Gemini API                   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   PostgreSQL                        │
│  users · trips · stops · cities · activities ·      │
│  expenses · itinerary_days · ai_generations         │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
GlobeTrotter-Hackathon/
├── frontend/                   # React SPA (Vite)
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── TripCard.jsx
│       │   ├── BudgetChart.jsx
│       │   ├── Timeline.jsx
│       │   ├── GlobeScore.jsx
│       │   ├── WhatIfPanel.jsx
│       │   ├── BeforeAfterCard.jsx
│       │   ├── AIThinkingLoader.jsx
│       │   └── ...
│       ├── pages/              # Route pages
│       │   ├── Dashboard.jsx
│       │   ├── TripPlanner.jsx
│       │   ├── ItineraryDetails.jsx
│       │   ├── PublicShare.jsx
│       │   ├── Login.jsx
│       │   └── Signup.jsx
│       ├── services/           # API client functions
│       └── context/            # React context (auth)
│
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── server.js           # App entry point & routes
│   │   ├── controllers/        # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── tripController.js
│   │   │   ├── cityController.js
│   │   │   ├── activityController.js
│   │   │   └── aiController.js
│   │   ├── services/           # Business logic
│   │   │   ├── budgetService.js
│   │   │   ├── globeScoreService.js
│   │   │   └── fallbackService.js
│   │   ├── ai/                 # Gemini AI integration
│   │   │   ├── geminiClient.js
│   │   │   ├── tripGenerator.js
│   │   │   └── tripOptimizer.js
│   │   ├── middleware/         # Auth & error handling
│   │   └── config/             # Database connection
│   └── database/
│       ├── migrations/         # SQL schema
│       └── seeds/              # Initial city & activity data
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool       | Version |
|------------|---------|
| Node.js    | 18+     |
| PostgreSQL | 15+     |
| npm        | 9+      |

### 1. Clone the Repository

```bash
git clone https://github.com/AkshitaGaur-hub/GlobeTrotter-Hackathon.git
cd GlobeTrotter-Hackathon
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/globetrotter
PORT=5000
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

> 💡 Get a free Gemini API key at [ai.google.dev](https://ai.google.dev/)

Start the backend (auto-runs migrations & seeds on first launch):

```bash
npm run dev
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔌 API Reference

### Authentication

| Method | Endpoint        | Description           | Auth |
|--------|----------------|-----------------------|------|
| POST   | `/auth/signup`  | Register a new user   | ❌   |
| POST   | `/auth/login`   | Login & get JWT token | ❌   |
| GET    | `/auth/me`      | Get current user info | ✅   |

### Trips

| Method | Endpoint                          | Description                    | Auth |
|--------|-----------------------------------|--------------------------------|------|
| GET    | `/trips`                          | List user's trips              | ✅   |
| POST   | `/trips`                          | Create a new trip              | ✅   |
| GET    | `/trips/:id`                      | Get trip details               | ✅   |
| DELETE | `/trips/:id`                      | Delete a trip                  | ✅   |
| GET    | `/trips/:id/budget`               | Get trip budget breakdown      | ✅   |
| GET    | `/trips/:id/itinerary`            | Get full itinerary             | ✅   |
| POST   | `/trips/:id/apply-optimization`   | Apply AI optimization          | ✅   |

### AI

| Method | Endpoint              | Description                        | Auth |
|--------|-----------------------|------------------------------------|------|
| POST   | `/ai/generate-trip`   | Generate an AI-powered itinerary   | ✅   |
| POST   | `/ai/optimize-trip`   | Optimize an existing trip with AI   | ✅   |

### Public

| Method | Endpoint                      | Description                 | Auth |
|--------|-------------------------------|-----------------------------|------|
| GET    | `/cities`                     | List all cities             | ❌   |
| GET    | `/cities/:id`                 | Get city details            | ❌   |
| GET    | `/activities`                 | List all activities         | ❌   |
| GET    | `/activities/by-city/:cityId` | Get activities for a city   | ❌   |
| GET    | `/public/trips/:share_slug`   | View a shared trip          | ❌   |

---

## 🛠️ Tech Stack

| Layer      | Technology                                                         |
|------------|--------------------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Recharts, Lucide React, React Router |
| Backend    | Node.js, Express.js, JWT (jsonwebtoken), bcryptjs                   |
| Database   | PostgreSQL, pg (node-postgres)                                      |
| AI         | Google Gemini API (with response caching)                           |
| Dev Tools  | Git, Vite HMR, ESM modules                                         |

---

## 📸 Features in Action

### 🏠 Dashboard
- Personalized welcome with recent & upcoming trips
- Recommended destinations
- Quick-access trip creation

### 🧳 AI Trip Planner
- Describe your trip preferences (destinations, dates, budget, interests)
- Gemini AI generates a complete multi-city itinerary
- Activities auto-assigned with cost and timing
- Built-in fallback service if AI is unavailable

### 📊 Budget Tracker
- Category-wise expense breakdown (transport, stay, activities, meals)
- Interactive charts via Recharts
- Per-day cost analysis with over-budget alerts

### 🔄 Trip Optimizer
- "What If" panel for AI-powered trip improvements
- Side-by-side before/after comparison
- One-click apply optimization

### 🏆 GlobeScore
- Multi-dimensional trip rating (adventure, culture, relaxation, value)
- Visual score breakdown

### 🔗 Public Sharing
- Generate shareable trip links
- Read-only public itinerary view

---

## 👥 Team

**GlobeTrotter Hackathon Team**

---

<div align="center">

### 🌍 Your Journey. Your Plan. Your Way.

*Plan smarter · Travel better · Explore more*

</div>
