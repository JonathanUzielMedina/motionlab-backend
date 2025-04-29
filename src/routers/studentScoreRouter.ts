import { Router } from "express";
import {
  getStudentScoresById,
  createStudentScores,
  getAllStudentScore,
  deleteAllStudentScores,
} from "../controllers/studentScoreController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentScoresById);
studentScoreRouter.get("/", getAllStudentScore);
studentScoreRouter.post("/", createStudentScores);
studentScoreRouter.delete("/", deleteAllStudentScores);
export default studentScoreRouter;
