import { Response, NextFunction } from "express";
import IRequest from "../models/request";
import { BadTokenError, AuthTokenExpiredError } from "../models/api-error";
import { firebaseAuth } from "../services/firebase";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NodeCache = require( "node-cache" );

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
  console.log('frotnend token is', token)
  try {
    const decodedToken = await firebaseAuth().verifyIdToken(token);
    // req.user = decodedToken;
    const firebase_user = decodedToken;
    

    //now check if the user exists in DB, if yes do nothing, otherwise create a db user now.
    const { user_id, email, name, picture } = firebase_user;
     // Check if the user exists in the database
     
     let user = await prisma.user.findUnique({
      where: { auth_id: user_id },
    });

     // If the user does not exist, create a new record in the database
     if (!user) {
      const [first_name, ...last_nameArr] = name.split(" ");
      const last_name = last_nameArr.join(" ");

      user = await prisma.user.create({
        data: {
          auth_id: user_id,
          email: email || null,
          first_name: first_name || null,
          last_name: last_name || null,
          profile_img:  null,
        },
      });
    }

    req.user = user;


    next();
  } catch (error) {
    console.log("error: ", error);
    throw new AuthTokenExpiredError();
  }
}
