import express from "express";
import dotenv from "dotenv/config";
import { initDB } from "./config/db.js";
import transactionRoutes from "./routes/transactionsRoute.js";
import rateLimiter from "./middleWare/rateLimiter.js";
import job from "./config/cron.js";

const app = express();  

if (process.env.NODE_ENV === "production") job.start();

// Middleware
app.use(rateLimiter);     
app.use(express.json());

// Routes 
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5001;


initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on PORT:${PORT}`);
  });
});
