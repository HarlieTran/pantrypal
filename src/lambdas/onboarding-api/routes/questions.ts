import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { generateQuestions } from '../services/bedrock';
import { putItem } from '../services/dynamodb';
import { validateQuestions } from '../schemas/validation';
import { response } from '..';

export const handleQuestions = async (body: any): Promise<APIGatewayProxyResultV2> => {
  const error = validateQuestions(body);
  if (error) return response(400, { message: error });

  const { userId, dietaryPreferences, allergies, healthGoals } = body;
  const sessionId = randomUUID();

  const questions = await generateQuestions(
    dietaryPreferences ?? 'not specified',
    allergies ?? 'none',
    healthGoals ?? 'not specified'
  );
  const now = new Date().toISOString();

  await putItem({
    userId,
    sessionId,
    questions,
    dietaryPreferences: dietaryPreferences ?? '',
    allergies: allergies ?? '',
    healthGoals: healthGoals ?? '',
    status: 'questions_generated',
    createdAt: now,
    updatedAt: now
  });

  console.log(JSON.stringify({
    level: 'INFO',
    message: 'Questions generated',
    userId,
    sessionId,
    questionCount: questions.length,
    timestamp: new Date().toISOString()
  }));

  return response(200, { sessionId, questions });
};
