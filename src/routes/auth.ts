import { Router } from "express";
import { authController } from "../controllers/auth";
import restricted from "../middlewares/auth-middleware";
import catchAsyncError from "../middlewares/async-error-handler";

const authRouter: Router = Router();
authRouter
  .route("/me")
  .get(catchAsyncError(restricted), catchAsyncError(authController.getMyProfile));

  authRouter
  .route("/register")
  .post(catchAsyncError(authController.register)); //not passing the middleware, as middlware will create the user.

authRouter
  .route("/roles")
  .get(catchAsyncError(restricted), catchAsyncError(authController.getAllRoles))
  .post(catchAsyncError(restricted), catchAsyncError(authController.createRole));


authRouter
  .route('/roles/:id')
  .post(catchAsyncError(restricted), catchAsyncError(authController.updateRole))
  .delete(catchAsyncError(restricted), catchAsyncError(authController.deleteRole))



export default authRouter;
