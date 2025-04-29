import { Router } from "express";
import {
  deleteTeamFromLobby,
  getLobbyTeams,
  lobbyAccess,
} from "../controllers/lobbyController";

const lobbyRouter: Router = Router();

lobbyRouter.get("/:matchId", getLobbyTeams);

lobbyRouter.get("/:id", lobbyAccess);

lobbyRouter.delete("/:id", deleteTeamFromLobby);

export default lobbyRouter;
