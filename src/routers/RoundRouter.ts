import { Router } from "express";
import {
  getAllRounds,
  getRoundById,
  createRound,
  getMostRecentRound,
} from "../controllers/RoundController";

const roundRouter: Router = Router();

roundRouter.get("/", getAllRounds);
roundRouter.get("/:id", getRoundById);
roundRouter.post("/", createRound);
roundRouter.get("/current", getMostRecentRound);

export default roundRouter;
