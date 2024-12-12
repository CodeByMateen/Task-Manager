import { HTTP_STATUS_CODE } from "../utils/http-status-codes.js";
import Task from "../models/task-schema.js";

export const createTask = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { title, description } = req.body;
    if (!title) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "Title is required.",
      });
    }

    const task = await Task.create({
      title,
      description,
      userId: user_id,
    });

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.log(error.message);
    if (error.name === "ValidationError") {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: error.message,
      });
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const isTaskExist = await Task.findOne({ _id: id, userId: user_id });
    if (!isTaskExist) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: "Task not found.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Task updated successfully.",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
export const updateCompleteTask = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const isTaskExist = await Task.findOne({ _id: id, userId: user_id });
    if (!isTaskExist) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: "Task not found.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Task updated successfully.",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { id } = req.params;

    const isTaskExist = await Task.findOne({ _id: id, userId: user_id });
    if (!isTaskExist) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: "Task not found.",
      });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: user_id,
    });
    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Task deleted successfully.",
      data: deletedTask,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getPaginatedTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    const tasks = await Task.find().skip(skip).limit(limit);

    if (tasks.length <= 0) {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "No tasks found.",
        data: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Tasks fetched successfully.",
      data: tasks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    if (tasks.length <= 0) {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "No tasks found.",
        data: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Tasks fetched successfully.",
      data: tasks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tasks = await Task.find({ userId: user_id });

    if (tasks.length <= 0) {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "No tasks found.",
        data: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Tasks fetched successfully.",
      data: tasks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id });
    if (!task) {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "Task not found.",
        data: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Task fetched successfully.",
      data: task,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getCompletedTasks = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tasks = await Task.find({ userId: user_id, completed: true });

    if (tasks.length <= 0) {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "No tasks found.",
        data: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Tasks fetched successfully.",
      data: tasks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getIncompleteTasks = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tasks = await Task.find({ userId: user_id, completed: false });

    if (tasks.length <= 0) {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "No tasks found.",
        data: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "Tasks fetched successfully.",
      data: tasks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
