import { Router } from "express";
import {
  getStudentScoresById,
  createStudentScores,
  getStudentScoreByRound,
  deleteAllStudentScores,
} from "../controllers/studentScoreController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentScoresById);
studentScoreRouter.get("/:id", getStudentScoreByRound);
studentScoreRouter.post("/", createStudentScores);
studentScoreRouter.delete("/", deleteAllStudentScores);
export default studentScoreRouter;
