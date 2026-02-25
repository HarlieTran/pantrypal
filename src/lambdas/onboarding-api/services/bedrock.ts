import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? 'us-east-2'
});

export const generateQuestions = async (
  dietaryPreferences: string,
  allergies: string,
  healthGoals: string
): Promise<any[]> => {

  const prompt = `You are a culinary assistant onboarding a new user to PantryPal, 
an app that manages pantry items and generates personalized recipes.

User profile:
- Dietary preferences: ${dietaryPreferences ?? 'not specified'}
- Allergies: ${allergies ?? 'none'}
- Health goals: ${healthGoals ?? 'not specified'}

Generate exactly 8 questions to understand this user's cooking and eating habits.
These answers will be used to recommend the best recipes based on their pantry items.

Rules:
1. First 3 mandatory questions must cover:
   - Cooking skill level
   - How many people they usually cook for
   - How much time they have to cook on a typical day
2. Remaining 5 questions should be personalized based on their profile and cover:
   - Cuisine preferences
   - Meal planning habits
   - Kitchen equipment they own
   - Flavor preferences (spicy, sweet, savory)
   - How often they cook vs eat out
3. Every question must have 4 specific options + "Other" as last option
4. Be clear and conversational

Return ONLY a valid JSON array, no extra text:
[
  {
    "questionId": "q1",
    "question": "...",
    "mandatory": true,
    "type": "multiple_choice",
    "options": ["option1", "option2", "option3", "option4", "Other"]
  }
]`;

  const bedrockResponse = await client.send(new InvokeModelCommand({
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
        temperature: 0.7
      }
    })
  }));

  const body = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
  const outputText = body.output.message.content[0].text;

  // Strip markdown code blocks if present
  const cleaned = outputText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};