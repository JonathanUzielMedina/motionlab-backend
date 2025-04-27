"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MatchController_1 = require("../controllers/MatchController");
const MatchController_2 = require("../controllers/MatchController");
const matchRouter = (0, express_1.Router)();
matchRouter.post("/", MatchController_2.createMatch);
matchRouter.get("/", MatchController_1.getAllMatches);
exports.default = matchRouter;
