import { Router } from "express";
import {
  getTeamScoreById,
  createTeamScore,
  getTeamScoresByRound,
  getAllTeamScores,
} from "../controllers/teamScoreController";

const teamScoreRouter: Router = Router();

teamScoreRouter.post("/", createTeamScore);

teamScoreRouter.get("/:id", getTeamScoresByRound);

teamScoreRouter.get("/", getAllTeamScores);

export default teamScoreRouter;
