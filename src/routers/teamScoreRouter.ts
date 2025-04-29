import { Router } from "express";
import {
  getTeamScoreById,
  createTeamScore,
} from "../controllers/teamScoreController";

const teamScoreRouter: Router = Router();

teamScoreRouter.get("/:id", getTeamScoreById);
teamScoreRouter.post("/", createTeamScore);

export default teamScoreRouter;
