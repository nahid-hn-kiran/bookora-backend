// src/app.ts
import express from "express";

// src/app/routes/index.ts
import { Router as Router9 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
var catchAsync_default = catchAsync;

// src/app/modules/auth/auth.service.ts
import status2 from "http-status";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.9.1",
  "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id            String  @id @default(uuid(7))\n  name          String\n  email         String  @unique\n  profilePhoto  String?\n  contactNumber String?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([isDeleted])\n  @@map("admins")\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String     @unique\n  emailVerified Boolean    @default(false)\n  role          Role       @default(USER)\n  status        UserStatus @default(ACTIVE)\n  image         String?\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  admin    Admin?\n  bookings Booking[]\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Booking {\n  id            String @id @default(uuid(7))\n  bookingNumber String @unique\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  timeSlotId String\n  timeSlot   TimeSlot @relation(fields: [timeSlotId], references: [id], onDelete: Restrict)\n\n  guestCount Int\n\n  totalAmount Decimal @db.Decimal(10, 2)\n\n  status BookingStatus @default(PENDING)\n\n  notes String?\n\n  payment   Payment?\n  expiresAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([timeSlotId])\n  @@index([userId])\n  @@index([status])\n  @@index([expiresAt])\n  @@map("bookings")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum VenueStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum RoomStatus {\n  ACTIVE\n  INACTIVE\n  MAINTENANCE\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  CANCELLED\n  COMPLETED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  STRIPE\n  CASH\n}\n\nmodel Payment {\n  id String @id @default(uuid(7))\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  amount Decimal @db.Decimal(10, 2)\n\n  method PaymentMethod\n  status PaymentStatus @default(PENDING)\n\n  transactionId     String?\n  paymentIntentId   String? @unique\n  checkoutSessionId String?\n\n  paidAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([status])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Room {\n  id          String  @id @default(uuid(7))\n  name        String\n  description String?\n\n  capacity   Int\n  price      Decimal @db.Decimal(10, 2)\n  duration   Int\n  difficulty String?\n\n  image String?\n\n  status RoomStatus @default(ACTIVE)\n\n  venueId String\n  venue   Venue  @relation(fields: [venueId], references: [id], onDelete: Cascade)\n\n  timeSlots TimeSlot[]\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([venueId])\n  @@index([status])\n  @@index([isDeleted])\n  @@map("rooms")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TimeSlot {\n  id String @id @default(uuid(7))\n\n  roomId String\n\n  date      DateTime\n  startTime DateTime\n  endTime   DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  room Room @relation(fields: [roomId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  bookings Booking[]\n\n  @@index([roomId])\n  @@index([date])\n  @@map("time_slots")\n}\n\nmodel Venue {\n  id          String      @id @default(uuid(7))\n  name        String\n  description String?\n  address     String\n  city        String\n  country     String\n  phone       String?\n  email       String?\n  image       String?\n  status      VenueStatus @default(ACTIVE)\n\n  rooms Room[]\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([status])\n  @@index([isDeleted])\n  @@map("venues")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"timeSlotId","kind":"scalar","type":"String"},{"name":"timeSlot","kind":"object","type":"TimeSlot","relationName":"BookingToTimeSlot"},{"name":"guestCount","kind":"scalar","type":"Int"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"bookings"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentIntentId","kind":"scalar","type":"String"},{"name":"checkoutSessionId","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Room":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"difficulty","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"RoomStatus"},{"name":"venueId","kind":"scalar","type":"String"},{"name":"venue","kind":"object","type":"Venue","relationName":"RoomToVenue"},{"name":"timeSlots","kind":"object","type":"TimeSlot","relationName":"RoomToTimeSlot"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"rooms"},"TimeSlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"room","kind":"object","type":"Room","relationName":"RoomToTimeSlot"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTimeSlot"}],"dbName":"time_slots"},"Venue":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"VenueStatus"},{"name":"rooms","kind":"object","type":"Room","relationName":"RoomToVenue"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"venues"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","admin","rooms","_count","venue","timeSlots","room","bookings","timeSlot","booking","payment","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","_avg","_sum","Booking.groupBy","Booking.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Room.findUnique","Room.findUniqueOrThrow","Room.findFirst","Room.findFirstOrThrow","Room.findMany","Room.createOne","Room.createMany","Room.createManyAndReturn","Room.updateOne","Room.updateMany","Room.updateManyAndReturn","Room.upsertOne","Room.deleteOne","Room.deleteMany","Room.groupBy","Room.aggregate","TimeSlot.findUnique","TimeSlot.findUniqueOrThrow","TimeSlot.findFirst","TimeSlot.findFirstOrThrow","TimeSlot.findMany","TimeSlot.createOne","TimeSlot.createMany","TimeSlot.createManyAndReturn","TimeSlot.updateOne","TimeSlot.updateMany","TimeSlot.updateManyAndReturn","TimeSlot.upsertOne","TimeSlot.deleteOne","TimeSlot.deleteMany","TimeSlot.groupBy","TimeSlot.aggregate","Venue.findUnique","Venue.findUniqueOrThrow","Venue.findFirst","Venue.findFirstOrThrow","Venue.findMany","Venue.createOne","Venue.createMany","Venue.createManyAndReturn","Venue.updateOne","Venue.updateMany","Venue.updateManyAndReturn","Venue.upsertOne","Venue.deleteOne","Venue.deleteMany","Venue.groupBy","Venue.aggregate","AND","OR","NOT","id","name","description","address","city","country","phone","email","image","VenueStatus","status","isDeleted","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","roomId","date","startTime","endTime","capacity","price","duration","difficulty","RoomStatus","venueId","bookingId","amount","PaymentMethod","method","PaymentStatus","transactionId","paymentIntentId","checkoutSessionId","paidAt","bookingNumber","userId","timeSlotId","guestCount","totalAmount","BookingStatus","notes","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","role","UserStatus","profilePhoto","contactNumber","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "vgRboAEOAwAA3QIAILgBAADgAgAwuQEAAAsAELoBAADgAgAwuwEBAAAAAbwBAQCfAgAhwgEBAAAAAcYBIACiAgAhxwFAAKMCACHIAUAApAIAIckBQACkAgAh7AEBAAAAAYUCAQCgAgAhhgIBAKACACEBAAAAAQAgDAMAAN0CACC4AQAA4gIAMLkBAAADABC6AQAA4gIAMLsBAQCfAgAhyAFAAKQCACHJAUAApAIAIewBAQCfAgAh8gFAAKQCACH-AQEAnwIAIf8BAQCgAgAhgAIBAKACACEDAwAAiwQAIP8BAADjAgAggAIAAOMCACAMAwAA3QIAILgBAADiAgAwuQEAAAMAELoBAADiAgAwuwEBAAAAAcgBQACkAgAhyQFAAKQCACHsAQEAnwIAIfIBQACkAgAh_gEBAAAAAf8BAQCgAgAhgAIBAKACACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAN0CACC4AQAA4QIAMLkBAAAHABC6AQAA4QIAMLsBAQCfAgAhyAFAAKQCACHJAUAApAIAIewBAQCfAgAh9QEBAJ8CACH2AQEAnwIAIfcBAQCgAgAh-AEBAKACACH5AQEAoAIAIfoBQACjAgAh-wFAAKMCACH8AQEAoAIAIf0BAQCgAgAhCAMAAIsEACD3AQAA4wIAIPgBAADjAgAg-QEAAOMCACD6AQAA4wIAIPsBAADjAgAg_AEAAOMCACD9AQAA4wIAIBEDAADdAgAguAEAAOECADC5AQAABwAQugEAAOECADC7AQEAAAAByAFAAKQCACHJAUAApAIAIewBAQCfAgAh9QEBAJ8CACH2AQEAnwIAIfcBAQCgAgAh-AEBAKACACH5AQEAoAIAIfoBQACjAgAh-wFAAKMCACH8AQEAoAIAIf0BAQCgAgAhAwAAAAcAIAEAAAgAMAIAAAkAIA4DAADdAgAguAEAAOACADC5AQAACwAQugEAAOACADC7AQEAnwIAIbwBAQCfAgAhwgEBAJ8CACHGASAAogIAIccBQACjAgAhyAFAAKQCACHJAUAApAIAIewBAQCfAgAhhQIBAKACACGGAgEAoAIAIQEAAAALACARAwAA3QIAIA0AAN4CACAPAADfAgAguAEAANsCADC5AQAADQAQugEAANsCADC7AQEAnwIAIcUBAADcAvEBIsgBQACkAgAhyQFAAKQCACHrAQEAnwIAIewBAQCfAgAh7QEBAJ8CACHuAQIA1wIAIe8BEAC5AgAh8QEBAKACACHyAUAAowIAIQUDAACLBAAgDQAAjwQAIA8AAJAEACDxAQAA4wIAIPIBAADjAgAgEQMAAN0CACANAADeAgAgDwAA3wIAILgBAADbAgAwuQEAAA0AELoBAADbAgAwuwEBAAAAAcUBAADcAvEBIsgBQACkAgAhyQFAAKQCACHrAQEAAAAB7AEBAJ8CACHtAQEAnwIAIe4BAgDXAgAh7wEQALkCACHxAQEAoAIAIfIBQACjAgAhAwAAAA0AIAEAAA4AMAIAAA8AIBMJAADZAgAgCgAA2gIAILgBAADWAgAwuQEAABEAELoBAADWAgAwuwEBAJ8CACG8AQEAnwIAIb0BAQCgAgAhwwEBAKACACHFAQAA2ALhASLGASAAogIAIccBQACjAgAhyAFAAKQCACHJAUAApAIAIdwBAgDXAgAh3QEQALkCACHeAQIA1wIAId8BAQCgAgAh4QEBAJ8CACEGCQAAjQQAIAoAAI4EACC9AQAA4wIAIMMBAADjAgAgxwEAAOMCACDfAQAA4wIAIBMJAADZAgAgCgAA2gIAILgBAADWAgAwuQEAABEAELoBAADWAgAwuwEBAAAAAbwBAQCfAgAhvQEBAKACACHDAQEAoAIAIcUBAADYAuEBIsYBIACiAgAhxwFAAKMCACHIAUAApAIAIckBQACkAgAh3AECANcCACHdARAAuQIAId4BAgDXAgAh3wEBAKACACHhAQEAnwIAIQMAAAARACABAAASADACAAATACABAAAAEQAgDAsAANUCACAMAADSAgAguAEAANQCADC5AQAAFgAQugEAANQCADC7AQEAnwIAIcgBQACkAgAhyQFAAKQCACHYAQEAnwIAIdkBQACkAgAh2gFAAKQCACHbAUAApAIAIQILAACMBAAgDAAAhQQAIAwLAADVAgAgDAAA0gIAILgBAADUAgAwuQEAABYAELoBAADUAgAwuwEBAAAAAcgBQACkAgAhyQFAAKQCACHYAQEAnwIAIdkBQACkAgAh2gFAAKQCACHbAUAApAIAIQMAAAAWACABAAAXADACAAAYACABAAAAFgAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAANACAPDgAAvAIAILgBAAC4AgAwuQEAAB0AELoBAAC4AgAwuwEBAJ8CACHFAQAAuwLnASLIAUAApAIAIckBQACkAgAh4gEBAJ8CACHjARAAuQIAIeUBAAC6AuUBIucBAQCgAgAh6AEBAKACACHpAQEAoAIAIeoBQACjAgAhAQAAAB0AIAEAAAADACABAAAABwAgAQAAAA0AIAEAAAABACAEAwAAiwQAIMcBAADjAgAghQIAAOMCACCGAgAA4wIAIAMAAAALACABAAAjADACAAABACADAAAACwAgAQAAIwAwAgAAAQAgAwAAAAsAIAEAACMAMAIAAAEAIAsDAACKBAAguwEBAAAAAbwBAQAAAAHCAQEAAAABxgEgAAAAAccBQAAAAAHIAUAAAAAByQFAAAAAAewBAQAAAAGFAgEAAAABhgIBAAAAAQEVAAAnACAKuwEBAAAAAbwBAQAAAAHCAQEAAAABxgEgAAAAAccBQAAAAAHIAUAAAAAByQFAAAAAAewBAQAAAAGFAgEAAAABhgIBAAAAAQEVAAApADABFQAAKQAwCwMAAIkEACC7AQEA5wIAIbwBAQDnAgAhwgEBAOcCACHGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIewBAQDnAgAhhQIBAOgCACGGAgEA6AIAIQIAAAABACAVAAAsACAKuwEBAOcCACG8AQEA5wIAIcIBAQDnAgAhxgEgAOoCACHHAUAA6wIAIcgBQADsAgAhyQFAAOwCACHsAQEA5wIAIYUCAQDoAgAhhgIBAOgCACECAAAACwAgFQAALgAgAgAAAAsAIBUAAC4AIAMAAAABACAcAAAnACAdAAAsACABAAAAAQAgAQAAAAsAIAYIAACGBAAgIgAAiAQAICMAAIcEACDHAQAA4wIAIIUCAADjAgAghgIAAOMCACANuAEAANMCADC5AQAANQAQugEAANMCADC7AQEAigIAIbwBAQCKAgAhwgEBAIoCACHGASAAjQIAIccBQACOAgAhyAFAAI8CACHJAUAAjwIAIewBAQCKAgAhhQIBAIsCACGGAgEAiwIAIQMAAAALACABAAA0ADAhAAA1ACADAAAACwAgAQAAIwAwAgAAAQAgEgQAAM8CACAFAADQAgAgBgAA0QIAIAwAANICACC4AQAAzAIAMLkBAAA7ABC6AQAAzAIAMLsBAQAAAAG8AQEAnwIAIcIBAQAAAAHDAQEAoAIAIcUBAADOAoUCIsYBIACiAgAhxwFAAKMCACHIAUAApAIAIckBQACkAgAhgQIgAKICACGDAgAAzQKDAiIBAAAAOAAgAQAAADgAIBIEAADPAgAgBQAA0AIAIAYAANECACAMAADSAgAguAEAAMwCADC5AQAAOwAQugEAAMwCADC7AQEAnwIAIbwBAQCfAgAhwgEBAJ8CACHDAQEAoAIAIcUBAADOAoUCIsYBIACiAgAhxwFAAKMCACHIAUAApAIAIckBQACkAgAhgQIgAKICACGDAgAAzQKDAiIGBAAAggQAIAUAAIMEACAGAACEBAAgDAAAhQQAIMMBAADjAgAgxwEAAOMCACADAAAAOwAgAQAAPAAwAgAAOAAgAwAAADsAIAEAADwAMAIAADgAIAMAAAA7ACABAAA8ADACAAA4ACAPBAAA_gMAIAUAAP8DACAGAACABAAgDAAAgQQAILsBAQAAAAG8AQEAAAABwgEBAAAAAcMBAQAAAAHFAQAAAIUCAsYBIAAAAAHHAUAAAAAByAFAAAAAAckBQAAAAAGBAiAAAAABgwIAAACDAgIBFQAAQAAgC7sBAQAAAAG8AQEAAAABwgEBAAAAAcMBAQAAAAHFAQAAAIUCAsYBIAAAAAHHAUAAAAAByAFAAAAAAckBQAAAAAGBAiAAAAABgwIAAACDAgIBFQAAQgAwARUAAEIAMA8EAADUAwAgBQAA1QMAIAYAANYDACAMAADXAwAguwEBAOcCACG8AQEA5wIAIcIBAQDnAgAhwwEBAOgCACHFAQAA0wOFAiLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIYECIADqAgAhgwIAANIDgwIiAgAAADgAIBUAAEUAIAu7AQEA5wIAIbwBAQDnAgAhwgEBAOcCACHDAQEA6AIAIcUBAADTA4UCIsYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAhgQIgAOoCACGDAgAA0gODAiICAAAAOwAgFQAARwAgAgAAADsAIBUAAEcAIAMAAAA4ACAcAABAACAdAABFACABAAAAOAAgAQAAADsAIAUIAADPAwAgIgAA0QMAICMAANADACDDAQAA4wIAIMcBAADjAgAgDrgBAADFAgAwuQEAAE4AELoBAADFAgAwuwEBAIoCACG8AQEAigIAIcIBAQCKAgAhwwEBAIsCACHFAQAAxwKFAiLGASAAjQIAIccBQACOAgAhyAFAAI8CACHJAUAAjwIAIYECIACNAgAhgwIAAMYCgwIiAwAAADsAIAEAAE0AMCEAAE4AIAMAAAA7ACABAAA8ADACAAA4ACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAADOAwAguwEBAAAAAcgBQAAAAAHJAUAAAAAB7AEBAAAAAfIBQAAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAEBFQAAVgAgCLsBAQAAAAHIAUAAAAAByQFAAAAAAewBAQAAAAHyAUAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABARUAAFgAMAEVAABYADAJAwAAzQMAILsBAQDnAgAhyAFAAOwCACHJAUAA7AIAIewBAQDnAgAh8gFAAOwCACH-AQEA5wIAIf8BAQDoAgAhgAIBAOgCACECAAAABQAgFQAAWwAgCLsBAQDnAgAhyAFAAOwCACHJAUAA7AIAIewBAQDnAgAh8gFAAOwCACH-AQEA5wIAIf8BAQDoAgAhgAIBAOgCACECAAAAAwAgFQAAXQAgAgAAAAMAIBUAAF0AIAMAAAAFACAcAABWACAdAABbACABAAAABQAgAQAAAAMAIAUIAADKAwAgIgAAzAMAICMAAMsDACD_AQAA4wIAIIACAADjAgAgC7gBAADEAgAwuQEAAGQAELoBAADEAgAwuwEBAIoCACHIAUAAjwIAIckBQACPAgAh7AEBAIoCACHyAUAAjwIAIf4BAQCKAgAh_wEBAIsCACGAAgEAiwIAIQMAAAADACABAABjADAhAABkACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAAyQMAILsBAQAAAAHIAUAAAAAByQFAAAAAAewBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBQAAAAAH7AUAAAAAB_AEBAAAAAf0BAQAAAAEBFQAAbAAgDbsBAQAAAAHIAUAAAAAByQFAAAAAAewBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBQAAAAAH7AUAAAAAB_AEBAAAAAf0BAQAAAAEBFQAAbgAwARUAAG4AMA4DAADIAwAguwEBAOcCACHIAUAA7AIAIckBQADsAgAh7AEBAOcCACH1AQEA5wIAIfYBAQDnAgAh9wEBAOgCACH4AQEA6AIAIfkBAQDoAgAh-gFAAOsCACH7AUAA6wIAIfwBAQDoAgAh_QEBAOgCACECAAAACQAgFQAAcQAgDbsBAQDnAgAhyAFAAOwCACHJAUAA7AIAIewBAQDnAgAh9QEBAOcCACH2AQEA5wIAIfcBAQDoAgAh-AEBAOgCACH5AQEA6AIAIfoBQADrAgAh-wFAAOsCACH8AQEA6AIAIf0BAQDoAgAhAgAAAAcAIBUAAHMAIAIAAAAHACAVAABzACADAAAACQAgHAAAbAAgHQAAcQAgAQAAAAkAIAEAAAAHACAKCAAAxQMAICIAAMcDACAjAADGAwAg9wEAAOMCACD4AQAA4wIAIPkBAADjAgAg-gEAAOMCACD7AQAA4wIAIPwBAADjAgAg_QEAAOMCACAQuAEAAMMCADC5AQAAegAQugEAAMMCADC7AQEAigIAIcgBQACPAgAhyQFAAI8CACHsAQEAigIAIfUBAQCKAgAh9gEBAIoCACH3AQEAiwIAIfgBAQCLAgAh-QEBAIsCACH6AUAAjgIAIfsBQACOAgAh_AEBAIsCACH9AQEAiwIAIQMAAAAHACABAAB5ADAhAAB6ACADAAAABwAgAQAACAAwAgAACQAgCbgBAADCAgAwuQEAAIABABC6AQAAwgIAMLsBAQAAAAHIAUAApAIAIckBQACkAgAh8gFAAKQCACHzAQEAnwIAIfQBAQCfAgAhAQAAAH0AIAEAAAB9ACAJuAEAAMICADC5AQAAgAEAELoBAADCAgAwuwEBAJ8CACHIAUAApAIAIckBQACkAgAh8gFAAKQCACHzAQEAnwIAIfQBAQCfAgAhAAMAAACAAQAgAQAAgQEAMAIAAH0AIAMAAACAAQAgAQAAgQEAMAIAAH0AIAMAAACAAQAgAQAAgQEAMAIAAH0AIAa7AQEAAAAByAFAAAAAAckBQAAAAAHyAUAAAAAB8wEBAAAAAfQBAQAAAAEBFQAAhQEAIAa7AQEAAAAByAFAAAAAAckBQAAAAAHyAUAAAAAB8wEBAAAAAfQBAQAAAAEBFQAAhwEAMAEVAACHAQAwBrsBAQDnAgAhyAFAAOwCACHJAUAA7AIAIfIBQADsAgAh8wEBAOcCACH0AQEA5wIAIQIAAAB9ACAVAACKAQAgBrsBAQDnAgAhyAFAAOwCACHJAUAA7AIAIfIBQADsAgAh8wEBAOcCACH0AQEA5wIAIQIAAACAAQAgFQAAjAEAIAIAAACAAQAgFQAAjAEAIAMAAAB9ACAcAACFAQAgHQAAigEAIAEAAAB9ACABAAAAgAEAIAMIAADCAwAgIgAAxAMAICMAAMMDACAJuAEAAMECADC5AQAAkwEAELoBAADBAgAwuwEBAIoCACHIAUAAjwIAIckBQACPAgAh8gFAAI8CACHzAQEAigIAIfQBAQCKAgAhAwAAAIABACABAACSAQAwIQAAkwEAIAMAAACAAQAgAQAAgQEAMAIAAH0AIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgDgMAAJ8DACANAADBAwAgDwAAoAMAILsBAQAAAAHFAQAAAPEBAsgBQAAAAAHJAUAAAAAB6wEBAAAAAewBAQAAAAHtAQEAAAAB7gECAAAAAe8BEAAAAAHxAQEAAAAB8gFAAAAAAQEVAACbAQAgC7sBAQAAAAHFAQAAAPEBAsgBQAAAAAHJAUAAAAAB6wEBAAAAAewBAQAAAAHtAQEAAAAB7gECAAAAAe8BEAAAAAHxAQEAAAAB8gFAAAAAAQEVAACdAQAwARUAAJ0BADAOAwAAlQMAIA0AAMADACAPAACWAwAguwEBAOcCACHFAQAAkwPxASLIAUAA7AIAIckBQADsAgAh6wEBAOcCACHsAQEA5wIAIe0BAQDnAgAh7gECAPgCACHvARAA-QIAIfEBAQDoAgAh8gFAAOsCACECAAAADwAgFQAAoAEAIAu7AQEA5wIAIcUBAACTA_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_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-AEAIA67AQEAAAABvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQAAAAHBAQEAAAABwgEBAAAAAcMBAQAAAAHFAQAAAMUBAsYBIAAAAAHHAUAAAAAByAFAAAAAAckBQAAAAAEBFQAA-gEAMAEVAAD6AQAwDwcAAO0CACC7AQEA5wIAIbwBAQDnAgAhvQEBAOgCACG-AQEA5wIAIb8BAQDnAgAhwAEBAOcCACHBAQEA6AIAIcIBAQDoAgAhwwEBAOgCACHFAQAA6QLFASLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIQIAAADwAQAgFQAA_QEAIA67AQEA5wIAIbwBAQDnAgAhvQEBAOgCACG-AQEA5wIAIb8BAQDnAgAhwAEBAOcCACHBAQEA6AIAIcIBAQDoAgAhwwEBAOgCACHFAQAA6QLFASLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIQIAAADzAQAgFQAA_wEAIAIAAADzAQAgFQAA_wEAIAMAAADwAQAgHAAA-AEAIB0AAP0BACABAAAA8AEAIAEAAADzAQAgCAgAAOQCACAiAADmAgAgIwAA5QIAIL0BAADjAgAgwQEAAOMCACDCAQAA4wIAIMMBAADjAgAgxwEAAOMCACARuAEAAIkCADC5AQAAhgIAELoBAACJAgAwuwEBAIoCACG8AQEAigIAIb0BAQCLAgAhvgEBAIoCACG_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-gFAAI4CACH7AUAAjgIAIfwBAQCLAgAh_QEBAIsCACELuAEAAMQCADC5AQAAZAAQugEAAMQCADC7AQEAigIAIcgBQACPAgAhyQFAAI8CACHsAQEAigIAIfIBQACPAgAh_gEBAIoCACH_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-gFAAKMCACH7AUAAowIAIfwBAQCgAgAh_QEBAKACACEMAwAA3QIAILgBAADiAgAwuQEAAAMAELoBAADiAgAwuwEBAJ8CACHIAUAApAIAIckBQACkAgAh7AEBAJ8CACHyAUAApAIAIf4BAQCfAgAh_wEBAKACACGAAgEAoAIAIQAAAAABjAIBAAAAAQGMAgEAAAABAYwCAAAAxQECAYwCIAAAAAEBjAJAAAAAAQGMAkAAAAABCxwAAO4CADAdAADzAgAwiQIAAO8CADCKAgAA8AIAMIsCAADxAgAgjAIAAPICADCNAgAA8gIAMI4CAADyAgAwjwIAAPICADCQAgAA9AIAMJECAAD1AgAwDgoAAKQDACC7AQEAAAABvAEBAAAAAb0BAQAAAAHDAQEAAAABxQEAAADhAQLGASAAAAABxwFAAAAAAcgBQAAAAAHJAUAAAAAB3AECAAAAAd0BEAAAAAHeAQIAAAAB3wEBAAAAAQIAAAATACAcAACjAwAgAwAAABMAIBwAAKMDACAdAAD7AgAgARUAAL4EADATCQAA2QIAIAoAANoCACC4AQAA1gIAMLkBAAARABC6AQAA1gIAMLsBAQAAAAG8AQEAnwIAIb0BAQCgAgAhwwEBAKACACHFAQAA2ALhASLGASAAogIAIccBQACjAgAhyAFAAKQCACHJAUAApAIAIdwBAgDXAgAh3QEQALkCACHeAQIA1wIAId8BAQCgAgAh4QEBAJ8CACECAAAAEwAgFQAA-wIAIAIAAAD2AgAgFQAA9wIAIBG4AQAA9QIAMLkBAAD2AgAQugEAAPUCADC7AQEAnwIAIbwBAQCfAgAhvQEBAKACACHDAQEAoAIAIcUBAADYAuEBIsYBIACiAgAhxwFAAKMCACHIAUAApAIAIckBQACkAgAh3AECANcCACHdARAAuQIAId4BAgDXAgAh3wEBAKACACHhAQEAnwIAIRG4AQAA9QIAMLkBAAD2AgAQugEAAPUCADC7AQEAnwIAIbwBAQCfAgAhvQEBAKACACHDAQEAoAIAIcUBAADYAuEBIsYBIACiAgAhxwFAAKMCACHIAUAApAIAIckBQACkAgAh3AECANcCACHdARAAuQIAId4BAgDXAgAh3wEBAKACACHhAQEAnwIAIQ27AQEA5wIAIbwBAQDnAgAhvQEBAOgCACHDAQEA6AIAIcUBAAD6AuEBIsYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAh3AECAPgCACHdARAA-QIAId4BAgD4AgAh3wEBAOgCACEFjAICAAAAAZICAgAAAAGTAgIAAAABlAICAAAAAZUCAgAAAAEFjAIQAAAAAZICEAAAAAGTAhAAAAABlAIQAAAAAZUCEAAAAAEBjAIAAADhAQIOCgAA_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_EBIsgBQADsAgAhyQFAAOwCACHrAQEA5wIAIe0BAQDnAgAh7gECAPgCACHvARAA-QIAIfEBAQDoAgAh8gFAAOsCACEMDQAAwAMAIA8AAJYDACC7AQEA5wIAIcUBAACTA_EBIsgBQADsAgAhyQFAAOwCACHrAQEA5wIAIe0BAQDnAgAh7gECAPgCACHvARAA-QIAIfEBAQDoAgAh8gFAAOsCACEMDQAAwQMAIA8AAKADACC7AQEAAAABxQEAAADxAQLIAUAAAAAByQFAAAAAAesBAQAAAAHtAQEAAAAB7gECAAAAAe8BEAAAAAHxAQEAAAAB8gFAAAAAAQm7AQEAAAABvAEBAAAAAcIBAQAAAAHGASAAAAABxwFAAAAAAcgBQAAAAAHJAUAAAAABhQIBAAAAAYYCAQAAAAECAAAAAQAgHAAA4QMAIAMAAAALACAcAADhAwAgHQAA5QMAIAsAAAALACAVAADlAwAguwEBAOcCACG8AQEA5wIAIcIBAQDnAgAhxgEgAOoCACHHAUAA6wIAIcgBQADsAgAhyQFAAOwCACGFAgEA6AIAIYYCAQDoAgAhCbsBAQDnAgAhvAEBAOcCACHCAQEA5wIAIcYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAhhQIBAOgCACGGAgEA6AIAIQy7AQEAAAAByAFAAAAAAckBQAAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBQAAAAAH7AUAAAAAB_AEBAAAAAf0BAQAAAAECAAAACQAgHAAA8QMAIAMAAAAJACAcAADxAwAgHQAA8AMAIAEVAACXBAAwEQMAAN0CACC4AQAA4QIAMLkBAAAHABC6AQAA4QIAMLsBAQAAAAHIAUAApAIAIckBQACkAgAh7AEBAJ8CACH1AQEAnwIAIfYBAQCfAgAh9wEBAKACACH4AQEAoAIAIfkBAQCgAgAh-gFAAKMCACH7AUAAowIAIfwBAQCgAgAh_QEBAKACACECAAAACQAgFQAA8AMAIAIAAADuAwAgFQAA7wMAIBC4AQAA7QMAMLkBAADuAwAQugEAAO0DADC7AQEAnwIAIcgBQACkAgAhyQFAAKQCACHsAQEAnwIAIfUBAQCfAgAh9gEBAJ8CACH3AQEAoAIAIfgBAQCgAgAh-QEBAKACACH6AUAAowIAIfsBQACjAgAh_AEBAKACACH9AQEAoAIAIRC4AQAA7QMAMLkBAADuAwAQugEAAO0DADC7AQEAnwIAIcgBQACkAgAhyQFAAKQCACHsAQEAnwIAIfUBAQCfAgAh9gEBAJ8CACH3AQEAoAIAIfgBAQCgAgAh-QEBAKACACH6AUAAowIAIfsBQACjAgAh_AEBAKACACH9AQEAoAIAIQy7AQEA5wIAIcgBQADsAgAhyQFAAOwCACH1AQEA5wIAIfYBAQDnAgAh9wEBAOgCACH4AQEA6AIAIfkBAQDoAgAh-gFAAOsCACH7AUAA6wIAIfwBAQDoAgAh_QEBAOgCACEMuwEBAOcCACHIAUAA7AIAIckBQADsAgAh9QEBAOcCACH2AQEA5wIAIfcBAQDoAgAh-AEBAOgCACH5AQEA6AIAIfoBQADrAgAh-wFAAOsCACH8AQEA6AIAIf0BAQDoAgAhDLsBAQAAAAHIAUAAAAAByQFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gFAAAAAAfsBQAAAAAH8AQEAAAAB_QEBAAAAAQe7AQEAAAAByAFAAAAAAckBQAAAAAHyAUAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABAgAAAAUAIBwAAP0DACADAAAABQAgHAAA_QMAIB0AAPwDACABFQAAlgQAMAwDAADdAgAguAEAAOICADC5AQAAAwAQugEAAOICADC7AQEAAAAByAFAAKQCACHJAUAApAIAIewBAQCfAgAh8gFAAKQCACH-AQEAAAAB_wEBAKACACGAAgEAoAIAIQIAAAAFACAVAAD8AwAgAgAAAPoDACAVAAD7AwAgC7gBAAD5AwAwuQEAAPoDABC6AQAA-QMAMLsBAQCfAgAhyAFAAKQCACHJAUAApAIAIewBAQCfAgAh8gFAAKQCACH-AQEAnwIAIf8BAQCgAgAhgAIBAKACACELuAEAAPkDADC5AQAA-gMAELoBAAD5AwAwuwEBAJ8CACHIAUAApAIAIckBQACkAgAh7AEBAJ8CACHyAUAApAIAIf4BAQCfAgAh_wEBAKACACGAAgEAoAIAIQe7AQEA5wIAIcgBQADsAgAhyQFAAOwCACHyAUAA7AIAIf4BAQDnAgAh_wEBAOgCACGAAgEA6AIAIQe7AQEA5wIAIcgBQADsAgAhyQFAAOwCACHyAUAA7AIAIf4BAQDnAgAh_wEBAOgCACGAAgEA6AIAIQe7AQEAAAAByAFAAAAAAckBQAAAAAHyAUAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABBBwAAPIDADCJAgAA8wMAMIsCAAD1AwAgjwIAAPYDADAEHAAA5gMAMIkCAADnAwAwiwIAAOkDACCPAgAA6gMAMAMcAADhAwAgiQIAAOIDACCPAgAAAQAgBBwAANgDADCJAgAA2QMAMIsCAADbAwAgjwIAAI0DADAAAAQDAACLBAAgxwEAAOMCACCFAgAA4wIAIIYCAADjAgAgAAAAAAUcAACRBAAgHQAAlAQAIIkCAACSBAAgigIAAJMEACCPAgAAOAAgAxwAAJEEACCJAgAAkgQAII8CAAA4ACAGBAAAggQAIAUAAIMEACAGAACEBAAgDAAAhQQAIMMBAADjAgAgxwEAAOMCACAGCQAAjQQAIAoAAI4EACC9AQAA4wIAIMMBAADjAgAgxwEAAOMCACDfAQAA4wIAIAYHAACmAwAgvQEAAOMCACDBAQAA4wIAIMIBAADjAgAgwwEAAOMCACDHAQAA4wIAIAACCwAAjAQAIAwAAIUEACAFDgAAugMAIOcBAADjAgAg6AEAAOMCACDpAQAA4wIAIOoBAADjAgAgDgQAAP4DACAFAAD_AwAgDAAAgQQAILsBAQAAAAG8AQEAAAABwgEBAAAAAcMBAQAAAAHFAQAAAIUCAsYBIAAAAAHHAUAAAAAByAFAAAAAAckBQAAAAAGBAiAAAAABgwIAAACDAgICAAAAOAAgHAAAkQQAIAMAAAA7ACAcAACRBAAgHQAAlQQAIBAAAAA7ACAEAADUAwAgBQAA1QMAIAwAANcDACAVAACVBAAguwEBAOcCACG8AQEA5wIAIcIBAQDnAgAhwwEBAOgCACHFAQAA0wOFAiLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIYECIADqAgAhgwIAANIDgwIiDgQAANQDACAFAADVAwAgDAAA1wMAILsBAQDnAgAhvAEBAOcCACHCAQEA5wIAIcMBAQDoAgAhxQEAANMDhQIixgEgAOoCACHHAUAA6wIAIcgBQADsAgAhyQFAAOwCACGBAiAA6gIAIYMCAADSA4MCIge7AQEAAAAByAFAAAAAAckBQAAAAAHyAUAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABDLsBAQAAAAHIAUAAAAAByQFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gFAAAAAAfsBQAAAAAH8AQEAAAAB_QEBAAAAAQq7AQEAAAABxQEAAADxAQLIAUAAAAAByQFAAAAAAesBAQAAAAHtAQEAAAAB7gECAAAAAe8BEAAAAAHxAQEAAAAB8gFAAAAAAQ4FAAD_AwAgBgAAgAQAIAwAAIEEACC7AQEAAAABvAEBAAAAAcIBAQAAAAHDAQEAAAABxQEAAACFAgLGASAAAAABxwFAAAAAAcgBQAAAAAHJAUAAAAABgQIgAAAAAYMCAAAAgwICAgAAADgAIBwAAJkEACADAAAAOwAgHAAAmQQAIB0AAJ0EACAQAAAAOwAgBQAA1QMAIAYAANYDACAMAADXAwAgFQAAnQQAILsBAQDnAgAhvAEBAOcCACHCAQEA5wIAIcMBAQDoAgAhxQEAANMDhQIixgEgAOoCACHHAUAA6wIAIcgBQADsAgAhyQFAAOwCACGBAiAA6gIAIYMCAADSA4MCIg4FAADVAwAgBgAA1gMAIAwAANcDACC7AQEA5wIAIbwBAQDnAgAhwgEBAOcCACHDAQEA6AIAIcUBAADTA4UCIsYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAhgQIgAOoCACGDAgAA0gODAiIOBAAA_gMAIAYAAIAEACAMAACBBAAguwEBAAAAAbwBAQAAAAHCAQEAAAABwwEBAAAAAcUBAAAAhQICxgEgAAAAAccBQAAAAAHIAUAAAAAByQFAAAAAAYECIAAAAAGDAgAAAIMCAgIAAAA4ACAcAACeBAAgAwAAADsAIBwAAJ4EACAdAACiBAAgEAAAADsAIAQAANQDACAGAADWAwAgDAAA1wMAIBUAAKIEACC7AQEA5wIAIbwBAQDnAgAhwgEBAOcCACHDAQEA6AIAIcUBAADTA4UCIsYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAhgQIgAOoCACGDAgAA0gODAiIOBAAA1AMAIAYAANYDACAMAADXAwAguwEBAOcCACG8AQEA5wIAIcIBAQDnAgAhwwEBAOgCACHFAQAA0wOFAiLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIYECIADqAgAhgwIAANIDgwIiCAsAAKsDACC7AQEAAAAByAFAAAAAAckBQAAAAAHYAQEAAAAB2QFAAAAAAdoBQAAAAAHbAUAAAAABAgAAABgAIBwAAKMEACADAAAAFgAgHAAAowQAIB0AAKcEACAKAAAAFgAgCwAAqgMAIBUAAKcEACC7AQEA5wIAIcgBQADsAgAhyQFAAOwCACHYAQEA5wIAIdkBQADsAgAh2gFAAOwCACHbAUAA7AIAIQgLAACqAwAguwEBAOcCACHIAUAA7AIAIckBQADsAgAh2AEBAOcCACHZAUAA7AIAIdoBQADsAgAh2wFAAOwCACENAwAAnwMAIA0AAMEDACC7AQEAAAABxQEAAADxAQLIAUAAAAAByQFAAAAAAesBAQAAAAHsAQEAAAAB7QEBAAAAAe4BAgAAAAHvARAAAAAB8QEBAAAAAfIBQAAAAAECAAAADwAgHAAAqAQAIAMAAAANACAcAACoBAAgHQAArAQAIA8AAAANACADAACVAwAgDQAAwAMAIBUAAKwEACC7AQEA5wIAIcUBAACTA_EBIsgBQADsAgAhyQFAAOwCACHrAQEA5wIAIewBAQDnAgAh7QEBAOcCACHuAQIA-AIAIe8BEAD5AgAh8QEBAOgCACHyAUAA6wIAIQ0DAACVAwAgDQAAwAMAILsBAQDnAgAhxQEAAJMD8QEiyAFAAOwCACHJAUAA7AIAIesBAQDnAgAh7AEBAOcCACHtAQEA5wIAIe4BAgD4AgAh7wEQAPkCACHxAQEA6AIAIfIBQADrAgAhDrsBAQAAAAG8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAQEAAAABwwEBAAAAAcUBAAAAxQECxgEgAAAAAccBQAAAAAHIAUAAAAAByQFAAAAAAQIAAADwAQAgHAAArQQAIAMAAADzAQAgHAAArQQAIB0AALEEACAQAAAA8wEAIBUAALEEACC7AQEA5wIAIbwBAQDnAgAhvQEBAOgCACG-AQEA5wIAIb8BAQDnAgAhwAEBAOcCACHBAQEA6AIAIcIBAQDoAgAhwwEBAOgCACHFAQAA6QLFASLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIQ67AQEA5wIAIbwBAQDnAgAhvQEBAOgCACG-AQEA5wIAIb8BAQDnAgAhwAEBAOcCACHBAQEA6AIAIcIBAQDoAgAhwwEBAOgCACHFAQAA6QLFASLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIQ8JAACyAwAguwEBAAAAAbwBAQAAAAG9AQEAAAABwwEBAAAAAcUBAAAA4QECxgEgAAAAAccBQAAAAAHIAUAAAAAByQFAAAAAAdwBAgAAAAHdARAAAAAB3gECAAAAAd8BAQAAAAHhAQEAAAABAgAAABMAIBwAALIEACADAAAAEQAgHAAAsgQAIB0AALYEACARAAAAEQAgCQAAsQMAIBUAALYEACC7AQEA5wIAIbwBAQDnAgAhvQEBAOgCACHDAQEA6AIAIcUBAAD6AuEBIsYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAh3AECAPgCACHdARAA-QIAId4BAgD4AgAh3wEBAOgCACHhAQEA5wIAIQ8JAACxAwAguwEBAOcCACG8AQEA5wIAIb0BAQDoAgAhwwEBAOgCACHFAQAA-gLhASLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIdwBAgD4AgAh3QEQAPkCACHeAQIA-AIAId8BAQDoAgAh4QEBAOcCACEOBAAA_gMAIAUAAP8DACAGAACABAAguwEBAAAAAbwBAQAAAAHCAQEAAAABwwEBAAAAAcUBAAAAhQICxgEgAAAAAccBQAAAAAHIAUAAAAAByQFAAAAAAYECIAAAAAGDAgAAAIMCAgIAAAA4ACAcAAC3BAAgAwAAADsAIBwAALcEACAdAAC7BAAgEAAAADsAIAQAANQDACAFAADVAwAgBgAA1gMAIBUAALsEACC7AQEA5wIAIbwBAQDnAgAhwgEBAOcCACHDAQEA6AIAIcUBAADTA4UCIsYBIADqAgAhxwFAAOsCACHIAUAA7AIAIckBQADsAgAhgQIgAOoCACGDAgAA0gODAiIOBAAA1AMAIAUAANUDACAGAADWAwAguwEBAOcCACG8AQEA5wIAIcIBAQDnAgAhwwEBAOgCACHFAQAA0wOFAiLGASAA6gIAIccBQADrAgAhyAFAAOwCACHJAUAA7AIAIYECIADqAgAhgwIAANIDgwIiCrsBAQAAAAHFAQAAAPEBAsgBQAAAAAHJAUAAAAAB6wEBAAAAAewBAQAAAAHuAQIAAAAB7wEQAAAAAfEBAQAAAAHyAUAAAAABBrsBAQAAAAHIAUAAAAAByQFAAAAAAdkBQAAAAAHaAUAAAAAB2wFAAAAAAQ27AQEAAAABvAEBAAAAAb0BAQAAAAHDAQEAAAABxQEAAADhAQLGASAAAAABxwFAAAAAAcgBQAAAAAHJAUAAAAAB3AECAAAAAd0BEAAAAAHeAQIAAAAB3wEBAAAAAQEDAAIFBAYDBQoEBgwBCAANDBAFAQMAAgEDAAIDAwACDQAGDx4MAwgACwsABwwbBQMIAAoJAAgKGQYCBxQHCAAJAQcVAAEKGgABDBwAAQ4ABQMEHwAFIAAMIQAAAQMAAgEDAAIDCAASIgATIwAUAAAAAwgAEiIAEyMAFAAAAwgAGSIAGiMAGwAAAAMIABkiABojABsBAwACAQMAAgMIACAiACEjACIAAAADCAAgIgAhIwAiAQMAAgEDAAIDCAAnIgAoIwApAAAAAwgAJyIAKCMAKQAAAAMIAC8iADAjADEAAAADCAAvIgAwIwAxAgMAAg0ABgIDAAINAAYFCAA2IgA5IwA6dAA3dQA4AAAAAAAFCAA2IgA5IwA6dAA3dQA4AQ4ABQEOAAUFCAA_IgBCIwBDdABAdQBBAAAAAAAFCAA_IgBCIwBDdABAdQBBAQkACAEJAAgFCABIIgBLIwBMdABJdQBKAAAAAAAFCABIIgBLIwBMdABJdQBKAQsABwELAAcDCABRIgBSIwBTAAAAAwgAUSIAUiMAUwAAAwgAWCIAWSMAWgAAAAMIAFgiAFkjAFoQAgERIgESJAETJQEUJgEWKAEXKg4YKw8ZLQEaLw4bMBAeMQEfMgEgMw4kNhElNxUmOQInOgIoPQIpPgIqPwIrQQIsQw4tRBYuRgIvSA4wSRcxSgIySwIzTA40Txg1UBw2UQM3UgM4UwM5VAM6VQM7VwM8WQ49Wh0-XAM_Xg5AXx5BYANCYQNDYg5EZR9FZiNGZwRHaARIaQRJagRKawRLbQRMbw5NcCROcgRPdA5QdSVRdgRSdwRTeA5UeyZVfCpWfitXfytYggErWYMBK1qEAStbhgErXIgBDl2JASxeiwErX40BDmCOAS1hjwErYpABK2ORAQ5klAEuZZUBMmaWAQVnlwEFaJgBBWmZAQVqmgEFa5wBBWyeAQ5tnwEzbqEBBW-jAQ5wpAE0caUBBXKmAQVzpwEOdqoBNXerATt4rQEMea4BDHqwAQx7sQEMfLIBDH20AQx-tgEOf7cBPIABuQEMgQG7AQ6CAbwBPYMBvQEMhAG-AQyFAb8BDoYBwgE-hwHDAUSIAcQBB4kBxQEHigHGAQeLAccBB4wByAEHjQHKAQeOAcwBDo8BzQFFkAHPAQeRAdEBDpIB0gFGkwHTAQeUAdQBB5UB1QEOlgHYAUeXAdkBTZgB2gEGmQHbAQaaAdwBBpsB3QEGnAHeAQadAeABBp4B4gEOnwHjAU6gAeUBBqEB5wEOogHoAU-jAekBBqQB6gEGpQHrAQ6mAe4BUKcB7wFUqAHxAQipAfIBCKoB9QEIqwH2AQisAfcBCK0B-QEIrgH7AQ6vAfwBVbAB_gEIsQGAAg6yAYECVrMBggIItAGDAgi1AYQCDrYBhwJXtwGIAls"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var RoomStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  MAINTENANCE: "MAINTENANCE"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVars = () => {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT, 10),
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    email: {
      EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    google: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      FRONTEND_URL: process.env.FRONTEND_URL
    },
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
  };
};
var envVars = loadEnvVars();

// src/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status from "http-status";
import path2 from "path";
import ejs from "ejs";

// src/app/errorHelpers/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var appError_default = AppError;

// src/app/utils/email.ts
var transporter = nodemailer.createTransport({
  host: envVars.email.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.email.EMAIL_SENDER_SMTP_USER,
    pass: envVars.email.EMAIL_SENDER_SMTP_PASS
  },
  port: Number(envVars.email.EMAIL_SENDER_SMTP_PORT)
});
var sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments
}) => {
  try {
    const templatePath = path2.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.email.EMAIL_SENDER_SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", error.message);
    throw new appError_default(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  baseUrl: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
        input: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
        input: false
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password reset otp",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6
    })
  ]
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  return {
    success: true,
    data: decoded
  };
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1e3
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
var registerUser = async (payload) => {
  const { name, email, password } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (isUserExists) {
    throw new appError_default(status2.CONFLICT, "User already exists");
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data) {
    throw new appError_default(
      status2.INTERNAL_SERVER_ERROR,
      "Failed to register user."
    );
  }
  const accessToken = tokenUtils.getAccessToken({
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  const refreshToken = tokenUtils.getRefreshToken({
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  return { accessToken, refreshToken, ...data };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new appError_default(status2.NOT_FOUND, "No user exists with the email.");
  }
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data) {
    throw new appError_default(status2.INTERNAL_SERVER_ERROR, "Failed to login.");
  }
  const accessToken = tokenUtils.getAccessToken({
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  const refreshToken = tokenUtils.getRefreshToken({
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  return { accessToken, refreshToken, ...data };
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new appError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success) {
    throw new appError_default(status2.UNAUTHORIZED, "Invalid refresh token");
  }
  const { data } = verifiedRefreshToken;
  const newAccessToken = tokenUtils.getAccessToken({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    id: data.id,
    email: data.email,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new appError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const { oldPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword: oldPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var forgetPassword = async (email) => {
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new appError_default(status2.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new appError_default(status2.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: {
        select: {
          id: true,
          contactNumber: true,
          profilePhoto: true
        }
      }
    }
  });
  if (!user) {
    throw new appError_default(status2.NOT_FOUND, "User not found.");
  }
  return user;
};
var udpateMyProfile = async (user, payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    include: {
      admin: true
    }
  });
  if (!userExists) {
    throw new appError_default(status2.NOT_FOUND, "User not found.");
  }
  console.log(userExists);
  if (userExists.isDeleted) {
    throw new appError_default(status2.NOT_FOUND, "User not found.");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: user.id
      },
      data: {
        ...payload.name !== void 0 && {
          name: payload.name
        },
        ...payload.image !== void 0 && {
          image: payload.image
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (payload.contactNumber !== void 0 && userExists.admin) {
      await tx.admin.update({
        where: {
          id: userExists.admin.id
        },
        data: {
          contactNumber: payload.contactNumber
        }
      });
    }
    return updatedUser;
  });
  return result;
};
var authService = {
  registerUser,
  loginUser,
  getNewToken,
  logoutUser,
  changePassword,
  forgetPassword,
  resetPassword,
  getMyProfile,
  udpateMyProfile
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { statusCode, success, message, data, meta } = responseData;
  res.status(statusCode).json({
    success,
    message,
    ...meta && { meta },
    ...data !== void 0 && { data }
  });
};

// src/app/modules/auth/auth.controller.ts
import status3 from "http-status";
var registerUser2 = catchAsync_default(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    statusCode: status3.CREATED,
    success: true,
    message: "Registration successfull",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest
    }
  });
});
var loginUser2 = catchAsync_default(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    statusCode: status3.OK,
    success: true,
    message: "Login successfull",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest
    }
  });
});
var getNewToken2 = catchAsync_default(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new appError_default(status3.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await authService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken
    }
  });
});
var logoutUser2 = catchAsync_default(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.logoutUser(betterAuthSessionToken);
  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Logout successfully",
    data: result
  });
});
var changePassword2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var forgetPassword2 = catchAsync_default(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    statusCode: status3.OK,
    success: true,
    message: "If an account exists for this email, a password reset link has been sent."
  });
});
var resetPassword2 = catchAsync_default(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    statusCode: status3.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var getMyProfile2 = catchAsync_default(async (req, res) => {
  const result = await authService.getMyProfile(req.user.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Profile retrived successfully",
    data: result
  });
});
var updateMyProfile = catchAsync_default(async (req, res) => {
  const result = await authService.udpateMyProfile(req.user, req.body);
  sendResponse(res, {
    statusCode: status3.OK,
    success: true,
    message: "Profile updated successfully.",
    data: result
  });
});
var authController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getNewToken: getNewToken2,
  logoutUser: logoutUser2,
  changePassword: changePassword2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  getMyProfile: getMyProfile2,
  updateMyProfile
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/auth/auth.validation.ts
import z from "zod";
var userRegisterZodSchema = z.object({
  name: z.string("Name is required"),
  email: z.email({
    message: "Please provide a valid email address"
  }),
  password: z.string("Password is required").min(6, {
    message: "Password must be at least 6 characters long"
  })
});
var userLoginZodSchema = z.object({
  email: z.email({
    message: "Please provide a valid email address"
  }),
  password: z.string("Password is required").min(6, {
    message: "Password must be at least 6 characters long"
  })
});
var forgotPasswordSchema = z.object({
  email: z.email({
    message: "Please provide a valid email address"
  })
});
var updateMyProfileZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long.").max(100, "Name cannot exceed 100 characters.").optional(),
  image: z.string().url("Image must be a valid URL.").optional(),
  contactNumber: z.string().min(6, "Contact number is too short.").max(20, "Contact number is too long.").optional()
});
var changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters long.").max(100, "New password cannot exceed 100 characters."),
  confirmPassword: z.string().min(1, "Please confirm your new password.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password.",
  path: ["newPassword"]
});

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new appError_default(status4.UNAUTHORIZED, "No valid session found!");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (!sessionExists || !sessionExists.user) {
        throw new appError_default(status4.UNAUTHORIZED, "Invalid or expired session");
      }
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentageRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentageRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring soon.");
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new appError_default(
            status4.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resoure."
          );
        }
      }
    }
    const token = cookieUtils.getCookie(req, "accessToken");
    const verifyToken2 = jwtUtils.verifyToken(
      token,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifyToken2.success) {
      throw new appError_default(status4.UNAUTHORIZED, "Unauthorized access!");
    }
    if (verifyToken2.data.status !== UserStatus.ACTIVE) {
      throw new appError_default(status4.UNAUTHORIZED, "Unauthorized access!");
    }
    if (verifyToken2.data.isDeleted) {
      throw new appError_default(status4.UNAUTHORIZED, "Unauthorized access!");
    }
    if (authRoles.length > 0 && !authRoles.includes(verifyToken2.data.role)) {
      throw new appError_default(
        status4.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resoure."
      );
    }
    req.user = {
      id: verifyToken2.data.id,
      role: verifyToken2.data.role,
      email: verifyToken2.data.email
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(userRegisterZodSchema),
  authController.registerUser
);
router.post(
  "/login",
  validateRequest(userLoginZodSchema),
  authController.loginUser
);
router.get(
  "/my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.getMyProfile
);
router.patch(
  "/update-my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateMyProfileZodSchema),
  authController.updateMyProfile
);
router.post("/refresh-token", authController.getNewToken);
router.post("/logout", authController.logoutUser);
router.post(
  "/change-password",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.changePassword
);
router.post(
  "/forget-password",
  validateRequest(forgotPasswordSchema),
  authController.forgetPassword
);
router.post("/reset-password", authController.resetPassword);
var authRoutes = router;

// src/app/modules/admin/admin.route.ts
import { Router as Router2 } from "express";

// src/app/modules/admin/admin.controller.ts
import status6 from "http-status";

// src/app/modules/admin/admin.service.ts
import status5 from "http-status";
var getAllUsers = async (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skip = Number((page - 1) * limit);
  const andConditions = [
    {
      role: Role.USER,
      isDeleted: false
    }
  ];
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  const where = {
    AND: andConditions
  };
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.user.count({
      where
    })
  ]);
  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: Role.USER,
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new appError_default(status5.NOT_FOUND, "User not found.");
  }
  return user;
};
var updateUser = async (id, payload) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      role: Role.USER,
      isDeleted: false
    }
  });
  if (!existingUser) {
    throw new appError_default(status5.NOT_FOUND, "User not found.");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      image: payload.profilePhoto,
      status: payload.status
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var deleteUser = async (id) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      role: Role.USER,
      isDeleted: false
    }
  });
  if (!existingUser) {
    throw new appError_default(status5.NOT_FOUND, "User not found.");
  }
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: {
        id
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        role: true,
        isDeleted: true,
        deletedAt: true
      }
    });
    await tx.session.deleteMany({
      where: {
        userId: id
      }
    });
    await tx.account.deleteMany({
      where: {
        userId: id
      }
    });
    return user;
  });
  return result;
};
var getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: false
    },
    select: {
      id: true,
      contactNumber: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  console.log(admins);
  return admins;
};
var getAdminById = async (id) => {
  const admin = await prisma.admin.findFirst({
    where: {
      id,
      isDeleted: false
    },
    select: {
      id: true,
      contactNumber: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });
  if (!admin) {
    throw new appError_default(status5.NOT_FOUND, "Admin or Super Admin not found.");
  }
  return admin;
};
var updateAdmin = async (id, payload) => {
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!existingAdmin) {
    throw new appError_default(status5.NOT_FOUND, "Admin or Super Admin not found.");
  }
  const result = await prisma.$transaction(async (tx) => {
    if (payload.admin) {
      await tx.admin.update({
        where: {
          id
        },
        data: {
          contactNumber: payload.admin.contactNumber
        }
      });
      await tx.user.update({
        where: {
          id: existingAdmin.userId
        },
        data: {
          name: payload.admin.name,
          image: payload.admin.profilePhoto
        }
      });
    }
    return tx.admin.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        contactNumber: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  });
  return result;
};
var deleteAdmin = async (id, user) => {
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!existingAdmin) {
    throw new appError_default(status5.NOT_FOUND, "Admin or Super Admin not found.");
  }
  if (existingAdmin.userId === user.id) {
    throw new appError_default(status5.BAD_REQUEST, "You cannot delete yourself.");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    const deletedUser = await tx.user.update({
      where: {
        id: existingAdmin.userId
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        isDeleted: true,
        deletedAt: true
      }
    });
    await tx.session.deleteMany({
      where: {
        userId: existingAdmin.userId
      }
    });
    await tx.account.deleteMany({
      where: {
        userId: existingAdmin.userId
      }
    });
    return deletedUser;
  });
  return result;
};
var AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

// src/app/modules/admin/admin.controller.ts
var getAllUsers2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getUserById2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const user = await AdminService.getUserById(id);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "User fetched successfully",
    data: user
  });
});
var updateUser2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateUser(id, req.body);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteUser(id);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var getAllAdmins2 = catchAsync_default(async (req, res) => {
  console.log(req.user);
  const result = await AdminService.getAllAdmins();
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result
  });
});
var getAdminById2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const admin = await AdminService.getAdminById(id);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "Admin fetched successfully",
    data: admin
  });
});
var updateAdmin2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedAdmin = await AdminService.updateAdmin(id, payload);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin
  });
});
var deleteAdmin2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await AdminService.deleteAdmin(id, user);
  sendResponse(res, {
    statusCode: status6.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result
  });
});
var AdminController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  deleteUser: deleteUser2,
  getAllAdmins: getAllAdmins2,
  updateAdmin: updateAdmin2,
  deleteAdmin: deleteAdmin2,
  getAdminById: getAdminById2
};

// src/app/modules/admin/admin.validation.ts
import z2 from "zod";
var updateAdminZodSchema = z2.object({
  admin: z2.object({
    name: z2.string("Name must be a string").optional(),
    profilePhoto: z2.url("Profile photo must be a valid URL").optional(),
    contactNumber: z2.string("Contact number must be a string").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional()
  }).optional()
});
var updateUserZodSchema = z2.object({
  name: z2.string("Name must be a string").optional(),
  profilePhoto: z2.url("Profile photo must be a valid URL").optional(),
  contactNumber: z2.string("Contact number must be a string").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 14 characters").optional(),
  status: z2.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional()
});
var getUsersQueryValidationSchema = z2.object({
  page: z2.coerce.number().int().min(1).optional(),
  limit: z2.coerce.number().int().min(1).max(100).optional(),
  search: z2.string().optional(),
  status: z2.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional()
});

// src/app/modules/admin/admin.route.ts
var router2 = Router2();
router2.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllUsers
);
router2.get(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getUserById
);
router2.patch(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateUserZodSchema),
  AdminController.updateUser
);
router2.delete(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.deleteUser
);
router2.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllAdmins
);
router2.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAdminById
);
router2.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin
);
router2.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);
var AdminRoutes = router2;

// src/app/modules/venues/venue.route.ts
import { Router as Router3 } from "express";

// src/app/modules/venues/venue.service.ts
import status7 from "http-status";
var createVenue = async (payload) => {
  const existingVenue = await prisma.venue.findFirst({
    where: {
      name: payload.name,
      isDeleted: false
    }
  });
  if (existingVenue) {
    throw new appError_default(
      status7.CONFLICT,
      "A venue with this name already exists."
    );
  }
  const venue = await prisma.venue.create({
    data: {
      name: payload.name,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      phone: payload.phone,
      email: payload.email,
      image: payload.image
    }
  });
  return venue;
};
var getVenues = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        city: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        country: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ];
  }
  if (query.status) {
    where.status = query.status;
  }
  const [venues, total] = await prisma.$transaction([
    prisma.venue.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: {
            rooms: true
          }
        }
      }
    }),
    prisma.venue.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: venues
  };
};
var getVenueById = async (id) => {
  const venue = await prisma.venue.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      rooms: {
        where: {
          isDeleted: false
        }
      }
    }
  });
  if (!venue) {
    throw new appError_default(status7.NOT_FOUND, "Venue not found.");
  }
  return venue;
};
var updateVenue = async (id, payload) => {
  const existingVenue = await prisma.venue.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!existingVenue) {
    throw new appError_default(status7.NOT_FOUND, "Venue not found.");
  }
  if (payload.name && payload.name !== existingVenue.name) {
    const duplicateVenue = await prisma.venue.findFirst({
      where: {
        name: payload.name,
        id: {
          not: id
        },
        isDeleted: false
      }
    });
    if (duplicateVenue) {
      throw new appError_default(
        status7.CONFLICT,
        "A venue with this name already exists."
      );
    }
  }
  const venue = await prisma.venue.update({
    where: {
      id
    },
    data: payload
  });
  return venue;
};
var deleteVenue = async (id) => {
  const venue = await prisma.venue.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!venue) {
    throw new appError_default(status7.NOT_FOUND, "Venue not found.");
  }
  const deletedVenue = await prisma.venue.update({
    where: {
      id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedVenue;
};
var venueService = {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue
};

// src/app/modules/venues/venue.controller.ts
var createVenue2 = catchAsync_default(async (req, res) => {
  const result = await venueService.createVenue(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Venue created successfully.",
    data: result
  });
});
var getVenues2 = catchAsync_default(async (req, res) => {
  const result = await venueService.getVenues(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Venues retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getVenueById2 = catchAsync_default(async (req, res) => {
  const result = await venueService.getVenueById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Venue retrieved successfully.",
    data: result
  });
});
var updateVenue2 = catchAsync_default(async (req, res) => {
  const result = await venueService.updateVenue(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Venue updated successfully.",
    data: result
  });
});
var deleteVenue2 = catchAsync_default(async (req, res) => {
  const result = await venueService.deleteVenue(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Venue deleted successfully.",
    data: result
  });
});
var venueController = {
  createVenue: createVenue2,
  getVenues: getVenues2,
  getVenueById: getVenueById2,
  updateVenue: updateVenue2,
  deleteVenue: deleteVenue2
};

// src/app/modules/venues/vanue.validation.ts
import { z as z3 } from "zod";
var createVenueValidationSchema = z3.object({
  name: z3.string().min(2, "Venue name must be at least 2 characters").max(100, "Venue name cannot exceed 100 characters"),
  description: z3.string().max(1e3, "Description cannot exceed 1000 characters").optional(),
  address: z3.string().min(3, "Address is required").max(300, "Address cannot exceed 300 characters"),
  city: z3.string().min(2, "City is required").max(100, "City cannot exceed 100 characters"),
  country: z3.string().min(2, "Country is required").max(100, "Country cannot exceed 100 characters"),
  phone: z3.string().optional(),
  email: z3.email("Invalid email address").optional(),
  image: z3.url("Invalid image URL").optional()
});
var updateVenueValidationSchema = z3.object({
  name: z3.string().min(2).max(100).optional(),
  description: z3.string().max(1e3).optional(),
  address: z3.string().min(3).max(300).optional(),
  city: z3.string().min(2).max(100).optional(),
  country: z3.string().min(2).max(100).optional(),
  phone: z3.string().optional(),
  email: z3.email("Invalid email address").optional(),
  image: z3.url("Invalid image URL").optional(),
  status: z3.enum(["ACTIVE", "INACTIVE"]).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required for update"
});
var venueValidation = {
  createVenueValidationSchema,
  updateVenueValidationSchema
};

// src/app/modules/venues/venue.route.ts
var router3 = Router3();
router3.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(venueValidation.createVenueValidationSchema),
  venueController.createVenue
);
router3.get("/", venueController.getVenues);
router3.get("/:id", venueController.getVenueById);
router3.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(venueValidation.updateVenueValidationSchema),
  venueController.updateVenue
);
router3.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  venueController.deleteVenue
);
var venueRoutes = router3;

// src/app/modules/rooms/room.route.ts
import { Router as Router4 } from "express";

// src/app/modules/rooms/room.service.ts
var createRoom = async (payload) => {
  const venue = await prisma.venue.findFirst({
    where: {
      id: payload.venueId,
      isDeleted: false
    }
  });
  if (!venue) {
    throw new Error("Venue not found.");
  }
  const room = await prisma.room.create({
    data: {
      name: payload.name,
      description: payload.description,
      capacity: payload.capacity,
      price: payload.price,
      duration: payload.duration,
      difficulty: payload.difficulty,
      image: payload.image,
      status: payload.status,
      venueId: payload.venueId
    },
    include: {
      venue: true
    }
  });
  return room;
};
var getAllRooms = async (query) => {
  const rooms = await prisma.room.findMany({
    where: {
      isDeleted: false,
      ...query.venueId && {
        venueId: query.venueId
      },
      ...query.status && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: query.status
      }
    },
    include: {
      venue: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return rooms;
};
var getRoomById = async (roomId) => {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      isDeleted: false
    },
    include: {
      venue: true
    }
  });
  if (!room) {
    throw new Error("Room not found.");
  }
  return room;
};
var updateRoom = async (roomId, payload) => {
  const existingRoom = await prisma.room.findFirst({
    where: {
      id: roomId,
      isDeleted: false
    }
  });
  if (!existingRoom) {
    throw new Error("Room not found.");
  }
  const room = await prisma.room.update({
    where: {
      id: roomId
    },
    data: payload,
    include: {
      venue: true
    }
  });
  return room;
};
var deleteRoom = async (roomId) => {
  const existingRoom = await prisma.room.findFirst({
    where: {
      id: roomId,
      isDeleted: false
    }
  });
  if (!existingRoom) {
    throw new Error("Room not found.");
  }
  const room = await prisma.room.update({
    where: {
      id: roomId
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return room;
};
var roomService = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom
};

// src/app/modules/rooms/room.controller.ts
var createRoom2 = catchAsync_default(async (req, res) => {
  const room = await roomService.createRoom(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Room created successfully.",
    data: room
  });
});
var getAllRooms2 = catchAsync_default(async (req, res) => {
  const rooms = await roomService.getAllRooms({
    venueId: req.query.venueId,
    status: req.query.status
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rooms retrieved successfully.",
    data: rooms
  });
});
var getRoomById2 = catchAsync_default(async (req, res) => {
  const room = await roomService.getRoomById(req.params.roomId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Room retrieved successfully.",
    data: room
  });
});
var updateRoom2 = catchAsync_default(async (req, res) => {
  const room = await roomService.updateRoom(
    req.params.roomId,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Room updated successfully.",
    data: room
  });
});
var deleteRoom2 = catchAsync_default(async (req, res) => {
  const room = await roomService.deleteRoom(req.params.roomId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Room deleted successfully.",
    data: room
  });
});
var roomController = {
  createRoom: createRoom2,
  getAllRooms: getAllRooms2,
  getRoomById: getRoomById2,
  updateRoom: updateRoom2,
  deleteRoom: deleteRoom2
};

// src/app/modules/rooms/room.validation.ts
import { z as z4 } from "zod";
var createRoomValidationSchema = z4.object({
  name: z4.string().min(2, "Room name must be at least 2 characters long"),
  description: z4.string().optional(),
  capacity: z4.number().int().positive("Capacity must be greater than 0"),
  price: z4.number().positive("Price must be greater than 0"),
  duration: z4.number().int().positive("Duration must be greater than 0"),
  difficulty: z4.string().optional(),
  image: z4.url("Image must be a valid URL").optional(),
  status: z4.enum(RoomStatus).optional(),
  venueId: z4.string().min(1, "Venue ID is required")
});
var updateRoomValidationSchema = z4.object({
  name: z4.string().min(2, "Room name must be at least 2 characters long").optional(),
  description: z4.string().optional(),
  capacity: z4.number().int().positive("Capacity must be greater than 0").optional(),
  price: z4.number().positive("Price must be greater than 0").optional(),
  duration: z4.number().int().positive("Duration must be greater than 0").optional(),
  difficulty: z4.string().optional(),
  image: z4.url("Image must be a valid URL").optional(),
  status: z4.enum(RoomStatus).optional()
});

// src/app/modules/rooms/room.route.ts
var router4 = Router4();
router4.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createRoomValidationSchema),
  roomController.createRoom
);
router4.get("/", roomController.getAllRooms);
router4.get("/:roomId", roomController.getRoomById);
router4.patch(
  "/:roomId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateRoomValidationSchema),
  roomController.updateRoom
);
router4.delete(
  "/:roomId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  roomController.deleteRoom
);
var roomRoutes = router4;

// src/app/modules/time-slots/timeSlot.route.ts
import { Router as Router5 } from "express";

// src/app/modules/time-slots/timeSlot.service.ts
import status8 from "http-status";
var createTimeSlot = async (payload) => {
  const room = await prisma.room.findFirst({
    where: {
      id: payload.roomId,
      isDeleted: false,
      status: "ACTIVE"
    }
  });
  if (!room) {
    throw new appError_default(status8.NOT_FOUND, "Room not found or inactive.");
  }
  const date = new Date(payload.date);
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);
  if (startTime >= endTime) {
    throw new appError_default(
      status8.BAD_REQUEST,
      "Start time must be before end time."
    );
  }
  const existingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: payload.roomId,
      startTime
    }
  });
  if (existingTimeSlot) {
    throw new appError_default(
      status8.CONFLICT,
      "A time slot already exists for this room at this time."
    );
  }
  const overlappingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: payload.roomId,
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: startTime
      }
    }
  });
  if (overlappingTimeSlot) {
    throw new appError_default(
      status8.CONFLICT,
      "This time slot overlaps with an existing time slot."
    );
  }
  const timeSlot = await prisma.timeSlot.create({
    data: {
      roomId: payload.roomId,
      date,
      startTime,
      endTime
    },
    include: {
      room: true
    }
  });
  return timeSlot;
};
var getAllTimeSlots = async (query) => {
  const now = /* @__PURE__ */ new Date();
  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      ...query.roomId && {
        roomId: query.roomId
      },
      ...query.date && {
        date: new Date(query.date)
      },
      room: {
        isDeleted: false,
        status: "ACTIVE"
      }
    },
    include: {
      room: true,
      bookings: {
        where: {
          status: {
            in: ["PENDING", "CONFIRMED"]
          }
        },
        select: {
          id: true,
          status: true,
          expiresAt: true
        }
      }
    },
    orderBy: {
      startTime: "asc"
    }
  });
  return timeSlots.map((timeSlot) => {
    const activeBooking = timeSlot.bookings.find((booking) => {
      if (booking.status === "CONFIRMED") {
        return true;
      }
      if (booking.status === "PENDING" && booking.expiresAt && booking.expiresAt > now) {
        return true;
      }
      return false;
    });
    const isAvailable = timeSlot.startTime > now && !activeBooking;
    return {
      ...timeSlot,
      isAvailable,
      bookings: void 0
    };
  });
};
var getTimeSlotById = async (timeSlotId) => {
  const timeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: timeSlotId
    },
    include: {
      room: true,
      bookings: {
        where: {
          status: {
            in: ["PENDING", "CONFIRMED"]
          }
        },
        select: {
          id: true,
          status: true,
          expiresAt: true
        }
      }
    }
  });
  if (!timeSlot) {
    throw new appError_default(status8.NOT_FOUND, "Time slot not found.");
  }
  const now = /* @__PURE__ */ new Date();
  const activeBooking = timeSlot.bookings.find((booking) => {
    if (booking.status === "CONFIRMED") {
      return true;
    }
    if (booking.status === "PENDING" && booking.expiresAt && booking.expiresAt > now) {
      return true;
    }
    return false;
  });
  const isAvailable = timeSlot.startTime > now && !activeBooking;
  return {
    ...timeSlot,
    isAvailable,
    bookings: void 0
  };
};
var updateTimeSlot = async (timeSlotId, payload) => {
  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: timeSlotId
    },
    include: {
      bookings: true
    }
  });
  if (!existingTimeSlot) {
    throw new appError_default(status8.NOT_FOUND, "Time slot not found.");
  }
  if (existingTimeSlot.bookings.length > 0) {
    throw new appError_default(
      status8.BAD_REQUEST,
      "A booked time slot cannot be modified."
    );
  }
  const date = payload.date ? new Date(payload.date) : existingTimeSlot.date;
  const startTime = payload.startTime ? new Date(payload.startTime) : existingTimeSlot.startTime;
  const endTime = payload.endTime ? new Date(payload.endTime) : existingTimeSlot.endTime;
  if (startTime >= endTime) {
    throw new appError_default(
      status8.BAD_REQUEST,
      "Start time must be before end time."
    );
  }
  const overlappingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: existingTimeSlot.roomId,
      id: {
        not: timeSlotId
      },
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: startTime
      }
    }
  });
  if (overlappingTimeSlot) {
    throw new appError_default(
      status8.BAD_REQUEST,
      "This time slot overlaps with an existing time slot."
    );
  }
  const timeSlot = await prisma.timeSlot.update({
    where: {
      id: timeSlotId
    },
    data: {
      date,
      startTime,
      endTime
    },
    include: {
      room: true
    }
  });
  return timeSlot;
};
var deleteTimeSlot = async (timeSlotId) => {
  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: timeSlotId
    },
    include: {
      bookings: true
    }
  });
  if (!existingTimeSlot) {
    throw new appError_default(status8.NOT_FOUND, "Time slot not found.");
  }
  if (existingTimeSlot.bookings.length > 0) {
    throw new appError_default(
      status8.BAD_REQUEST,
      "A booked time slot cannot be deleted."
    );
  }
  await prisma.timeSlot.delete({
    where: {
      id: timeSlotId
    }
  });
  return null;
};
var timeSlotService = {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
};

// src/app/modules/time-slots/timeSlot.controller.ts
var createTimeSlot2 = catchAsync_default(async (req, res) => {
  const timeSlot = await timeSlotService.createTimeSlot(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Time slot created successfully.",
    data: timeSlot
  });
});
var getAllTimeSlots2 = catchAsync_default(async (req, res) => {
  const timeSlots = await timeSlotService.getAllTimeSlots({
    roomId: req.query.roomId,
    date: req.query.date
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slots retrieved successfully.",
    data: timeSlots
  });
});
var getTimeSlotById2 = catchAsync_default(async (req, res) => {
  const timeSlot = await timeSlotService.getTimeSlotById(
    req.params.timeSlotId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slot retrieved successfully.",
    data: timeSlot
  });
});
var updateTimeSlot2 = catchAsync_default(async (req, res) => {
  const timeSlot = await timeSlotService.updateTimeSlot(
    req.params.timeSlotId,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slot updated successfully.",
    data: timeSlot
  });
});
var deleteTimeSlot2 = catchAsync_default(async (req, res) => {
  await timeSlotService.deleteTimeSlot(req.params.timeSlotId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slot deleted successfully."
  });
});
var timeSlotController = {
  createTimeSlot: createTimeSlot2,
  getAllTimeSlots: getAllTimeSlots2,
  getTimeSlotById: getTimeSlotById2,
  updateTimeSlot: updateTimeSlot2,
  deleteTimeSlot: deleteTimeSlot2
};

// src/app/modules/time-slots/timeSlot.validation.ts
import { z as z5 } from "zod";
var createTimeSlotValidationSchema = z5.object({
  roomId: z5.string().min(1, "Room ID is required"),
  date: z5.iso.datetime({ message: "Date must be a valid ISO datetime" }),
  startTime: z5.iso.datetime({
    message: "Start time must be a valid ISO datetime"
  }),
  endTime: z5.iso.datetime({ message: "End time must be a valid ISO datetime" })
});
var updateTimeSlotValidationSchema = z5.object({
  date: z5.iso.datetime({ message: "Date must be a valid ISO datetime" }).optional(),
  startTime: z5.iso.datetime({ message: "Start time must be a valid ISO datetime" }).optional(),
  endTime: z5.iso.datetime({ message: "End time must be a valid ISO datetime" }).optional()
});

// src/app/modules/time-slots/timeSlot.route.ts
var router5 = Router5();
router5.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTimeSlotValidationSchema),
  timeSlotController.createTimeSlot
);
router5.get("/", timeSlotController.getAllTimeSlots);
router5.get("/:timeSlotId", timeSlotController.getTimeSlotById);
router5.patch(
  "/:timeSlotId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTimeSlotValidationSchema),
  timeSlotController.updateTimeSlot
);
router5.delete(
  "/:timeSlotId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  timeSlotController.deleteTimeSlot
);
var timeSlotRoutes = router5;

// src/app/modules/bookings/booking.route.ts
import { Router as Router6 } from "express";

// src/app/modules/bookings/booking.service.ts
import status9 from "http-status";

// src/app/config/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// src/app/modules/bookings/booking.service.ts
var generateBookingNumber = () => {
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1e5 + Math.random() * 9e5);
  return `BK-${year}${month}${day}-${random}`;
};
var createBooking = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new appError_default(status9.NOT_FOUND, "User not found.");
  }
  if (user.isDeleted || user.status !== "ACTIVE") {
    throw new appError_default(
      status9.FORBIDDEN,
      "Your account is not allowed to create a booking."
    );
  }
  const timeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: payload.timeSlotId
    },
    include: {
      room: true
    }
  });
  console.log(timeSlot?.room.status);
  if (!timeSlot) {
    throw new appError_default(status9.NOT_FOUND, "Time slot not found.");
  }
  if (timeSlot.room.isDeleted) {
    throw new appError_default(
      status9.NOT_FOUND,
      "The room for this time slot is no longer available."
    );
  }
  if (timeSlot.room.status !== "ACTIVE") {
    throw new appError_default(
      status9.BAD_REQUEST,
      "The room for this time slot is currently unavailable."
    );
  }
  if (payload.guestCount > timeSlot.room.capacity) {
    throw new appError_default(
      status9.BAD_REQUEST,
      `This room can accommodate a maximum of ${timeSlot.room.capacity} guests.`
    );
  }
  if (timeSlot.startTime <= /* @__PURE__ */ new Date()) {
    throw new appError_default(
      status9.BAD_REQUEST,
      "This time slot has already started or passed."
    );
  }
  const totalAmount = timeSlot.room.price;
  const booking = await prisma.$transaction(async (transaction) => {
    const existingBooking = await transaction.booking.findFirst({
      where: {
        timeSlotId: payload.timeSlotId,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    });
    if (existingBooking) {
      throw new appError_default(status9.CONFLICT, "This time slot is already booked.");
    }
    const createdBooking = await transaction.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId,
        timeSlotId: timeSlot.id,
        guestCount: payload.guestCount,
        totalAmount,
        status: "PENDING",
        notes: payload.notes,
        expiresAt: new Date(Date.now() + 15 * 60 * 1e3)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        timeSlot: {
          include: {
            room: {
              include: {
                venue: true
              }
            }
          }
        }
      }
    });
    return createdBooking;
  });
  return booking;
};
var getMyBookings = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      userId
    },
    include: {
      timeSlot: {
        include: {
          room: {
            include: {
              venue: true
            }
          }
        }
      },
      payment: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings;
};
var getBookingById = async (bookingId, userId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId
    },
    include: {
      timeSlot: {
        include: {
          room: {
            include: {
              venue: true
            }
          }
        }
      },
      payment: true
    }
  });
  if (!booking) {
    throw new appError_default(status9.NOT_FOUND, "Booking not found.");
  }
  return booking;
};
var getBookingByIdAdmin = async (bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId
    },
    include: {
      timeSlot: {
        include: {
          room: {
            include: {
              venue: true
            }
          }
        }
      },
      payment: true,
      user: true
    }
  });
  if (!booking) {
    throw new appError_default(status9.NOT_FOUND, "Booking not found.");
  }
  return booking;
};
var getAllBookings = async (query) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;
  const andConditions = [];
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.search) {
    andConditions.push({
      OR: [
        {
          bookingNumber: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          user: {
            name: {
              contains: query.search,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            email: {
              contains: query.search,
              mode: "insensitive"
            }
          }
        },
        {
          timeSlot: {
            room: {
              name: {
                contains: query.search,
                mode: "insensitive"
              }
            }
          }
        }
      ]
    });
  }
  const where = andConditions.length > 0 ? {
    AND: andConditions
  } : {};
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        timeSlot: {
          include: {
            room: {
              include: {
                venue: true
              }
            }
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.booking.count({
      where
    })
  ]);
  return {
    data: bookings,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var cancelBooking = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId
    },
    include: {
      payment: true
    }
  });
  if (!booking) {
    throw new appError_default(status9.NOT_FOUND, "Booking not found.");
  }
  if (booking.status === "CANCELLED") {
    throw new appError_default(status9.BAD_REQUEST, "Booking is already cancelled.");
  }
  if (booking.status === "COMPLETED") {
    throw new appError_default(
      status9.BAD_REQUEST,
      "Completed bookings cannot be cancelled."
    );
  }
  if (booking.payment && booking.payment.status === "PAID") {
    if (!booking.payment.paymentIntentId) {
      throw new appError_default(
        status9.INTERNAL_SERVER_ERROR,
        "Payment intent ID is missing."
      );
    }
    const refund = await stripe.refunds.create({
      payment_intent: booking.payment.paymentIntentId
    });
    if (refund.status !== "succeeded") {
      throw new appError_default(status9.BAD_REQUEST, "Payment refund failed.");
    }
    const result = await prisma.$transaction(async (transaction) => {
      const updatedPayment = await transaction.payment.update({
        where: {
          id: booking.payment.id
        },
        data: {
          status: "REFUNDED"
        }
      });
      const updatedBooking2 = await transaction.booking.update({
        where: {
          id: booking.id
        },
        data: {
          status: "CANCELLED"
        }
      });
      return {
        booking: updatedBooking2,
        payment: updatedPayment
      };
    });
    return result;
  }
  const updatedBooking = await prisma.booking.update({
    where: {
      id: booking.id
    },
    data: {
      status: "CANCELLED"
    }
  });
  return {
    booking: updatedBooking,
    payment: booking.payment
  };
};
var updateBookingStatus = async (bookingId, payload) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    include: {
      payment: true
    }
  });
  if (!booking) {
    throw new appError_default(status9.NOT_FOUND, "Booking not found.");
  }
  const allowedTransitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
  };
  const allowedStatuses = allowedTransitions[booking.status];
  if (!allowedStatuses.includes(payload.status)) {
    throw new appError_default(
      status9.BAD_REQUEST,
      `Cannot change booking status from ${booking.status} to ${payload.status}.`
    );
  }
  if (payload.status === "CANCELLED") {
    if (booking.payment?.status === "PAID") {
      if (!booking.payment.paymentIntentId) {
        throw new appError_default(
          status9.INTERNAL_SERVER_ERROR,
          "Payment intent ID is missing."
        );
      }
      const refund = await stripe.refunds.create({
        payment_intent: booking.payment.paymentIntentId
      });
      if (refund.status !== "succeeded") {
        throw new appError_default(
          status9.BAD_REQUEST,
          "Payment refund failed. Booking was not cancelled."
        );
      }
      const result = await prisma.$transaction(async (transaction) => {
        const updatedPayment = await transaction.payment.update({
          where: {
            id: booking.payment.id
          },
          data: {
            status: "REFUNDED"
          }
        });
        const updatedBooking2 = await transaction.booking.update({
          where: {
            id: booking.id
          },
          data: {
            status: "CANCELLED"
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            timeSlot: {
              include: {
                room: true
              }
            },
            payment: true
          }
        });
        return {
          booking: updatedBooking2,
          payment: updatedPayment
        };
      });
      return result;
    }
  }
  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: payload.status
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      timeSlot: {
        include: {
          room: true
        }
      },
      payment: true
    }
  });
  return updatedBooking;
};
var bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  getBookingByIdAdmin,
  getAllBookings,
  cancelBooking,
  updateBookingStatus
};

// src/app/modules/bookings/booking.controller.ts
import status10 from "http-status";
var createBooking2 = catchAsync_default(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully.",
    data: booking
  });
});
var getMyBookings2 = catchAsync_default(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully.",
    data: bookings
  });
});
var getBookingById2 = catchAsync_default(async (req, res) => {
  const booking = await bookingService.getBookingById(
    req.params.bookingId,
    req.user.id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved successfully.",
    data: booking
  });
});
var getBookingByIdAdmin2 = catchAsync_default(async (req, res) => {
  const booking = await bookingService.getBookingByIdAdmin(
    req.params.bookingId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved successfully.",
    data: booking
  });
});
var getAllBookings2 = catchAsync_default(async (req, res) => {
  const result = await bookingService.getAllBookings(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully.",
    data: result.data,
    meta: result.meta
  });
});
var cancelBooking2 = catchAsync_default(async (req, res) => {
  const result = await bookingService.cancelBooking(
    req.user.id,
    req.params.bookingId
  );
  sendResponse(res, {
    statusCode: status10.OK,
    success: true,
    message: "Booking cancelled successfully.",
    data: result
  });
});
var updateBookingStatus2 = catchAsync_default(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(
    req.params.bookingId,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking status updated successfully.",
    data: booking
  });
});
var bookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings2,
  getBookingById: getBookingById2,
  getBookingByIdAdmin: getBookingByIdAdmin2,
  getAllBookings: getAllBookings2,
  cancelBooking: cancelBooking2,
  updateBookingStatus: updateBookingStatus2
};

// src/app/modules/bookings/booking.validation.ts
import { z as z6 } from "zod";
var createBookingValidationSchema = z6.object({
  timeSlotId: z6.string().min(1, "Time slot ID is required"),
  guestCount: z6.number().int("Guest count must be an integer").min(1, "Guest count must be at least 1"),
  notes: z6.string().optional()
});
var updateBookingStatusValidationSchema = z6.object({
  status: z6.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
});
var getBookingsQueryValidationSchema = z6.object({
  page: z6.coerce.number().int().min(1).optional(),
  limit: z6.coerce.number().int().min(1).max(100).optional(),
  search: z6.string().optional(),
  status: z6.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional()
});

// src/app/modules/bookings/booking.route.ts
var router6 = Router6();
router6.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createBookingValidationSchema),
  bookingController.createBooking
);
router6.get(
  "/my-bookings",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getMyBookings
);
router6.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBookings
);
router6.get(
  "/:bookingId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getBookingById
);
router6.get(
  "/admin/:bookingId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getBookingByIdAdmin
);
router6.post(
  "/:bookingId/cancel",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.cancelBooking
);
router6.patch(
  "/:bookingId/status",
  validateRequest(updateBookingStatusValidationSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.updateBookingStatus
);
var bookingRoutes = router6;

// src/app/modules/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/app/modules/payment/payment.service.ts
import status11 from "http-status";
var createPaymentIntent = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId
    },
    include: {
      payment: true,
      timeSlot: {
        include: {
          room: true
        }
      }
    }
  });
  if (!booking) {
    throw new appError_default(status11.NOT_FOUND, "Booking not found.");
  }
  if (booking.status === "CANCELLED") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "A cancelled booking cannot be paid for."
    );
  }
  if (booking.status === "COMPLETED") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has already been completed."
    );
  }
  if (booking.status === "CONFIRMED") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has already been confirmed."
    );
  }
  if (booking.expiresAt && booking.expiresAt <= /* @__PURE__ */ new Date()) {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has expired. Please create a new booking."
    );
  }
  if (booking.payment?.status === "PAID") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has already been paid."
    );
  }
  if (booking.payment?.paymentIntentId) {
    const existingPaymentIntent = await stripe.paymentIntents.retrieve(
      booking.payment.paymentIntentId
    );
    if (existingPaymentIntent.status === "succeeded") {
      throw new appError_default(
        status11.BAD_REQUEST,
        "This payment has already been completed."
      );
    }
    if (existingPaymentIntent.status === "requires_payment_method" || existingPaymentIntent.status === "requires_confirmation" || existingPaymentIntent.status === "requires_action") {
      return {
        clientSecret: existingPaymentIntent.client_secret,
        paymentIntentId: existingPaymentIntent.id
      };
    }
  }
  const amountInSmallestUnit = Math.round(Number(booking.totalAmount) * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInSmallestUnit,
    currency: process.env.STRIPE_CURRENCY || "usd",
    automatic_payment_methods: {
      enabled: true
    },
    metadata: {
      bookingId: booking.id,
      userId
    },
    description: `Bookora booking ${booking.bookingNumber}`
  });
  if (booking.payment) {
    await prisma.payment.update({
      where: {
        id: booking.payment.id
      },
      data: {
        paymentIntentId: paymentIntent.id,
        status: "PENDING"
      }
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        method: "STRIPE",
        status: "PENDING",
        paymentIntentId: paymentIntent.id
      }
    });
  }
  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
};
var createCheckoutSession = async (userId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId
    },
    include: {
      payment: true,
      timeSlot: {
        include: {
          room: true
        }
      }
    }
  });
  if (!booking) {
    throw new appError_default(status11.NOT_FOUND, "Booking not found.");
  }
  if (booking.status === "CANCELLED") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "A cancelled booking cannot be paid for."
    );
  }
  if (booking.status === "COMPLETED") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has already been completed."
    );
  }
  if (booking.status === "CONFIRMED") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has already been confirmed."
    );
  }
  if (booking.expiresAt && booking.expiresAt <= /* @__PURE__ */ new Date()) {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has expired. Please create a new booking."
    );
  }
  if (booking.payment?.status === "PAID") {
    throw new appError_default(
      status11.BAD_REQUEST,
      "This booking has already been paid."
    );
  }
  if (booking.payment?.checkoutSessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(
      booking.payment.checkoutSessionId
    );
    if (existingSession.status === "open") {
      return {
        sessionId: existingSession.id,
        url: existingSession.url
      };
    }
    if (existingSession.status === "complete") {
      throw new appError_default(
        status11.BAD_REQUEST,
        "This booking payment has already been completed."
      );
    }
  }
  const amountInSmallestUnit = Math.round(Number(booking.totalAmount) * 100);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: process.env.STRIPE_CURRENCY || "usd",
          product_data: {
            name: booking.timeSlot.room.name,
            description: `Bookora booking ${booking.bookingNumber}`
          },
          unit_amount: amountInSmallestUnit
        },
        quantity: 1
      }
    ],
    metadata: {
      bookingId: booking.id,
      userId
    },
    payment_intent_data: {
      metadata: {
        bookingId: booking.id,
        userId
      }
    },
    success_url: process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/payment/success",
    cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/payment/cancelled"
  });
  if (booking.payment) {
    await prisma.payment.update({
      where: {
        id: booking.payment.id
      },
      data: {
        checkoutSessionId: session.id,
        /*
         * A new checkout attempt is pending.
         */
        status: "PENDING"
      }
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        method: "STRIPE",
        status: "PENDING",
        checkoutSessionId: session.id
      }
    });
  }
  return {
    sessionId: session.id,
    url: session.url
  };
};
var paymentService = {
  createPaymentIntent,
  createCheckoutSession
};

// src/app/modules/payment/payment.controller.ts
var createPaymentIntent2 = catchAsync_default(async (req, res) => {
  const result = await paymentService.createPaymentIntent(
    req.user.id,
    req.body.bookingId
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment intent created successfully.",
    data: result
  });
});
var createCheckoutSession2 = catchAsync_default(
  async (req, res) => {
    const result = await paymentService.createCheckoutSession(
      req.user.id,
      req.body.bookingId
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Checkout session created successfully.",
      data: result
    });
  }
);
var paymentController = {
  createPaymentIntent: createPaymentIntent2,
  createCheckoutSession: createCheckoutSession2
};

// src/app/modules/payment/payment.validation.ts
import { z as z7 } from "zod";
var createPaymentIntentValidationSchema = z7.object({
  bookingId: z7.string().min(1, "Booking ID is required")
});
var createCheckoutSessionValidationSchema = z7.object({
  bookingId: z7.string().min(1, "Booking ID is required")
});

// src/app/modules/payment/payment.route.ts
var router7 = Router7();
router7.post(
  "/create-intent",
  checkAuth(Role.USER),
  validateRequest(createPaymentIntentValidationSchema),
  paymentController.createPaymentIntent
);
router7.post(
  "/create-checkout-session",
  checkAuth(Role.USER),
  validateRequest(createCheckoutSessionValidationSchema),
  paymentController.createCheckoutSession
);
var paymentRoutes = router7;

// src/app/modules/dashboard/admin.dashboard.route.ts
import { Router as Router8 } from "express";

// src/app/modules/dashboard/admin.dashboard.controller.ts
import status12 from "http-status";

// src/app/modules/dashboard/admin.dashboard.service.ts
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalAdmins,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    revenueResult,
    recentBookings
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "USER",
        isDeleted: false
      }
    }),
    prisma.admin.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        status: "PENDING"
      }
    }),
    prisma.booking.count({
      where: {
        status: "CONFIRMED"
      }
    }),
    prisma.booking.count({
      where: {
        status: "COMPLETED"
      }
    }),
    prisma.booking.count({
      where: {
        status: "CANCELLED"
      }
    }),
    prisma.payment.aggregate({
      where: {
        status: "PAID"
      },
      _sum: {
        amount: true
      }
    }),
    prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        timeSlot: {
          include: {
            room: {
              include: {
                venue: true
              }
            }
          }
        },
        payment: true
      }
    })
  ]);
  return {
    users: {
      total: totalUsers
    },
    admins: {
      total: totalAdmins
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings
    },
    revenue: {
      total: revenueResult._sum.amount ?? 0
    },
    recentBookings
  };
};
var AdminDashboardService = {
  getDashboardStats
};

// src/app/modules/dashboard/admin.dashboard.controller.ts
var getDashboardStats2 = catchAsync_default(async (_req, res) => {
  const result = await AdminDashboardService.getDashboardStats();
  sendResponse(res, {
    statusCode: status12.OK,
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: result
  });
});
var AdminDashboardController = {
  getDashboardStats: getDashboardStats2
};

// src/app/modules/dashboard/admin.dashboard.route.ts
var router8 = Router8();
router8.get(
  "/stats",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminDashboardController.getDashboardStats
);
var AdminDashboardRoutes = router8;

// src/app/routes/index.ts
var router9 = Router9();
router9.use("/auth", authRoutes);
router9.use("/admins", AdminRoutes);
router9.use("/venues", venueRoutes);
router9.use("/rooms", roomRoutes);
router9.use("/time-slots", timeSlotRoutes);
router9.use("/bookings", bookingRoutes);
router9.use("/payments", paymentRoutes);
router9.use("/admin/dashboard", AdminDashboardRoutes);
var indexRoutes = router9;

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/app/middleware/notFound.ts
import status13 from "http-status";
var notFound = (req, res) => {
  res.status(status13.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  });
};

// src/app/middleware/globalErrorHandler.ts
import status15 from "http-status";
import z8 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status14 from "http-status";
var handleZodError = (err) => {
  const statusCode = status14.BAD_REQUEST;
  const message = "Zod validation error";
  const errorSource = [];
  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join(".") || "unknown",
      message: issue.message
    });
  });
  return {
    statusCode,
    success: false,
    message,
    errorSource
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler ", err);
  }
  let errorSource = [];
  let statusCode = status15.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let stack = void 0;
  if (err instanceof z8.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource.push(...simplifiedError.errorSource);
    stack = err.stack;
  } else if (err instanceof appError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status15.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSource,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app.ts
import cookieParser from "cookie-parser";

// src/app/modules/payment/payment.webhook.ts
var handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      envVars.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature."
    });
  }
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      await handlePaymentSucceeded(paymentIntent);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      await handlePaymentFailed(paymentIntent);
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      await handleChargeRefunded(charge);
      break;
    }
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }
  return res.status(200).json({
    received: true
  });
};
var handlePaymentSucceeded = async (paymentIntent) => {
  const bookingId = paymentIntent.metadata.bookingId;
  if (!bookingId) {
    console.error("Booking ID missing from PaymentIntent metadata.");
    return;
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    console.error("Booking not found:", bookingId);
    return;
  }
  if (booking.status !== "PENDING") {
    console.log(
      `Ignoring successful payment for booking ${booking.id} because its status is ${booking.status}.`
    );
    return;
  }
  if (booking.expiresAt && booking.expiresAt <= /* @__PURE__ */ new Date()) {
    console.log(
      `Booking ${booking.id} has expired. Refunding successful payment.`
    );
    try {
      await stripe.refunds.create({
        payment_intent: paymentIntent.id
      });
    } catch (error) {
      console.error(
        `Failed to refund payment for expired booking ${booking.id}:`,
        error
      );
      return;
    }
    await prisma.$transaction(async (transaction) => {
      const currentBooking = await transaction.booking.findUnique({
        where: {
          id: booking.id
        }
      });
      if (!currentBooking || currentBooking.status !== "PENDING") {
        return;
      }
      const existingPayment = await transaction.payment.findUnique({
        where: {
          paymentIntentId: paymentIntent.id
        }
      });
      if (existingPayment) {
        await transaction.payment.update({
          where: {
            id: existingPayment.id
          },
          data: {
            status: "REFUNDED"
          }
        });
      } else {
        await transaction.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            method: "STRIPE",
            status: "REFUNDED",
            paymentIntentId: paymentIntent.id,
            paidAt: /* @__PURE__ */ new Date()
          }
        });
      }
      await transaction.booking.update({
        where: {
          id: booking.id
        },
        data: {
          status: "CANCELLED"
        }
      });
    });
    return;
  }
  await prisma.$transaction(async (transaction) => {
    const currentBooking = await transaction.booking.findUnique({
      where: {
        id: booking.id
      }
    });
    if (!currentBooking || currentBooking.status !== "PENDING") {
      return;
    }
    const existingPayment = await transaction.payment.findUnique({
      where: {
        paymentIntentId: paymentIntent.id
      }
    });
    if (existingPayment) {
      if (existingPayment.status === "PAID") {
        return;
      }
      await transaction.payment.update({
        where: {
          id: existingPayment.id
        },
        data: {
          status: "PAID",
          paidAt: /* @__PURE__ */ new Date(),
          paymentIntentId: paymentIntent.id
        }
      });
    } else {
      await transaction.payment.create({
        data: {
          bookingId: currentBooking.id,
          amount: currentBooking.totalAmount,
          method: "STRIPE",
          status: "PAID",
          paymentIntentId: paymentIntent.id,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
    }
    await transaction.booking.update({
      where: {
        id: currentBooking.id
      },
      data: {
        status: "CONFIRMED"
      }
    });
  });
};
var handlePaymentFailed = async (paymentIntent) => {
  const payment = await prisma.payment.findUnique({
    where: {
      paymentIntentId: paymentIntent.id
    }
  });
  if (!payment) {
    return;
  }
  await prisma.payment.update({
    where: {
      id: payment.id
    },
    data: {
      status: "FAILED"
    }
  });
};
var handleChargeRefunded = async (charge) => {
  if (!charge.payment_intent) {
    console.error("PaymentIntent missing from refunded charge.");
    return;
  }
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id;
  await prisma.$transaction(async (transaction) => {
    const payment = await transaction.payment.findUnique({
      where: {
        paymentIntentId
      },
      include: {
        booking: true
      }
    });
    if (!payment) {
      console.error(
        "Payment not found for refunded PaymentIntent:",
        paymentIntentId
      );
      return;
    }
    if (payment.status === "REFUNDED") {
      return;
    }
    await transaction.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: "REFUNDED"
      }
    });
    if (payment.booking.status !== "CANCELLED") {
      await transaction.booking.update({
        where: {
          id: payment.bookingId
        },
        data: {
          status: "CANCELLED"
        }
      });
    }
  });
};
var paymentWebhookController = {
  handleStripeWebhook
};

// src/app.ts
import cors from "cors";
var app = express();
app.use(express.urlencoded({ extended: true }));
app.post(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json"
  }),
  paymentWebhookController.handleStripeWebhook
);
app.use(
  cors({
    origin: [
      envVars.google.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/v1", indexRoutes);
app.get("/", (req, res) => {
  res.send("TypeScript + Express!");
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;
export {
  app_default as default
};
