import { Router } from "express";
import { getAllRounds, getRoundById,createRound } from "../controllers/RoundController";


const roundRouter: Router = Router();

roundRouter.get("/", getAllRounds);
roundRouter.get("/:id", getRoundById);
roundRouter.post("/", createRound);

export default roundRouter;




