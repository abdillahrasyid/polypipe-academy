import { getCurrentPageStatus, STATUS_META } from './config/page-status.js';

const STATUS = getCurrentPageStatus();
const META   = STATUS_META[STATUS] ?? STATUS_META.progress;

const banner = document.getElementById('proto-banner');
if (banner) {
  banner.style.background = META.bg;
  banner.style.color      = META.fg;
  banner.style.display    = window.USE_MOCK ? '' : 'none';

  /* Segitiga kecil pojok kiri-atas dengan label status */
  const triangle = document.createElement('div');
  triangle.id = 'proto-status-indicator';
  triangle.style.cssText = `
    position:fixed;top:0;left:0;z-index:10000;
    width:64px;height:64px;
    clip-path:polygon(0 0,100% 0,0 100%);
    background:${META.bg};
    cursor:pointer;
    transition:opacity .15s;
  `;
  triangle.setAttribute('title', META.label);
  triangle.setAttribute('aria-label', `Status halaman: ${META.label}`);

  let labelEl = null;
  let hideTimer = null;

  triangle.addEventListener('click', () => {
    if (labelEl) {
      labelEl.remove();
      labelEl = null;
      clearTimeout(hideTimer);
      return;
    }
    labelEl = document.createElement('div');
    labelEl.style.cssText = `
      position:fixed;top:8px;left:8px;z-index:10001;
      background:${META.bg};color:${META.fg};
      font-family:'Inter',sans-serif;font-size:11px;font-weight:600;
      padding:4px 8px;border-radius:4px;
      pointer-events:none;white-space:nowrap;
    `;
    labelEl.textContent = META.label;
    document.body.appendChild(labelEl);

    /* Countdown bar */
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:absolute;bottom:0;left:0;height:2px;
      background:rgba(255,255,255,.5);width:100%;
      transform-origin:left;animation:shrinkBar 4s linear forwards;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes shrinkBar{to{transform:scaleX(0);}}';
    document.head.appendChild(style);
    labelEl.appendChild(bar);

    hideTimer = setTimeout(() => {
      labelEl?.remove();
      labelEl = null;
    }, 4000);
  });

  document.body.appendChild(triangle);

  /* Adjust topbar if banner visible */
  if (window.USE_MOCK) {
    const topbar = document.querySelector('.topbar');
    const sidebar = document.querySelector('.sidebar');
    if (topbar) topbar.style.top = '29px';
    if (sidebar) sidebar.style.top = '29px';
  }
}
