import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { Pool } from 'pg';

const secretsClient = new SecretsManagerClient({});
let pool: Pool | null = null;

export const getDbPool = async (): Promise<Pool> => {
  if (pool) return pool;

  const secret = await secretsClient.send(new GetSecretValueCommand({
    SecretId: process.env.DB_SECRET_ARN!
  }));

  const { username, password, host, port, dbname } = JSON.parse(secret.SecretString!);

  pool = new Pool({
    host,
    port,
    database: dbname,
    user: username,
    password,
    ssl: { rejectUnauthorized: false }
  });

  return pool;
};