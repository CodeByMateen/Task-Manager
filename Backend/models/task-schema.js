import mongoose from "mongoose"; 
// import { User } from "./user-schema";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the task"],
    minLength: [3, "Title must contain at least 3 characters"],
  },
  description: {
    type: String,
    required: false,
    minLength: [10, "Description must contain at least 10 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
