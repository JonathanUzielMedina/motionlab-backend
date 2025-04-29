import { Router } from "express";
import {
  getTeamScoreById,
  createTeamScore,
  getAllTeamScores,
} from "../controllers/teamScoreController";

const teamScoreRouter: Router = Router();

teamScoreRouter.get("/:id", getTeamScoreById);

teamScoreRouter.post("/", createTeamScore);

teamScoreRouter.get("/", getAllTeamScores);

export default teamScoreRouter;
