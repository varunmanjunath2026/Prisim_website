// Adds a "Products" link right after "Projects" in the top menu, phone menu and footer.
// Those menus are drawn by the Framer bundle, so copy an existing item once the page has
// loaded, and put it back if Framer redraws the menu.
(() => {
  const label = (el) => el.textContent.trim().toLowerCase();
  const href = (window.__PB || "") + "/products/";

  const style = document.createElement("style");
  style.textContent = `[data-prisim-products] a:hover p{color:#ff991c!important}`;

  const add = (link) => {
    const unit = link.classList.contains("framer-text") ? link.closest("p").parentElement : link.parentElement;
    const list = unit.parentElement;
    if (!list || list.querySelector("[data-prisim-products]")) return;
    // Copy an item that isn't highlighted as the current page.
    const source = [...list.children].find((item) => {
      const a = item.querySelector("a");
      return a && !a.hasAttribute("data-framer-page-link-current") && a.getAttribute("data-framer-name") !== "Active";
    }) || unit;
    const copy = source.cloneNode(true);
    copy.setAttribute("data-prisim-products", "");
    const a = copy.querySelector("a");
    a.setAttribute("href", href);
    a.removeAttribute("data-framer-page-link-current");
    (a.querySelector("p") || a).textContent = "Products";
    copy.style.order = getComputedStyle(unit).order; // the phone menu sets its order in CSS
    unit.after(copy);
  };

  const scan = () => {
    [...document.querySelectorAll("a")].filter((a) => label(a) === "projects").forEach(add);
  };

  const start = () => {
    document.head.appendChild(style);
    scan();
    let timer;
    new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(scan, 100); })
      .observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
