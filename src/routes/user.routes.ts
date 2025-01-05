import { Router } from "express";
import { authController } from "../controllers/auth";
import restricted from "../middlewares/auth-middleware";
import catchAsyncError from "../middlewares/async-error-handler";
import { userMemberController } from "../controllers/user.member.controller";

const userRouter: Router = Router();
userRouter
  .route("/find")
  .get(catchAsyncError(restricted), catchAsyncError(userMemberController.getUsersByUsername));

export {userRouter}
