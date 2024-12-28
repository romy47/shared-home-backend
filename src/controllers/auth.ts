import { Request, Response, NextFunction } from "express";
import { BadRequestResponse, CreatedResponse, InternalErrorResponse, NotFoundResponse, SuccessResponse } from "../models/api-response";
import IRequest from "../models/request";
import {  PrismaClient, User } from "@prisma/client";


const prisma = new PrismaClient();

class AuthController {
  async getMyProfile(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    console.log(req.user) 
    new SuccessResponse("Success", { data:req.user }).send(res);
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
      const newUser:User = await prisma.user.create({
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
      return;
    }
  }

  async getAllRoles(req: IRequest, res: Response) {
    try {
      const roles = await prisma.role.findMany();
      new SuccessResponse("Success", { data:roles }).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("InternalError", { error: 'Failed to retrieve roles' }).send(res);
    }
  };

  async createRole(req: IRequest, res: Response) {
    const { title, role } = req.body;
  
    try {
      if (!title || !role) {
        return new BadRequestResponse("BadRequest", { error: 'Title and role are required' }).send(res);
      }
  
      const newRole = await prisma.role.create({
        data: {
          title,
          role,
        },
      });
  
      new CreatedResponse("Created", { data: newRole }).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("InternalError", { error: 'Failed to create role' }).send(res);
    }
  }

  async updateRole(req: IRequest, res: Response) {
    const { id } = req.params;
    const { title, role } = req.body;

    if(!id){
      return new BadRequestResponse("id is invalid", { error: 'id is invalid' }).send(res);
    }
  
    try {
      const existingRole = await prisma.role.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingRole) {
        return new NotFoundResponse("NotFound", { error: 'Role not found' }).send(res);
      }
  
      const updatedRole = await prisma.role.update({
        where: { id: parseInt(id) },
        data: {
          title: title ?? existingRole.title, // Keep existing title if not provided
          role: role ?? existingRole.role,    // Keep existing role if not provided
        },
      });
  
      return res.status(200).json({ message: 'Role updated successfully', data: updatedRole });
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("InternalError", { error: 'Failed to update role' }).send(res);
    }
  }

  async deleteRole (req: IRequest, res: Response) {
    const { id } = req.params;

    if(!id){
      return new BadRequestResponse("id is invalid", { error: 'id is invalid' }).send(res);
    }
  
    try {
      const role = await prisma.role.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!role) {
        return new NotFoundResponse("NotFound", { error: 'Role not found' }).send(res);
      }
  
      await prisma.role.delete({
        where: { id: parseInt(id) },
      });
  
      return res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("InternalError", { error: 'Failed to delete role' }).send(res);
    }
  }
}

export const authController = new AuthController();
