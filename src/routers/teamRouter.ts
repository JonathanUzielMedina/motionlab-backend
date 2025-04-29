import { Router } from "express";
import {
  changeTeamStatus,
  createTeam,
  getAllTeams,
} from "../controllers/teamController";

const teamRouter: Router = Router();

teamRouter.post("/", createTeam);

teamRouter.get("/", getAllTeams);

export default teamRouter;
