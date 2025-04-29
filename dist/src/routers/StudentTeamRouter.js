"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StudentTeamController_1 = require("../controllers/StudentTeamController");
const studentTeamRouter = (0, express_1.Router)();
studentTeamRouter.get("/:id", StudentTeamController_1.getStudentsByTeamId);
studentTeamRouter.post("/", StudentTeamController_1.registerStudents);
exports.default = studentTeamRouter;
