import { Router } from "express";
import {
  deleteTeamFromLobby,
  getLobbyTeams,
  lobbyAccess,
} from "../controllers/lobbyController";

const lobbyRouter: Router = Router();

lobbyRouter.get("/teams/:matchId", getLobbyTeams);

lobbyRouter.get("/access/:code", lobbyAccess);

lobbyRouter.delete("/:id", deleteTeamFromLobby);

export default lobbyRouter;
