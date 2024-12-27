import { Router } from "express";
import { authController } from "../controllers/auth";
import restricted from "../middlewares/auth-middleware";
import catchAsyncError from "../middlewares/async-error-handler";

const authRrouter: Router = Router();
authRrouter
  .route("/")
  .get(catchAsyncError(restricted), catchAsyncError(authController.test));

authRrouter
  .route("/register")
  .post(catchAsyncError(authController.register)); //for testing, omitting the user header check, we need user here as well.


export default authRrouter;
