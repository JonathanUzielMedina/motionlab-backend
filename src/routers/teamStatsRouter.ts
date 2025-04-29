import { Router } from "express";
import { getAllTeamStats } from "../controllers/teamStatsController";
import { createTeam } from "../controllers/teamController";

const teamStatsRouter: Router = Router();

teamStatsRouter.get("/", getAllTeamStats);

teamStatsRouter.post("/", createTeam);


export default teamStatsRouter;
