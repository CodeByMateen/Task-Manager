import { HTTP_STATUS_CODE } from "../utils/http-status-codes.js";
import User from "../models/user-schema.js";

export const signUP = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "All fields are required: name, email, and password.",
      });
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(HTTP_STATUS_CODE.CONFLICT).json({
        message: "User already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    user.password = undefined;
    const token = user.getJWTToken();

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      message: "User signed up successfully.",
      data: { user, token },
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

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "All fields are required: email, and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        message: "Invalid email or password.",
      });
    }

    const token = user.getJWTToken();

    return res.status(HTTP_STATUS_CODE.OK).json({
      message: "User signed in successfully.",
      token,
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
