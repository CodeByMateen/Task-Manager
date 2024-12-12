import { HTTP_STATUS_CODE } from "../utils/http-status-codes.js";
import jwt from "jsonwebtoken";
import User from "../models/user-schema.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json({ message: "Token is missing, User not authorized" });
    }

    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json({ message: "Invalid token, User not authorized" });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json({ message: "User not found, User not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export default authMiddleware;
