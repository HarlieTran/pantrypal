import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { handleSignup } from './routes/signup';
import { handleQuestions } from './routes/questions';
import { handleAnswer } from './routes/answer';
import { handleEvent } from './routes/event';

export const response = (statusCode: number, body: object): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(body)
});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const path = event.rawPath ?? '/';
  const method = (event.requestContext.http.method ?? '').toUpperCase();

  console.log(JSON.stringify({
    level: 'INFO',
    message: 'Request received',
    path,
    method,
    timestamp: new Date().toISOString()
  }));

  try {
    let body: any = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch {
        return response(400, { message: 'Invalid JSON body' });
      }
    }

    // Use suffix matching so stage/base-path prefixes do not break routing.
    if (method === 'POST' && path.endsWith('/signup')) return await handleSignup(body);
    if (method === 'POST' && path.endsWith('/questions')) return await handleQuestions(body);
    if (method === 'POST' && path.endsWith('/answer')) return await handleAnswer(body);
    if (method === 'POST' && path.endsWith('/event')) return await handleEvent(body);

    return response(404, { message: 'Route not found' });

  } catch (error: any) {
    console.log(JSON.stringify({
      level: 'ERROR',
      message: 'Unhandled error',
      error: error.message,
      path,
      timestamp: new Date().toISOString()
    }));

    return response(500, { message: 'Internal server error' });
  }
};
