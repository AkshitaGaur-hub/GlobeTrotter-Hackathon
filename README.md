# 🌍 GlobeTrotter

### ✈️ Empowering Personalized Travel Planning

> **Plan Smarter. Explore more. Travel more **

GlobeTrotter is a personalized, interactive, and collaborative travel planning platform designed to simplify the complexity of planning **multi-city trips**.

Instead of managing destinations, dates, activities, expenses, and itineraries across multiple platforms, GlobeTrotter brings everything together into one seamless travel planning experience.

Users can **discover destinations, build customized itineraries, manage activities, estimate expenses, visualize their journey, and share their travel plans** with friends or the wider community.

---

## 🎯 Problem Statement

Planning a multi-city trip can quickly become complicated.

Travelers often need to manage:

* 📍 Multiple destinations
* 📅 Different travel dates
* 🎯 Activities and experiences
* 💰 Transportation and accommodation costs
* 🍴 Food and other expenses
* 🗓️ Day-by-day schedules
* 🤝 Sharing plans with friends

This scattered planning process makes it difficult to maintain a clear overview of the entire journey.

### 💡 Our Solution

**GlobeTrotter provides a centralized travel planning platform** where travelers can create, organize, visualize, budget, and share their complete journey from a single application.

The project brief defines the goal as simplifying multi-city travel while helping users organize personalized trips efficiently, stay within budget, and maintain full visibility of their journey.

---

# 🚀 Vision

Our vision is to build a **personalized, intelligent, and collaborative travel ecosystem** that transforms the way people plan and experience travel.

GlobeTrotter aims to make travel planning:

**Simple → Personalized → Visual → Cost-aware → Collaborative**

Users can explore destinations, create structured journeys, make cost-effective decisions, and share their travel experiences with others.

---

# 🎯 Mission

GlobeTrotter focuses on giving travelers intuitive tools to:

* 📍 Add and manage travel stops
* ⏱️ Manage travel durations
* 🌎 Discover cities and destinations
* 🎯 Explore activities
* 💰 Estimate trip expenses
* 📊 Understand cost breakdowns
* 🗓️ Visualize travel timelines
* 🤝 Share trip plans

The application is designed around a responsive user experience backed by structured relational travel data.

---

# ✨ Key Features

## 🔐 1. Authentication

Secure entry point for users to access their travel plans.

### Features

* User Login
* User Signup
* Email & Password
* Forgot Password
* Basic form validation
* Personalized user access

---

# 🏠 2. Dashboard

The dashboard acts as the user's central travel hub.

### Features

* 👋 Personalized welcome message
* 🧳 Recent trips
* 📅 Upcoming trips
* 🌎 Recommended destinations
* 💰 Budget highlights
* ➕ Plan New Trip

The dashboard allows users to quickly navigate between existing trips and discover travel inspiration.

---

# 🧳 3. Create Trip

Users can start a completely personalized travel plan.

### Trip Information

* Trip name
* Start date
* End date
* Trip description
* Optional cover photo

Once saved, the trip becomes available in the user's personal trip collection.

---

# 🗂️ 4. My Trips

A centralized view of all trips created by the user.

Each trip card can display:

* 🧳 Trip name
* 📅 Date range
* 📍 Number of destinations
* 👁️ View trip
* ✏️ Edit trip
* 🗑️ Delete trip

This makes it easy to manage both upcoming and previously created journeys.

---

# 🗺️ 5. Interactive Itinerary Builder

The heart of GlobeTrotter.

Users can construct a complete multi-city journey by adding destinations and activities.

### Features

* ➕ Add Stop
* 📍 Select city
* 📅 Assign travel dates
* 🎯 Add activities
* 🔄 Reorder cities
* 🗓️ Build day-wise plans

The itinerary builder is designed to provide an interactive way to construct the complete journey.

---

# 🔎 6. City Discovery & Search

Users can search for destinations and add them directly to their itinerary.

### City Information

* 🌎 Country / Region
* 💰 Cost Index
* ⭐ Popularity
* 📍 Destination information

### Filters

* Country
* Region

Users can select a destination and use **Add to Trip** to include it in their journey.

---

# 🎯 7. Activity Discovery

Discover experiences for every destination.

Activities can be organized around:

* 🍴 Food experiences
* 🏛️ Sightseeing
* 🏔️ Adventure
* 🎨 Cultural experiences
* 🎯 Other interests

### Activity Filters

* Activity type
* Cost
* Duration

Users can quickly view activity descriptions/images and add or remove activities from their itinerary.

---

# 📋 8. Itinerary View

Once a trip is created, users can review the complete journey in a structured format.

### Features

* Day-wise itinerary
* City headers
* Activity blocks
* Activity timing
* Activity cost
* Calendar view
* List view

This gives travelers complete visibility of their planned journey.

---

# 💰 9. Smart Trip Budget

GlobeTrotter helps travelers understand and manage their estimated expenses.

### Expense Categories

| Category      | Examples                         |
| ------------- | -------------------------------- |
| 🚆 Transport  | Flights, trains, local transport |
| 🏨 Stay       | Hotels and accommodation         |
| 🎯 Activities | Tours, attractions, experiences  |
| 🍴 Meals      | Food and dining                  |

### Budget Insights

* Total estimated trip cost
* Cost breakdown
* Average cost per day
* Visual charts
* Over-budget day alerts

The problem statement specifically calls for cost breakdowns across transport, stay, activities, and meals, along with visual charts and over-budget alerts.

---

# 📅 10. Calendar & Timeline

Visualize the entire journey through a calendar or timeline.

### Features

* 📅 Calendar component
* 🗓️ Vertical timeline
* 📂 Expandable days
* 🔄 Drag-to-reorder activities
* ✏️ Quick editing

This makes complex multi-city journeys easier to understand at a glance.

---

# 🔗 11. Shareable Itineraries

Travel plans don't have to stay private.

Users can create a shareable version of their itinerary.

### Features

* 🔗 Public itinerary URL
* 👀 Read-only view
* 📋 Trip summary
* 📑 Copy Trip
* 📱 Social media sharing

Friends or other travelers can view the itinerary and use it as inspiration.

---

# 👤 12. Profile & Settings

Users can control their personal information and travel preferences.

### Features

* Profile name
* Profile photo
* Email
* Language preference
* Saved destinations
* Account deletion
* Privacy/data controls

These settings give users control over their account and personal travel information.

---

# 📊 13. Admin Analytics Dashboard

An optional admin module can provide insights into platform usage.

### Analytics

* 👥 User engagement
* 🧳 Total trips created
* 🌎 Popular cities
* 🎯 Popular activities
* 📈 Usage trends
* 👤 User management

The problem statement describes the admin dashboard as an optional interface for monitoring user trends, trips, popular cities/activities, engagement, and platform usage.

---

# 🔄 User Journey

```text
                    🌍 GlobeTrotter
                          │
                          ▼
                  🔐 Login / Signup
                          │
                          ▼
                    🏠 Dashboard
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
           🧳 My Trips       🔎 Explore
                 │                 │
                 ▼                 ▼
           ➕ Create Trip     🌎 Cities
                 │                 │
                 ▼                 ▼
          🗺️ Add Destinations 🎯 Activities
                 │                 │
                 └────────┬────────┘
                          ▼
                  🧩 Build Itinerary
                          │
                          ▼
                    💰 Budget
                          │
                          ▼
                  📅 Calendar /
                     Timeline
                          │
                          ▼
                  🔗 Share Trip
```

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────┐
│              USER                    │
│        Web / Mobile Interface        │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          FRONTEND APPLICATION        │
│                                      │
│  Dashboard                           │
│  Trip Management                     │
│  Itinerary Builder                   │
│  City & Activity Search              │
│  Budget Visualization                │
│  Calendar / Timeline                 │
│  Profile & Settings                  │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│              API / BACKEND           │
│                                      │
│ Authentication                       │
│ Trip Management                      │
│ Destination Management               │
│ Activity Management                  │
│ Budget Calculation                   │
│ Sharing                              │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│        RELATIONAL DATABASE           │
│                                      │
│ Users                                │
│ Trips                                │
│ Stops                                │
│ Cities                               │
│ Activities                           │
│ Expenses                             │
│ Itineraries                          │
└──────────────────────────────────────┘
```

The application is expected to use a relational database capable of storing interconnected data such as users, itineraries, stops, activities, and estimated expenses.

---

# 🗄️ Core Data Model

A simplified relational structure can be represented as:

```text
User
 │
 ├──< Trip
 │       │
 │       ├──< Stop
 │       │      │
 │       │      └── City
 │       │
 │       ├──< Activity
 │       │
 │       └──< Expense
 │
 └──< Shared Trip
```

### Main Entities

**User**

* User information
* Authentication
* Preferences

**Trip**

* Trip name
* Start/end dates
* Description
* Owner

**Stop**

* Destination
* Travel dates
* Stop order

**City**

* City information
* Country/region
* Cost index
* Popularity

**Activity**

* Activity type
* Cost
* Duration
* Description

**Expense**

* Category
* Estimated amount
* Associated trip/day

---

# 📱 Responsive Experience

GlobeTrotter is designed to provide a smooth experience across:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet

The interface should dynamically adapt to different screen sizes and user trip flows.

---

# 🛠️ Technology Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Responsive UI

### Backend

* Python
* FastAPI
* REST APIs
* SQLAlchemy
* JWT Authentication

### Database

* PostgreSQL
* Relational Database

### Development Tools

* Git
* GitHub
* VS Code
* Postman
* Swagger / OpenAPI

---

# 📂 Project Structure

```text
GlobeTrotter/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── services/
│
├── database/
│   └── schema/
│
├── README.md
└── package.json
```

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
```

## 2. Navigate to the Project

```bash
cd GlobeTrotter
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
API_URL=your_api_url
JWT_SECRET=your_secret
```

> Add only the environment variables actually required by your implementation.

## 5. Start the Application

```bash
npm run dev
```

---

# 🔮 Future Scope

GlobeTrotter can be extended with additional intelligent travel features such as:

* 🤖 AI-powered itinerary recommendations
* 🗺️ Interactive maps
* 🌦️ Destination weather information
* ✈️ Flight integration
* 🏨 Hotel integration
* 💳 Real-time pricing
* 🔔 Travel reminders
* 👥 Real-time collaborative trip planning
* 🌐 Multi-language support
* 📱 Progressive Web App support
* 📊 Advanced travel analytics

These are proposed extensions and are **not part of the mandatory functionality specified in the provided problem statement**.

---

# 🏆 Why GlobeTrotter?

GlobeTrotter brings the complete travel planning lifecycle into one platform:

```text
DISCOVER
   ↓
PLAN
   ↓
ORGANIZE
   ↓
BUDGET
   ↓
VISUALIZE
   ↓
SHARE
```

Instead of switching between different applications for destinations, activities, schedules, budgets, and sharing, travelers can manage their journey through one connected experience.

---

# 🎯 Hackathon Impact

GlobeTrotter addresses a real-world problem through a combination of:

* 🌍 Personalized travel planning
* 🗺️ Multi-city itinerary management
* 🔎 Destination discovery
* 🎯 Activity discovery
* 💰 Budget awareness
* 📅 Journey visualization
* 🔗 Social sharing
* 🗄️ Relational data management
* 📱 Responsive user experience

The project brief specifically emphasizes building a functional, insightful, user-centric application that helps travelers organize personalized trips efficiently and maintain visibility of their journey.

---

# 👥 Team

### GlobeTrotter Hackathon Team

**Project:** GlobeTrotter
**Theme:** Personalized Travel Planning
**Purpose:** Simplifying multi-city travel planning through an interactive digital platform.

---

# 📌 Project Reference

The project requirements, feature specifications, and overall vision are based on the official GlobeTrotter problem statement provided for the hackathon.

---

<div align="center">

## 🌍 GlobeTrotter

### **Your Journey. Your Plan. Your Way.**

**Plan smarter • Travel better • Explore more**

</div>
