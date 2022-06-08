import express from "express";
import { createTask } from "../controller/task.controller";
const router = express.Router();

router.post("/create", createTask);

export default router;
