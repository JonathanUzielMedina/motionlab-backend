import { Router } from "express";
import { getLobbyTeams, lobbyAccess } from "../controllers/lobbyController";

const lobbyRouter: Router = Router();

lobbyRouter.get("/", getLobbyTeams);

lobbyRouter.get("/:id", lobbyAccess);

export default lobbyRouter;
