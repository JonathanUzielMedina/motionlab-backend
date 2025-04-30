import { Router } from "express";
import {
  calculateSimulation,
  isSimulationReady,
} from "../controllers/simController";

const simRouter: Router = Router();

simRouter.post("/", calculateSimulation);

simRouter.get("/", isSimulationReady);

export default simRouter;
