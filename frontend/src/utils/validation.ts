export interface ValidationResult {
  valid: boolean;
  error: string;
}

// ── Sign Up Validation ─────────────────────────────────
export const validateSignUp = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult => {

  if (!username.trim()) {
    return { valid: false, error: 'Username is required.' };
  }

  if (username.trim().length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters.' };
  }

  if (!email.trim()) {
    return { valid: false, error: 'Email is required.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters.' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }

  return { valid: true, error: '' };
};

// ── Preferences Validation ─────────────────────────────
export const validatePreferences = (
  dietaryPreferences: string,
  healthGoals: string
): ValidationResult => {

  if (!dietaryPreferences.trim()) {
    return { valid: false, error: 'Please enter your dietary preferences.' };
  }

  if (!healthGoals.trim()) {
    return { valid: false, error: 'Please enter your health goals.' };
  }

  return { valid: true, error: '' };
};