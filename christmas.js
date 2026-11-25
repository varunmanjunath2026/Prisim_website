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
  const wrapAnimate = () => typeof Element.prototype.animate === "function";
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
    .framer-9mDat .framer-1by002t{z-index:6}  /* keep the "Best Value" tag above the snow */
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
      spark(x, y) {
        if (!running || sparks.length > 80) return;
        sparks.push({ x, y, r: Math.random() * 2 + 1, vx: -(Math.random() * 0.8 + 0.2), vy: Math.random() * 0.8 + 0.2,
          life: 1, c: Math.random() < 0.6 ? GOLD : Math.random() < 0.5 ? ORANGE : "#ffffff" });
      },
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

  // ---------- Santa hat on the last "e" of "Software" in the home page heading ----------
  // Drawn outside the page content and kept in place over the letter, so the heading itself is untouched.
  function buildHat() {
    const hat = document.createElement("div");
    hat.id = "xmas-hat";
    hat.setAttribute("aria-hidden", "true");
    hat.innerHTML =
      '<svg viewBox="0 0 100 84" width="100%" height="100%">' +
      '<path d="M12 64 C16 34 36 12 60 11 C76 10 88 19 92 36 L85 39 C80 30 72 27 66 30 C74 41 80 52 86 64 Z" fill="#d63a2b"/>' +
      '<path d="M60 11 C76 10 88 19 92 36 L85 39 C80 30 72 27 66 30 C58 22 50 16 40 15 C46 12 53 11 60 11 Z" fill="#b02a1e" opacity=".55"/>' +
      '<circle cx="91" cy="39" r="8.5" fill="#fff"/>' +
      '<rect x="4" y="60" width="90" height="17" rx="8.5" fill="#fff"/>' +
      '<path d="M10 66 Q20 63 30 66 T50 66 T70 66 T90 66" stroke="#e6e6e6" stroke-width="2" fill="none"/>' +
      "</svg>";
    Object.assign(hat.style, {
      position: "absolute", left: "0", top: "0", width: "0", height: "0", pointerEvents: "none",
      zIndex: "2147479000", transformOrigin: "30% 90%", transform: "rotate(18deg)", display: "none",
      filter: "drop-shadow(0 3px 4px rgba(0,0,0,.45))",
    });

    let word = null;
    const findWord = () => {
      const main = document.getElementById("main") || document.body;
      for (const p of main.querySelectorAll("p, span, h1")) {
        if (p.childElementCount === 0 && p.textContent.trim() === "Software") {
          const r = p.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) return p;
        }
      }
      return null;
    };
    const place = () => {
      if (!word || !word.isConnected || !word.getClientRects().length) word = findWord();
      if (!word) { hat.style.display = "none"; return; }
      const text = word.firstChild;
      if (!text || text.nodeType !== 3) { hat.style.display = "none"; return; }
      const end = text.textContent.replace(/\s+$/, "").length;
      const range = document.createRange();
      range.setStart(text, end - 1);
      range.setEnd(text, end);
      const r = range.getBoundingClientRect();
      if (!r.width) { hat.style.display = "none"; return; }
      const w = r.width * 1.35;
      const h = w * 0.84;
      // the "e" starts roughly a third of the way down the line box
      const letterTop = r.top + r.height * 0.3;
      hat.style.display = "block";
      hat.style.width = w + "px";
      hat.style.height = h + "px";
      hat.style.left = r.left + window.scrollX + r.width / 2 - w * 0.42 + "px";
      hat.style.top = letterTop + window.scrollY - h * 0.8 + "px";
    };
    return { el: hat, place };
  }

  // ---------- Santa's sleigh flying across the screen every so often ----------
  function buildSleigh(snow) {
    const deer = (x, nose) =>
      `<g transform="translate(${x} 0)">` +
      // antlers
      '<path d="M44 14 l-3 -9 M41 9 l-5 -3 M44 14 l3 -10 M46 8 l5 -3" stroke="#e8c27a" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      // legs (galloping)
      '<g stroke="#8a5a2e" stroke-width="3" stroke-linecap="round" fill="none">' +
      '<path class="lf" d="M30 36 l6 9"/><path class="lb" d="M27 36 l-2 10"/><path class="lf" d="M12 35 l-6 8"/><path class="lb" d="M15 35 l2 10"/></g>' +
      // body, neck, head, tail
      '<ellipse cx="22" cy="30" rx="15" ry="8" fill="#b9773f"/>' +
      '<path d="M32 26 C36 22 38 18 40 16 L46 19 C42 22 40 26 36 31 Z" fill="#b9773f"/>' +
      '<ellipse cx="45" cy="17" rx="6" ry="4.5" fill="#c98a4b"/>' +
      '<path d="M41 13 l-4 -2 3 4 z" fill="#8a5a2e"/>' +
      '<circle cx="46" cy="15.5" r="1" fill="#1a1a1a"/>' +
      `<circle cx="51" cy="18" r="${nose ? 2.6 : 1.6}" fill="${nose ? "#ff3b30" : "#3a2414"}"${nose ? ' style="filter:drop-shadow(0 0 4px #ff3b30)"' : ""}/>` +
      '<path d="M7 27 l-5 -3 2 5 z" fill="#f3e6d6"/>' +
      // harness
      '<path d="M15 23 C18 30 26 31 31 25" stroke="#d63a2b" stroke-width="2.5" fill="none"/>' +
      '<circle cx="23" cy="29" r="1.6" fill="#ffc46b"/>' +
      "</g>";
    const sleigh =
      '<g transform="translate(0 0)">' +
      // reins
      '<path d="M78 34 C95 30 110 30 128 30 M78 34 C110 26 150 25 186 26" stroke="#ffc46b" stroke-width="1.2" fill="none" opacity=".85"/>' +
      // gift sack + presents
      '<rect x="8" y="12" width="14" height="13" rx="2" fill="#ff991c"/><path d="M15 12v13M8 18h14" stroke="#fff" stroke-width="1.6"/>' +
      '<rect x="18" y="16" width="12" height="10" rx="2" fill="#2f9e5b"/><path d="M24 16v10" stroke="#ffc46b" stroke-width="1.6"/>' +
      // Santa
      '<path d="M44 26 C44 14 52 9 58 10 C64 11 66 18 66 26 Z" fill="#d63a2b"/>' +
      '<circle cx="58" cy="9" r="6" fill="#f2c6a0"/>' +
      '<path d="M52 10 C53 18 63 18 64 10 C62 14 54 14 52 10 Z" fill="#fff"/>' +
      '<path d="M52 6 C54 -2 62 -3 66 1 C69 4 71 8 72 11 L68 11 C66 7 64 5 62 5 Z" fill="#d63a2b"/>' +
      '<rect x="51" y="4" width="13" height="4" rx="2" fill="#fff"/><circle cx="72" cy="11" r="2.6" fill="#fff"/>' +
      '<path d="M64 19 L76 30" stroke="#d63a2b" stroke-width="4" stroke-linecap="round"/>' +
      // sleigh body and runners
      '<path d="M4 24 H74 C82 24 84 30 80 36 C76 42 66 44 56 44 H18 C8 44 2 36 4 24 Z" fill="#d63a2b"/>' +
      '<path d="M8 28 H72" stroke="#ffc46b" stroke-width="2"/>' +
      '<path d="M10 44 v6 M60 44 v6 M2 52 H74 C82 52 86 48 86 44" stroke="#ffc46b" stroke-width="2.5" stroke-linecap="round" fill="none"/>' +
      "</g>";
    const wrap = document.createElement("div");
    wrap.id = "xmas-sleigh";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      `<div class="bob"><svg viewBox="-4 -6 250 62" width="100%" height="100%">${sleigh}${deer(126, false)}${deer(186, true)}</svg></div>`;

    const style = document.createElement("style");
    style.textContent = `
      #xmas-sleigh{position:fixed;left:0;top:0;width:250px;height:62px;pointer-events:none;z-index:2147480200;
        display:none;filter:drop-shadow(0 0 6px rgba(255,196,107,.35))}
      #xmas-sleigh .bob{width:100%;height:100%;animation:xmas-bob 1.1s ease-in-out infinite}
      #xmas-sleigh .lf{animation:xmas-legf .35s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:top}
      #xmas-sleigh .lb{animation:xmas-legb .35s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:top}
      @keyframes xmas-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes xmas-legf{from{transform:rotate(-25deg)}to{transform:rotate(20deg)}}
      @keyframes xmas-legb{from{transform:rotate(20deg)}to{transform:rotate(-25deg)}}
      @media (max-width:809.98px){#xmas-sleigh{width:170px;height:42px}}
    `;
    document.head.appendChild(style);

    let flying = false, dir = 1;
    const fly = () => {
      if (flying || document.hidden) return;
      flying = true;
      const vw = window.innerWidth, vh = window.innerHeight;
      const w = wrap.offsetWidth || 250;
      const y0 = vh * (0.12 + Math.random() * 0.2), y1 = vh * (0.06 + Math.random() * 0.14);
      const from = dir > 0 ? -w - 20 : vw + 20, to = dir > 0 ? vw + 20 : -w - 20;
      const flip = dir > 0 ? "" : " scaleX(-1)";
      wrap.style.display = "block";
      const dur = Math.max(9000, vw * 9);
      const anim = wrap.animate([
        { transform: `translate(${from}px, ${y0}px) rotate(${dir * -4}deg)${flip}` },
        { transform: `translate(${(from + to) / 2}px, ${(y0 + y1) / 2 - 30}px) rotate(${dir * -2}deg)${flip}`, offset: 0.5 },
        { transform: `translate(${to}px, ${y1}px) rotate(${dir * -6}deg)${flip}` },
      ], { duration: dur, easing: "linear" });
      const trail = setInterval(() => {
        const r = wrap.getBoundingClientRect();
        snow.spark(dir > 0 ? r.left + 6 : r.right - 6, r.top + r.height * 0.75);
      }, 55);
      anim.onfinish = anim.oncancel = () => {
        clearInterval(trail);
        wrap.style.display = "none";
        flying = false;
        dir = -dir;
      };
    };
    const loop = () => setTimeout(() => { if (snow.on()) fly(); loop(); }, 28000 + Math.random() * 14000);
    return { el: wrap, start() { setTimeout(() => { if (snow.on()) fly(); }, 3500); loop(); } };
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

    if (!reduceMotion && wrapAnimate()) {
      const sleigh = buildSleigh(snow);
      document.body.appendChild(sleigh.el);
      sleigh.start();
    }

    const hat = buildHat();
    document.body.appendChild(hat.el);
    // follow the heading while it animates in, then keep it lined up on resize and layout changes
    const t0 = performance.now();
    const follow = () => {
      hat.place();
      if (performance.now() - t0 < 6000) requestAnimationFrame(follow);
      else if (hat.el.style.display === "block") setInterval(hat.place, 700); // only on pages that have the word
    };
    requestAnimationFrame(follow);
    window.addEventListener("resize", hat.place);
  };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();
