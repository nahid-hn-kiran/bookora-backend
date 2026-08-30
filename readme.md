# Bookora Backend

Backend API for Bookora, an escape room booking and management platform.

## Production

**Backend API:** https://bookora-api-rea1.onrender.com/

The backend is deployed on Render.

## Overview

The Bookora backend provides the server-side application layer for authentication, authorization, venues, rooms, time slots, bookings, payments, administrative operations, validation, error handling, and database access.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Better Auth
- Zod
- Stripe
- Nodemailer
- Docker
- Render

## Core Features

### Authentication and Authorization

- Email/password authentication
- Google OAuth
- Better Auth session management
- Role-based authorization
- Protected API routes

### Venue, Room and Time-Slot Management

- Venue management
- Room management
- Time-slot management
- Availability handling

### Booking System

- Booking creation and management
- Time-slot availability
- Booking status handling
- Booking expiry scheduler
- Transaction-based booking operations

### Payments

- Stripe payment integration
- Stripe webhook handling
- Payment-related booking state updates

### Administration

- Admin routes and services
- User management
- Venue and room management
- Booking management
- Dashboard data

### API Engineering

- REST API architecture
- Request validation
- Centralized error handling
- Prisma error handling
- Environment-based configuration
- Graceful server shutdown

## Project Structure

```text
bookora-backend/
├── src/
│   ├── app/
│   │   ├── config/
│   │   ├── errorHelpers/
│   │   ├── middleware/
│   │   └── modules/
│   │       ├── admin/
│   │       ├── auth/
│   │       ├── bookings/
│   │       ├── dashboard/
│   │       ├── payment/
│   │       ├── rooms/
│   │       ├── time-slots/
│   │       └── venues/
│   ├── lib/
│   └── server.ts
├── prisma/
├── Dockerfile
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Local Development

### Requirements

- Node.js
- npm
- PostgreSQL

### Installation

```bash
cd bookora-backend
npm install
```

Create a `.env` file containing the environment variables required by the application.

Generate the Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Default local server:

```text
http://localhost:5000
```

## Production Build

```bash
npm run build
```

## Environment Variables

The backend requires configuration for:

- Application environment and port
- PostgreSQL database
- Better Auth
- Access and refresh tokens
- SMTP email delivery
- Google OAuth
- Frontend URL
- Stripe

Never commit `.env` files or secret credentials to Git.

## Docker

The backend includes a Dockerfile for containerized deployment.

It can also be run as part of the full Bookora Docker Compose setup from the repository root.

## Database

PostgreSQL is used as the primary database and Prisma is used for database access and schema management.

Common Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Use the appropriate migration workflow for the target environment.

## Author

Nahid Hasan
