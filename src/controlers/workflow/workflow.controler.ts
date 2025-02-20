import dayjs from "dayjs";

import { serve } from "@upstash/workflow/express";
import { Subscription } from "../../models";

const reminders = [7, 5, 2, 1];

// type CustomWorkflowContext = WorkflowContext<{ subscriptionId: string }>;

export const sendReminders = serve(async (context: any) => {
  console.log("CONTEXT", context.requestPayload);
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  console.log("WORKFLOW SUB", subscription);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  console.log(renewalDate.isBefore(dayjs()));

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal Date has past for subscription with this id: ${subscriptionId}. Stopping workflow`
    );

    return;
  }

  for (const daysBefore of reminders) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    console.log(reminderDate);
    const label = `Reminder ${daysBefore} days before`;
    console.log(label);
    console.log(reminderDate.isAfter(dayjs()));
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, label, reminderDate);
    }
    await triggerReminder(context, label);
  }
});

const fetchSubscription = async (context: any, subscriptionId: string) => {
  console.log(subscriptionId);
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate({
      path: "user",
      select: "name email",
    });
  });
};

const sleepUntilReminder = async (
  context: any,
  label: string,
  date: dayjs.Dayjs
) => {
  console.log(`Sleep until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context: any, label: string) => {
  return await context.run(label, () => {
    console.log(`Tringgering ${label} reminder`);
    //Send email, or sms or push  notifkation
  });
};
