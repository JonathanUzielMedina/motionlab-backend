import { Router } from "express";
import { getStudentTeamById } from "../controllers/StudentTeamController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentTeamById);

export default studentScoreRouter;
