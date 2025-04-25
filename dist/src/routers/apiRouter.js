"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const teacherRouter_1 = __importDefault(require("./teacherRouter"));
const apiRouter = (0, express_1.Router)();
apiRouter.use("/auth", authRouter_1.default);
apiRouter.use("/teacher", teacherRouter_1.default);
apiRouter.get("/", (req, res) => {
    res.send("Api Root");
});
exports.default = apiRouter;
