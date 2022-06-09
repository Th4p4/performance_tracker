import express from "express";
import { createTask, updateTask } from "../controller/task.controller";
import checkAuth from "../middleware/check.auth";
const router = express.Router();

router.use(checkAuth);
router.post("/create", createTask);
router.patch("/update/:id", updateTask);

export default router;
