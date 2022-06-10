import mongoose from "mongoose";
import { IProject } from "./project.model";
import { IUser } from "./user.model";

const Schema = mongoose.Schema;

export interface ITask {
  name: string;
  project: IProject["_id"];
  status: string;
  developer?: [IUser["_id"]];
}

// type User = Model<IUser, {}, IUserMethods>;

const taskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true },
    developer: [{ type: mongoose.Types.ObjectId }],
    project: [{ type: mongoose.Types.ObjectId, required: true }],
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const TaskModel = mongoose.model<ITask>("task", taskSchema);
