import { Router } from "express";
import {
  getStudentScoresById,
  createStudentScores,
  getStudentScoreByRound,
  deleteAllStudentScores,
  getAllStudentScores,
} from "../controllers/studentScoreController";

const studentScoreRouter: Router = Router();

studentScoreRouter.get("/:id", getStudentScoreByRound);
studentScoreRouter.get("/", getAllStudentScores);
studentScoreRouter.post("/", createStudentScores);
studentScoreRouter.delete("/", deleteAllStudentScores);
export default studentScoreRouter;
