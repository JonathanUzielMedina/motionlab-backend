import { Router } from "express";
import {
  createTeacher,
  getAllTeachers,
} from "../controllers/teacherController";

const teacherRouter: Router = Router();

teacherRouter.post("/", createTeacher);

teacherRouter.get("/", getAllTeachers);

export default teacherRouter;
