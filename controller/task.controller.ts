import { Response } from "express";
import { IProject, ProjectModel } from "../model/project.model";
import { ITask, TaskModel } from "../model/task.model";
import { UserModel } from "../model/user.model";
import { TypedRequest, Para } from "../types/types";

interface MyToken {
  isAdmin: boolean;
  projects?: [IProject];
}
export const createTask = async (
  req: TypedRequest<never, never, ITask>,
  res: Response
) => {
  const { name, project, status, developer } = req.body;
  let user;
  try {
    const userData = req.userData as MyToken;
    const proj = await ProjectModel.findById(project);
    // console.log();
    if (!proj)
      res
        .status(404)
        .json({ message: "Couldn't find the project with the given id." });
    if (!userData.projects?.some((leader) => leader.leader == proj?.leader))
      res.status(401).json("unauthorized");
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
      developer: developer?.push(...developer),
    });
    await task.save();
    res.status(201).json({ task: task, message: "Task created succesfully." });
  } catch (error) {}
};

export const updateTask = async (
  req: TypedRequest<Para, never, ITask>,
  res: Response
) => {
  const id = req.params.id;
  console.log(id, "ho");
  const { name, project, status, developer } = req.body;
  let user;
  try {
    const userData = req.userData as MyToken;
    console.log(userData);
    console.log(userData?.projects, "userdata from token");
    const proj = await ProjectModel.findById(project);
    console.log(proj?.leader?.toString(), "gg");
    // console.log();
    if (!proj)
      return res
        .status(404)
        .json({ message: "Couldn't find the project with the given id." });
    if (
      !userData.projects?.some((leader) => {
        const valid = leader.leader == proj?.leader?.toString();
        return valid;
      })
    )
      return res.status(401).json("unauthorized bhayo");
    if (developer) {
      user = await UserModel.findById(developer);
      if (!user)
        return res
          .status(404)
          .json({ message: "Couldn't find the user with the given id." });
    }
    const task = await TaskModel.findById(id);
    task!.status = status;
    task!.developer?.push(...developer!);
    await task?.save();
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json("internal sever error.");
  }
};
