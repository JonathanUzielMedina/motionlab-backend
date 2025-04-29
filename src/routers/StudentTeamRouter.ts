import { Router } from "express";
import {
  registerStudents,
  getStudentsByTeamId,
} from "../controllers/StudentTeamController";

const studentTeamRouter: Router = Router();

studentTeamRouter.get("/:id", getStudentsByTeamId);


export default studentTeamRouter;
