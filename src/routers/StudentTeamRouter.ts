import { Router } from "express";
import {
  getStudentTeamById,
  registerStudents,
} from "../controllers/StudentTeamController";

const studentTeamRouter: Router = Router();

studentTeamRouter.get("/:id", getStudentTeamById);

studentTeamRouter.post("/", registerStudents);

export default studentTeamRouter;
