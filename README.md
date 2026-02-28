# PantryPal Onboarding

PantryPal Onboarding is a full-stack onboarding system for collecting user profile data and turning it into AI-generated cooking insights.

The project includes:
- A React + TypeScript frontend for signup and onboarding flow
- AWS Lambda backend services for API handling, health checks, summary generation, and scheduled heartbeat monitoring
- DynamoDB for onboarding/session data
- PostgreSQL for user account storage
- Amazon Bedrock for generating onboarding questions and cooking profile summaries

## Architecture

- Frontend (`frontend/`)
  - Vite + React single-page app
  - Page flow: `landing -> signup -> preferences -> questions -> summary`
  - API integration in `frontend/src/services/api.ts`

- Backend Lambdas (`src/lambdas/`)
  - `health-check`: returns service metadata and runtime status
  - `onboarding-api`: handles `/signup`, `/questions`, `/answer`, `/event`
  - `summary`: handles `/summary` and generates a structured cooking profile
  - `session-monitor`: scheduled heartbeat logger

- Storage
  - PostgreSQL table: `users` (schema in `sql/001_create_users_table.sql`)
  - DynamoDB table: onboarding sessions and answers (`DYNAMODB_TABLE` env var)

- AI
  - Amazon Bedrock Runtime via `InvokeModel`
  - Question generation and summary generation both use model ID from `BEDROCK_MODEL_ID`

## Repository Structure

- `frontend/`: React frontend (Vite)
- `src/lambdas/`: Lambda source code
- `src/iam/`: IAM policy JSON per Lambda role
- `sql/`: SQL schema
- `scripts/`: Build/package utilities
- `dist/`: Compiled Lambda artifacts (generated)

## Prerequisites

- Node.js 20+
- npm
- AWS account/resources for Lambda + API Gateway + DynamoDB + Bedrock
- PostgreSQL database (credentials stored in AWS Secrets Manager)

## Local Development

### Backend

Run from repository root:

```bash
npm install
npm run build:lambdas
```

Optional packaging for deployment:

```bash
npm run package:lambdas
```

### Frontend

Run from `frontend/`:

```bash
npm install
npm run dev
```

Set frontend environment variable in `frontend/.env`:

```env
VITE_ONBOARDING_API_URL=https://<api-gateway-domain>/<stage>
```

## Backend Environment Variables

Commonly used Lambda environment variables:

- `APP_NAME`
- `ENVIRONMENT`
- `AWS_REGION`
- `BEDROCK_MODEL_ID`
- `DYNAMODB_TABLE`
- `DB_SECRET_ARN`
- `STUDENT_NAME` (health-check response)
- `STUDENT_ID` (health-check response)

## API Endpoints

Base path is configured in API Gateway (example stage: `/dev`).

- `GET /health`
  - Returns application/runtime health payload
- `POST /signup`
  - Creates a user in PostgreSQL
  - Body: `username`, `email`, `password`
- `POST /questions`
  - Generates onboarding questions and creates a session record in DynamoDB
  - Body: `userId`, `dietaryPreferences`, `allergies`, `healthGoals`
- `POST /answer`
  - Saves user answers and normalized `qaPairs` in DynamoDB
  - Body: `userId`, `sessionId`, `answers`, `habitBackground`
- `POST /event`
  - Logs onboarding analytics/event payloads
- `POST /summary`
  - Reads onboarding session and generates a `cookingProfile` via Bedrock
  - Body: `userId`, `sessionId`

## Build Scripts (Root)

Defined in `package.json`:

- `npm run build:health`
- `npm run build:onboarding`
- `npm run build:summary`
- `npm run build:session-monitor`
- `npm run build:lambdas`
- `npm run package:lambdas`
- `npm run clean`

## IAM Policies

Policy files are stored under `src/iam/`.

### HealthCheckLambdaRole.json

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowHealthCheckLogging",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:us-east-2:175948132683:log-group:/aws/lambda/HealthCheckLambda:*"
        }
    ]
}
```

### OnboardingApiLambdaRole.json

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:us-east-2:175948132683:log-group:/aws/lambda/OnboardingApiLambda:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:us-east-2:175948132683:table/UserOnboardingProfiles"
        },
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "arn:aws:secretsmanager:us-east-2:175948132683:secret:pantrypal/db/credentials-DIgOOU"
        }
    ]
}
```

### SummaryLambdaRole.json

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:us-east-2:175948132683:log-group:/aws/lambda/SessionMonitorLambda:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:us-east-2:175948132683:table/UserOnboardingProfiles"
        },
        {
            "Effect": "Allow",
            "Action": "bedrock:InvokeModel",
            "Resource": "*"
        }
    ]
}
```

### SessionMonitorLambdaRole.json

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:us-east-2:175948132683:log-group:/aws/lambda/SessionMonitorLambda:*"
        }
    ]
}
```

## Notes

- The IAM files for Onboarding and Summary include comments in source about Bedrock cross-region inference and wildcard resource usage (`"Resource": "*"`).
- If desired, these comments can be moved into this README as an additional security rationale section.