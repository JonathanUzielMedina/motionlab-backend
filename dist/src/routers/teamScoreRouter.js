"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamScoreController_1 = require("../controllers/teamScoreController");
const teamScoreRouter = (0, express_1.Router)();
teamScoreRouter.get("/:id", teamScoreController_1.getTeamScoreById);
teamScoreRouter.post("/", teamScoreController_1.createTeamScore);
exports.default = teamScoreRouter;
