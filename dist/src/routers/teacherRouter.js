"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("../controllers/teacherController");
const teacherRouter = (0, express_1.Router)();
teacherRouter.post("/", teacherController_1.createTeacher);
teacherRouter.get("/", teacherController_1.getAllTeachers);
exports.default = teacherRouter;
