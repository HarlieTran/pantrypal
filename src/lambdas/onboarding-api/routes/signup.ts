import { APIGatewayProxyResultV2 } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDbPool } from '../services/db';
import { validateSignup } from '../schemas/validation';
import { response } from '..';

export const handleSignup = async (body: any): Promise<APIGatewayProxyResultV2> => {
  const error = validateSignup(body);
  if (error) return response(400, { message: error });

  const { username, email, password } = body;
  const passwordHash = await bcrypt.hash(password, 12);
  const userId = randomUUID();

  const db = await getDbPool();
  await db.query(
    `INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)`,
    [userId, username, email, passwordHash]
  );

  console.log(JSON.stringify({
    level: 'INFO',
    message: 'User signed up',
    userId,
    timestamp: new Date().toISOString()
  }));

  return response(200, { message: 'User created successfully', userId });
};