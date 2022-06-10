import { NextFunction, Response } from "express";
import { IProject, ProjectModel } from "../model/project.model";
import { ITask, TaskModel } from "../model/task.model";
import { UserModel } from "../model/user.model";
import HttpError from "../services/http.error";
import { TypedRequest, Para } from "../types/types";

interface MyToken {
  isAdmin: boolean;
  projects?: [IProject];
}
export const createTask = async (
  req: TypedRequest<never, never, ITask>,
  res: Response,
  next: NextFunction
) => {
  const { name, project, status, developer } = req.body;
  let user;
  try {
    const userData = req.userData as MyToken;
    const proj = await ProjectModel.findById(project);

    console.log(userData);
    if (!proj) {
      const err = new HttpError(
        "Couldn't find the project with the given id.",
        404
      );
      return next(err);
    }
    if (!userData.projects?.some((leader) => leader.leader == proj?.leader)) {
      const err = new HttpError("Unauthorized.", 401);
      return next(err);
    }
    if (developer) {
      user = await UserModel.findOne({ _id: developer });
      if (!user) {
        const err = new HttpError(
          "Couldn't find the user with the given id.",
          404
        );
        return next(err);
      }
    }
    const task = new TaskModel({
      name,
      project,
      status,
      developer: developer?.push(...developer),
    });
    await task.save();
    res.status(201).json({ task: task, message: "Task created succesfully." });
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};

export const updateTask = async (
  req: TypedRequest<Para, never, ITask>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { name, project, status, developer } = req.body;
  let user;
  try {
    const userData = req.userData as MyToken;
    const proj = await ProjectModel.findById(project);
    // console.log();
    if (!proj) {
      const err = new HttpError(
        "Couldn't find the project with the given id.",
        404
      );
      return next(err);
    }
    if (
      !userData.projects?.some((leader) => {
        const valid = leader.leader == proj?.leader?.toString();
        return valid;
      })
    )
      return res.status(401).json("unauthorized bhayo");
    if (developer) {
      user = await UserModel.findById(developer);
      if (!user) {
        const err = new HttpError(
          "Couldn't find the user with the given id.",
          404
        );
        return next(err);
      }
    }
    const task = await TaskModel.findById(id);
    task!.status = status;
    task!.developer?.push(...developer!);
    await task?.save();
    return res.status(200).json(task);
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};
