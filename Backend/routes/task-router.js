import express from "express";
import {
  getAllTasks,
  getPaginatedTasks,
  getTasks,
  getCompletedTasks,
  getIncompleteTasks,
  getTaskById,
  createTask,
  updateCompleteTask,
  updateTask,
  deleteTask,
} from "../controllers/task-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/get-all", getAllTasks);
router.get("/get-paginated-tasks", getPaginatedTasks);
router.get("/get-tasks", authMiddleware, getTasks);
router.get("/get-complete", authMiddleware, getCompletedTasks);
router.get("/get-incomplete", authMiddleware, getIncompleteTasks);
router.get("/get/:id", authMiddleware, getTaskById);
router.post("/create", authMiddleware, createTask);
router.put("/update-complete-task/:id", authMiddleware, updateCompleteTask);
router.patch("/update-task/:id", authMiddleware, updateTask);
router.delete("/delete-task/:id", authMiddleware, deleteTask);

export default router;
