import { Router } from "express";
import { changeTeamStatus, createTeam } from "../controllers/teamController";

const teamRouter: Router = Router();

teamRouter.patch("/:id", changeTeamStatus);

teamRouter.post("/", createTeam);

export default teamRouter;
