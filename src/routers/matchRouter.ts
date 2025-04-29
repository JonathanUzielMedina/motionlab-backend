import { Router } from "express";
import { getAllMatches,createMatch,getMatchById,getMatchesByTeacherId } from "../controllers/MatchController";


const matchRouter: Router = Router();

matchRouter.post("/", createMatch);

matchRouter.get("/", getAllMatches);

matchRouter.get("/:id", getMatchById);

matchRouter.get("/teacher/:id", getMatchesByTeacherId);

export default matchRouter;
