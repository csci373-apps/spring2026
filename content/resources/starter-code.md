---
title: "Starter Code Overview"
group: "Getting Started"
group_order: 1
order: 1
quicklink: 1
heading_max_level: 3
---

The starter code is a simplified version of the Three Moves Ahead health application that provides the foundational infrastructure for your semester project. It includes core authentication, basic CRUD operations, and development tooling, but intentionally excludes advanced features that you'll implement during the course.

## Architecture Diagrams

### 1. Development
All containers managed by `docker-compose.yaml`. Expo runs locally, connects to Backend via localhost:8000 

```bash
┌─────────────────────────────────────────────────────────────┐
│                    Your Laptop (Development)                │
│                                                             │
│  ┌──────────────┐         ┌────────────────┐                │
│  │              │         │   Frontend     │                │
│  │  Browser     │◀───────▶│   Container    │                │
│  │              │         │ localhost:8000 │                │
│  │              │         │    (React)     │                │
│  └──────────────┘         └──────┬─────────┘                │
│                                  │                          │
│  ┌──────────────┐                │   HTTP Requests          │
│  │   Expo       │                │ (localhost:8000)         │
│  │   (npm start)│                │                          │
│  │   iOS/Android│                │                          │
│  │   Simulator  │                │                          │
│  └──────────────┘                ▼                          │
│         ▲                ┌────────────────┐                 │
│         │                │    Backend     │                 │
│         └──────────────▶ | localhost:8000 │                 │
│     HTTP Requests        │   (FastAPI)    │                 │
│   (localhost:8000)       └──────┬─────────┘                 │
│                                 │                           │
│                                 │    SQL Queries            │
│                                 │ (Docker network)          │
│                                 ▼                           │
│                          ┌──────────────┐                   │
│                          │  Database    │                   │
│                          │  Container   │                   │
│                          │ (PostgreSQL) │                   │
│                          └──────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Production
Single container serves both frontend (static) and backend (FastAPI). Mobile app built with EAS, distributed as APK/IPA.

```bash
┌─────────────────────────────────────────────────────────────┐
│                    Browser Users                            │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Desktop    │         │   Mobile     │                  │
│  │   Browser    │         │   Browser    │                  │
│  └──────────────┘         └──────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      │ (https://tma.unca.info)
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────┐
│                    Production (Railway)                    │
│                                                            │
│                    ┌────────────────────────────┐          │
│                    │   Combined Container       │          │
│                    │   (Single Docker Image)    │          │
│                    │                            │          │
│                    │  ┌──────────────────────┐  │          │
│                    │  │  Frontend (Static)   │  │          │
│                    │  │  Served from /static │  │          │
│                    │  └──────────────────────┘  │          │
│                    │                            │          │
│                    │  ┌──────────────────────┐  │          │
│                    │  │  Backend (FastAPI)   │  │          │
│                    │  │  Port: 8080          │  │          │
│                    │  └──────┬───────────────┘  │          │
│                    └─────────┼──────────────────┘          │
│                              │                             │
│                              │    SQL Queries              │
│                              │                             │
│                              ▼                             │
│                    ┌──────────────────────┐                │
│                    │  Managed PostgreSQL  │                │
│                    │  (Railway/Cloud DB)  │                │
│                    └──────────────────────┘                │
│                                                            │
└────────────────────────────────────────────────────────────┘
                                      ▲
                                      │
                                      │ HTTPS API Calls
                                      │ (https://tma.unca.info)
                                      │
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Users                             │
│                                                             │
│  ┌──────────────┐         ┌────────────────┐                │
│  │  iOS Device  │         │ Android Device │                │
│  │  (IPA)       │         │  (APK)         │                │
│  └──────────────┘         └────────────────┘                │
│                                                             │
│  Built with EAS (Expo Application Services)                 │
│  Distributed via App Store / Google Play / Direct Install   │
└─────────────────────────────────────────────────────────────┘
```

## What's Included

### 1. Backend (FastAPI + PostgreSQL)

**Core Infrastructure:**
- FastAPI server with async SQLAlchemy ORM
- PostgreSQL database with Docker setup
- JWT-based authentication system
- Role-based access control (admin, manager, user roles)
- Database migrations and seed data scripts
- CORS middleware configured

**API Endpoints:**
<a href="https://dev.tma.unca.info/docs" target="_blank">https://dev.tma.unca.info/docs</a>

**Database Models:**
- `User` - User accounts with profile fields
- `Role` - System roles (user, manager, admin)
- `Group` - User groups
- `UserGroup` - Many-to-many relationship between users and groups
- `Course` - Courses/projects
- `CourseGroup` - Many-to-many relationship between courses and groups

**Seed Data:**
- Pre-populated CSV files for users, groups, courses
- Automatic role seeding on startup
- Sample data generation with Faker

### 2. Frontend (React + TypeScript + Mantine)

**Core Infrastructure:**
- React 19 with TypeScript
- Vite build tool
- Mantine UI component library
- React Router for navigation
- Context API for authentication state

**Features:**
- Authentication
- Admin Interface
- User Interface

**UI Components:**
- Layout components (AdminPageLayout, UserPageLayout)
- Data views (table and card views)
- Form components
- Navigation components

**Web Demo**: https://dev.tma.unca.info/

### 3. Mobile App (React Native + Expo)

**Core Infrastructure:**
- Expo SDK 54
- React Native with TypeScript
- Expo Router for file-based routing
- React Native Paper (Material Design 3)
- React Query for data fetching
- Axios for API calls
- Expo Secure Store for token storage

**Features:**
- Authentication (login)
- Home screen
- Groups list and detail screens
- Basic navigation with bottom tabs
- Error boundary
- Protected routes

**Note:** Mobile app is simplified and primarily serves as a foundation for future development.

### 4. Development Tools

**Docker & Docker Compose:**
- PostgreSQL database container
- Backend API container with hot reload
- Frontend container with hot reload
- Volume mounts for development
- Health checks and dependency management

**CI/CD:**
- GitHub Actions workflow for linting and formatting
- Automated checks on push and pull requests
- Backend: Black, isort, Ruff
- Frontend: ESLint, Prettier

**Code Quality:**
- Pre-commit hooks (via CI)
- Consistent formatting rules
- TypeScript strict mode
- ESLint configuration

## What's NOT Included

The following features are intentionally excluded from the starter code and will be implemented during the course:

- **Modules** - Course module management
- **Posts** - Content posts within modules
- **Quizzes** - Quiz creation and taking
- **File Upload** - File upload and storage
- **User Progress** - Progress tracking for courses/modules
- **Invites** - User invitation system
- **Email Verification** - Email verification workflow
- **Admin Impersonation** - Admin user impersonation feature
- **Complex UI Features** - Advanced UI components and interactions

## Setup Instructions

### 1. Prerequisites

- **Docker & Docker Compose** - For running backend and frontend
- **Node.js 18.x or 20.x** - For mobile app development (avoid 19.x or 21+)
- **Git** - Version control
- **SSH key** - For GitHub authentication

### 2. Initial Setup

1. One member of your team forks the base repository, located here: https://github.com/csci373-apps/tma-starter-app

1. **Clone the repository:**
   ```bash
   git clone git@github.com:<teammates_github_handle>/tma-starter-app.git
   cd tma
   ```

1. **Create a new branch:**
   ```bash
   git checkout -b <your-username>-setup
   ```

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (defaults usually work for local development).

1. **Build your Docker images, volumes, and containers:**
First, make sure that Docker Desktop is running on your machine. Also, if you've previously built a container that also uses ports 5433, 5173, or 8000, please stop those containers before proceeding.

When you're ready, issue the following command to build your containers:

   ```bash
   docker compose up -d
   ```
   This starts:
   - PostgreSQL database on port 5433
   - Backend API on port 8000
   - Frontend on port 5173

5. **Seed the database:**
After creating your containers, run the test database script to populate your database with fake information (just for testing). You can modify your fake data by navigating to `backend/scripts/sample_data` and editing the relevant CSV files with the data you want.

   ```bash
   docker exec -it tma_backend poetry run python scripts/populate.py --reset
   ```
   The `--reset` flag drops all tables and recreates them with fresh data.

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### 3. Default Credentials

After seeding, you can log into the web app (http://localhost:5173) with:
- **Admin:** `admin` / `password` (or check `backend/scripts/sample_data/users.csv`)
- **Regular User:** `tester` / `password` (or check `backend/scripts/sample_data/users.csv`)

### 4. Mobile App Setup

The Mobile App Setup does not use Docker, so you will have to configure Expo and React Native manually.

**Prerequisites:**
- **For iOS Simulator:** Xcode (macOS only) - includes iOS Simulator
- **For Android Emulator:** Android Studio with Android SDK and an AVD (Android Virtual Device). See <a href="https://docs.expo.dev/workflow/android-studio-emulator/" target="_blank" rel="noopener noreferrer">these instructions</a>.
- **For Physical Devices:** Expo Go app installed on your phone
  - iOS: Install from <a href="https://apps.apple.com/app/expo-go/id982107779" target="_blank" rel="noopener noreferrer">App Store</a>
  - Android: Install from <a href="https://play.google.com/store/apps/details?id=host.exp.exponent" target="_blank" rel="noopener noreferrer">Google Play</a>

**Setup Steps:**

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional):**
   ```bash
   # For iOS simulator and web: leave EXPO_PUBLIC_API_URL unset (uses localhost:8000)
   # For Android emulator: leave unset (automatically uses 10.0.2.2:8000)
   # For physical device: set to your computer's IP address
   echo "EXPO_PUBLIC_API_URL=http://YOUR_IP:8000" > .env
   ```
   
   **Note:** The app automatically uses the correct URL based on platform:
   - **iOS Simulator:** `http://localhost:8000` (default)
   - **Android Emulator:** `http://10.0.2.2:8000` (default)
   - **Physical Device:** Set `EXPO_PUBLIC_API_URL` to your computer's IP (e.g., `http://192.168.1.228:8000`)

4. **Start Expo:**
   ```bash
   npm start
   ```
   Or use: `npx expo start` (both work the same)

5. **Run on device:**
   - **iOS Simulator:** Press `i` (requires Xcode)
   - **Android Emulator:** Press `a` (requires Android Studio with AVD)
   - **Physical Device:** 
     - Install Expo Go app on your phone (see Prerequisites above)
     - Scan the QR code shown in the terminal with:
       - **iOS:** Camera app (opens in Expo Go)
       - **Android:** Expo Go app's built-in scanner
`

### 5. Useful Commands

**Docker:**
```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild everything
docker compose down --rmi all -v --remove-orphans
docker compose up --build -d
```

**Backend Formatting / Linting:**
```sh
# Check for code formatting / linter errors (Python):
docker exec -it tma_backend bash scripts/check.sh

# Auto-fix code formatting and some linter errors (Python):
docker exec -it tma_backend bash scripts/fix.sh
```

**Frontend Formatting / Linting:**
```sh
# Check for code formatting / linter errors (TypeScript, React):
docker exec -it tma_frontend npm run check  

# Auto-fix code formatting and some linter errors (TypeScript, React):
docker exec -it tma_frontend npm run fix
```

## Project Structure

```sh
health-app/
├── backend/             # FastAPI backend
│   ├── models/          # SQLAlchemy models
│   ├── routes/          # API route handlers
│   ├── schemas/         # Pydantic schemas
│   ├── database/        # Database connection & migrations
│   ├── scripts/         # Seed data scripts
│   └── server.py        # FastAPI app entry point
├── ui/                  # React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── contexts/    # React contexts
│       ├── hooks/       # Custom React hooks
│       └── utils/       # Utility functions
├── mobile/              # React Native mobile app
│   ├── app/             # Expo Router app directory
│   ├── components/      # React Native components
│   ├── services/        # API service functions
│   └── contexts/        # React contexts
├── database/            # Database Docker setup
├── docker-compose.yaml  # Docker Compose configuration
└── .github/             # GitHub Actions workflows
```

## Next Steps

1. **Explore the codebase** - Familiarize yourself with the structure
2. **Review the API** - Check out `/docs` endpoint for API documentation
3. **Read the code** - Understand how authentication, routing, and data flow work
4. **Check the seed data** - Look at `backend/scripts/sample_data/` to understand the data model
5. **Start implementing** - Begin with the first homework assignment!

## Additional Resources

- <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer">FastAPI Documentation</a>
- <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React Documentation</a>
- <a href="https://docs.expo.dev/" target="_blank" rel="noopener noreferrer">Expo Documentation</a>
- <a href="https://mantine.dev/" target="_blank" rel="noopener noreferrer">Mantine UI Documentation</a>
- <a href="https://callstack.github.io/react-native-paper/" target="_blank" rel="noopener noreferrer">React Native Paper Documentation</a>

