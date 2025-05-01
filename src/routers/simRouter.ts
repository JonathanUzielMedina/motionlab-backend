import { Router } from "express";
import {
  calculateSimulation,
  isSimulationReady,
} from "../controllers/simController";

const simRouter: Router = Router();

simRouter.post("/", calculateSimulation);

simRouter.get("/:round_id", isSimulationReady);

export default simRouter;
