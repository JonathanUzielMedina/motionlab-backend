import { Router, Request, Response } from "express";
import authRouter from "./authRouter";
import teacherRouter from "./teacherRouter";
const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/teacher", teacherRouter);

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Api Root");
});

export default apiRouter;
