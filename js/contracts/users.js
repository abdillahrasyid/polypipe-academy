export const USER_STATUS = Object.freeze(['active', 'nonaktif', 'suspended']);
export const USER_ROLE   = Object.freeze(['admin', 'pengguna']);
export const USER_PAKET  = Object.freeze(['free', 'premium']);

/**
 * @typedef {Object} User
 * @property {string}   id
 * @property {string}   nama
 * @property {string}   email
 * @property {string}   noHp
 * @property {'admin'|'pengguna'} role
 * @property {'active'|'nonaktif'|'suspended'} status
 * @property {'free'|'premium'} paket
 * @property {string|null} paketExpiredAt  - ISO date, null jika free
 * @property {string}   tanggalDaftar      - ISO datetime
 * @property {string|null} lastLogin       - ISO datetime, null jika belum pernah login
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^08\d{8,13}$/;

/**
 * @param {{nama,email,noHp,role,status,paket,paketExpiredAt}} input
 * @returns {{path:string,message:string}[]}
 */
export function validateCreateUser(input) {
  const errors = [];
  if (!input.nama || input.nama.trim().length < 2)
    errors.push({ path: 'nama', message: 'Nama minimal 2 karakter' });
  if (input.nama && input.nama.trim().length > 100)
    errors.push({ path: 'nama', message: 'Nama maksimal 100 karakter' });
  if (!EMAIL_RE.test(input.email ?? ''))
    errors.push({ path: 'email', message: 'Format email tidak valid' });
  if (!PHONE_RE.test(input.noHp ?? ''))
    errors.push({ path: 'noHp', message: 'No HP harus diawali 08 dan terdiri dari 10–15 digit' });
  if (!USER_ROLE.includes(input.role))
    errors.push({ path: 'role', message: 'Role tidak valid' });
  if (!USER_STATUS.includes(input.status))
    errors.push({ path: 'status', message: 'Status tidak valid' });
  if (!USER_PAKET.includes(input.paket))
    errors.push({ path: 'paket', message: 'Paket tidak valid' });
  if (input.paket === 'premium' && !input.paketExpiredAt)
    errors.push({ path: 'paketExpiredAt', message: 'Tanggal expired wajib diisi untuk paket Premium' });
  return errors;
}

/**
 * @param {Partial<User>} input
 * @returns {{path:string,message:string}[]}
 */
export function validateUpdateUser(input) {
  const errors = [];
  if (input.nama !== undefined) {
    if (input.nama.trim().length < 2) errors.push({ path: 'nama', message: 'Nama minimal 2 karakter' });
    if (input.nama.trim().length > 100) errors.push({ path: 'nama', message: 'Nama maksimal 100 karakter' });
  }
  if (input.email !== undefined && !EMAIL_RE.test(input.email))
    errors.push({ path: 'email', message: 'Format email tidak valid' });
  if (input.noHp !== undefined && !PHONE_RE.test(input.noHp))
    errors.push({ path: 'noHp', message: 'No HP harus diawali 08 dan terdiri dari 10–15 digit' });
  if (input.role !== undefined && !USER_ROLE.includes(input.role))
    errors.push({ path: 'role', message: 'Role tidak valid' });
  if (input.status !== undefined && !USER_STATUS.includes(input.status))
    errors.push({ path: 'status', message: 'Status tidak valid' });
  if (input.paket !== undefined && !USER_PAKET.includes(input.paket))
    errors.push({ path: 'paket', message: 'Paket tidak valid' });
  if (input.paket === 'premium' && input.paketExpiredAt === null)
    errors.push({ path: 'paketExpiredAt', message: 'Tanggal expired wajib diisi untuk paket Premium' });
  return errors;
}
