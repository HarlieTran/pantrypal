import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { validateEvent } from '../schemas/validation';
import { response } from '..';

export const handleEvent = async (body: any): Promise<APIGatewayProxyResultV2> => {
  const error = validateEvent(body);
  if (error) return response(400, { message: error });

  const { eventType, userId, metadata } = body;

  console.log(JSON.stringify({
    level: 'INFO',
    message: 'Event received',
    eventType,
    userId,
    metadata: metadata ?? {},
    timestamp: new Date().toISOString()
  }));

  return response(200, { message: 'Event logged successfully' });
};