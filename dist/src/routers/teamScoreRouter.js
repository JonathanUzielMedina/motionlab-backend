"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamScoreController_1 = require("../controllers/teamScoreController");
const teamScoreRouter = (0, express_1.Router)();
teamScoreRouter.post("/", teamScoreController_1.createTeamScore);
teamScoreRouter.get("/:id", teamScoreController_1.getTeamScoresByRound);
teamScoreRouter.get("/", teamScoreController_1.getAllTeamScores);
exports.default = teamScoreRouter;
