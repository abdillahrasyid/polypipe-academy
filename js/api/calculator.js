import { validateCalculatorInput } from '../contracts/calculator.js';

export async function getCalculatorOptions() {
  const res = await fetch('/api/v1/calculator/options');
  if (!res.ok) throw new Error('Gagal memuat opsi kalkulator');
  return res.json();
}

export async function submitCalculator(input) {
  const errors = validateCalculatorInput(input);
  if (errors.length) {
    const err = new Error('Validasi gagal');
    err.validationErrors = errors;
    throw err;
  }
  const res = await fetch('/api/v1/calculator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || 'Gagal menyimpan data');
    err.status = res.status;
    throw err;
  }
  return res.json();
}
