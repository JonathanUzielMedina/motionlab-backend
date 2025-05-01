import { Router } from "express";
import { getAllTeamStats } from "../controllers/teamStatsController";
import { createTeam } from "../controllers/teamController";

const teamStatsRouter: Router = Router();

teamStatsRouter.get("/", getAllTeamStats);

teamStatsRouter.post("/:round_id", createTeam);

export default teamStatsRouter;
