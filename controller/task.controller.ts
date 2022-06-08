import { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { IProject, ProjectModel } from "../model/project.model";
import { ITask, TaskModel } from "../model/task.model";
import { UserModel } from "../model/user.model";

interface TypedRequest<P extends core.ParamsDictionary, U extends core.Query, T>
  extends Request {
  body: T;
  query: U;
  params: P;
}
interface Para extends core.ParamsDictionary {
  id: string;
}

export const createTask = async (
  req: TypedRequest<never, never, ITask>,
  res: Response
) => {
  const { name, project, status, developer } = req.body;
  let user, proj;
  try {
    proj = ProjectModel.findOne({ _id: project });
    if (!proj)
      res
        .status(404)
        .json({ message: "Couldn't find the project with the given id." });
    if (developer) {
      user = await UserModel.findOne({ _id: developer });
      if (!user)
        res
          .status(404)
          .json({ message: "Couldn't find the user with the given id." });
    }
    const task = new TaskModel({
      name,
      project,
      status,
      developer,
    });
    await task.save();
    res.status(201).json({ task: task, message: "Task created succesfully." });
  } catch (error) {}
};
