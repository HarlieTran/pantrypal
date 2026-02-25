import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (item: Record<string, any>) => {
  await docClient.send(new PutCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Item: item
  }));
};

export const getItem = async (userId: string, sessionId: string) => {
  const result = await docClient.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: { userId, sessionId }
  }));
  return result.Item;
};