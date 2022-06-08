import express from "express";
import userRoutes from "./user.route";
import projectRoutes from "./project.route";
import taskRoutes from "./task.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);

export default router;
