
# PantryPal

PantryPal is a full-stack application designed to manage user onboarding and health preferences through an AI-powered experience. The system utilizes a React frontend and an AWS-based serverless backend to collect user data, provide health-related questions via Amazon Bedrock, and store information in DynamoDB and PostgreSQL.

## Repository Structure

* **`frontend/`**: A React application built with TypeScript and Vite.
* **`src/lambdas/`**: AWS Lambda functions for handling API logic including health checks, onboarding, session monitoring, and summary generation.
* **`src/iam/`**: JSON policy definitions for the Lambda execution roles.
* **`sql/`**: Database schema definitions for PostgreSQL.
* **`scripts/`**: Utility scripts for packaging and deployment.

## Getting Started

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env`.
4. Set the `VITE_API_BASE_URL` environment variable.
5. Run the development server: `npm run dev`.

### Backend Setup

1. Install dependencies at the root: `npm install`.
2. Build the Lambda functions: `npm run build:lambdas`.
3. (Optional) Package the functions for AWS deployment: `npm run package:lambdas`.

## Core API Endpoints

The frontend interacts with the backend via the following key endpoints (Base URL: `https://hp3gu9os8i.execute-api.us-east-2.amazonaws.com/dev`):

* `GET /health`: System health check.
* `POST /signup`: User registration.
* `POST /questions`: Generates personalized onboarding questions based on user preferences.
* `POST /answer`: Submits user responses for processing.
* `POST /summary`: Generates a summary of the user's onboarding profile.

---

## IAM Policy Configuration

The following IAM policy is used for the **Onboarding API Lambda**. It grants necessary permissions for logging, DynamoDB access, and Amazon Bedrock invocation for AI features.

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
