"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const simController_1 = require("../controllers/simController");
const simRouter = (0, express_1.Router)();
simRouter.post("/:id", simController_1.calculateSimulation);
exports.default = simRouter;
