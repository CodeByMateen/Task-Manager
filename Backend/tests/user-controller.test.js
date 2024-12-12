import request from "supertest";
import app from "../app";
import { User } from "../models/user-schema.js";
import { HTTP_STATUS_CODE } from "../utils/http-status-codes.js";

jest.mock("../models/user-schema.js");

describe("User Controller Tests", () => {
  describe("POST /signup", () => {
    it("should return 400 if name, email, or password is missing", async () => {
      const res = await request(app)
        .post("/signup")
        .send({ name: "", email: "", password: "" });

      expect(res.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.body.message).toBe(
        "All fields are required: name, email, and password."
      );
    });

    it("should return 409 if email already exists", async () => {
      User.findOne.mockResolvedValueOnce({});

      const res = await request(app).post("/signup").send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "Password@123",
      });

      expect(res.status).toBe(HTTP_STATUS_CODE.CONFLICT);
      expect(res.body.message).toBe("User already exists.");
    });

    it("should return 201 and user data when signup is successful", async () => {
      const mockUser = {
        _id: "12345",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "Password@123",
        getJWTToken: jest.fn().mockReturnValue("mockToken"),
      };

      User.findOne.mockResolvedValueOnce(null);
      User.create.mockResolvedValueOnce(mockUser);

      const res = await request(app).post("/signup").send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "Password@123",
      });

      expect(res.status).toBe(HTTP_STATUS_CODE.CREATED);
      expect(res.body.message).toBe("User signed up successfully.");
      expect(res.body.data.user.name).toBe("John Doe");
      expect(res.body.data.token).toBe("mockToken");
    });

    it("should return 500 if there is an internal server error", async () => {
      User.create.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const res = await request(app).post("/signup").send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "Password@123",
      });

      expect(res.status).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(res.body.message).toBe("Database connection failed");
    });
  });

  describe("POST /signin", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app)
        .post("/signin")
        .send({ email: "", password: "" });

      expect(res.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.body.message).toBe(
        "All fields are required: email, and password."
      );
    });

    it("should return 401 if user does not exist", async () => {
      User.findOne.mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/signin")
        .send({ email: "johndoe@example.com", password: "Password@123" });

      expect(res.status).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("should return 401 if password does not match", async () => {
      const mockUser = {
        _id: "12345",
        email: "johndoe@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValueOnce(mockUser);

      const res = await request(app)
        .post("/signin")
        .send({ email: "johndoe@example.com", password: "WrongPassword@123" });

      expect(res.status).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("should return 200 and a token when signin is successful", async () => {
      const mockUser = {
        _id: "12345",
        email: "johndoe@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
        getJWTToken: jest.fn().mockReturnValue("mockToken"),
      };

      User.findOne.mockResolvedValueOnce(mockUser);

      const res = await request(app)
        .post("/signin")
        .send({ email: "johndoe@example.com", password: "Password@123" });

      expect(res.status).toBe(HTTP_STATUS_CODE.OK);
      expect(res.body.message).toBe("User signed in successfully.");
      expect(res.body.token).toBe("mockToken");
    });

    it("should return 500 if there is an internal server error", async () => {
      User.findOne.mockRejectedValueOnce(new Error("Database query failed"));

      const res = await request(app)
        .post("/signin")
        .send({ email: "johndoe@example.com", password: "Password@123" });

      expect(res.status).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(res.body.message).toBe("Database query failed");
    });
  });
});
