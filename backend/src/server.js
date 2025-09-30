import express from "express";
import { ENV } from "./config/env.js"; // add .js because we're importing local files
import { connectDB } from "./config/db.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

app.listen(ENV.PORT, () => {
  console.log("Server started on port:", ENV.PORT);
  connectDB();
});
