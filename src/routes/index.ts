import { Router } from "express";
import authRouter from "./auth";

const router: Router = Router();
router.use("/token-test/", authRouter);

export default router;
