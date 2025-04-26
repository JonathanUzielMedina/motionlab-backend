import { Router } from "express";
import { getAllTeamStats } from "../controllers/teamStatsController";

const teamStatsRouter: Router = Router();

teamStatsRouter.get("/", getAllTeamStats);

export default teamStatsRouter;
