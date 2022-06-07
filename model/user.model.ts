import mongoose, { HydratedDocument, Model } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

interface IUser {
  name: string;
  email: string;
  password: string;
  designation: string;
  project?: [string];
  tasks?: [string];
}

interface IUserMethods {
  generateHash(userPassword: string): string;
}

interface User extends Model<IUser, {}, IUserMethods> {
  comparePassword(
    userPassword: string,
    hashedpassword: string
  ): Promise<boolean>;
}

// type User = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, User, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: {
      type: String,
      enum: ["developer", "lead", "Admin"],
      default: "developer",
    },
    project: [{ type: mongoose.Types.ObjectId }],
    tasks: [{ type: mongoose.Types.ObjectId }],
  },
  {
    timestamps: true,
  }
);

userSchema.method(
  "generateHash",
  function generateHash(userPassword: string): string {
    const hashedpassword = bcrypt.hashSync(userPassword, 10);
    return hashedpassword;
  }
);
userSchema.static(
  "comparePassword",
  function comparePassword(
    userPassword: string,
    hashedpassword: string
  ): boolean {
    const isValid = bcrypt.compareSync(userPassword, hashedpassword);
    return isValid;
  }
);
export const UserModel = mongoose.model<IUser, User>("user", userSchema);
