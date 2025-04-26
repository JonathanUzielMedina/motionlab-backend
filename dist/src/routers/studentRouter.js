"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const studentRouter = (0, express_1.Router)();
studentRouter.get("/", studentController_1.getAllStudents);
exports.default = studentRouter;
