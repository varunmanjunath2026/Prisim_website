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

  // The project cards still carry the old template addresses; point them at the real pages.
  const PROJECTS = {
    "stellar-shots-videography": "tyaara-weddings",
    "razor-sharp-barbershop": "relicomp-elevators",
    "archivision-architects": "manpho-media-corp",
    "fernhill-landscapes": "chandana-car-care",
  };
  const projectLink = (href) => {
    const match = href && href.match(/case-studies\/([a-z-]+)/);
    const slug = match && (PROJECTS[match[1]] || (Object.values(PROJECTS).includes(match[1]) && match[1]));
    return slug ? (window.__PB || "") + "/case-studies/" + slug + "/" : null;
  };

  const fixLink = (a) => {
    const href = a.getAttribute("href");
    const fixed = projectLink(href) || toRoot(href);
    if (fixed && fixed !== href) a.setAttribute("href", fixed);
  };

  const fixAll = (root) => {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches("a[href]")) fixLink(root);
    root.querySelectorAll('a[href^="./"], a[href*="case-studies/"]').forEach(fixLink);
  };

  // About, Projects, Reviews, Blog and Contact are sections of the home page.
  // When the home content is already on screen, glide to the section instead of reloading.
  const SECTIONS = {
    "": () => document.body,
    "about": () => document.querySelector('[data-framer-name="Section - About"]'),
    "case-studies": () => [...document.querySelectorAll("h1, h2, h3")].find((e) => e.textContent.trim() === "Case Studies" && e.getClientRects().length),
    "review": () => [...document.querySelectorAll('[data-framer-name="Video Container"] a')].find((e) => e.getClientRects().length),
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
  // These slide in as they appear, so measure their resting place and stop below the menu bar.
  const GAPS = { "case-studies": 110, "review": 130 };
  const restingTop = (el) => { let y = 0; for (; el; el = el.offsetParent) y += el.offsetTop; return y; };
  const glideTo = (route, target) => {
    if (route === "") window.scrollTo({ top: 0, behavior: "smooth" });
    else if (GAPS[route]) window.scrollTo({ top: restingTop(target) - GAPS[route], behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth", block: route === "contact-us" ? "center" : "start" });
  };
  // Move the menu highlight to the section just opened. Framer only sets it on page load.
  const NAV_LABELS = { "": "home", "about": "about", "case-studies": "projects", "review": "reviews", "articles": "blog", "contact-us": "contact" };
  const NAV_STYLES = {
    active: {
      name: "Active", variant: "framer-v-bff8k2",
      background: "var(--token-16cecdcd-c5a5-4884-abaa-e0abd93e3514, rgba(255, 255, 255, 0.1))",
      textColor: "var(--token-4fdd7769-e1d0-45b2-8e3d-fe484baba321, rgb(255, 221, 0))",
      paragraphColor: "var(--extracted-r6o4lv, var(--token-4fdd7769-e1d0-45b2-8e3d-fe484baba321, rgb(255, 221, 0)))",
    },
    inactive: {
      name: "Default", variant: "framer-v-dqaxfb",
      background: "rgba(0, 0, 0, 0)",
      textColor: "var(--token-ea7dfee4-8907-43b4-9e13-e33ec4b80086)",
      paragraphColor: "var(--extracted-r6o4lv, var(--token-ea7dfee4-8907-43b4-9e13-e33ec4b80086))",
    },
  };
  const paintNav = () => {
    const current = window.__prisimNavLabel;
    document.querySelectorAll("p.framer-styles-preset-1dy6ejl").forEach((text) => {
      const name = text.textContent.trim().toLowerCase();
      const link = text.closest("a");
      if (!link || !Object.values(NAV_LABELS).includes(name)) return;
      const active = name === current;
      const style = active ? NAV_STYLES.active : NAV_STYLES.inactive;
      const variant = [...link.classList].find((c) => c.startsWith("framer-v-"));
      if (variant && variant !== style.variant) link.classList.replace(variant, style.variant);
      if (link.getAttribute("data-framer-name") !== style.name) link.setAttribute("data-framer-name", style.name);
      if (active && link.getAttribute("data-framer-page-link-current") !== "true") link.setAttribute("data-framer-page-link-current", "true");
      else if (!active && link.hasAttribute("data-framer-page-link-current")) link.removeAttribute("data-framer-page-link-current");
      if (link.style.backgroundColor !== style.background) link.style.backgroundColor = style.background;
      if (text.parentElement.style.getPropertyValue("--extracted-r6o4lv") !== style.textColor) text.parentElement.style.setProperty("--extracted-r6o4lv", style.textColor);
      if (text.style.getPropertyValue("--framer-text-color") !== style.paragraphColor) text.style.setProperty("--framer-text-color", style.paragraphColor);
    });
  };
  let navWatcher;
  const setNav = (route) => {
    window.__prisimNavLabel = NAV_LABELS[route];
    paintNav();
    if (navWatcher) return;
    // Framer redraws menu items on hover, so re-apply the highlight after it does.
    let queued = false;
    navWatcher = new MutationObserver((mutations) => {
      if (queued || !mutations.some((m) => m.target.closest && m.target.closest("nav"))) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; paintNav(); });
    });
    navWatcher.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style", "data-framer-name"] });
  };

  const homeContentShown = () => !!document.querySelector('[data-framer-name="Section - About"]');

  // Catch clicks before Framer's router so navigation always uses the fixed link.
  window.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const a = event.target.closest && event.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self")) return;
    // Hero "Get Started" button always goes to the contact form.
    const isHeroCta = a.closest('[data-framer-name="Button and Review Numbers"]') && /get started/i.test(a.textContent);
    const href = isHeroCta ? (window.__PB || "") + "/contact-us/" : a.getAttribute("href");
    const project = projectLink(href);
    if (project) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(project);
      return;
    }
    const route = routeOf(href);
    if (route !== null && homeContentShown()) {
      const target = SECTIONS[route]();
      if (target) {
        event.preventDefault();
        event.stopImmediatePropagation();
        glideTo(route, target);
        setNav(route);
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
    if (route === "" || target) { glideTo(route, target); setNav(route); }
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
