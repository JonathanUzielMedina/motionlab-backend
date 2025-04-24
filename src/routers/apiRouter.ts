import { Router, Request, Response } from "express";
const apiRouter: Router = Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Api Root");
});

export default apiRouter;
