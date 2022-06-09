import { Response } from "express";
import { IProject, ProjectModel } from "../model/project.model";
import { TypedRequest, Para } from "../types/types";

export const createProject = async (
  req: TypedRequest<never, never, IProject>,
  res: Response
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
    res.status(500).json("internal sever error.");
  }
};

export const getProjectDetails = async (
  req: TypedRequest<Para, never, never>,
  res: Response
) => {
  const id = req.params.id;
  console.log(id);
  try {
    const project = await ProjectModel.findById(id).populate({
      path: "leader",
      select: "name -_id",
    });
    if (!project)
      res
        .status(404)
        .json({ message: "Project doesn't exists for the given id." });
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error occured.");
  }
};
