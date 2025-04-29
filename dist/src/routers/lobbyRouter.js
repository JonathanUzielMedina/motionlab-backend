"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lobbyController_1 = require("../controllers/lobbyController");
const lobbyRouter = (0, express_1.Router)();
lobbyRouter.get("/", lobbyController_1.getLobbyTeams);
lobbyRouter.get("/:id", lobbyController_1.lobbyAccess);
lobbyRouter.delete("/:id", lobbyController_1.deleteTeamFromLobby);
exports.default = lobbyRouter;
