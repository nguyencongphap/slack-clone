import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js"; // add .js because we're importing local files
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import chatRoutes from "./routes/chat.route.js";
import * as Sentry from "@sentry/node";

const app = express();

app.use(express.json()); // allows us to access req.body where we have JSON data

app.use(clerkMiddleware()); // this allow us to use req.auth in the endpoints to do sth like req.auth().userId to get Clerk user id

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/chat", chatRoutes);

// use Sentry
Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
  try {
    await connectDB();

    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server started on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();

export default app; // Export for Vercel to use when we deploy to Vercel

// TODO: Continue at 1:18:00
