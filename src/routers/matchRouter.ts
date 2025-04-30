import { Router } from "express";
import {
  getAllMatches,
  createMatch,
  getMatchesByTeacherId,
  getMatchByCode,
  getMatchParameters,
  changeMatchStatus,
  getMatchStatus,
} from "../controllers/MatchController";

const matchRouter: Router = Router();

matchRouter.post("/", createMatch);

matchRouter.get("/", getAllMatches);

matchRouter.get("/:id", getMatchParameters);

matchRouter.get("/teacher/:id", getMatchesByTeacherId);

matchRouter.get("/:code", getMatchByCode);

matchRouter.post("/status", changeMatchStatus);

matchRouter.get("/status/:match_id", getMatchStatus);

export default matchRouter;
