import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? 'us-east-1'
});

export const fetchOnboardingProfile = async (
  userId: string,
  sessionId: string
) => {
  const result = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: { userId, sessionId }
  }));

  return result.Item ?? null;
};

export const generateCookingProfile = async (
  qaPairs: any[],
  habitBackground: string
) => {
  // Include the full Q&A context so the model can infer skill, constraints, and habits.
  const prompt = `You are a culinary assistant for PantryPal, an app that manages 
pantry items and generates personalized recipes.

Based on this user's onboarding responses, create a concise cooking profile 
that will be used to personalize recipe recommendations.

User background: ${habitBackground ?? 'not specified'}

User Q&A responses:
${qaPairs.map((qa: any) => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}

Return ONLY a valid JSON object in this exact structure, no extra text:
{
  "cookingSkill": "beginner|intermediate|advanced",
  "servingSize": <number>,
  "availableTime": "under 30 mins|30-60 mins|over 60 mins",
  "cuisinePreferences": ["cuisine1", "cuisine2"],
  "flavorProfile": ["flavor1", "flavor2"],
  "dietaryRestrictions": ["restriction1"],
  "cookingFrequency": "rarely|sometimes|often|daily",
  "summary": "<2-3 sentence human readable summary of cooking habits>"
}`;

  const bedrockResponse = await bedrockClient.send(new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID ?? 'us.amazon.nova-2-lite-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: [{ text: prompt }]
        }
      ],
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0.5
      }
    })
  }));

  const body = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
  const outputText = body.output.message.content[0].text;

  // Some model responses are wrapped in markdown fences; strip before parsing JSON.
  const cleaned = outputText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};
