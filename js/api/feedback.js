import { validateFeedback } from '../contracts/feedback.js';

/**
 * Submit user feedback.
 * Validates input first; throws validation errors before hitting network.
 * @param {import('../contracts/feedback.js').FeedbackInput} input
 * @returns {Promise<{data: object}>}
 */
export async function submitFeedback(input) {
  const errors = validateFeedback(input);
  if (errors.length > 0) {
    const err = new Error('Validasi gagal');
    err.validationErrors = errors;
    throw err;
  }

  const res = await fetch('/api/v1/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error || 'Gagal mengirim feedback');
    err.status = res.status;
    throw err;
  }

  return json;
}
