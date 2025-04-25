import { Router } from "express";
import { teacherAuthentication } from "../controllers/authController";

const authRouter: Router = Router();

authRouter.post("/teacher", teacherAuthentication);

export default authRouter;
