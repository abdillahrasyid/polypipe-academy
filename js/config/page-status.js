/**
 * Mapping pathname → development status per halaman.
 * Status: 'progress' | 'ready' | 'done'
 *
 * Update status di sini saat halaman selesai di-review / BE sudah implement.
 */
export const PAGE_STATUS_MAP = {
  '/admin.html':        'progress',
  '/login.html':        'progress',
  '/register.html':     'progress',
  '/home.html':         'progress',
  '/index.html':        'progress',
  '/splash.html':       'progress',
  '/welcome.html':      'progress',
  '/calculator.html':         'progress',
  '/calculator-result.html':  'progress',
  '/calculator-step1.html':   'progress',
  '/calculator-step2.html':   'progress',
  '/calculator-step3.html':   'progress',
  '/calculator-step4.html':   'progress',
  '/calculator-step5.html':   'progress',
  '/calculator-step6.html':   'progress',
  '/calculator-step7.html':   'progress',
};

export const STATUS_META = {
  progress: { label: 'In Progress',          bg: 'var(--warning-500)',  fg: '#fff' },
  ready:    { label: 'Ready for Development', bg: '#2563eb',             fg: '#fff' },
  done:     { label: 'Selesai Develop',       bg: 'var(--done-500)',     fg: '#fff' },
};

export function getCurrentPageStatus() {
  const path = location.pathname;
  return PAGE_STATUS_MAP[path] ?? 'progress';
}
