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

  // About, Projects, Reviews, Blog and Contact are sections of the home page.
  // When the home content is already on screen, glide to the section instead of reloading.
  const SECTIONS = {
    "": () => document.body,
    "about": () => document.querySelector('[data-framer-name="Section - About"]'),
    "case-studies": () => [...document.querySelectorAll("h1, h2, h3")].find((e) => e.textContent.trim() === "Case Studies" && e.getClientRects().length),
    "review": () => [...document.querySelectorAll("a")].find((e) => e.textContent.trim().toUpperCase() === "VIEW ALL REVIEWS" && e.getClientRects().length),
    "articles": () => [...document.querySelectorAll("h1, h2, h3")].find((e) => e.textContent.trim() === "Dive into our collection of engaging blog posts" && e.getClientRects().length),
    "contact-us": () => [...document.querySelectorAll('input[placeholder="Your name"]')].find((e) => e.getClientRects().length),
  };
  const TITLES = {"about": "About Prisim | Digital Marketing Agency in Bangalore", "case-studies": "Digital Marketing Case Studies | Prisim Bangalore", "review": "Client Reviews | Prisim Digital Marketing Agency", "articles": "SEO &amp; Digital Marketing Blog | Prisim", "contact-us": "Contact Prisim | Digital Marketing Agency Bangalore", "": "Prisim | Best Digital Marketing Agency in Bangalore"};
  const routeOf = (href) => {
    if (!href) return null;
    const base = window.__PB || "";
    let path = href.startsWith("./") ? href.slice(1) : href;
    if (base && path.startsWith(base + "/")) path = path.slice(base.length);
    if (!path.startsWith("/") || /[?#.]/.test(path)) return null;
    const name = path.replace(/^\/|\/$/g, "");
    return name in SECTIONS ? name : null;
  };
  const homeContentShown = () => !!document.querySelector('[data-framer-name="Section - About"]');

  // Catch clicks before Framer's router so navigation always uses the fixed link.
  window.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const a = event.target.closest && event.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self")) return;
    const href = a.getAttribute("href");
    const route = routeOf(href);
    if (route !== null && homeContentShown()) {
      const target = SECTIONS[route]();
      if (target) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (route === "") window.scrollTo({ top: 0, behavior: "smooth" });
        else target.scrollIntoView({ behavior: "smooth", block: route === "contact-us" ? "center" : "start" });
        const url = (window.__PB || "") + (route ? "/" + route + "/" : "/");
        if (location.pathname !== url) history.pushState({ prisimSection: route }, "", url);
        if (TITLES[route]) { window.__prisimTitle = TITLES[route]; document.title = TITLES[route]; }
        return;
      }
    }
    const fixed = toRoot(href);
    if (!fixed) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(fixed);
  }, true);

  // Back/forward between sections: scroll instead of leaving the page.
  window.addEventListener("popstate", () => {
    if (!homeContentShown()) return;
    const route = routeOf(location.pathname);
    if (route === null) return;
    const target = SECTIONS[route]();
    if (TITLES[route]) { window.__prisimTitle = TITLES[route]; document.title = TITLES[route]; }
    if (route === "") window.scrollTo({ top: 0, behavior: "smooth" });
    else if (target) target.scrollIntoView({ behavior: "smooth", block: route === "contact-us" ? "center" : "start" });
  });

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
