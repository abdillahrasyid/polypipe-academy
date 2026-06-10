import { validateCreateUser, validateUpdateUser } from '../contracts/users.js';

const BASE = () => (window.API_BASE_URL ?? '/api/v1') + '/users';
const headers = { 'Content-Type': 'application/json' };

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function getUsers(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  const url = qs ? `${BASE()}?${qs}` : BASE();
  return handleResponse(await fetch(url));
}

export async function getUser(id) {
  return handleResponse(await fetch(`${BASE()}/${id}`));
}

export async function createUser(input) {
  const errors = validateCreateUser(input);
  if (errors.length) throw { validationErrors: errors };
  return handleResponse(await fetch(BASE(), {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  }));
}

export async function updateUser(id, input) {
  const errors = validateUpdateUser(input);
  if (errors.length) throw { validationErrors: errors };
  return handleResponse(await fetch(`${BASE()}/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(input),
  }));
}

export async function updateUserStatus(id, status) {
  return handleResponse(await fetch(`${BASE()}/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  }));
}

export async function deleteUser(id) {
  return handleResponse(await fetch(`${BASE()}/${id}`, { method: 'DELETE' }));
}
