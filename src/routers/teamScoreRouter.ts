import { Router } from "express";
import {
  getTeamScoreById,
  createTeamScore,
  getTeamScoresByRound,
} from "../controllers/teamScoreController";

const teamScoreRouter: Router = Router();

teamScoreRouter.get("/:id", getTeamScoreById);

teamScoreRouter.post("/", createTeamScore);

teamScoreRouter.get("/:id", getTeamScoresByRound);

export default teamScoreRouter;
