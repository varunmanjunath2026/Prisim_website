(async function () {
  const routes = {
    "/about": {
      title: "About",
      navLabel: "About",
      find: () => document.querySelector('[data-framer-name="Section - About"]'),
    },
    "/case-studies": {
      title: "Case Studies",
      navLabel: "Projects",
      find: () => [...document.querySelectorAll("h1, h2, h3")].find((item) => item.textContent.trim() === "Case Studies"),
    },
    "/review": {
      title: "Reviews",
      navLabel: "Reviews",
      find: () => [...document.querySelectorAll("a")].find((item) => item.textContent.trim().toUpperCase() === "VIEW ALL REVIEWS"),
    },
    "/articles": {
      title: "Blog",
      navLabel: "Blog",
      find: () => [...document.querySelectorAll("h1, h2, h3")].find((item) => item.textContent.trim() === "Dive into our collection of engaging blog posts"),
    },
    "/contact-us": {
      title: "Contact",
      navLabel: "Contact",
      find: () => document.querySelector('input[placeholder="Your name"]'),
    },
  };
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const route = Object.keys(routes).find((path) => pathname.endsWith(path));
  const page = route ? routes[route] : null;

  if (!page) {
    document.body.textContent = "This page is not available.";
    return;
  }

  const siteBase = pathname.slice(0, -route.length);

  try {
    const response = await fetch(`${siteBase}/index.html`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Homepage request failed (${response.status})`);

    let html = await response.text();
    if (siteBase) {
      html = html.replace(/(["'(=])\/(?!\/)/g, `$1${siteBase}/`);
    }
    const normalizePaths = siteBase
      ? `<script>
        (() => {
          const prefix = ${JSON.stringify(siteBase)};
          const attributes = ["src", "href", "poster", "srcset"];
          const fix = (root) => {
            if (root.nodeType !== Node.ELEMENT_NODE) return;
            const elements = [root, ...root.querySelectorAll("[src], [href], [poster], [srcset]")];
            for (const element of elements) {
              for (const attribute of attributes) {
                const value = element.getAttribute(attribute);
                if (!value) continue;
                const updated = attribute === "srcset"
                  ? value.replace(/(^|,\\s*)\\/(?!\\/)/g, "$1" + prefix + "/")
                  : value.startsWith("/") && !value.startsWith("//")
                    ? prefix + value
                    : value;
                if (updated !== value) element.setAttribute(attribute, updated);
              }
            }
          };
          fix(document.documentElement);
          new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (mutation.type === "attributes") fix(mutation.target);
              else for (const node of mutation.addedNodes) fix(node);
            }
          }).observe(document.documentElement, {
            attributes: true,
            attributeFilter: attributes,
            childList: true,
            subtree: true,
          });
        })();
      <\\/script>`
      : "";
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1><base href="${siteBase}/">${normalizePaths}`,
    );

    const scrollScript = `<script>
      (() => {
        const deadline = Date.now() + 4000;
        const navSelector = "p.framer-styles-preset-1dy6ejl";
        const navLabels = ["home", "about", "services", "projects", "reviews", "blog", "contact"];
        const navStyles = {
          active: {
            name: "Active",
            variant: "framer-v-bff8k2",
            background: "var(--token-16cecdcd-c5a5-4884-abaa-e0abd93e3514, rgba(255, 255, 255, 0.1))",
            textColor: "var(--token-4fdd7769-e1d0-45b2-8e3d-fe484baba321, rgb(255, 221, 0))",
            paragraphColor: "var(--extracted-r6o4lv, var(--token-4fdd7769-e1d0-45b2-8e3d-fe484baba321, rgb(255, 221, 0)))",
          },
          inactive: {
            name: "Default",
            variant: "framer-v-dqaxfb",
            background: "rgba(0, 0, 0, 0)",
            textColor: "var(--token-ea7dfee4-8907-43b4-9e13-e33ec4b80086)",
            paragraphColor: "var(--extracted-r6o4lv, var(--token-ea7dfee4-8907-43b4-9e13-e33ec4b80086))",
          },
        };
        const updateNavigation = () => {
          const navItems = [...document.querySelectorAll(navSelector)]
            .filter((item) => navLabels.includes(item.textContent.trim().toLowerCase()))
            .map((item) => ({ label: item.textContent.trim(), text: item, link: item.closest("a") }))
            .filter((item) => item.link);

          for (const item of navItems) {
            const isActive = item.label.toLowerCase() === "${page.navLabel.toLowerCase()}";
            const style = isActive ? navStyles.active : navStyles.inactive;
            const variant = [...item.link.classList].find((name) => name.startsWith("framer-v-"));
            if (variant && variant !== style.variant) item.link.classList.replace(variant, style.variant);
            if (item.link.getAttribute("data-framer-name") !== style.name) item.link.setAttribute("data-framer-name", style.name);
            if (isActive && item.link.getAttribute("data-framer-page-link-current") !== "true") {
              item.link.setAttribute("data-framer-page-link-current", "true");
            } else if (!isActive && item.link.hasAttribute("data-framer-page-link-current")) {
              item.link.removeAttribute("data-framer-page-link-current");
            }
            if (item.link.style.backgroundColor !== style.background) item.link.style.backgroundColor = style.background;
            if (item.text.parentElement.style.getPropertyValue("--extracted-r6o4lv") !== style.textColor) {
              item.text.parentElement.style.setProperty("--extracted-r6o4lv", style.textColor);
            }
            if (item.text.style.getPropertyValue("--framer-text-color") !== style.paragraphColor) {
              item.text.style.setProperty("--framer-text-color", style.paragraphColor);
            }
          }
        };
        const scrollToSection = () => {
          document.title = "${page.title} | Prisim";
          updateNavigation();
          const target = (${page.find.toString()})();
          if (target) {
            target.scrollIntoView({ block: "start" });
          }
          if (Date.now() < deadline) setTimeout(scrollToSection, 200);
        };
        const isNavigationNode = (node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return false;
          const text = node.matches(navSelector)
            ? node
            : node.closest("a")?.querySelector(navSelector) || node.querySelector(navSelector);
          return text && navLabels.includes(text.textContent.trim().toLowerCase());
        };
        const observer = new MutationObserver((mutations) => {
          if (mutations.some((mutation) =>
            mutation.type === "attributes"
              ? isNavigationNode(mutation.target)
              : [...mutation.addedNodes].some(isNavigationNode)
          )) {
            updateNavigation();
          }
        });
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ["class", "style", "data-framer-name", "data-framer-page-link-current"],
          childList: true,
          subtree: true,
        });

        window.addEventListener("load", scrollToSection, { once: true });
        document.addEventListener("DOMContentLoaded", scrollToSection, { once: true });
        setTimeout(scrollToSection, 500);
      })();
    <\/script>`;

    html = html.replace("</body>", `${scrollScript}</body>`);
    document.open();
    document.write(html);
    document.close();
    document.title = `${page.title} | Prisim`;
  } catch (error) {
    document.body.textContent = `Unable to load ${page.title}: ${error.message}`;
    console.error(error);
  }
})();
