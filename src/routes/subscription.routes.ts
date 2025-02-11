import { Router, Request, Response } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req: Request, res: Response) => {
  res.send({
    test: "test",
  });
});

export default subscriptionRouter;
