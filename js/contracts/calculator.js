export const PISTON_AREA_UNITS = Object.freeze(['CM2', 'MM2']);
export const SATUAN_WAKTU_OPTIONS = Object.freeze(['Detik', 'Menit']);

export const WELDING_STANDARDS = Object.freeze([
  { value: 'DVS2207-1', label: 'DVS 2207-1' },
  { value: 'ISO21307',  label: 'ISO 21307' },
  { value: 'ASTMF2620', label: 'ASTM F2620' },
  { value: 'EN12201',   label: 'EN 12201' },
  { value: 'SNI7058',   label: 'SNI 7058' },
]);

export const MATERIAL_PIPA_OPTIONS = Object.freeze([
  { value: 'PE100', label: 'PE100' },
  { value: 'PE80',  label: 'PE80' },
  { value: 'PPR',   label: 'PP-R' },
  { value: 'PVDF',  label: 'PVDF' },
]);

export const DIAMETER_LUAR_OPTIONS = Object.freeze([
  { value: 20,  label: '20 mm' },
  { value: 25,  label: '25 mm' },
  { value: 32,  label: '32 mm' },
  { value: 40,  label: '40 mm' },
  { value: 50,  label: '50 mm' },
  { value: 63,  label: '63 mm' },
  { value: 75,  label: '75 mm' },
  { value: 90,  label: '90 mm' },
  { value: 110, label: '110 mm' },
  { value: 125, label: '125 mm' },
  { value: 160, label: '160 mm' },
  { value: 200, label: '200 mm' },
  { value: 250, label: '250 mm' },
  { value: 315, label: '315 mm' },
]);

export const SDR_OPTIONS = Object.freeze([
  { value: 6,    label: 'SDR 6' },
  { value: 7.4,  label: 'SDR 7.4' },
  { value: 9,    label: 'SDR 9' },
  { value: 11,   label: 'SDR 11' },
  { value: 13.6, label: 'SDR 13.6' },
  { value: 17,   label: 'SDR 17' },
  { value: 21,   label: 'SDR 21' },
  { value: 26,   label: 'SDR 26' },
]);

export const DRAG_PRESSURE_OPTIONS = Object.freeze([
  { value: 1,  label: '1 bar' },
  { value: 2,  label: '2 bar' },
  { value: 3,  label: '3 bar' },
  { value: 4,  label: '4 bar' },
  { value: 5,  label: '5 bar' },
  { value: 6,  label: '6 bar' },
  { value: 7,  label: '7 bar' },
  { value: 8,  label: '8 bar' },
  { value: 9,  label: '9 bar' },
  { value: 10, label: '10 bar' },
  { value: 12, label: '12 bar' },
  { value: 15, label: '15 bar' },
]);

export const SUHU_RUANGAN_OPTIONS = Object.freeze([
  { value: 'below10', label: '< 10°C',      safe: false },
  { value: '10to20',  label: '10°C – 20°C', safe: true  },
  { value: '21to30',  label: '21°C – 30°C', safe: true  },
  { value: '31to40',  label: '31°C – 40°C', safe: true  },
  { value: 'above40', label: '> 40°C',      safe: false },
]);

export const DRAG_PRESSURE_WARNING_THRESHOLD = 10;

/**
 * Hitung ketebalan dinding pipa: e = OD / SDR
 * @param {number} od  - Diameter luar (mm)
 * @param {number} sdr - Standar Dimensi Rasio
 * @returns {string}
 */
export function hitungKetebalan(od, sdr) {
  if (!od || !sdr || sdr <= 0) return '—';
  return (od / sdr).toFixed(2);
}

/** @param {number} pt */
export function isDragPressureWarning(pt) {
  return Number(pt) >= DRAG_PRESSURE_WARNING_THRESHOLD;
}

/** @param {string} suhuValue */
export function isSuhuWarning(suhuValue) {
  const opt = SUHU_RUANGAN_OPTIONS.find(o => o.value === suhuValue);
  return opt ? !opt.safe : false;
}

/**
 * @param {Object} input
 * @returns {{path: string, message: string}[]}
 */
export function validateCalculatorInput(input) {
  const errors = [];
  const pistonVal = parseInt(input.pistonArea, 10);
  if (!input.pistonArea || isNaN(pistonVal) || pistonVal <= 0)
    errors.push({ path: 'pistonArea', message: 'Piston area wajib diisi dengan angka positif' });
  if (input.pistonArea && String(input.pistonArea).includes('.'))
    errors.push({ path: 'pistonArea', message: 'Piston area tidak dapat desimal' });
  if (!input.weldingStandard)
    errors.push({ path: 'weldingStandard', message: 'Pilih standard metode welding' });
  if (!input.materialPipa)
    errors.push({ path: 'materialPipa', message: 'Pilih material pipa' });
  if (!input.diameterLuar)
    errors.push({ path: 'diameterLuar', message: 'Pilih diameter luar' });
  if (!input.sdr)
    errors.push({ path: 'sdr', message: 'Pilih SDR' });
  if (!input.dragPressure)
    errors.push({ path: 'dragPressure', message: 'Pilih drag pressure' });
  if (!input.suhuRuangan)
    errors.push({ path: 'suhuRuangan', message: 'Pilih suhu ruangan' });
  return errors;
}
