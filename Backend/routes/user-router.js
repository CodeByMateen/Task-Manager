import express from "express";
import { signUP, signIn } from "../controllers/user-controller.js";

const router = express.Router();

router.post("/signup", signUP);
router.post("/signin", signIn);

export default router;
