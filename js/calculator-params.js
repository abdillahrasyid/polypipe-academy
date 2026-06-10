/**
 * Shared calculator utilities for butt-fusion welding parameter pages.
 * Used by: calculator-result.html, calculator-step1–3.html
 */

/* ── Label maps ── */
const WELDING_LABELS = {
  'DVS2207-1': 'DVS 2207-1', 'ISO21307': 'ISO 21307',
  'ASTMF2620': 'ASTM F2620', 'EN12201': 'EN 12201', 'SNI7058': 'SNI 7058',
};
const MATERIAL_LABELS = {
  'PE100': 'PE100', 'PE80': 'PE80', 'PPR': 'PP-R', 'PVDF': 'PVDF',
};
const SUHU_LABELS = {
  'below10': '< 10°C', '10to20': '10°C – 20°C',
  '21to30': '21°C – 30°C', '31to40': '31°C – 40°C', 'above40': '> 40°C',
};
const DIAMETER_LABELS = {
  '20':'20 mm','25':'25 mm','32':'32 mm','40':'40 mm','50':'50 mm',
  '63':'63 mm','75':'75 mm','90':'90 mm','110':'110 mm','125':'125 mm',
  '160':'160 mm','200':'200 mm','250':'250 mm','315':'315 mm',
};
const SDR_LABELS = {
  '6':'SDR 6','7.4':'SDR 7.4','9':'SDR 9','11':'SDR 11',
  '13.6':'SDR 13.6','17':'SDR 17','21':'SDR 21','26':'SDR 26',
};

/**
 * Compute all welding parameters from calculator input data.
 * @param {Object} d - raw input from sessionStorage 'calc_input'
 * @returns {Object} computed params + raw seconds for t1, t2
 */
function calcWeldingParams(d) {
  const od      = parseFloat(d.diameterLuar);
  const sdr     = parseFloat(d.sdr);
  const pt      = parseFloat(d.dragPressure);
  const pa      = parseFloat(d.pistonArea);
  const isCM2   = d.pistonAreaUnit === 'CM2';
  const isMenit = d.satuanWaktu === 'Menit';
  const mat     = d.materialPipa;

  const e        = od / sdr;
  const Amm2     = isCM2 ? pa * 100 : pa;
  const A_pipe   = Math.PI * e * (od - e);

  const sigma = { PE100: 0.15, PE80: 0.10, PPR: 0.15, PVDF: 0.20 }[mat] ?? 0.15;
  const F      = sigma * A_pipe;
  const p_join = (F / Amm2) * 10;

  const p1pt = p_join + pt;
  const p2pt = pt;
  const p3   = p_join + pt;

  const t1s = Math.max(5, e * 2.1);
  const t2s = Math.max(5, e * 10);
  const t3s = od <= 90 ? 5 : od <= 315 ? 6 : 8;
  const t4s = od <= 90 ? 6 : od <= 315 ? 8 : 11;
  const t5s = Math.max(15, e * 60);

  const fmt  = (v, decimals = 2) => parseFloat(v.toFixed(decimals));
  const fmtT = (s) => isMenit ? `${(s / 60).toFixed(2)}` : `${s.toFixed(2)}`;

  const A_bead = Math.max(0.5, e * 0.5);

  const temps = {
    PE100: [200, 220, 240], PE80: [200, 210, 220],
    PPR: [250, 260, 270], PVDF: [260, 270, 280],
  };
  const [Tmin, Tnom, Tmax] = temps[mat] ?? temps.PE100;

  return {
    e: fmt(e),
    p1pt: fmt(p1pt), t1: fmtT(t1s), t1s,
    A_bead: fmt(A_bead),
    p2pt: fmt(p2pt), t2: fmtT(t2s), t2s,
    t3_max: t3s.toFixed(1), t3s,
    t4_max: t4s.toFixed(1), t4s,
    p3: fmt(p3), t5: fmtT(t5s), t5s,
    t6s: t5s,
    Tmin, Tnom, Tmax,
    tUnit: isMenit ? 'menit' : 'detik',
    matNote: MATERIAL_LABELS[mat] ?? mat,
  };
}

/**
 * Build welding cycle SVG with optional phase highlight.
 * @param {Object} params - from calcWeldingParams
 * @param {number|null} highlightPhase - 0-indexed phase to highlight (0=t1,1=t2,...)
 */
function buildCycleSVGWithHighlight(params, highlightPhase = null) {
  const W = 300, H = 130;
  const ml = 36, mr = 12, mt = 14, mb = 28;
  const cw = W - ml - mr, ch = H - mt - mb;

  const p_high = 0.85, p_drag = 0.40, p_zero = 0.0;
  const phases = [0.17, 0.25, 0.07, 0.11, 0.20, 0.20];  // 6 phases: t1-t6

  const xs = [0];
  phases.forEach(p => xs.push(xs[xs.length - 1] + p));

  const px = f => ml + f * cw;
  const py = f => mt + (1 - f) * ch;

  const profile = [
    [xs[0], p_high], [xs[1], p_high],
    [xs[1], p_drag], [xs[2], p_drag],
    [xs[2], p_zero], [xs[3], p_zero],
    [xs[3], p_high], [xs[4], p_high],
    [xs[4], p_high], [xs[5], p_high],
    [xs[5], p_high], [xs[6], p_high],
  ];

  const lineD = profile.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`
  ).join(' ');

  const dashHigh = `M${ml},${py(p_high).toFixed(1)} L${(W - mr).toFixed(1)},${py(p_high).toFixed(1)}`;
  const dashDrag = `M${ml},${py(p_drag).toFixed(1)} L${(W - mr).toFixed(1)},${py(p_drag).toFixed(1)}`;

  const phaseLabels = phases.map((w, i) => ({
    x: px(xs[i] + w / 2), label: `t${i + 1}`,
  }));

  const pLabels = [
    { y: py(p_high), text: 'p1+pt' },
    { y: py(p_drag), text: 'p2' },
  ];

  // Highlight overlay
  let highlightRect = '';
  if (highlightPhase !== null && highlightPhase >= 0 && highlightPhase < phases.length) {
    const x1 = px(xs[highlightPhase]);
    const x2 = px(xs[highlightPhase + 1]);
    highlightRect = `<rect x="${x1.toFixed(1)}" y="${mt.toFixed(1)}" width="${(x2 - x1).toFixed(1)}" height="${ch.toFixed(1)}" fill="rgba(255,191,136,0.28)" rx="3"/>`;
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:6px" role="img" aria-label="Diagram siklus pengelasan butt fusion">
  ${highlightRect}
  <path d="${dashHigh}" stroke="#b3d7fb" stroke-width="1" stroke-dasharray="4 3" fill="none"/>
  <path d="${dashDrag}" stroke="#d0d5dd" stroke-width="1" stroke-dasharray="4 3" fill="none"/>
  <path d="${lineD}" stroke="#0d4495" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
  <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${mt + ch}" stroke="#344054" stroke-width="1.2"/>
  <line x1="${ml}" y1="${mt + ch}" x2="${W - mr}" y2="${mt + ch}" stroke="#344054" stroke-width="1.2"/>
  <text x="8" y="${mt + ch / 2}" font-size="11" font-family="Inter,sans-serif" fill="#475467" text-anchor="middle" transform="rotate(-90,8,${mt + ch / 2})">p</text>
  <text x="${W - mr + 8}" y="${mt + ch + 4}" font-size="11" font-family="Inter,sans-serif" fill="#475467">t</text>
  ${pLabels.map(l => `<text x="${ml - 4}" y="${(l.y + 4).toFixed(1)}" font-size="8.5" font-family="Inter,sans-serif" fill="#0c3e88" text-anchor="end">${l.text}</text>`).join('\n  ')}
  <text x="${(px(xs[4]) + 2).toFixed(1)}" y="${(py(p_high) - 2).toFixed(1)}" font-size="8" font-family="Inter,sans-serif" fill="#0c3e88">p3+pt</text>
  ${phaseLabels.map(l => `<text x="${l.x.toFixed(1)}" y="${(mt + ch + 14).toFixed(1)}" font-size="9" font-family="Inter,sans-serif" fill="#475467" text-anchor="middle">${l.label}</text>`).join('\n  ')}
  ${xs.slice(1, -1).map(f => `<line x1="${px(f).toFixed(1)}" y1="${(mt + ch).toFixed(1)}" x2="${px(f).toFixed(1)}" y2="${(mt + ch + 4).toFixed(1)}" stroke="#475467" stroke-width="1"/>`).join('\n  ')}
</svg>`;
}

/** Format seconds to HH:MM:SS */
function formatCountdown(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(sec).padStart(2, '0'),
  };
}

/** Standard proto-banner init */
function initProtoBanner() {
  if (!window.USE_MOCK) return;
  const banner = document.getElementById('proto-banner');
  if (banner) { banner.classList.add('visible'); document.body.classList.add('has-banner'); }
  const tri = document.createElement('div');
  tri.style.cssText = 'position:fixed;top:0;left:0;z-index:10000;width:56px;height:56px;clip-path:polygon(0 0,100% 0,0 100%);background:#f59e0b;cursor:pointer;';
  tri.title = 'In Progress';
  let lbl = null, t = null;
  tri.addEventListener('click', () => {
    if (lbl) { lbl.remove(); lbl = null; clearTimeout(t); return; }
    lbl = Object.assign(document.createElement('div'), { textContent: 'In Progress' });
    lbl.style.cssText = 'position:fixed;top:6px;left:6px;z-index:10001;background:#f59e0b;color:#fff;font-family:Inter,sans-serif;font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;pointer-events:none;';
    document.body.appendChild(lbl);
    t = setTimeout(() => { lbl?.remove(); lbl = null; }, 4000);
  });
  document.body.appendChild(tri);
}
