import { Router } from "express";
import { calculateSimulation } from "../controllers/simController";

const simRouter: Router = Router();

simRouter.post("/", calculateSimulation);

export default simRouter;
