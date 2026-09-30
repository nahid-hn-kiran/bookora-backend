// Vercel serverless entry. Uses the tsup bundle because the source relies on
// extensionless ESM imports that do not resolve at runtime without bundling.
import app from "../dist/app.js";

export default app;
