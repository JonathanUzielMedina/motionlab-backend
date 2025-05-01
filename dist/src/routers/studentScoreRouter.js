"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentScoreController_1 = require("../controllers/studentScoreController");
const studentScoreRouter = (0, express_1.Router)();
studentScoreRouter.get("/:id", studentScoreController_1.getStudentScoreByRound);
studentScoreRouter.post("/", studentScoreController_1.createStudentScores);
studentScoreRouter.delete("/", studentScoreController_1.deleteAllStudentScores);
exports.default = studentScoreRouter;
