# Slooze Food Ordering App - Full Stack Challenge

## Overview
This is a full-stack, role-based food ordering web application built as part of the Slooze recruitment challenge.
It features a **NestJS** backend (migrated to **GraphQL** + **Prisma**) and a **Next.js** frontend (**Apollo Client**).

## Tech Stack
- **Backend**: NestJS, GraphQL (Apollo Driver), Prisma ORM, PostgreSQL.
- **Frontend**: Next.js (App Router), Apollo Client, Tailwind CSS.
- **Authentication**: JWT-based Authentication with Role-Based Access Control (RBAC).

## Features Implemented
| Feature | Admin | Manager | Member |
| :--- | :---: | :---: | :---: |
| View Restaurants/Menu | ✅ | ✅ | ✅ |
| Create Order | ✅ | ✅ | ✅ |
| Checkout & Pay | ✅ | ✅ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ |
| Manage Payment Methods | ✅ | ❌ | ❌ |

**Bonus**: Implemented Relational Access Control (Re-BAC). Managers and Members are restricted to their assigned Country (India/America).

## Prerequisites
- Node.js (v18+)
- pnpm (Recommended package manager)
- PostgreSQL Database

## Docker Setup
Run the entire stack (Frontend, Backend, Database) with Docker Compose:

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - **Frontend**: [http://localhost:3001](http://localhost:3001)
   - **Backend**: [http://localhost:3000/graphql](http://localhost:3000/graphql)

3. **Seeding Data** (Optional):
   The database starts empty. To load the test personas (Admin/Manager/Member), run:
   ```bash
   docker-compose exec api pnpm seed
   ```

## Configuration
Before running the application, set up the environment variables:

1. **Backend**: Copy the example env file:
   ```bash
   cp api/.env.example api/.env
   ```

2. **Frontend**: Copy the example env file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

## Setup Instructions

### 1. Backend Setup
Navigate to the `api` directory:
```bash
cd api
```

Install dependencies:
```bash
pnpm install
```

Configure Environment:
Ensure you have a `.env` file with `DATABASE_URL` pointing to your Postgres instance.
```env
DATABASE_URL="postgresql://user:password@localhost:5432/slooze_db?schema=public"
JWT_SECRET="super-secret"
```

Initialize Database & Seed Data:
```bash
# Generate Prisma Client
pnpm prisma generate

# Push Schema to DB
pnpm prisma db push

# Seed the Database (Creates Test Personas)
pnpm ts-node prisma/seed.ts
```

Start the Backend:
```bash
pnpm run start:dev
```
Server runs at `http://localhost:3000/graphql`.

### 2. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
pnpm install
```

Start the Frontend:
```bash
pnpm run dev
```
Application runs at `http://localhost:3001`.

## Verification & Testing

### Test Personas (Pre-seeded)
| Role | Name | Email | Password | Country | 
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Nick Fury | `nick@slooze.xyz` | `password` | INDIA |
| **Manager** | Captain Marvel | `marvel@slooze.xyz` | `password` | INDIA |
| **Manager** | Captain America | `cap@slooze.xyz` | `password` | AMERICA |
| **Member** | Thanos | `thanos@slooze.xyz` | `password` | INDIA |
| **Member** | Thor | `thor@slooze.xyz` | `password` | INDIA |
| **Member** | Travis | `travis@slooze.xyz` | `password` | AMERICA |

### Automated Verification Script
A script is provided to verify the RBAC logic programmatically:
```bash
cd api
node verify_rbac.js
```

### Postman Collection
Import `slooze-food-app.postman_collection.json` into Postman. 
1. **Login** request automatically sets the `token` environment variable.
2. Subsequent requests use `{{token}}` for valid RBAC testing.

## Architecture Notes
- **Prisma**: Used as the ORM replacing TypeORM. Schema defined in `api/prisma/schema.prisma`.
- **GraphQL**: Code-first approach. Resolvers found in `api/src/*/resolvers`.
- **Apollo Client**: Configured in `frontend/lib/apollo-client.ts` with `AuthProvider` integration.
