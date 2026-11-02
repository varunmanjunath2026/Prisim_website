// Framer renders internal links as "./about", which breaks on pages served
// from a folder (on /services/ it becomes /services/about). Rewrite them to
// root links with a trailing slash, e.g. "/about/".
(() => {
  const toRoot = (href) => {
    if (!href || !href.startsWith("./")) return null;
    const match = href.slice(2).match(/^([^?#]*)(.*)$/);
    let path = match[1];
    if (/\.[a-z0-9]+$/i.test(path)) return null; // files like .css or .png
    if (path && !path.endsWith("/")) path += "/";
    return (window.__PB || "") + "/" + path + match[2];
  };

  const fixLink = (a) => {
    const fixed = toRoot(a.getAttribute("href"));
    if (fixed) a.setAttribute("href", fixed);
  };

  const fixAll = (root) => {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches("a[href]")) fixLink(root);
    root.querySelectorAll('a[href^="./"]').forEach(fixLink);
  };

  // Catch clicks before Framer's router so navigation always uses the fixed link.
  window.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const a = event.target.closest && event.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self")) return;
    const fixed = toRoot(a.getAttribute("href"));
    if (!fixed) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(fixed);
  }, true);

  const start = () => {
    fixAll(document.documentElement);
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes") fixLink(m.target);
        else m.addedNodes.forEach(fixAll);
      }
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });
  };

  if (document.documentElement) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
})();
