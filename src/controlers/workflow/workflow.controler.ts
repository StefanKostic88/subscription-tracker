import dayjs from "dayjs";
import { WorkflowContext } from "@upstash/workflow";
import { serve } from "@upstash/workflow/express";
import { Subscription } from "../../models";

type CustomWorkflowContext = WorkflowContext<{ subscriptionId: any }>;

export const sendReminders = serve(async (context: CustomWorkflowContext) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal Date has past for subscription with this id: ${subscriptionId}. Stopping workflow`
    );

    return;
  }
});

const fetchSubscription = async (
  context: CustomWorkflowContext,
  subscriptionId: string
) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate({
      path: "user",
      select: "name email",
    });
  });
};
