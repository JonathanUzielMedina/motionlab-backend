import { Router } from "express";
import {
  getAllRounds,
  getRoundById,
  createRound,
  getMostRecentRound,
} from "../controllers/RoundController";

const roundRouter: Router = Router();

roundRouter.get("/", getAllRounds);
roundRouter.post("/", createRound);
roundRouter.get("/current/:id", getMostRecentRound);

export default roundRouter;
