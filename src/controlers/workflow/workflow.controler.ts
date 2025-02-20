import dayjs from "dayjs";

import { serve } from "@upstash/workflow/express";
import { Subscription } from "../../models";
import { WorkflowContext } from "@upstash/workflow";

const reminders = [7, 5, 2, 1];

type CustomWorkflowContext = WorkflowContext<{ subscriptionId: string }>;

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

  for (const daysBefore of reminders) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    const label = `Reminder ${daysBefore} days before`;

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, label, reminderDate);
    }
    await triggerReminder(context, label);
  }
});

const fetchSubscription = async (
  context: CustomWorkflowContext,
  subscriptionId: string
) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate({
      path: "user",
      select: "name email",
    });
  });
};

const sleepUntilReminder = async (
  context: CustomWorkflowContext,
  label: string,
  date: dayjs.Dayjs
) => {
  console.log(`Sleep until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: CustomWorkflowContext,
  label: string
) => {
  return await context.run(label, () => {
    console.log(`Tringgering ${label} reminder`);
    //Send email, or sms or push  notifkation
  });
};
