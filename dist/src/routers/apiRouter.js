"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiRouter = (0, express_1.Router)();
apiRouter.get("/", (req, res) => {
    res.send("Api Root");
});
exports.default = apiRouter;
