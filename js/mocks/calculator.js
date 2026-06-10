import {
  WELDING_STANDARDS,
  MATERIAL_PIPA_OPTIONS,
  DIAMETER_LUAR_OPTIONS,
  SDR_OPTIONS,
  DRAG_PRESSURE_OPTIONS,
  SUHU_RUANGAN_OPTIONS,
  validateCalculatorInput,
} from '../contracts/calculator.js';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function maybeError(rate = 0.05) {
  if (Math.random() < rate) {
    const err = new Error('Server error sementara, coba lagi.');
    err.status = 500;
    throw err;
  }
}

export async function mockGetCalculatorOptions() {
  console.info('[MOCK] GET /api/v1/calculator/options');
  await delay(200 + Math.random() * 200);
  return {
    data: {
      weldingStandards:     WELDING_STANDARDS,
      materialPipa:         MATERIAL_PIPA_OPTIONS,
      diameterLuar:         DIAMETER_LUAR_OPTIONS,
      sdrOptions:           SDR_OPTIONS,
      dragPressureOptions:  DRAG_PRESSURE_OPTIONS,
      suhuRuanganOptions:   SUHU_RUANGAN_OPTIONS,
    },
  };
}

export async function mockSubmitCalculator(body) {
  console.info('[MOCK] POST /api/v1/calculator', body);
  await delay(600 + Math.random() * 400);
  maybeError();

  const errors = validateCalculatorInput(body);
  if (errors.length) {
    const err = new Error('Validasi gagal: ' + errors.map(e => e.message).join(', '));
    err.status = 400;
    err.validationErrors = errors;
    throw err;
  }

  return {
    data: {
      id:        `calc-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    },
  };
}
