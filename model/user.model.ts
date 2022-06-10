import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  designation?: string;
  project?: [string];
  tasks?: [string];
}

interface IUserMethods {
  toJSON(): Omit<IUser, "password">;
}

type User = Model<IUser, {}, IUserMethods>;
// !~

const userSchema = new Schema<IUser, User, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    designation: {
      type: String,
      enum: ["Intern", "Junior", "Mid", "Senior"],
      default: "Intern",
    },
    project: [{ type: mongoose.Types.ObjectId, ref: "project" }],
    tasks: [{ type: mongoose.Types.ObjectId, ref: "task" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.toJSON = function (): Omit<IUser, "password"> {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const UserModel = mongoose.model<IUser, User>("user", userSchema);
