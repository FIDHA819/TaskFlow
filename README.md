# TaskFlow — MERN Stack Task Management App

A full-featured Task Management Web Application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, full CRUD operations, search, filtering, and pagination.

---

## ✨ Features

### Core
- **User Authentication** — Register, login, JWT-secured sessions with auto-expiry
- **Full Task CRUD** — Create, read, update, delete tasks
- **Toggle Status** — One-click mark as completed/pending with optimistic UI
- **Responsive Design** — Works across all screen sizes

### Bonus Features
- **Search** — Real-time debounced search by title/description
- **Filter** — Filter by status (pending/completed) and priority (low/medium/high)
- **Sort** — Sort by date, priority, or due date
- **Pagination** — Server-side pagination with 10 tasks per page
- **Priority Levels** — High / Medium / Low with visual indicators
- **Due Dates** — Optional due dates with overdue highlighting
- **Progress Bar** — Visual completion percentage on dashboard
- **Clear Completed** — Bulk delete all completed tasks
- **Password Strength Meter** — Real-time feedback during registration

---

## 🗂 Project Structure

```
taskflow/
├── server/                   # Node.js + Express backend
│   ├── models/
│   │   ├── User.js           # User schema (name, email, password)
│   │   └── Task.js           # Task schema (title, description, status, priority, dueDate, userId)
│   ├── routes/
│   │   ├── auth.js           # POST /register, POST /login, GET /me, PUT /profile
│   │   └── tasks.js          # Full CRUD + toggle + clear-completed
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware
│   ├── index.js              # Express app entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── client/                   # React.js frontend
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js    # Global auth state (useReducer)
    │   ├── hooks/
    │   │   └── useTasks.js       # Task operations + state management
    │   ├── pages/
    │   │   ├── Login.js          # Login page
    │   │   ├── Register.js       # Register page with password strength
    │   │   └── Dashboard.js      # Main task dashboard
    │   ├── components/
    │   │   ├── TaskItem.js       # Individual task row
    │   │   ├── TaskModal.js      # Add/edit task modal
    │   │   └── ConfirmDialog.js  # Delete confirmation dialog
    │   ├── utils/
    │   │   └── api.js            # Axios instance + interceptors
    │   ├── App.js                # Router + protected routes
    │   └── App.css              # Full design system
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Atlas](https://cloud.mongodb.com) free tier)
- **npm** v8+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

`server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://fidhapichu461_db_user:taskmanagement@cluster0.lvq9ogx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development

```

> **For MongoDB Atlas**: Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://fidhapichu461_db_user:taskmanagement@cluster0.lvq9ogx.mongodb.net/?`

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the app

**Option A — Run both together (from root):**
```bash
cd ..        # back to root taskflow/
npm install  # installs concurrently
npm run dev  # starts both server + client
```

**Option B — Run separately:**

Terminal 1 (backend):
```bash
cd backend
npm run dev   # runs with nodemon on port 5000
```

Terminal 2 (frontend):
```bash
cd frontend
npm start     # runs on port 3000
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

**Register request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (paginated, filterable) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status |
| DELETE | `/api/tasks/:id` | Delete task |
| DELETE | `/api/tasks` | Clear all completed tasks |

**GET /api/tasks query parameters:**
```
page=1          (default: 1)
limit=10        (default: 10, max: 50)
status=pending  (pending | completed | all)
priority=high   (high | medium | low | all)
search=keyword  (searches title + description)
sortBy=createdAt (createdAt | priority | dueDate)
sortOrder=desc  (asc | desc)
```

**GET /api/tasks response:**
```json
{
  "success": true,
  "tasks": [...],
  "pagination": { "total": 25, "page": 1, "limit": 10, "pages": 3, "hasNext": true, "hasPrev": false },
  "stats": { "total": 25, "completed": 8, "pending": 17 }
}
```

**Create/Update task body:**
```json
{
  "title": "Build the API",
  "description": "Implement RESTful endpoints",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

---

## 🗃 Database Schema

### User
```js
{
  name:      String (required, 2-50 chars),
  email:     String (required, unique, lowercase),
  password:  String (required, hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```js
{
  title:       String (required, 1-100 chars),
  description: String (max 500 chars),
  status:      String (enum: 'pending' | 'completed', default: 'pending'),
  priority:    String (enum: 'low' | 'medium' | 'high', default: 'medium'),
  dueDate:     Date (optional),
  userId:      ObjectId (ref: User, required),
  createdAt:   Date,
  updatedAt:   Date
}
```

---

## 🌐 Deployment

### Backend — Render.com (free tier)
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set Root Directory to `backend`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables from `.env`

### Frontend — Vercel (free tier)
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set Root Directory to `frontend`
4. Add env variable: `REACT_APP_API_URL=https://your-render-app.onrender.com/api`
5. Deploy

### Database — MongoDB Atlas (free tier)
1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user + whitelist `0.0.0.0/0` for Render
3. Copy connection string to Render env vars

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens with configurable expiry (default 7 days)
- Protected routes via middleware on all task endpoints
- Input validation using **express-validator** on all routes
- Mongoose query scoping — users can only access their own tasks
- CORS restricted to frontend origin

---

## 📊 Evaluation Criteria Addressed

| Criteria | Implementation |
|----------|---------------|
| **Code Quality** | Modular architecture, custom hooks, context API, clean separation of concerns |
| **UI/UX** | Dark theme design system, responsive, animated modals, optimistic updates |
| **Functionality** | Full CRUD, auth, search, filter, sort, pagination, priority, due dates |
| **Error Handling** | Global error handler, field-level validation, toast notifications, 404/401 middleware |
| **Creativity** | Password strength meter, progress bar, optimistic toggle, bulk clear, greeting by time of day |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, react-hot-toast, react-icons |
| Backend | Node.js, Express.js, express-validator |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Dev Tools | nodemon, concurrently |
#   T a s k F l o w  
 