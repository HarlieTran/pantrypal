import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  console.log(JSON.stringify({
    level: "INFO",
    message: "HealthCheck invoked",
    timestamp: new Date().toISOString(),
    requestId: event.requestContext?.requestId ?? "unknown"
  }));

  const response = {
    applicationName: process.env.APP_NAME ?? "Missing Variable Input",
    studentName: process.env.STUDENT_NAME ?? "Missing Variable Input",
    studentId: process.env.STUDENT_ID ?? "Missing Variable Input",
    environment: process.env.ENVIRONMENT ?? "dev",
    lambdaMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE ?? "Missing Variable Input",
    timestamp: new Date().toISOString(),
    status: "healthy"
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(response)
  };
};