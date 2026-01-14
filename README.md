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

## Quick Start
Follow these steps to get the application running locally.

### 1. Database Setup
The project uses PostgreSQL which can be easily started using Docker.

Navigate to the `api` directory and start the database:
```bash
cd api
docker-compose up -d
```
This spins up a Postgres instance on port `5432`.

### 2. Backend Setup
Make sure you are in the `api` directory.

1. **Configuration**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Initialize Database**:
   Run the following commands to generate Prisma client, push the schema, and seed the database with test data:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   pnpm seed
   ```

4. **Start the API**:
   ```bash
   pnpm run start:dev
   ```
   The backend will be running at `http://localhost:3000/graphql`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

1. **Configuration**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the App**:
   ```bash
   pnpm run dev
   ```
   The application will be running at `http://localhost:3001`.


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
