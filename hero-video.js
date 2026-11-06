// Hero "Play video · Know about us" and the client video reviews: play the Instagram
// video in a pop-up player on the page.
(() => {
  const POST = "https://www.instagram.com/p/DdRIlFwzMuw/";
  const TRIGGERS = [
    '[data-framer-name="Image and Video Overlay"]',
    '[data-framer-name="Cursor Area"]',
    '[data-framer-name="Play Button Tablet and Phone"]',
  ].join(",");

  const style = document.createElement("style");
  style.textContent = `
    .prisim-video-modal{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;
      padding:24px;background:rgba(5,5,5,.86);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s ease}
    .prisim-video-modal.is-open{opacity:1}
    .prisim-video-box{position:relative;width:min(420px,100%);height:min(760px,calc(100vh - 110px));border-radius:22px;
      overflow:hidden;background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.6)}
    .prisim-video-box iframe{width:100%;height:100%;border:0;display:block}
    .prisim-video-close{position:absolute;top:18px;right:18px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,153,28,.7);
      background:rgba(10,10,10,.8);color:#fff;font:400 26px/1 sans-serif;cursor:pointer}
    .prisim-video-close:hover{background:#ff991c;color:#0a0a0a}
    .prisim-video-open{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:#ff991c;
      font:600 14px/1.2 "Satoshi","Inter",sans-serif;text-decoration:underline;text-underline-offset:4px}
    @media (max-width:600px){.prisim-video-modal{padding:60px 12px 52px}.prisim-video-box{height:calc(100vh - 120px)}}
  `;
  document.head.appendChild(style);

  let modal = null;
  let lastFocus = null;

  const close = () => {
    if (!modal) return;
    const m = modal;
    modal = null;
    m.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    setTimeout(() => m.remove(), 250);
    if (lastFocus) lastFocus.focus();
  };

  const open = (post = POST) => {
    if (modal) return;
    lastFocus = document.activeElement;
    modal = document.createElement("div");
    modal.className = "prisim-video-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Prisim video");
    modal.innerHTML = `
      <div class="prisim-video-box">
        <iframe src="${post}embed/" title="Prisim on Instagram" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="eager"></iframe>
      </div>
      <button type="button" class="prisim-video-close" aria-label="Close video">&times;</button>
      <a class="prisim-video-open" href="${post}" target="_blank" rel="noopener">Open on Instagram</a>`;
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".prisim-video-close")) close();
    });
    document.body.appendChild(modal);
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => modal && modal.classList.add("is-open"));
    modal.querySelector(".prisim-video-close").focus();
  };

  const inTrigger = (e) => !modal && e.target instanceof Element && e.target.closest(TRIGGERS);

  // Stop the template's own player from reacting, without blocking scrolling.
  ["pointerdown", "pointerup", "mousedown", "mouseup"].forEach((type) =>
    window.addEventListener(type, (e) => { if (inTrigger(e)) e.stopImmediatePropagation(); }, true));

  window.addEventListener("click", (e) => {
    if (!inTrigger(e)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open();
  }, true);

  // Client video review cards.
  window.addEventListener("click", (e) => {
    if (modal || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return;
    const card = e.target.closest('[data-framer-name="Video Container"] a[href*="instagram.com/p/"]');
    if (!card) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open(card.href.split("?")[0].replace(/\/?$/, "/"));
  }, true);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal) close();
    else if ((e.key === "Enter" || e.key === " ") && inTrigger(e)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      open();
    }
  }, true);
})();
