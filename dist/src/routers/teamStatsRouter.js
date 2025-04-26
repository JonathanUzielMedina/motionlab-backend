"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamStatsController_1 = require("../controllers/teamStatsController");
const teamStatsRouter = (0, express_1.Router)();
teamStatsRouter.get("/", teamStatsController_1.getAllTeamStats);
exports.default = teamStatsRouter;
