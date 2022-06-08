import express from "express";
import {
  createProject,
  getProjectDetails,
} from "../controller/project.controller";
const router = express.Router();

// router.get("/", getUsers);
router.post("/create", createProject);
router.get("/:id", getProjectDetails);
// router.post("/login", logIn);

export default router;
