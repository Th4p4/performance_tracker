import express from "express";
import { logIn, signUp } from "../controller/user.controller";
const router = express.Router();

// router.get("/", getUsers);
router.post("/signup", signUp);
router.post("/login", logIn);

export default router;
