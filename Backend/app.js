import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user-router.js";
import taskRouter from "./routes/task-router.js";
import { connectToDatabase } from "./database/database-connection.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

connectToDatabase();

export default app;
