import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  designation?: string;
  project?: [string];
  tasks?: [string];
}

// !~

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: {
      type: String,
      enum: ["developer", "lead", "Admin"],
      default: "developer",
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

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const UserModel = mongoose.model<IUser>("user", userSchema);
