import request from "supertest";
import app from "../app";
import Task from "../models/task-schema";
import User from "../models/user-schema";

jest.mock("../models/task-schema.js");
jest.mock("../models/user-schema.js");

describe("Task Controller Tests", () => {
  beforeEach(async () => {
    Task.mockClear();
    User.mockClear();
  });

  describe("POST /tasks", () => {
    it("should return 400 if title is missing", async () => {
      const res = await request(app)
        .post("/tasks")
        .send({ description: "Task description" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Title is required.");
    });

    it("should return 201 and task data when creation is successful", async () => {
      const mockTask = {
        _id: "12345",
        title: "Task title",
        description: "Task description",
        userId: "67890",
      };

      Task.create.mockResolvedValueOnce(mockTask);

      const res = await request(app)
        .post("/tasks")
        .send({ title: "Task title", description: "Task description" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Task created successfully.");
      expect(res.body.data).toEqual(mockTask);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.create.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const res = await request(app)
        .post("/tasks")
        .send({ title: "Task title", description: "Task description" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should return 400 if title, description, or completed is missing", async () => {
      const res = await request(app).patch("/tasks/12345").send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Title, description, and completed are required."
      );
    });

    it("should return 404 if task is not found", async () => {
      Task.find.mockResolvedValueOnce([]);

      const res = await request(app).patch("/tasks/12345").send({
        title: "Task title",
        description: "Task description",
        completed: true,
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Task not found.");
    });

    it("should return 200 and task data when update is successful", async () => {
      const mockTask = {
        _id: "12345",
        title: "Task title",
        description: "Task description",
        userId: "67890",
        completed: true,
      };

      Task.find.mockResolvedValueOnce([mockTask]);
      Task.findByIdAndUpdate.mockResolvedValueOnce(mockTask);

      const res = await request(app).patch("/tasks/12345").send({
        title: "Task title",
        description: "Task description",
        completed: true,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task updated successfully.");
      expect(res.body.data).toEqual(mockTask);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const res = await request(app).patch("/tasks/12345").send({
        title: "Task title",
        description: "Task description",
        completed: true,
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should return 404 if task is not found", async () => {
      Task.find.mockResolvedValueOnce([]);

      const res = await request(app).delete("/tasks/12345");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Task not found.");
    });

    it("should return 200 and task data when deletion is successful", async () => {
      const mockTask = {
        _id: "12345",
        title: "Task title",
        description: "Task description",
        userId: "67890",
      };

      Task.find.mockResolvedValueOnce([mockTask]);
      Task.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

      const res = await request(app).delete("/tasks/12345");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task deleted successfully.");
      expect(res.body.data).toEqual(mockTask);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.deleteOne.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const res = await request(app).delete("/tasks/12345");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("GET /tasks", () => {
    it("should return 200 and all tasks when fetch is successful", async () => {
      const mockTasks = [
        {
          _id: "12345",
          title: "Task title",
          description: "Task description",
          userId: "67890",
        },
        {
          _id: "67890",
          title: "Task title",
          description: "Task description",
          userId: "12345",
        },
      ];

      Task.find.mockResolvedValueOnce(mockTasks);

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Tasks fetched successfully.");
      expect(res.body.data).toEqual(mockTasks);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.find.mockRejectedValueOnce(new Error("Database connection failed"));

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("GET /tasks/user", () => {
    it("should return 200 and user tasks when fetch is successful", async () => {
      const mockTasks = [
        {
          _id: "12345",
          title: "Task title",
          description: "Task description",
          userId: "67890",
        },
        {
          _id: "67890",
          title: "Task title",
          description: "Task description",
          userId: "12345",
        },
      ];

      Task.find.mockResolvedValueOnce(mockTasks);

      const res = await request(app).get("/tasks/user");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Tasks fetched successfully.");
      expect(res.body.data).toEqual(mockTasks);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.find.mockRejectedValueOnce(new Error("Database connection failed"));

      const res = await request(app).get("/tasks/user");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return 404 if task is not found", async () => {
      Task.findOne.mockResolvedValueOnce(null);

      const res = await request(app).get("/tasks/12345");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Task not found.");
    });

    it("should return 200 and task data when fetch is successful", async () => {
      const mockTask = {
        _id: "12345",
        title: "Task title",
        description: "Task description",
        userId: "67890",
      };

      Task.findOne.mockResolvedValueOnce(mockTask);

      const res = await request(app).get("/tasks/12345");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task fetched successfully.");
      expect(res.body.data).toEqual(mockTask);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.findOne.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const res = await request(app).get("/tasks/12345");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("GET /tasks/completed", () => {
    it("should return 200 and completed tasks when fetch is successful", async () => {
      const mockTasks = [
        {
          _id: "12345",
          title: "Task title",
          description: "Task description",
          userId: "67890",
          completed: true,
        },
        {
          _id: "67890",
          title: "Task title",
          description: "Task description",
          userId: "12345",
          completed: true,
        },
      ];

      Task.find.mockResolvedValueOnce(mockTasks);

      const res = await request(app).get("/tasks/completed");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Tasks fetched successfully.");
      expect(res.body.data).toEqual(mockTasks);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.find.mockRejectedValueOnce(new Error("Database connection failed"));

      const res = await request(app).get("/tasks/completed");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("GET /tasks/incomplete", () => {
    it("should return 200 and incomplete tasks when fetch is successful", async () => {
      const mockTasks = [
        {
          _id: "12345",
          title: "Task title",
          description: "Task description",
          userId: "67890",
          completed: false,
        },
        {
          _id: "67890",
          title: "Task title",
          description: "Task description",
          userId: "12345",
          completed: false,
        },
      ];

      Task.find.mockResolvedValueOnce(mockTasks);

      const res = await request(app).get("/tasks/incomplete");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Tasks fetched successfully.");
      expect(res.body.data).toEqual(mockTasks);
    });

    it("should return 500 if there is an internal server error", async () => {
      Task.find.mockRejectedValueOnce(new Error("Database connection failed"));

      const res = await request(app).get("/tasks/incomplete");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Database connection failed");
    });
  });
});
