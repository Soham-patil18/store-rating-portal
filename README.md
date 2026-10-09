# Store Rating Platform (FullStack Intern Challenge)

A complete, production-ready web application built according to the **FullStack Intern Coding Challenge** specification.

---

## 🚀 Tech Stack
- **Backend**: Express.js (Node.js ES Modules)
- **Database**: PostgreSQL / MySQL / SQLite (Sequelize ORM with relational schema & automated seeder)
- **Frontend**: React.js (Vite + Tailwind CSS + Lucide Icons)
- **Authentication**: JWT token authentication with bcrypt password hashing

---

## 👥 User Roles & Features

### 1. System Administrator
- **Dashboard Metrics**:
  - Total number of registered users
  - Total number of registered stores
  - Total number of submitted ratings
- **Store & User Creation**:
  - Add new stores (Name, Email, Address, Assigned Owner)
  - Add new users (Name, Email, Password, Address, Role: Admin, Normal, Owner)
- **Directory & Listings**:
  - View all stores with Name, Email, Address, Overall Rating
  - View all users with Name, Email, Address, Role
  - **Store Owner Rating**: If the user is a Store Owner, their store's rating is automatically calculated and displayed!
- **Table Controls**:
  - Full filtering by Name, Email, Address, and Role
  - Column sorting (Ascending / Descending) on all key fields
- **Log out**

### 2. Normal User
- **Registration & Login**:
  - Signup page with form validation rules
  - Login system
- **Store Directory & Rating**:
  - Search stores by **Name** and **Address**
  - View Store Name, Address, Overall Rating
  - View **User's Submitted Rating** (or "Not rated yet")
  - Submit rating (1 to 5 stars)
  - Modify existing submitted rating
- **Profile**:
  - Update password after logging in
- **Log out**

### 3. Store Owner
- **Dashboard**:
  - Average rating of their store & total reviews received
  - Table of users who submitted ratings for their store (User Name, Email, Submitted Rating, Date)
  - Sorting support (by Name, Email, Rating, Date)
- **Profile**:
  - Update password after logging in
- **Log out**

---

## 🛡️ Form Validations (PDF Spec)
- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include at least one uppercase letter and one special character
- **Email**: Standard email validation rules
- **Rating**: Integer between 1 and 5

---

## ⚡ Quick Demo Accounts
The login page has **1-Click Quick Fill** buttons for effortless testing:

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@storerating.com` | `Admin@123` |
| **Normal User** | `johnathan.doe@example.com` | `User@123` |
| **Store Owner** | `michael.davies@stores.com` | `Owner@123` |

---

## 🛠️ How to Run

### 1. Backend (Port 5000)
```bash
cd backend
npm install
npm run seed     # Seeds demo admin, owners, users, stores, and ratings
npm start        # Starts server on http://localhost:5000
```

### 2. Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

Open your browser at **http://localhost:3000**!

---

## 🗄️ Database Configuration
By default, the backend connects via **SQLite** (`backend/database.sqlite`) for immediate zero-setup execution.

To switch to **MySQL** or **PostgreSQL**:
Edit `backend/.env`:
```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_db
```
and re-run `npm run seed`.
