"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoundController_1 = require("../controllers/RoundController");
const roundRouter = (0, express_1.Router)();
roundRouter.get("/", RoundController_1.getAllRounds);
roundRouter.get("/:id", RoundController_1.getRoundById);
roundRouter.post("/", RoundController_1.createRound);
exports.default = roundRouter;
