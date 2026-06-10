export const RATING_SCALE = Object.freeze([
  'sangat_baik',
  'baik',
  'cukup',
  'kurang',
  'sangat_kurang',
]);

export const RATING_LABELS = Object.freeze({
  sangat_baik:    'Sangat Baik',
  baik:           'Baik',
  cukup:          'Cukup',
  kurang:         'Kurang',
  sangat_kurang:  'Sangat Kurang',
});

/**
 * @typedef {Object} FeedbackInput
 * @property {'sangat_baik'|'baik'|'cukup'|'kurang'|'sangat_kurang'} q1 - Pengalaman menggunakan aplikasi
 * @property {'sangat_baik'|'baik'|'cukup'|'kurang'|'sangat_kurang'} q2 - Kemudahan tampilan
 * @property {'sangat_baik'|'baik'|'cukup'|'kurang'|'sangat_kurang'} q3 - Kesesuaian hasil perhitungan
 * @property {'sangat_baik'|'baik'|'cukup'|'kurang'|'sangat_kurang'} q4 - Performa aplikasi
 * @property {'sangat_baik'|'baik'|'cukup'|'kurang'|'sangat_kurang'} q5 - Kemudahan offline
 * @property {string} q6 - Kendala / bug (opsional, maks 1000 karakter)
 * @property {string} q7 - Saran atau masukan (opsional, maks 1000 karakter)
 * @property {string} q8 - Fitur yang diharapkan (opsional, maks 1000 karakter)
 */

/**
 * Validator submit feedback. Return array of error { path, message }.
 * @param {Partial<FeedbackInput>} input
 * @returns {{path: string, message: string}[]}
 */
export function validateFeedback(input) {
  const errors = [];

  const requiredRatings = ['q1', 'q2', 'q3', 'q4', 'q5'];
  requiredRatings.forEach(key => {
    if (!input[key] || !RATING_SCALE.includes(input[key])) {
      errors.push({ path: key, message: 'Pilih salah satu jawaban' });
    }
  });

  const textFields = ['q6', 'q7', 'q8'];
  textFields.forEach(key => {
    const val = (input[key] ?? '').trim();
    if (val.length > 1000) {
      errors.push({ path: key, message: 'Maksimal 1000 karakter' });
    }
  });

  return errors;
}
