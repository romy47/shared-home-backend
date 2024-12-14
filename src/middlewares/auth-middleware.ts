import { Response, NextFunction } from "express";
import IRequest from "../models/request";
import { BadTokenError, AuthTokenExpiredError } from "../models/api-error";
import { firebaseAuth } from "../services/firebase";
export default async function restricted(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !(authHeader.split(" ")[0] === "Bearer")) {
    throw new BadTokenError();
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const decodedToken = await firebaseAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("error: ", error);
    throw new AuthTokenExpiredError();
  }
}
