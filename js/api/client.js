import * as UsersMock      from '../mocks/users.js';
import * as CalculatorMock from '../mocks/calculator.js';
import * as FeedbackMock   from '../mocks/feedback.js';

const USE_MOCK    = () => window.USE_MOCK !== false;
const API_BASE    = () => window.API_BASE_URL ?? '/api/v1';

const MOCK_ROUTES = [
  { method: 'GET',  pattern: /^\/api\/v1\/calculator\/options$/, handler: () => CalculatorMock.mockGetCalculatorOptions() },
  { method: 'POST', pattern: /^\/api\/v1\/calculator$/,          handler: (_m, body) => CalculatorMock.mockSubmitCalculator(body) },
  { method: 'GET',    pattern: /^\/api\/v1\/users\/([^/]+)\/status$/,  handler: null },
  { method: 'PATCH',  pattern: /^\/api\/v1\/users\/([^/]+)\/status$/,  handler: async (m, body) => UsersMock.mockUpdateUserStatus(m[1], body.status) },
  { method: 'GET',    pattern: /^\/api\/v1\/users\/([^/]+)$/,           handler: (m) => UsersMock.mockGetUser(m[1]) },
  { method: 'PATCH',  pattern: /^\/api\/v1\/users\/([^/]+)$/,           handler: (m, body) => UsersMock.mockUpdateUser(m[1], body) },
  { method: 'DELETE', pattern: /^\/api\/v1\/users\/([^/]+)$/,           handler: (m) => UsersMock.mockDeleteUser(m[1]) },
  { method: 'GET',    pattern: /^\/api\/v1\/users(\?.*)?$/,             handler: (m, _b, url) => {
    const params = Object.fromEntries(new URL(url, location.origin).searchParams);
    return UsersMock.mockGetUsers({
      page: parseInt(params.page) || 1,
      limit: parseInt(params.limit) || 10,
      q: params.q || '',
      role: params.role || '',
      status: params.status || '',
      paket: params.paket || '',
    });
  }},
  { method: 'POST',   pattern: /^\/api\/v1\/users$/,                    handler: (m, body) => UsersMock.mockCreateUser(body) },
  { method: 'POST',   pattern: /^\/api\/v1\/feedback$/,                  handler: (_m, body) => FeedbackMock.mockSubmitFeedback(body) },
];

const _origFetch = window.fetch.bind(window);

window.fetch = async function(input, init = {}) {
  const url    = typeof input === 'string' ? input : input.url;
  const method = (init.method || 'GET').toUpperCase();

  if (!USE_MOCK() || !url.startsWith('/api/v1/')) {
    return _origFetch(input, init);
  }

  const body = init.body ? JSON.parse(init.body) : {};
  for (const route of MOCK_ROUTES) {
    if (route.method !== method) continue;
    const match = url.match(route.pattern);
    if (!match) continue;
    try {
      const result = await route.handler(match, body, url);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      const status = err.status || 500;
      return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return _origFetch(input, init);
};
