import { NextFunction, Response } from "express";
import { IProject, ProjectModel } from "../model/project.model";
import HttpError from "../services/http.error";
import { TypedRequest, Para } from "../types/types";

export const createProject = async (
  req: TypedRequest<never, never, IProject>,
  res: Response,
  next: NextFunction
) => {
  const { name, leader, tasks, status } = req.body;
  try {
    const project = new ProjectModel({
      name,
      leader,
      tasks: tasks || [],
      status,
    });
    await project.save();
    res
      .status(201)
      .json({ project: project, message: "succesfully created project" });
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};

export const getProjectDetails = async (
  req: TypedRequest<Para, never, never>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  console.log(id);
  try {
    const project = await ProjectModel.findById(id).populate({
      path: "leader",
      select: "name -_id",
    });
    if (!project) {
      const err = new HttpError(
        "Project doesn't exists for the given id.",
        404
      );
      return next(err);
    }
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};
