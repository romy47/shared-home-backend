import { Request } from "express";
import {  User } from "@prisma/client";
export default interface IRequest extends Request {
  user: User;
}
