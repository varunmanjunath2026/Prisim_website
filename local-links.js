// Add a "Mathikere Office" item to the footer menu (after "Contact") so visitors
// and search engines can reach the Mathikere page from every page.
(() => {
  const LABEL = "Mathikere Office";
  const href = () => (window.__PB || "") + "/digital-marketing-agency-mathikere/";

  const addLink = () => {
    const docH = document.documentElement.scrollHeight;
    const contacts = [...document.querySelectorAll("a")].filter((a) => {
      if (a.textContent.trim() !== "Contact" || a.dataset.prisimLocalDone) return false;
      const r = a.getBoundingClientRect();
      return r.top + window.scrollY > docH * 0.75; // footer only, not the top menu
    });
    contacts.forEach((a) => {
      a.dataset.prisimLocalDone = "1";
      // clone the menu item (its wrapper if it only holds this link) so styling matches
      const item = a.parentElement && a.parentElement.children.length === 1 && a.parentElement.querySelectorAll("a").length === 1 ? a.parentElement : a;
      const copy = item.cloneNode(true);
      const link = copy.tagName === "A" ? copy : copy.querySelector("a");
      link.setAttribute("href", href());
      link.removeAttribute("target");
      link.dataset.prisimLocalDone = "1";
      // replace the visible text but keep the inner element styling
      const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      let node, done = false;
      while ((node = walker.nextNode())) {
        if (!done && node.textContent.trim() === "Contact") { node.textContent = LABEL; done = true; }
      }
      if (!done) link.textContent = LABEL;
      item.after(copy);
    });
  };

  const start = () => {
    addLink();
    let t;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(addLink, 300); })
      .observe(document.body, { childList: true, subtree: true });
  };
  // Wait until the page's own scripts have finished building the page.
  const later = () => setTimeout(start, 1200);
  if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });
})();
