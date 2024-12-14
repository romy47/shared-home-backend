import { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../models/api-response";
import IRequest from "../models/request";

class AuthController {
  async test(req: IRequest, res: Response, next: NextFunction): Promise<void> {
    new SuccessResponse("Success", { "result:": "token is valid!" }).send(res);
  }
}

export const authController = new AuthController();
