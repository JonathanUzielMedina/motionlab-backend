import { Router } from "express";
import { getStudentScoresById, createStudentScores } from "../controllers/studentScoreController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentScoresById);
studentScoreRouter.get("/", createStudentScores);

export default studentScoreRouter;
