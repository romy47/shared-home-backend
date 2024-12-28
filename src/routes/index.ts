import { Router } from "express";
import authRouter from "./auth";
import houseRouter from "./house.routes";

const router: Router = Router();
router.use("/auth/", authRouter);
router.use("/houses/", houseRouter);

export default router;
