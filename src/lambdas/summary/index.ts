import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { validateSummaryRequest } from './schemas/schema';
import { fetchOnboardingProfile, generateCookingProfile } from './services/service';

// Response helper
const response = (statusCode: number, body: object): APIGatewayProxyResultV2 => ({
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

  console.log(JSON.stringify({
    level: 'INFO',
    message: 'Summary request received',
    path: event.rawPath,
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

    // ─── Validate ─────────────────────────────────────────
    const error = validateSummaryRequest(body);
    if (error) return response(400, { message: error });

    const { userId, sessionId } = body;

    // ─── Fetch from DynamoDB ──────────────────────────────
    const profile = await fetchOnboardingProfile(userId, sessionId);
    if (!profile) {
      return response(404, { message: 'Onboarding profile not found' });
    }

    const qaPairs = profile.qaPairs ?? profile.answers;
    const { habitBackground } = profile;
    if (!qaPairs || qaPairs.length === 0) {
      return response(400, { message: 'No Q&A pairs found for this session' });
    }

    // ─── Generate cooking profile ─────────────────────────
    const cookingProfile = await generateCookingProfile(qaPairs, habitBackground);

    console.log(JSON.stringify({
      level: 'INFO',
      message: 'Cooking profile generated successfully',
      userId,
      sessionId,
      cookingSkill: cookingProfile.cookingSkill,
      timestamp: new Date().toISOString()
    }));

    return response(200, { userId, sessionId, cookingProfile });

  } catch (error: any) {
    console.log(JSON.stringify({
      level: 'ERROR',
      message: 'Summary error',
      error: error.message,
      timestamp: new Date().toISOString()
    }));

    return response(500, { message: 'Internal server error' });
  }
};
