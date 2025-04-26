import { Router } from "express";
import { getStudentScoresById } from "../controllers/studentScoreController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentScoresById);

export default studentScoreRouter;
