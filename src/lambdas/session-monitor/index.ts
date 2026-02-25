import { ScheduledEvent, Context } from 'aws-lambda';

export const handler = async (
  event: ScheduledEvent,
  context: Context
): Promise<void> => {

  const startTime = Date.now();

  // Log structured heartbeat
  console.log(JSON.stringify({
    level: "INFO",
    message: "Heartbeat",
    service: process.env.APP_NAME ?? "Missing Variable Input",
    environment: process.env.ENVIRONMENT ?? "dev",
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
    executionDuration: `${Date.now() - startTime}ms`,
    status: "healthy"
  }));

};