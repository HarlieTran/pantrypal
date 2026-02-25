export const validateSignup = (body: any): string | null => {
  if (!body.username) return 'Missing required field: username';
  if (!body.email) return 'Missing required field: email';
  if (!body.password) return 'Missing required field: password';
  if (body.password.length < 8) return 'Password must be at least 8 characters';
  return null;
};

export const validateQuestions = (body: any): string | null => {
  if (!body.userId) return 'Missing required field: userId';
  return null;
};

export const validateAnswer = (body: any): string | null => {
  if (!body.userId) return 'Missing required field: userId';
  if (!body.sessionId) return 'Missing required field: sessionId';
  if (!body.answers) return 'Missing required field: answers';
  if (!Array.isArray(body.answers) || body.answers.length === 0) {
    return 'answers must be a non-empty array';
  }
  for (const answer of body.answers) {
    if (!answer?.questionId) return 'Each answer must include questionId';
    if (answer?.answer === undefined || answer?.answer === null) {
      return 'Each answer must include answer';
    }
  }
  return null;
};

export const validateEvent = (body: any): string | null => {
  if (!body.eventType) return 'Missing required field: eventType';
  if (!body.userId) return 'Missing required field: userId';
  return null;
};
