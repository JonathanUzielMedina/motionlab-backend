import { Router } from "express";
import {
  registerStudents,
  getStudentsByTeamId,
} from "../controllers/StudentTeamController";

const studentTeamRouter: Router = Router();

studentTeamRouter.get("/:id", getStudentsByTeamId);

studentTeamRouter.post("/", registerStudents);

export default studentTeamRouter;
