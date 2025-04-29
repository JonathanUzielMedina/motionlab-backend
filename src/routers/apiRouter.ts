import { Router, Request, Response } from "express";
import authRouter from "./authRouter";
import teacherRouter from "./teacherRouter";
import teamStatsRouter from "./teamStatsRouter";
import studentRouter from "./studentRouter";
import studentScoreRouter from "./studentScoreRouter";
import teamScoreRouter from "./teamScoreRouter";
import lobbyRouter from "./lobbyRouter";
import teamRouter from "./teamRouter";
import simRouter from "./simRouter";
import matchRouter from "./matchRouter";
import roundRouter from "./RoundRouter";
import studentTeamRouter from "./StudentTeamRouter";
const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/teacher", teacherRouter);
apiRouter.use("/teamstats", teamStatsRouter);
apiRouter.use("/student", studentRouter);
apiRouter.use("/studentscores", studentScoreRouter);
apiRouter.use("/teamscores", teamScoreRouter);
apiRouter.use("/lobby", lobbyRouter);
apiRouter.use("/team", teamRouter);
apiRouter.use("/sim", simRouter);
apiRouter.use("/match", matchRouter);
apiRouter.use("/round", roundRouter);
apiRouter.use("/st", studentTeamRouter);

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Api Root");
});

export default apiRouter;
