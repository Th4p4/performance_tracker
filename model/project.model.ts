import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.model";

const Schema = mongoose.Schema;

export interface IProject {
  _id?: string;
  name: string;
  leader: IUser["_id"];
  tasks?: [mongoose.Types.ObjectId];
  status: string;
}

// type User = Model<IUser, {}, IUserMethods>;

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    leader: { type: mongoose.Types.ObjectId, required: true },
    tasks: [{ type: mongoose.Types.ObjectId }],
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

export const ProjectModel = mongoose.model<IProject>("project", projectSchema);
