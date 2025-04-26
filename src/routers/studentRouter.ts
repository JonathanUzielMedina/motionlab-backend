import { Router } from "express";
import { getAllStudents } from "../controllers/studentController";

const studentRouter: Router = Router();

studentRouter.get("/", getAllStudents)

export default studentRouter;
