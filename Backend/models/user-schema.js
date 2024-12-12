import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Task from "./task-schema.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minLength: [3, "Name must contain atleast 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: [8, "Password must contain at least 8 characters"],
    select: false,
    validate: {
      validator: function (value) {
        return (
          /[A-Z]/.test(value) &&
          /\d/.test(value) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(value)
        );
      },
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// CASCADE DELETE TASKS WHEN A USER IS REMOVED
userSchema.pre("remove", async function (next) {
  try {
    await Task.deleteMany({ userId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// HASH PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// GENERATE A TOKEN FOR AUTHENTICATION
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);

export default User;
