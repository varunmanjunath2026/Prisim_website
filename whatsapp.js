// Floating WhatsApp chat button (bottom-right). The number is never shown on the page;
// it is assembled here only to build the chat link.
(() => {
  if (document.getElementById("prisim-whatsapp")) return;
  const parts = ["91", "81477", "15267"];
  const text = encodeURIComponent("Hi Prisim, I'd like to know more about your digital marketing services.");
  const href = `https://wa.me/${parts.join("")}?text=${text}`;

  const style = document.createElement("style");
  style.textContent = `
    #prisim-whatsapp{position:fixed;right:22px;bottom:22px;z-index:2147482000;width:58px;height:58px;border-radius:50%;
      background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.35);
      transition:transform .2s ease, box-shadow .2s ease;text-decoration:none}
    #prisim-whatsapp:hover{transform:scale(1.08);box-shadow:0 10px 28px rgba(0,0,0,.45)}
    #prisim-whatsapp svg{width:32px;height:32px;fill:#fff}
    #prisim-whatsapp::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #25D366;
      animation:prisim-wa-pulse 2.4s ease-out infinite;pointer-events:none}
    @keyframes prisim-wa-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.5);opacity:0}}
    @media (max-width:809.98px){#prisim-whatsapp{right:16px;bottom:16px;width:52px;height:52px}#prisim-whatsapp svg{width:28px;height:28px}}
    @media (prefers-reduced-motion:reduce){#prisim-whatsapp::after{animation:none}}
  `;
  const a = document.createElement("a");
  a.id = "prisim-whatsapp";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with Prisim on WhatsApp");
  a.title = "Chat with us on WhatsApp";
  a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C9.13 3 3.5 8.6 3.5 15.5c0 2.2.58 4.35 1.68 6.25L3.4 28.6l7.05-1.84a12.5 12.5 0 0 0 5.59 1.33h.01c6.91 0 12.54-5.6 12.54-12.5C28.6 8.6 22.96 3 16.04 3zm0 22.85h-.01a10.4 10.4 0 0 1-5.3-1.45l-.38-.23-4.19 1.1 1.12-4.08-.25-.42a10.3 10.3 0 0 1-1.6-5.52C5.43 9.82 10.2 5.1 16.05 5.1c2.83 0 5.5 1.1 7.5 3.1a10.3 10.3 0 0 1 3.1 7.32c0 5.7-4.77 10.33-10.6 10.33zm5.81-7.74c-.32-.16-1.88-.92-2.17-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.14 3.06 1.3 3.27.16.21 2.24 3.4 5.42 4.77.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z"/></svg>';

  const mount = () => {
    if (document.getElementById("prisim-whatsapp")) return;
    document.head.appendChild(style);
    document.body.appendChild(a);
  };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();
