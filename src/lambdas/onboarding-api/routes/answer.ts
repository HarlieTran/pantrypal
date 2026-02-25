import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { getItem, putItem } from '../services/dynamodb';
import { validateAnswer } from '../schemas/validation';
import { response } from '..';

export const handleAnswer = async (body: any): Promise<APIGatewayProxyResultV2> => {
  const error = validateAnswer(body);
  if (error) return response(400, { message: error });

  const { userId, sessionId, answers, habitBackground } = body;
  const now = new Date().toISOString();
  const existing = await getItem(userId, sessionId);
  const questions = Array.isArray(existing?.questions) ? existing.questions : [];

  const questionById = new Map<string, string>(
    questions
      .filter((q: any) => q?.questionId && q?.question)
      .map((q: any) => [String(q.questionId), String(q.question)])
  );

  const qaPairs = answers.map((a: any) => ({
    questionId: String(a.questionId),
    question: questionById.get(String(a.questionId)) ?? String(a.question ?? ''),
    answer: String(a.answer ?? '')
  }));

  await putItem({
    userId,
    sessionId,
    questions,
    answers,
    qaPairs,
    habitBackground: habitBackground ?? '',
    status: 'completed',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  });

  console.log(JSON.stringify({
    level: 'INFO',
    message: 'OnboardingComplete',
    userId,
    sessionId,
    timestamp: new Date().toISOString()
  }));

  return response(200, { message: 'Onboarding completed successfully' });
};
