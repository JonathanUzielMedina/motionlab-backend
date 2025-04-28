import { Router } from "express";
import { getAllRounds, getRoundById } from "../controllers/RoundController";


const roundRouter: Router = Router();

roundRouter.get("/", getAllRounds);
roundRouter.get("/:id", getRoundById);

export default roundRouter;




