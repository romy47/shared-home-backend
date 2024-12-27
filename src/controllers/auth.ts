import { Request, Response, NextFunction } from "express";
import { BadRequestResponse, CreatedResponse, InternalErrorResponse, SuccessResponse } from "../models/api-response";
import IRequest from "../models/request";
import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
class AuthController {
  async test(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    console.log(req.user) 
    new SuccessResponse("Success", { data:'token is valid' }).send(res);
  }

  async register(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { first_name, last_name, email, auth_id, birthday, profile_img } = req.body;
  
      // Validate input (basic example, expand as needed)
      if (!auth_id || !email) {
        new BadRequestResponse("Bad Request", { error: 'auth_id and email are required' }).send(res);
        return;
      }
  
      // Check if the user already exists
      const existingUser:User|null = await prisma.user.findUnique({
        where: { auth_id:auth_id },
      });
  
      if (existingUser) {
        new BadRequestResponse("Bad Request", { error: 'User already exists' }).send(res);
        return;
      }
  
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          auth_id,
          birthday: birthday ? new Date(birthday) : null,
          profile_img,
        },
      });
  
      // Return the created user
      new CreatedResponse("Created", { data:newUser }).send(res);
      return;
    } catch (error) {
      console.error('Error creating user:', error);
      new InternalErrorResponse("InternalError",{ error: 'Internal Server Error' } ).send(res);
    }
  }


  // async getProfile(req: IRequest, res: Response, next: NextFunction): Promise<void> {
  //   const { authId } = req.user; 
  //   try {
  //     const user = await prisma.user.findUnique({
  //       where: { auth_id: authId },
  //     });

  //     if (!user) {
  //       return new ErrorResponse('User not found', 404).send(res);
  //     }

  //     new SuccessResponse('Profile retrieved successfully', user).send(res);
  //   } catch (error) {
  //     console.error(error);
  //     next(error); // Pass error to middleware
  //   }
  // }
}

export const authController = new AuthController();
