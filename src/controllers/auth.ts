import {  Response, NextFunction } from "express";
import {  CreatedResponse, SuccessResponse } from "../models/api-response";
import IRequest from "../models/request";
import { BadRequestError, InternalError, NotFoundError, UnprocessableEntityError } from "../models/api-error";
import { AuthRepository } from "../models/auth-repository";
import { User } from "@prisma/client";


class AuthController {
    private authRepo: AuthRepository;
  
    constructor() {
      this.authRepo = new AuthRepository();
    }

   getMyProfile = async(req: IRequest, res: Response, next: NextFunction): Promise<void>=> {
    console.log(req.user);
    new SuccessResponse("Success", { data: req.user }).send(res);
  }

   register=async(req: IRequest, res: Response): Promise<void> =>{
   
      const { first_name, last_name, email, auth_id, birthday, profile_img } = req.body;

      // Validate input (basic example, expand as needed)
      if (!auth_id || !email) {
        throw new BadRequestError('auth_id and email are required');
      }

      // Check if the user already exists
      const existingUser = await this.authRepo.getUserByAuthId(auth_id);

      if (existingUser) {
        throw new UnprocessableEntityError('User already exists');
      }

      // Create the user
      const newUser = await this.authRepo.createUser({
        first_name,
        last_name,
        email,
        auth_id,
        birthday: birthday ? new Date(birthday) : null,
        profile_img,
      });

      // Return the created user
      new CreatedResponse("Created", { data: newUser }).send(res);
    
  }

   updateProfile= async(req: IRequest, res: Response): Promise<void>=> {
    
      const { first_name, last_name, email, birthday, profile_img } = req.body;

      // Update the user
      const updatedUser:User = await this.authRepo.updateUser(req.user.auth_id, {
        first_name: first_name ?? req.user.first_name,
        last_name: last_name ?? req.user.last_name,
        email: email ?? req.user.email,
        birthday: birthday ? new Date(birthday) : req.user.birthday,
        profile_img: profile_img ?? req.user.profile_img,
      });

      // Return the updated user
      new SuccessResponse('Profile updated successfully', { data: updatedUser }).send(res);
    
  }



   getAllRoles=async(req: IRequest, res: Response): Promise<void>=> {
    
      const roles = await this.authRepo.getAllRoles();
      new SuccessResponse("Success", { data: roles }).send(res);
    
  }

   createRole=async(req: IRequest, res: Response): Promise<void>=> {
    const { title, role } = req.body;

    
      if (!title || !role) {
        throw new BadRequestError('Title and role are required');
      }

      const newRole = await this.authRepo.createRole({
        title,
        role,
      });

      new CreatedResponse("Created", { data: newRole }).send(res);
    
  }

   updateRole=async(req: IRequest, res: Response): Promise<void>=> {
    const { id } = req.params;
    const { title, role } = req.body;

    if (!id) {
      throw new BadRequestError("id is invalid");
    }

   
      const existingRole = await this.authRepo.getRoleById(parseInt(id));

      if (!existingRole) {
        throw new NotFoundError('Role not found');
      }

      const updatedRole = await this.authRepo.updateRole(parseInt(id), {
        title: title ?? existingRole.title,
        role: role ?? existingRole.role,
      });

      new SuccessResponse('Success', { data: updatedRole }).send(res);
    
  }

   deleteRole=async(req: IRequest, res: Response): Promise<void>=> {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("id is invalid");
    }

      await this.authRepo.getRoleById(parseInt(id));

      await this.authRepo.deleteRole(parseInt(id));

      new SuccessResponse('Success', { data: 'Role deleted successfully' }).send(res);
    
  }

}

export const authController = new AuthController();
