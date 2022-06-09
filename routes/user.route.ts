import express, { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  createUser,
  logIn,
  signUp,
  updateDetails,
  userDetails,
} from "../controller/user.controller";
import checkAuth from "../middleware/check.auth";
const router = express.Router();

// router.get("/", getUsers);
router.post("/signup", signUp);
router.post("/login", logIn);
router.use(checkAuth);
router.get("/:id", userDetails);
router.patch("/update/:id", updateDetails);
router.post("/create", createUser);
export default router;
