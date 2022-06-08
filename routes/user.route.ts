import express from "express";
import { logIn, signUp, userDetails } from "../controller/user.controller";
const router = express.Router();

// router.get("/", getUsers);
router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/:id", userDetails);

export default router;
