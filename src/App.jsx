cd /home/claude && python3 << 'PYEOF'
import json
with open('layout-final.json') as f:
    data = f.read()

react = '''import React, { useState, useMemo, useEffect, useCallback } from 'react';

const D = ''' + data + ''';

const PARTY = {
  LO:  { name: 'Land Owner',                color: '#C9A84C' },
  DEV: { name: 'Developer',                 color: '#5A9FB8' },
  LPC: { name: 'Landowner Pre Commitment',  color: '#C1440E' }
};

const FACING_FULL = {
  N: 'North', S: 'South', E: 'East', W: 'West',
  NE: 'North-East', NW: 'North-West', SE: 'South-East', SW: 'South-West'
};

const LIGHTING = {
  dark: {
    label: 'Default',
    pageBg: 'radial-gradient(ellipse at top, #15110d 0%, #0a0908 60%, #050403 100%)',
    landBg: ['#1f1814', '#0f0c09'],
    water: ['#2a5a6e', '#1a3a4a'], waterStroke: '#5a8aa8',
    green: ['#3a5a3a', '#2a4a2a'], greenStroke: '#4a6a4a',
    road: '#1a1612', roadStroke: '#2a2520',
    social: '#5a4a3a', socialStroke: '#7a6850',
    utility: '#4a3a30', utilityStroke: '#6a5a45',
    bufferFill: 'rgba(74, 90, 58, 0.3)', bufferStroke: 'rgba(106, 138, 90, 0.5)',
    accent: '#C9A84C', text: '#e8e0d4', muted: '#a89a82', faint: '#8a7a5a',
    panel: 'rgba(10, 9, 8, 0.6)', border: 'rgba(201, 168, 76, 0.15)'
  },
  golden: {
    label: 'Golden Hour',
    pageBg: 'radial-gradient(ellipse at top, #4a2814 0%, #2a1810 50%, #0a0503 100%)',
    landBg: ['#3a2818', '#1f140a'],
    water: ['#a8743a', '#6a4218'], waterStroke: '#dca878',
    green: ['#6a5a2a', '#4a3a1a'], greenStroke: '#8a7a4a',
    road: '#2a1a0a', roadStroke: '#3a2a18',
    social: '#7a5a3a', socialStroke: '#9a7a5a',
    utility: '#5a4030', utilityStroke: '#7a6045',
    bufferFill: 'rgba(140, 90, 40, 0.3)', bufferStroke: 'rgba(170, 120, 60, 0.5)',
    accent: '#FFC46A', text: '#fff0d8', muted: '#d8b078', faint: '#aa8050',
    panel: 'rgba(20, 12, 6, 0.6)', border: 'rgba(255, 196, 106, 0.15)'
  },
  blue: {
    label: 'Blue Hour',
    pageBg: 'radial-gradient(ellipse at top, #0a1535 0%, #050a1a 60%, #02050d 100%)',
    landBg: ['#0f1830', '#080d1a'],
    water: ['#3a5aaa', '#1a3a7a'], waterStroke: '#7aaaff',
    green: ['#2a4a6a', '#1a2a4a'], greenStroke: '#4a6a8a',
    road: '#0a0f20', roadStroke: '#1a1f30',
    social: '#2a3a5a', socialStroke: '#4a5a7a',
    utility: '#2a304a', utilityStroke: '#4a5070',
    bufferFill: 'rgba(50, 80, 140, 0.3)', bufferStroke: 'rgba(80, 110, 170, 0.5)',
    accent: '#7AB8FF', text: '#d8e0f0', muted: '#a0b0d0', faint: '#7080a0',
    panel: 'rgba(8, 12, 24, 0.6)', border: 'rgba(122, 184, 255, 0.18)'
  }
};

const HALOS = [
  { r: 0.85, label: 'FUTURE CITY HUB . 5 MINS' },
  { r: 1.15, label: 'OUTER RING ROAD . 10 MINS' },
  { r: 1.50, label: 'PHARMA CITY . 20 MINS' },
  { r: 1.90, label: 'RGIA AIRPORT . 30 MINS' }
];

const PADDING = 25;
const SCALE = 2.6;
const HALO_EXT = 280;  // viewBox extension on right for halos

function ptsToPath(pts) {
  return pts.map(([x, y]) => `${x * SCALE + PADDING},${y * SCALE + PADDING}`).join(' ');
}

function centroid(pts) {
  const n = pts.length;
  let cx = 0, cy = 0;
  for (const [x, y] of pts) { cx += x; cy += y; }
  return [cx / n, cy / n];
}

// ───────── MEMOIZED STATIC LAYERS ─────────
const StaticLayers = React.memo(function StaticLayers({ theme }) {
  return (
    <g>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor={theme.landBg[0]} />
          <stop offset="100%" stopColor={theme.landBg[1]} />
        </radialGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.water[0]} />
          <stop offset="100%" stopColor={theme.water[1]} />
        </linearGradient>
        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.green[0]} />
          <stop offset="100%" stopColor={theme.green[1]} />
        </linearGradient>
      </defs>

      {D.boundary.map((poly, i) => (
        <polygon key={`b-${i}`} points={ptsToPath(poly)} fill="url(#bgGrad)" stroke={theme.faint} strokeWidth="0.5" />
      ))}
      {D.roads.map((poly, i) => (
        <polygon key={`r-${i}`} points={ptsToPath(poly)} fill={theme.road} stroke={theme.roadStroke} strokeWidth="0.3" />
      ))}
      {D.splay.map((poly, i) => (
        <polygon key={`s-${i}`} points={ptsToPath(poly)} fill={theme.road} stroke={theme.roadStroke} strokeWidth="0.2" />
      ))}
      {D.green.map((poly, i) => (
        <polygon key={`g-${i}`} points={ptsToPath(poly)} fill="url(#greenGrad)" stroke={theme.greenStroke} strokeWidth="0.4" />
      ))}
      {D.social.map((poly, i) => (
        <polygon key={`si-${i}`} points={ptsToPath(poly)} fill={theme.social} stroke={theme.socialStroke} strokeWidth="0.4" opacity="0.85" />
      ))}
      {D.utility.map((poly, i) => (
        <polygon key={`u-${i}`} points={ptsToPath(poly)} fill={theme.utility} stroke={theme.utilityStroke} strokeWidth="0.3" opacity="0.8" />
      ))}
      {D.buffer.map((poly, i) => (
        <polygon key={`bf-${i}`} points={ptsToPath(poly)} fill={theme.bufferFill} stroke={theme.bufferStroke} strokeWidth="0.3" strokeDasharray="2,1.5" />
      ))}
      {D.water.map((poly, i) => (
        <polygon key={`w-${i}`} points={ptsToPath(poly)} fill="url(#waterGrad)" stroke={theme.waterStroke} strokeWidth="0.5" className="water-shimmer" />
      ))}
    </g>
  );
});

// ───────── GEOGRAPHIC HALOS ─────────
const GeoHalos = React.memo(function GeoHalos({ theme, W, H }) {
  // Anchor at the right edge of layout, vertically centered
  const cx = W * 0.78;
  const cy = H * 0.45;
  const baseR = H * 0.55;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        {HALOS.map((h, i) => {
          const r = baseR * h.r;
          // Arc from top-right going clockwise around to bottom-right
          const startAngle = -Math.PI * 0.42;
          const endAngle = Math.PI * 0.42;
          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          return (
            <path key={`hp-${i}`} id={`halo-arc-${i}`}
              d={`M ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2}`}
              fill="none" />
          );
        })}
      </defs>
      {HALOS.map((h, i) => {
        const r = baseR * h.r;
        return (
          <g key={`hg-${i}`}>
            <use href={`#halo-arc-${i}`} fill="none"
              stroke={theme.accent} strokeOpacity="0.08" strokeWidth="0.4"
              strokeDasharray="3,5" />
            <text fill={theme.accent} fillOpacity="0.32"
              fontSize="6" letterSpacing="2.2"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
              <textPath href={`#halo-arc-${i}`} startOffset="50%" textAnchor="middle">
                {h.label}
              </textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
});

// ───────── MAIN ─────────
export default function Yeliminedu() {
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(12);
  const [showLabels, setShowLabels] = useState(false);
  const [lightingMode, setLightingMode] = useState('dark');
  const [tourPlaying, setTourPlaying] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mobileMenu, setMobileMenu] = useState(false);

  const isMobile = windowWidth < 900;
  const theme = LIGHTING[lightingMode];

  // (5) Font injection with ID guard
  useEffect(() => {
    if (document.getElementById('yel-fonts-link')) return;
    const link = document.createElement('link');
    link.id = 'yel-fonts-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  // (2) Window size for responsive
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // (4) Mouse tracking, only when hovering
  useEffect(() => {
    if (!hovered) return;
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
  }, [hovered]);

  // (7) Tour auto-stop after duration
  useEffect(() => {
    if (!tourPlaying) return;
    const t = setTimeout(() => setTourPlaying(false), 25000);
    return () => clearTimeout(t);
  }, [tourPlaying]);

  // (3) Resilient party stats
  const partyStats = useMemo(() => {
    const s = { LO: { count: 0, area: 0 }, DEV: { count: 0, area: 0 }, LPC: { count: 0, area: 0 } };
    if (!Array.isArray(D.plots)) return s;
    D.plots.forEach(p => {
      if (!p || typeof p !== 'object') return;
      const pa = p.pa;
      if (!pa || !s[pa]) return;
      const sz = typeof p.s === 'number' && isFinite(p.s) ? p.s : 0;
      s[pa].count += 1;
      s[pa].area += sz;
    });
    return s;
  }, []);

  const W = D.w * SCALE + PADDING * 2;
  const H = D.h * SCALE + PADDING * 2;
  const VB_W = W + HALO_EXT;

  // (10) Depth-of-field blur per plot, memoized on tilt
  const blurMap = useMemo(() => {
    if (tilt <= 20) return null;
    const centerY = D.h / 2;
    const halfH = D.h / 2;
    const strength = Math.min((tilt - 20) / 20, 1);
    const map = {};
    D.plots.forEach(p => {
      const [, cy] = centroid(p.p);
      const norm = Math.abs(cy - centerY) / halfH;
      const blur = Math.min(norm * strength * 2.2, 2.5);
      if (blur > 0.15) map[p.n] = blur;
    });
    return map;
  }, [tilt]);

  const sortedPartyPlots = useMemo(() => {
    if (!selectedParty) return [];
    return D.plots.filter(p => p && p.pa === selectedParty).sort((a, b) => a.n - b.n);
  }, [selectedParty]);

  const currentPlot = selectedPlot !== null ? D.plots.find(p => p && p.n === selectedPlot) : null;

  const onPlotEnter = useCallback((n) => setHovered(n), []);
  const onPlotLeave = useCallback(() => setHovered(null), []);

  const closeMobileMenu = () => setMobileMenu(false);
  const showLeftRail = !isMobile || mobileMenu;

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.pageBg,
      color: theme.text,
      fontFamily: "'Manrope', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 1.2s ease'
    }}>
      <style>{`
        @keyframes waterShimmer { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.78; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.82; } }
        @keyframes droneTour {
          0%   { transform: rotateX(12deg) scale(1)   translate3d(0,0,0); }
          8%   { transform: rotateX(22deg) scale(1.1) translate3d(0,-30px,0); }
          22%  { transform: rotateX(34deg) scale(1.55) translate3d(-90px,-180px,0); }
          38%  { transform: rotateX(40deg) scale(1.8)  translate3d(60px,160px,0); }
          54%  { transform: rotateX(30deg) scale(1.4)  translate3d(120px,40px,0); }
          70%  { transform: rotateX(18deg) scale(1.15) translate3d(40px,-60px,0); }
          85%  { transform: rotateX(10deg) scale(1.02) translate3d(0,0,0); }
          100% { transform: rotateX(12deg) scale(1)    translate3d(0,0,0); }
        }
        .water-shimmer { animation: waterShimmer 4s ease-in-out infinite; }
        .fadeup { animation: fadeUp 0.4s ease-out backwards; }
        .plot-poly { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease, opacity 0.3s ease; cursor: pointer; transform-box: fill-box; transform-origin: center; }
        .plot-poly:hover { transform: scale(1.08) translateY(-2px); filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6)) drop-shadow(0 0 6px rgba(255,255,255,0.4)) !important; }
        .plot-breathe { animation: breathe 4s ease-in-out infinite; }
        .display-font { font-family: 'Fraunces', Georgia, serif; }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
        .plot-row { transition: background 0.15s; cursor: pointer; }
        .plot-row:hover { background: rgba(255,255,255,0.04); }
        .tour-wrapper { animation: droneTour 25s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: ${theme.accent}30; border-radius: 3px; }
        input[type=range] { accent-color: ${theme.accent}; }
        .light-btn { transition: all 0.2s ease; }
        .light-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* MOBILE BACKDROP */}
      {isMobile && mobileMenu && (
        <div onClick={closeMobileMenu}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 20, backdropFilter: 'blur(4px)' }} />
      )}

      {/* MOBILE TOP BAR */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 56,
          background: theme.panel, backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', zIndex: 15
        }}>
          <div className="display-font" style={{ fontSize: 18, color: theme.text }}>
            Yeliminedu
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)}
            style={{ background: 'none', border: `1px solid ${theme.border}`, color: theme.text, padding: '6px 12px', fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer' }}>
            {mobileMenu ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 2,
        paddingTop: isMobile ? 56 : 0
      }}>

        {/* LEFT RAIL */}
        <aside style={{
          width: isMobile ? '85%' : 360,
          maxWidth: isMobile ? 360 : 'unset',
          minWidth: isMobile ? 'unset' : 360,
          padding: '32px 28px',
          borderRight: isMobile ? 'none' : `1px solid ${theme.border}`,
          background: theme.panel,
          backdropFilter: 'blur(10px)',
          display: showLeftRail ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 24,
          maxHeight: isMobile ? 'calc(100vh - 56px)' : '100vh',
          overflowY: 'auto',
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 56 : 'auto',
          left: isMobile ? 0 : 'auto',
          bottom: isMobile ? 0 : 'auto',
          zIndex: isMobile ? 22 : 2,
          boxShadow: isMobile ? '4px 0 24px rgba(0,0,0,0.6)' : 'none'
        }}>
          <div className="fadeup">
            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: theme.faint, marginBottom: 6 }}>
              ELMINEDU . LAYOUT DISTRIBUTION
            </div>
            <h1 className="display-font" style={{ fontSize: 38, fontWeight: 400, lineHeight: 1, margin: 0, color: theme.text, letterSpacing: '-0.02em' }}>
              Yeliminedu
            </h1>
            <div className="display-font" style={{ fontSize: 14, fontStyle: 'italic', color: theme.accent, marginTop: 4 }}>
              యెల్లి మినేడు
            </div>
            <div style={{ height: 1, background: `linear-gradient(to right, ${theme.accent} 0%, transparent 100%)`, margin: '20px 0 0', width: 60 }} />
          </div>

          {/* PARTY BUTTONS */}
          <div className="fadeup" style={{ animationDelay: '0.1s' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', color: theme.faint, marginBottom: 14 }}>OWNERSHIP</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedParty && (
                <button onClick={() => { setSelectedParty(null); setSelectedPlot(null); }}
                  style={{ padding: '10px 14px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.muted, textAlign: 'left', cursor: 'pointer', fontSize: 12, letterSpacing: '0.1em', fontFamily: 'inherit' }}>
                  ← Show all parties
                </button>
              )}
              {Object.entries(PARTY).map(([k, m]) => {
                const active = selectedParty === k;
                const dimmed = selectedParty && !active;
                return (
                  <button key={k}
                    onClick={() => { setSelectedParty(active ? null : k); setSelectedPlot(null); if (isMobile) closeMobileMenu(); }}
                    style={{
                      padding: '16px 18px',
                      background: active ? `${m.color}22` : 'rgba(0,0,0,0.25)',
                      border: `1px solid ${active ? m.color : theme.border}`,
                      opacity: dimmed ? 0.35 : 1,
                      color: theme.text, textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'inherit', display: 'flex', flexDirection: 'column', gap: 6,
                      transition: 'all 0.2s'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 12, height: 12, background: m.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: active ? m.color : theme.text }}>
                        {m.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 11, color: theme.muted, paddingLeft: 22 }}>
                      <span className="mono">{partyStats[k].count} plots</span>
                      <span className="mono">{partyStats[k].area.toLocaleString()} sq.yds</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PLOT LIST */}
          {selectedParty && (
            <div className="fadeup" style={{ animationDelay: '0.15s', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', color: theme.faint, marginBottom: 10 }}>
                {PARTY[selectedParty].name.toUpperCase()} . {sortedPartyPlots.length} PLOTS
              </div>
              <div style={{ flex: 1, overflowY: 'auto', borderTop: `1px solid ${PARTY[selectedParty].color}30` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 50px 60px', fontSize: 9, letterSpacing: '0.15em', color: theme.faint, padding: '8px 0 6px', borderBottom: `1px solid ${theme.border}` }}>
                  <span>NO</span><span></span>
                  <span style={{ textAlign: 'right' }}>SIZE</span>
                  <span style={{ textAlign: 'right' }}>FACING</span>
                </div>
                {sortedPartyPlots.map(p => {
                  const isSel = selectedPlot === p.n;
                  return (
                    <div key={p.n} className="plot-row"
                      onClick={() => { setSelectedPlot(p.n); if (isMobile) closeMobileMenu(); }}
                      onMouseEnter={() => onPlotEnter(p.n)} onMouseLeave={onPlotLeave}
                      style={{
                        display: 'grid', gridTemplateColumns: '36px 1fr 50px 60px',
                        alignItems: 'center', padding: '8px 0',
                        background: isSel ? `${PARTY[selectedParty].color}22` : 'transparent',
                        borderBottom: `1px solid ${theme.border}`, fontSize: 12
                      }}>
                      <span className="mono" style={{ color: isSel ? PARTY[selectedParty].color : theme.muted, fontWeight: 500 }}>
                        {String(p.n).padStart(3, '0')}
                      </span><span></span>
                      <span className="mono" style={{ textAlign: 'right', color: theme.text }}>{p.s}</span>
                      <span style={{ textAlign: 'right', color: theme.faint, fontSize: 10, letterSpacing: '0.1em' }}>{p.f}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTROLS, hidden when party selected to keep focus */}
          {!selectedParty && (
            <>
              {/* LIGHTING */}
              <div className="fadeup" style={{ animationDelay: '0.2s' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.25em', color: theme.faint, marginBottom: 12 }}>LIGHTING</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(LIGHTING).map(([k, t]) => {
                    const active = lightingMode === k;
                    return (
                      <button key={k} onClick={() => setLightingMode(k)} className="light-btn"
                        style={{
                          flex: 1, padding: '10px 6px',
                          background: active ? `${t.accent}22` : 'rgba(0,0,0,0.25)',
                          border: `1px solid ${active ? t.accent : theme.border}`,
                          color: active ? t.accent : theme.muted,
                          fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}>
                        {t.label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TOUR */}
              <div className="fadeup" style={{ animationDelay: '0.25s' }}>
                <button onClick={() => setTourPlaying(true)} disabled={tourPlaying}
                  style={{
                    width: '100%', padding: '14px 18px',
                    background: tourPlaying ? `${theme.accent}11` : `${theme.accent}18`,
                    border: `1px solid ${theme.accent}`,
                    color: theme.accent, fontSize: 11, letterSpacing: '0.3em',
                    cursor: tourPlaying ? 'wait' : 'pointer',
                    fontFamily: 'inherit', fontWeight: 500,
                    transition: 'all 0.2s'
                  }}>
                  {tourPlaying ? '◆ TOUR IN PROGRESS' : '▶️  PLAY DRONE TOUR'}
                </button>
              </div>

              {/* PERSPECTIVE */}
              <div className="fadeup" style={{ animationDelay: '0.3s' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.25em', color: theme.faint, marginBottom: 12 }}>PERSPECTIVE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.muted, marginBottom: 6 }}>
                  <span>Tilt</span><span className="mono">{tilt}°{tilt > 20 ? ' . tilt-shift' : ''}</span>
                </div>
                <input type="range" min="0" max="40" value={tilt} onChange={(e) => setTilt(+e.target.value)}
                  disabled={tourPlaying} style={{ width: '100%' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: theme.muted, cursor: 'pointer', marginTop: 14 }}>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)}
                    style={{ accentColor: theme.accent }} />
                  <span>Show plot numbers</span>
                </label>
              </div>
            </>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${theme.border}`, fontSize: 10, color: theme.faint, letterSpacing: '0.1em', lineHeight: 1.7 }}>
            169 PLOTS . 45,679 SQ.YDS<br/>JDA . MARCH 2026
          </div>
        </aside>

        {/* MAIN CANVAS */}
        <main style={{
          flex: 1, position: 'relative', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? 16 : 40, perspective: '2000px',
          minHeight: isMobile ? 'calc(100vh - 56px)' : '100vh'
        }}>
          {!isMobile && (
            <>
              <div style={{ position: 'absolute', top: 32, right: 32, fontSize: 11, letterSpacing: '0.2em', color: theme.faint, textAlign: 'center', zIndex: 5 }}>
                <div className="display-font" style={{ fontSize: 28, color: theme.accent, lineHeight: 1, fontStyle: 'italic' }}>N</div>
                <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, ${theme.accent}, transparent)`, margin: '4px auto' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 32, right: 32, fontSize: 10, letterSpacing: '0.2em', color: theme.faint, zIndex: 5, textAlign: 'right' }}>
                <div style={{ width: 80, height: 1, background: theme.faint, marginBottom: 4, marginLeft: 'auto' }} />
                <div className="mono">50 m</div>
              </div>
            </>
          )}

          <div
            className={tourPlaying ? 'tour-wrapper' : ''}
            style={{
              transform: tourPlaying ? undefined : `rotateX(${tilt}deg)`,
              transformStyle: 'preserve-3d',
              transition: tourPlaying ? 'none' : 'transform 0.4s ease',
              transformOrigin: 'center center',
              height: isMobile ? '70vh' : '88vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              maxWidth: '100%'
            }}>
            <svg viewBox={`0 0 ${VB_W} ${H}`} preserveAspectRatio="xMidYMid meet"
              style={{ height: '100%', width: 'auto', maxWidth: '100%',
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8))' }}>

              <GeoHalos theme={theme} W={W} H={H} />
              <StaticLayers theme={theme} />

              {/* PLOTS (interactive layer) */}
              {D.plots.map(plot => {
                if (!plot || !PARTY[plot.pa]) return null;
                const meta = PARTY[plot.pa];
                const matches = !selectedParty || plot.pa === selectedParty;
                const isSelected = selectedPlot === plot.n;
                const isHovered = hovered === plot.n;
                const [cx, cy] = centroid(plot.p);
                const opacity = matches ? 1 : 0.08;
                const blur = blurMap && matches && !isSelected && !isHovered ? blurMap[plot.n] : null;

                return (
                  <g key={plot.n}>
                    <polygon points={ptsToPath(plot.p)}
                      fill={meta.color}
                      stroke={isSelected ? '#fff5d8' : isHovered ? '#ffffff' : '#0a0908'}
                      strokeWidth={isSelected ? 1.2 : 0.4}
                      opacity={opacity}
                      className={`plot-poly ${matches && !isSelected ? 'plot-breathe' : ''}`}
                      style={blur ? { filter: `blur(${blur.toFixed(2)}px)` } : undefined}
                      onClick={() => setSelectedPlot(plot.n)}
                      onMouseEnter={() => onPlotEnter(plot.n)}
                      onMouseLeave={onPlotLeave} />
                    {(showLabels || isSelected || isHovered) && matches && (
                      <text x={cx * SCALE + PADDING} y={cy * SCALE + PADDING + 2}
                        textAnchor="middle"
                        fontSize={isSelected || isHovered ? 7 : 4.5}
                        fontFamily="JetBrains Mono, monospace" fontWeight="600"
                        fill={isSelected ? '#0a0908' : '#1a1410'}
                        pointerEvents="none"
                        style={{ transition: 'font-size 0.2s' }}>
                        {plot.n}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* MOUSE-FOLLOWING TOOLTIP */}
          {hovered && !selectedPlot && (() => {
            const p = D.plots.find(x => x && x.n === hovered);
            if (!p || !PARTY[p.pa]) return null;
            const meta = PARTY[p.pa];
            // Position to avoid edges
            const w = 220;
            const h = 120;
            const margin = 16;
            let x = mousePos.x + 18;
            let y = mousePos.y + 18;
            if (typeof window !== 'undefined') {
              if (x + w + margin > window.innerWidth) x = mousePos.x - w - 18;
              if (y + h + margin > window.innerHeight) y = mousePos.y - h - 18;
            }
            return (
              <div style={{
                position: 'fixed', top: y, left: x,
                background: theme.panel,
                border: `1px solid ${meta.color}60`,
                padding: '14px 18px', backdropFilter: 'blur(12px)',
                fontSize: 13, minWidth: w, pointerEvents: 'none', zIndex: 50,
                transition: 'transform 0.1s ease-out',
                boxShadow: `0 8px 24px rgba(0,0,0,0.5)`
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', color: theme.faint }}>PLOT</div>
                <div className="display-font" style={{ fontSize: 28, fontWeight: 400, color: theme.text, lineHeight: 1, margin: '2px 0 8px' }}>
                  {String(p.n).padStart(3, '0')}
                </div>
                <div style={{ display: 'flex', gap: 18, fontSize: 12, marginBottom: 8 }}>
                  <div>
                    <div style={{ color: theme.faint, fontSize: 10, letterSpacing: '0.1em' }}>SIZE</div>
                    <div className="mono" style={{ color: theme.text }}>{p.s} sq.yds</div>
                  </div>
                  <div>
                    <div style={{ color: theme.faint, fontSize: 10, letterSpacing: '0.1em' }}>FACING</div>
                    <div className="mono" style={{ color: theme.text }}>{p.f}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', color: meta.color, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, background: meta.color }} />
                  {meta.name.toUpperCase()}
                </div>
              </div>
            );
          })()}
        </main>

        {/* RIGHT DETAIL */}
        {currentPlot && PARTY[currentPlot.pa] && (
          <aside style={{
            width: isMobile ? '100%' : 320,
            minWidth: isMobile ? 'unset' : 320,
            padding: isMobile ? '24px 20px' : '32px 28px',
            borderLeft: isMobile ? 'none' : `1px solid ${PARTY[currentPlot.pa].color}30`,
            borderTop: isMobile ? `1px solid ${PARTY[currentPlot.pa].color}30` : 'none',
            background: theme.panel,
            backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', gap: 20,
            maxHeight: isMobile ? '50vh' : '100vh',
            overflowY: 'auto', animation: 'fadeUp 0.3s ease-out',
            position: isMobile ? 'fixed' : 'relative',
            bottom: isMobile ? 0 : 'auto', left: isMobile ? 0 : 'auto', right: isMobile ? 0 : 'auto',
            zIndex: isMobile ? 18 : 2,
            boxShadow: isMobile ? '0 -8px 32px rgba(0,0,0,0.6)' : 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.3em', color: theme.faint }}>PLOT NO</div>
                <div className="display-font" style={{ fontSize: 72, fontWeight: 300, lineHeight: 1, color: theme.text, letterSpacing: '-0.04em' }}>
                  {String(currentPlot.n).padStart(3, '0')}
                </div>
              </div>
              <button onClick={() => setSelectedPlot(null)}
                style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 28, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ height: 1, background: `linear-gradient(to right, ${PARTY[currentPlot.pa].color}, transparent)`, width: 80 }} />

            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', color: theme.faint, marginBottom: 6 }}>OWNERSHIP</div>
              <div className="display-font" style={{ fontSize: 22, fontStyle: 'italic', color: PARTY[currentPlot.pa].color, lineHeight: 1.2 }}>
                {PARTY[currentPlot.pa].name}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', color: theme.faint, marginBottom: 4 }}>SIZE</div>
                <div className="display-font" style={{ fontSize: 28, fontWeight: 400, color: theme.text, lineHeight: 1 }}>{currentPlot.s}</div>
                <div style={{ fontSize: 10, color: theme.faint, marginTop: 2 }}>sq.yds</div>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', color: theme.faint, marginBottom: 4 }}>FACING</div>
                <div className="display-font" style={{ fontSize: 28, fontWeight: 400, color: theme.text, lineHeight: 1 }}>{currentPlot.f}</div>
                <div style={{ fontSize: 10, color: theme.faint, marginTop: 2 }}>{FACING_FULL[currentPlot.f] || ''}</div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 16, fontSize: 10, color: theme.faint, letterSpacing: '0.1em', lineHeight: 1.7 }}>
              ELMINEDU JDA<br/>MARCH 2026 . FINAL
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
'''

with open('/mnt/user-data/outputs/yeliminedu-layout.jsx', 'w') as f:
    f.write(react)

import os
print(f"Written: {os.path.getsize('/mnt/user-data/outputs/yeliminedu-layout.jsx')} bytes, {len(react.splitlines())} lines")
PYEOF
