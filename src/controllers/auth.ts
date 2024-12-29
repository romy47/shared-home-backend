import {  Response, NextFunction } from "express";
import {  CreatedResponse, SuccessResponse } from "../models/api-response";
import IRequest from "../models/request";
import {  PrismaClient, Role, User } from "@prisma/client";
import { BadRequestError, InternalError, NotFoundError, UnprocessableEntityError } from "../models/api-error";


const prisma = new PrismaClient();

class AuthController {
  async getMyProfile(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    console.log(req.user) 
    new SuccessResponse("Success", { data:req.user }).send(res);
  }

  async register(req: IRequest, res: Response): Promise<void> {
    try {
      const { first_name, last_name, email, auth_id, birthday, profile_img } = req.body;
  
      // Validate input (basic example, expand as needed)
      if (!auth_id || !email) {
        throw new BadRequestError('auth_id and email are required' )
      }
  
      // Check if the user already exists
      const existingUser:User|null = await prisma.user.findUnique({
        where: { auth_id:auth_id },
      });
  
      if (existingUser) {
        throw new UnprocessableEntityError('User already exists');
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
      throw new InternalError('Error creating new user')
    }
}

async updateProfile(req: IRequest, res: Response): Promise<void> {
  try {
    const {  first_name, last_name, email, birthday, profile_img } = req.body;

    // Update the user
    const updatedUser: User = await prisma.user.update({
      where: { auth_id:req.user.auth_id },
      data: {
        first_name: first_name ?? req.user.first_name,
        last_name: last_name ?? req.user.last_name,
        email: email ?? req.user.email,
        birthday: birthday ? new Date(birthday) : req.user.birthday,
        profile_img: profile_img ?? req.user.profile_img,
      },
    });

    // Return the updated user
    new SuccessResponse('Profile updated successfully', { data: updatedUser }).send(res);
    return;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new InternalError('Error updating user profile');
  }
}



  async getAllRoles(req: IRequest, res: Response) {
    try {
      const roles = await prisma.role.findMany();
      new SuccessResponse("Success", { data:roles }).send(res);
    } catch (error) {
      console.error(error);
      throw new InternalError('Failed to retrieve roles')
    }
  };

  async createRole(req: IRequest, res: Response) {
    const { title, role } = req.body;
  
    try {
      if (!title || !role) {
        throw new BadRequestError('Title and role are required');
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
      throw new InternalError('Failed to create role')
    }
  }

  async updateRole(req: IRequest, res: Response) {
    const { id } = req.params;
    const { title, role } = req.body;

    if(!id){
      throw new BadRequestError("id is invalid")
    }
  
    try {
      const existingRole = await this.getRoleElseThrow(id);
  
      const updatedRole = await prisma.role.update({
        where: { id: parseInt(id) },
        data: {
          title: title ?? existingRole.title, // Keep existing title if not provided
          role: role ?? existingRole.role,    // Keep existing role if not provided
        },
      });
      return new SuccessResponse('Success',{data:updatedRole})
    } catch (error) {
      console.error(error);

      throw new InternalError('Failed to update role')
    }
  }

  async deleteRole (req: IRequest, res: Response) {
    const { id } = req.params;

    if(!id){
      throw new BadRequestError("id is invalid")
      
    }
  
    try {
      await this.getRoleElseThrow(id);
  
      await prisma.role.delete({
        where: { id: parseInt(id) },
      });
  
      return new SuccessResponse('Success',{data:'Role deleted successfully'})
    } catch (error) {
      console.error(error);
      throw new InternalError('Failed to delete role')
    }
  }

  async getRoleElseThrow(id:string):Promise<Role>{
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
    });

    if (!role) {
      throw new NotFoundError('Role not found')
    }
    return role;
  }
}

export const authController = new AuthController();
