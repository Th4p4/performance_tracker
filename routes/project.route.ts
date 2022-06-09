import express from "express";
import {
  createProject,
  getProjectDetails,
} from "../controller/project.controller";
const router = express.Router();
import checkAuth from "../middleware/check.auth";
// router.get("/", getUsers);
router.use(checkAuth);
router.post("/create", createProject);
router.get("/:id", getProjectDetails);
// router.post("/login", logIn);

export default router;
