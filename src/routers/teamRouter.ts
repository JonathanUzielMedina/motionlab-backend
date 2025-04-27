import { Router } from "express";
import { changeTeamStatus } from "../controllers/teamController";

const teamRouter: Router = Router();

teamRouter.patch("/:id", changeTeamStatus);

teamRouter.post("/");

export default teamRouter;
