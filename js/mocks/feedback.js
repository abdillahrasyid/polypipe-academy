import { RATING_SCALE } from '../contracts/feedback.js';

const delay = ms => new Promise(r => setTimeout(r, ms));
const maybeError = (rate = 0.05) => {
  if (Math.random() < rate) throw { status: 500, message: 'Terjadi kesalahan pada server' };
};

let nextId = 1;

/**
 * Mock submit feedback. Validates required ratings, persists to in-memory log.
 */
export async function mockSubmitFeedback(body) {
  console.info('[MOCK] POST /api/v1/feedback', body);
  await delay(700);
  maybeError();

  const requiredRatings = ['q1', 'q2', 'q3', 'q4', 'q5'];
  for (const key of requiredRatings) {
    if (!body[key] || !RATING_SCALE.includes(body[key])) {
      throw { status: 400, message: `Field ${key} wajib diisi dengan nilai yang valid` };
    }
  }

  const record = {
    id:          String(nextId++),
    q1:          body.q1,
    q2:          body.q2,
    q3:          body.q3,
    q4:          body.q4,
    q5:          body.q5,
    q6:          (body.q6 ?? '').trim(),
    q7:          (body.q7 ?? '').trim(),
    q8:          (body.q8 ?? '').trim(),
    submittedAt: new Date().toISOString(),
  };

  return { data: record };
}
