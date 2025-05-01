"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamController_1 = require("../controllers/teamController");
const teamRouter = (0, express_1.Router)();
teamRouter.post("/", teamController_1.createTeam);
teamRouter.get("/", teamController_1.getAllTeams);
exports.default = teamRouter;
