"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoundController_1 = require("../controllers/RoundController");
const roundRouter = (0, express_1.Router)();
roundRouter.get("/", RoundController_1.getAllRounds);
roundRouter.post("/", RoundController_1.createRound);
roundRouter.get("/current/:id", RoundController_1.getMostRecentRound);
exports.default = roundRouter;
