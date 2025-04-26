import { Router, Request, Response } from "express";
import authRouter from "./authRouter";
import teacherRouter from "./teacherRouter";
import teamStatsRouter from "./teamStatsRouter";
import studentRouter from "./studentRouter";
import studentScoreRouter from "./studentScoreRouter";
import teamScoreRouter from "./teamScoreRouter";
import lobbyRouter from "./lobbyRouter";
const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/teacher", teacherRouter);
apiRouter.use("/teamstats", teamStatsRouter);
apiRouter.use("/student", studentRouter);
apiRouter.use("/studentscores", studentScoreRouter);
apiRouter.use("/teamscores", teamScoreRouter);
apiRouter.use("/lobby", lobbyRouter);

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Api Root");
});

export default apiRouter;
