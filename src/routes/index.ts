import { Router } from "express";
import authRouter from "./auth";
import houseRouter from "./house.routes";
import { userRouter } from "./user.routes";

const router: Router = Router();
router.use("/auth/", authRouter);
router.use("/houses/", houseRouter);
router.use("/users/", userRouter);

export default router;
