import { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";

interface TypedRequest<P extends core.ParamsDictionary, U extends core.Query, T>
  extends Request {
  body: T;
  query: U;
  params: P;
  userData?: string | JwtPayload;
}
interface Para extends core.ParamsDictionary {
  id: string;
}
