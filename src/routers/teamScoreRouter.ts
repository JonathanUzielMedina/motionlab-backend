import { Router } from "express";
import { getTeamScoreById } from "../controllers/teamScoreController";

const teamScoreRouter: Router = Router();

teamScoreRouter.get("/:id", getTeamScoreById);

export default teamScoreRouter;
