"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamRouter = (0, express_1.Router)();
teamRouter.get("/lobby");
exports.default = teamRouter;
