import { USER_STATUS, USER_ROLE, USER_PAKET } from '../contracts/users.js';

const delay = ms => new Promise(r => setTimeout(r, ms));
const maybeError = (rate = 0.05) => {
  if (Math.random() < rate) throw { status: 500, message: 'Terjadi kesalahan pada server' };
};

let nextId = 16;

const MOCK_USERS = [
  { id:'1',  nama:'M. Ramadhani',     email:'m.ramadhani@email.com',   noHp:'081234567890', role:'admin',    status:'active',    paket:'premium', paketExpiredAt:'2027-01-10', tanggalDaftar:'2025-01-10T08:00:00Z', lastLogin:'2026-06-09T22:10:00Z' },
  { id:'2',  nama:'Siti Rahayu',      email:'siti.rahayu@email.com',   noHp:'082345678901', role:'pengguna', status:'active',    paket:'premium', paketExpiredAt:'2026-12-15', tanggalDaftar:'2025-01-15T09:30:00Z', lastLogin:'2026-06-10T07:45:00Z' },
  { id:'3',  nama:'Budi Santoso',     email:'budi.santoso@email.com',  noHp:'083456789012', role:'pengguna', status:'active',    paket:'free',    paketExpiredAt:null,          tanggalDaftar:'2025-02-01T10:00:00Z', lastLogin:'2026-06-08T14:20:00Z' },
  { id:'4',  nama:'Agus Setiawan',    email:'agus.setiawan@email.com', noHp:'084567890123', role:'pengguna', status:'active',    paket:'premium', paketExpiredAt:'2026-11-20', tanggalDaftar:'2025-02-14T11:00:00Z', lastLogin:'2026-06-10T06:30:00Z' },
  { id:'5',  nama:'Dewi Anggraini',   email:'dewi.anggraini@email.com',noHp:'085678901234', role:'pengguna', status:'active',    paket:'premium', paketExpiredAt:'2026-08-20', tanggalDaftar:'2025-02-20T08:30:00Z', lastLogin:'2026-06-09T19:00:00Z' },
  { id:'6',  nama:'Hendra Gunawan',   email:'hendra.gunawan@email.com',noHp:'086789012345', role:'pengguna', status:'nonaktif',  paket:'free',    paketExpiredAt:null,          tanggalDaftar:'2025-03-05T13:00:00Z', lastLogin:'2026-04-12T10:00:00Z' },
  { id:'7',  nama:'Rina Wulandari',   email:'rina.wulandari@email.com',noHp:'087890123456', role:'pengguna', status:'active',    paket:'premium', paketExpiredAt:'2026-07-10', tanggalDaftar:'2025-03-10T09:00:00Z', lastLogin:'2026-06-07T21:15:00Z' },
  { id:'8',  nama:'Dwi Prasetyo',     email:'dwi.prasetyo@email.com',  noHp:'088901234567', role:'pengguna', status:'active',    paket:'free',    paketExpiredAt:null,          tanggalDaftar:'2025-03-18T15:00:00Z', lastLogin:'2026-06-05T16:40:00Z' },
  { id:'9',  nama:'Ahmad Fauzi',      email:'ahmad.fauzi@email.com',   noHp:'089012345678', role:'pengguna', status:'suspended', paket:'premium', paketExpiredAt:'2026-05-15', tanggalDaftar:'2025-04-01T08:00:00Z', lastLogin:'2026-05-14T11:00:00Z' },
  { id:'10', nama:'Lia Permata',      email:'lia.permata@email.com',   noHp:'081123456789', role:'pengguna', status:'suspended', paket:'premium', paketExpiredAt:'2026-05-20', tanggalDaftar:'2025-04-10T10:30:00Z', lastLogin:'2026-05-19T09:00:00Z' },
  { id:'11', nama:'Reza Kurniawan',   email:'reza.kurniawan@email.com',noHp:'082234567890', role:'pengguna', status:'nonaktif',  paket:'free',    paketExpiredAt:null,          tanggalDaftar:'2025-04-28T07:00:00Z', lastLogin:'2026-03-10T14:00:00Z' },
  { id:'12', nama:'Putri Handayani',  email:'putri.h@email.com',       noHp:'083345678901', role:'pengguna', status:'active',    paket:'premium', paketExpiredAt:'2026-06-01', tanggalDaftar:'2025-05-05T11:00:00Z', lastLogin:'2026-06-09T08:00:00Z' },
  { id:'13', nama:'Dedi Irawan',      email:'dedi.irawan@email.com',   noHp:'084456789012', role:'pengguna', status:'active',    paket:'free',    paketExpiredAt:null,          tanggalDaftar:'2025-05-15T09:30:00Z', lastLogin:'2026-06-10T05:50:00Z' },
  { id:'14', nama:'Nurul Fadhilah',   email:'nurul.f@email.com',       noHp:'085567890123', role:'pengguna', status:'active',    paket:'premium', paketExpiredAt:'2026-09-22', tanggalDaftar:'2025-05-22T14:00:00Z', lastLogin:'2026-06-08T20:30:00Z' },
  { id:'15', nama:'Anton Wijaya',     email:'anton.wijaya@email.com',  noHp:'086678901234', role:'admin',    status:'active',    paket:'premium', paketExpiredAt:'2027-06-01', tanggalDaftar:'2025-06-01T08:00:00Z', lastLogin:'2026-06-10T07:00:00Z' },
];

let users = MOCK_USERS.map(u => ({ ...u }));

function emailExists(email, excludeId = null) {
  return users.some(u => u.email === email && u.id !== excludeId);
}

export async function mockGetUsers({ page = 1, limit = 10, q = '', role = '', status = '', paket = '' } = {}) {
  console.info('[MOCK] getUsers', { page, limit, q, role, status, paket });
  await delay(350);
  maybeError();

  let filtered = users.filter(u => {
    const matchQ = !q || u.nama.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.noHp.includes(q);
    const matchRole   = !role   || u.role === role;
    const matchStatus = !status || u.status === status;
    const matchPaket  = !paket  || (paket === 'expired' ? isPaketExpired(u) : u.paket === paket && !isPaketExpired(u));
    return matchQ && matchRole && matchStatus && matchPaket;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data  = filtered.slice(start, start + limit);

  return { data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

export async function mockGetUser(id) {
  console.info('[MOCK] getUser', id);
  await delay(250);
  maybeError();
  const user = users.find(u => u.id === id);
  if (!user) throw { status: 404, message: 'User tidak ditemukan' };
  return { data: { ...user } };
}

export async function mockCreateUser(input) {
  console.info('[MOCK] createUser', input);
  await delay(700);
  maybeError();
  if (emailExists(input.email))
    throw { status: 400, message: 'Email sudah terdaftar', path: 'email' };
  const user = {
    id: String(nextId++),
    nama:          input.nama.trim(),
    email:         input.email.trim().toLowerCase(),
    noHp:          input.noHp.trim(),
    role:          input.role,
    status:        input.status || 'active',
    paket:         input.paket || 'free',
    paketExpiredAt: input.paket === 'premium' ? (input.paketExpiredAt || null) : null,
    tanggalDaftar: new Date().toISOString(),
    lastLogin:     null,
  };
  users.push(user);
  return { data: { ...user } };
}

export async function mockUpdateUser(id, input) {
  console.info('[MOCK] updateUser', id, input);
  await delay(650);
  maybeError();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) throw { status: 404, message: 'User tidak ditemukan' };
  if (input.email && emailExists(input.email, id))
    throw { status: 400, message: 'Email sudah digunakan user lain', path: 'email' };
  users[idx] = {
    ...users[idx],
    ...input,
    paketExpiredAt: input.paket === 'free' ? null : (input.paketExpiredAt ?? users[idx].paketExpiredAt),
  };
  return { data: { ...users[idx] } };
}

export async function mockUpdateUserStatus(id, status, actorId = '1') {
  console.info('[MOCK] updateUserStatus', id, status);
  await delay(450);
  maybeError();
  if (id === actorId && status === 'suspended')
    throw { status: 400, message: 'Admin tidak dapat men-suspend akun sendiri' };
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) throw { status: 404, message: 'User tidak ditemukan' };
  users[idx].status = status;
  return { data: { ...users[idx] } };
}

export async function mockDeleteUser(id) {
  console.info('[MOCK] deleteUser', id);
  await delay(400);
  maybeError();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) throw { status: 404, message: 'User tidak ditemukan' };
  users.splice(idx, 1);
  return { data: { id } };
}

export function isPaketExpired(user) {
  if (user.paket !== 'premium' || !user.paketExpiredAt) return false;
  return new Date(user.paketExpiredAt) < new Date();
}

/* Helper untuk demo: mock accounts per role */
export const MOCK_ACCOUNTS = {
  admin:    { email: 'admin@polypipe.id',    password: 'prototype123', userId: '1' },
  pengguna: { email: 'user@polypipe.id',     password: 'prototype123', userId: '3' },
};
