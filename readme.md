# Bookora Backend

Backend API for Bookora, an escape room booking and management platform.

## Production

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://bookora-frontend-gold.vercel.app)

**Live Application:** https://bookora-frontend-gold.vercel.app  
**Backend API:** https://bookora-backend-delta.vercel.app  
**Backend API Base:** https://bookora-backend-delta.vercel.app/api/v1  
**Cron Keep-Alive & Booking Expiry:** [https://bookora-backend-delta.vercel.app/api/v1/cron/expire-bookings](https://bookora-backend-delta.vercel.app/api/v1/cron/expire-bookings)

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
- Vercel

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

Booking rules:

- A new booking is `PENDING` and holds its time slot for 15 minutes. If it is not paid in that time it expires and is cancelled.
- Expired bookings are released by the scheduler every minute, and also on demand when someone tries to book the same time slot.
- Only one `PENDING` or `CONFIRMED` booking can exist per time slot. A second simultaneous request gets `409 Conflict`.
- Cancelling an unpaid booking also cancels its Stripe PaymentIntent and expires its Checkout Session, so it can no longer be paid.
- Cancelling a paid booking refunds the payment first. A refund that Stripe reports as `pending` counts as accepted.

### Payments

- Stripe payment integration
- Stripe webhook handling
- Payment-related booking state updates

Payment rules:

- A booking can be paid through a PaymentIntent or a Checkout Session. Both are confirmed by the `payment_intent.succeeded` webhook, which marks the payment `PAID` and the booking `CONFIRMED`.
- A payment that succeeds for an expired or cancelled booking is refunded automatically and recorded as `REFUNDED`.
- The Stripe webhook endpoint is `POST /api/v1/payments/webhook` and needs the `payment_intent.succeeded`, `payment_intent.payment_failed` and `charge.refunded` events.

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

When running locally, the API listens on the configured `PORT`.

## Production Build

```bash
npm run build
```

## Vercel Deployment

The backend can run as a single Vercel serverless function.

- Production API base: `https://bookora-backend-delta.vercel.app/api/v1`.
- Set `FRONTEND_URL` to `https://bookora-frontend-gold.vercel.app` in the backend's Vercel project.
- `api/index.js` is the function entry. It imports the bundled Express app from `dist/app.js`, which `npm run build` produces.
- `vercel.json` rewrites every path to that function and bundles the email templates in `src/app/templates`.
- `PORT` is not needed on Vercel. All other environment variables must be set in the Vercel project.
- Set `CRON_SECRET` to a long random value. The expiry route rejects every call while it is unset.

The in-process booking expiry scheduler does not run on Vercel. Expired bookings are released by:

```text
GET https://bookora-backend-delta.vercel.app/api/v1/cron/expire-bookings
```

The secret is passed as `?secret=<CRON_SECRET>` or as an `Authorization: Bearer <CRON_SECRET>` header. `vercel.json` schedules this once a day, which is the limit on the Hobby plan. For more frequent runs, call the route from an external scheduler.

After deploying, point the Stripe webhook at `https://<your-domain>/api/v1/payments/webhook` and update `STRIPE_WEBHOOK_SECRET`.

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
