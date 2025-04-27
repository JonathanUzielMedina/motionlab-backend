import { match } from "assert";
import { Router } from "express";
import { getAllMatches } from "../controllers/MatchController";
import { createMatch } from "../controllers/MatchController";

const matchRouter: Router = Router();

matchRouter.post("/", createMatch);

matchRouter.get("/", getAllMatches);

export default matchRouter;
