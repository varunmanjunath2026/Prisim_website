// Christmas add-on for the whole site. Everything festive lives in this one file:
// snowfall, a string of twinkling lights along the top, snow caps on the pricing
// cards and footer, and a small greeting with a snow on/off switch.
// It only adds elements outside the page content, so the orange-and-black site is untouched.
//
// To switch it off: set ENABLED to false below, or remove the christmas.js line
// from site-base.js (and the <script> tag in 404.html).
(() => {
  const ENABLED = true;
  if (!ENABLED || window.__prisimXmas) return;
  window.__prisimXmas = true;

  const ORANGE = "#ff991c";
  const RED = "#e85442";
  const GOLD = "#ffc46b";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  const css = `
    #xmas-snow{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147480000}
    #xmas-lights{position:fixed;top:0;left:0;right:0;height:26px;pointer-events:none;z-index:2147480500;overflow:hidden}
    #xmas-lights svg{display:block;width:100%;height:26px}
    #xmas-lights .b{animation:xmas-twinkle 2.6s ease-in-out infinite}
    #xmas-lights .b:nth-child(3n){animation-delay:-.9s}
    #xmas-lights .b:nth-child(3n+1){animation-delay:-1.7s}
    #xmas-lights .b:nth-child(4n){animation-duration:3.4s}
    @keyframes xmas-twinkle{0%,100%{opacity:1}50%{opacity:.35}}

    /* snow resting on the pricing cards and along the top of the footer */
    .framer-9mDat.framer-14qy8mi::before, footer.framer-wQvBV::before{
      content:"";position:absolute;left:18px;right:18px;top:0;height:16px;pointer-events:none;z-index:5;
      background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M0 0h120v5c-4 0-5 6-9 6s-4-4-8-4-5 8-10 8-4-6-9-6-5 3-9 3-4-5-8-5-5 7-10 7-5-4-9-4-4 5-9 5-5-6-9-6-4 3-8 3-5-7-10-7S4 11 0 9z' fill='%23ffffff' fill-opacity='.92'/%3E%3C/svg%3E") top/100% 100% no-repeat;
      filter:drop-shadow(0 2px 2px rgba(0,0,0,.25))}
    .framer-9mDat.framer-14qy8mi{position:relative}
    footer.framer-wQvBV::before{left:0;right:0;height:14px}

    #xmas-greet{position:fixed;left:22px;bottom:22px;z-index:2147482000;display:flex;align-items:center;gap:10px;
      font:600 14px/1.2 Inter,"Inter Placeholder",system-ui,sans-serif;color:#fff}
    #xmas-greet .pill{display:flex;align-items:center;gap:8px;padding:10px 14px 10px 12px;border-radius:999px;
      background:rgba(10,10,10,.82);border:1px solid rgba(255,153,28,.55);box-shadow:0 8px 24px rgba(0,0,0,.35);
      -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
    #xmas-greet .pill b{color:${ORANGE};font-weight:700}
    #xmas-greet .tree{font-size:18px;line-height:1}
    #xmas-greet button{all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;
      width:40px;height:40px;border-radius:50%;background:rgba(10,10,10,.82);border:1px solid rgba(255,153,28,.55);
      box-shadow:0 8px 24px rgba(0,0,0,.35);transition:transform .2s ease}
    #xmas-greet button:hover{transform:scale(1.08)}
    #xmas-greet button:focus-visible{outline:2px solid ${ORANGE};outline-offset:2px}
    #xmas-greet button svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round}
    #xmas-greet button[aria-pressed="false"] svg{stroke:rgba(255,255,255,.45)}
    #xmas-greet .x{width:22px;height:22px;margin-left:2px;border:0;background:none;box-shadow:none;opacity:.6}
    #xmas-greet .x svg{width:14px;height:14px}
    @media (max-width:809.98px){
      #xmas-greet{left:16px;bottom:16px}
      #xmas-greet .pill{font-size:13px;padding:9px 12px 9px 10px}
      #xmas-lights,#xmas-lights svg{height:20px}
    }
    @media (max-width:380px){#xmas-greet .pill .long{display:none}}
    @media (prefers-reduced-motion:reduce){#xmas-lights .b{animation:none}}
  `;

  // ---------- string of lights ----------
  function buildLights() {
    const wrap = document.createElement("div");
    wrap.id = "xmas-lights";
    wrap.setAttribute("aria-hidden", "true");
    const draw = () => {
      const w = Math.max(320, window.innerWidth);
      const span = w < 810 ? 46 : 58;
      const n = Math.ceil(w / span);
      const colors = [ORANGE, "#ffffff", RED, GOLD];
      let wire = "M0 3";
      let bulbs = "";
      for (let i = 0; i < n; i++) {
        const x0 = i * span, x1 = x0 + span, mid = x0 + span / 2;
        wire += ` Q${mid} 13 ${x1} 3`;
        const c = colors[i % colors.length];
        bulbs += `<g class="b"><rect x="${mid - 2.5}" y="7" width="5" height="4" rx="1" fill="#3a3a3a"/>` +
          `<ellipse cx="${mid}" cy="15.5" rx="4" ry="5.5" fill="${c}" style="filter:drop-shadow(0 0 4px ${c})"/></g>`;
      }
      wrap.innerHTML = `<svg viewBox="0 0 ${w} 26" preserveAspectRatio="none"><path d="${wire}" stroke="#2b2b2b" stroke-width="1.5" fill="none"/>${bulbs}</svg>`;
    };
    draw();
    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 150); });
    return wrap;
  }

  // ---------- snowfall ----------
  function buildSnow() {
    const canvas = document.createElement("canvas");
    canvas.id = "xmas-snow";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, flakes = [], sparks = [], running = false, raf = 0, last = 0;

    const count = () => Math.round(Math.min(140, Math.max(35, (W * H) / 14000)));
    const make = (top) => {
      const r = Math.random() * 2.4 + 0.8;
      return {
        x: Math.random() * W, y: top ? -10 - Math.random() * H * 0.2 : Math.random() * H,
        r, vy: r * 0.35 + 0.25, phase: Math.random() * Math.PI * 2, sway: Math.random() * 0.6 + 0.2,
        o: Math.random() * 0.5 + 0.45, orange: Math.random() < 0.14,
      };
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = count();
      while (flakes.length < want) flakes.push(make(false));
      flakes.length = want;
    };
    const paint = (f) => {
      ctx.globalAlpha = f.o;
      ctx.fillStyle = f.orange ? ORANGE : "#ffffff";
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    };
    const frame = (now) => {
      const dt = Math.min(48, now - (last || now)) / 16.7;
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.phase += 0.012 * dt;
        f.y += f.vy * dt;
        f.x += Math.sin(f.phase) * f.sway * 0.5 * dt;
        if (f.y > H + 6) Object.assign(f, make(true));
        if (f.x > W + 6) f.x = -6; else if (f.x < -6) f.x = W + 6;
        paint(f);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.022 * dt; s.y += s.vy * dt; s.x += s.vx * dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life; ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    };
    const api = {
      el: canvas,
      start() {
        if (running || reduceMotion) return;
        running = true; canvas.style.display = ""; last = 0; raf = requestAnimationFrame(frame);
      },
      stop() { running = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); canvas.style.display = "none"; },
      on: () => running,
    };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (running) { cancelAnimationFrame(raf); raf = 0; } }
      else if (running && !raf) { last = 0; raf = requestAnimationFrame(frame); }
    });
    // a few glittering flakes follow the mouse on desktop
    if (finePointer && !reduceMotion) {
      let lastSpark = 0;
      window.addEventListener("pointermove", (e) => {
        if (!running || e.timeStamp - lastSpark < 45 || sparks.length > 40) return;
        lastSpark = e.timeStamp;
        sparks.push({ x: e.clientX, y: e.clientY, r: Math.random() * 1.6 + 0.8, vx: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 0.6 + 0.3, life: 1, c: Math.random() < 0.5 ? ORANGE : "#ffffff" });
      }, { passive: true });
    }
    return api;
  }

  // ---------- greeting + snow switch ----------
  function buildGreeting(snow) {
    const box = document.createElement("div");
    box.id = "xmas-greet";
    const flake = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2M4 10.5l1-3.5-3.5-1M20 13.5l-1 3.5 3.5 1M4 13.5l1 3.5-3.5 1M20 10.5l-1-3.5 3.5-1"/></svg>';
    const showPill = store.get("prisim-xmas-greet") !== "closed";
    box.innerHTML =
      (reduceMotion ? "" : `<button type="button" class="t" aria-label="Snowfall" title="Turn snowfall on or off">${flake}</button>`) +
      (showPill ? `<div class="pill" role="note"><span class="tree" aria-hidden="true">🎄</span><span><b>Merry Christmas</b><span class="long"> from Prisim</span></span>` +
        `<button type="button" class="x" aria-label="Close greeting"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>` : "");
    const t = box.querySelector(".t");
    const sync = () => t && t.setAttribute("aria-pressed", String(snow.on()));
    if (t) t.addEventListener("click", () => {
      if (snow.on()) { snow.stop(); store.set("prisim-xmas-snow", "off"); }
      else { snow.start(); store.set("prisim-xmas-snow", "on"); }
      sync();
    });
    const x = box.querySelector(".x");
    if (x) x.addEventListener("click", () => { box.querySelector(".pill").remove(); store.set("prisim-xmas-greet", "closed"); });
    box.sync = sync;
    return box;
  }

  const mount = () => {
    if (document.getElementById("xmas-snow")) return;
    const style = document.createElement("style");
    style.id = "xmas-style";
    style.textContent = css;
    document.head.appendChild(style);
    const snow = buildSnow();
    document.body.appendChild(snow.el);
    document.body.appendChild(buildLights());
    const greet = buildGreeting(snow);
    document.body.appendChild(greet);
    if (store.get("prisim-xmas-snow") === "off" || reduceMotion) snow.stop(); else snow.start();
    greet.sync();
  };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();
