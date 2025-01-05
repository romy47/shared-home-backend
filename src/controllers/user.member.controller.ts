import { Response } from "express";
import { BadRequestError } from "../models/api-error";
import { SuccessResponse } from "../models/api-response";
import IRequest from "../models/request";
import { UserRepository } from "../models/user-repository";

export class UserMemberController {
  private userRepository: UserRepository;


  constructor() {
    this.userRepository = new UserRepository();
  }

  getUsersByUsername=async(req: IRequest, res: Response)=> {
    const username = req.query.username as string;

    if (!username) {
      throw new BadRequestError('username not valid')
    }
    const users = this.userRepository.findUserByUsername(username);
    new SuccessResponse('Success',users).send(res);
  }

}

const userMemberController = new UserMemberController();
export {userMemberController}