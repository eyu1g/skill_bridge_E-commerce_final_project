<<<<<<< HEAD
# skillbridge_final_project
=======
# SkillBridge E-commerce Backend (Node.js + Express + MongoDB)

## Overview
A REST API implementing authentication, product management, and orders for an e-commerce platform.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth, bcrypt password hashing
- express-validator for input validation
- Helmet, CORS, Morgan middlewares

## Getting Started

### Prerequisites
- Node.js 18+

### Setup
1. Install dependencies:
```
npm install
```
2. Create environment file:
```
cp .env.example .env
```
3. Adjust `.env` as needed (set a strong `JWT_SECRET`).
4. Database initialization: MongoDB collections are created automatically on first use.

### Run
```
npm run dev
```
Server runs at `http://localhost:3000`.

## API Endpoints

### Auth
- POST `/auth/register`
- POST `/auth/login`

### Products
- POST `/products` (Admin only)
- PUT `/products/:id` (Admin only)
- GET `/products` (public, pagination + search)
- GET `/products/:id` (public)
- DELETE `/products/:id` (Admin only)

### Orders
- POST `/orders` (Authenticated)
- GET `/orders` (Authenticated)

## Roles
- User is created with role USER by default. To create an admin, you may pass `role: "ADMIN"` during registration for initial bootstrapping.

## Environment Variables
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Required
- `PORT` — default 3000

## Notes
- Passwords are hashed with bcrypt and never returned via API.
- Order placement is fully transactional: stock check, stock decrement, order + items creation (MongoDB transactions).
- Products listing supports `?page`, `?limit` (or `?pageSize`), and `?search`.

### MongoDB Transaction Requirement
MongoDB transactions require a replica set.
- Recommended: use MongoDB Atlas.
- Local: start MongoDB as a replica set (not standalone).

## Testing (Bonus - outline)
- Use supertest + jest. For DB mocking, isolate the data access in `src/db.js` and stub it in tests.

>>>>>>> 044d4c5 (feat: initial backend setup for SkillBridge e-commerce API)
