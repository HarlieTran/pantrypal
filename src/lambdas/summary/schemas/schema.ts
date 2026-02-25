export const validateSummaryRequest = (body: any): string | null => {
  if (!body.userId) return 'Missing required field: userId';
  if (!body.sessionId) return 'Missing required field: sessionId';
  return null;
};