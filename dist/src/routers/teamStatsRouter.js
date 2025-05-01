"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamStatsController_1 = require("../controllers/teamStatsController");
const teamController_1 = require("../controllers/teamController");
const teamStatsRouter = (0, express_1.Router)();
teamStatsRouter.get("/", teamStatsController_1.getAllTeamStats);
teamStatsRouter.post("/:round_id", teamController_1.createTeam);
exports.default = teamStatsRouter;
