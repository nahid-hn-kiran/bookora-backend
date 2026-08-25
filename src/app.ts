import express, { Application, Request, Response } from "express";
import { indexRoutes } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { paymentWebhookController } from "./app/modules/payment/payment.webhook";
import cors from "cors";
import { envVars } from "./app/config/env";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

app.post(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  paymentWebhookController.handleStripeWebhook,
);

// Enable URL-encoded form data parsing
app.use(
  cors({
    origin: [
      envVars.google.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Better Auth
app.use("/api/auth", toNodeHandler(auth));

// All routes
app.use("/api/v1", indexRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

// Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
