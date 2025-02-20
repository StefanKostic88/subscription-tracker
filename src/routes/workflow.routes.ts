import { Router } from "express";
import { sendReminders } from "../controlers";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter;
