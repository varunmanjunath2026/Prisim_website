(() => {
  const services = [
    {
      id: "01",
      title: "SEO",
      category: "Search visibility",
      description:
        "We optimize your site's structure, content, and keywords to rank higher on search engine results pages, increasing your chances of being discovered by potential customers.",
      image: "/assets/framerusercontent.com/images/2Y3YDjnHm71tOfbO1d2eWDckzI.0ntg901.jpg",
      position: "center 36%",
    },
    {
      id: "02",
      title: "Content Marketing",
      category: "Content that connects",
      description:
        "Our content marketing services include creating informative blog posts, engaging videos, and shareable infographics to captivate your audience and drive traffic to your website.",
      image: "/assets/framerusercontent.com/images/3AL5wf1zCoZoGp1aSyLXxgEUE.0h36l01.jpg",
      position: "center 30%",
    },
    {
      id: "03",
      title: "Website Design",
      category: "Digital experiences",
      description:
        "Our design experts craft visually stunning and user-friendly websites optimized for performance and conversion, ensuring a seamless online experience for your visitors.",
      image: "/assets/framerusercontent.com/images/bSyfY8yZnWIysRpCPEUdiMrzb2o.1909qho.jpg",
      position: "center 55%",
    },
    {
      id: "04",
      title: "Social Media Marketing",
      category: "Social growth",
      description:
        "Engage and expand your audience across social media platforms with tailored strategies, content creation, and ad campaigns that connect with your target audience.",
      image: "/assets/framerusercontent.com/images/QHwiFG8CdFS1wdIHWtWHvAuzLAM.05jzcui.jpg",
      position: "center 50%",
    },
  ];

  const renderService = ({ id, title, category, description, image, position }, index) => `
    <article
      class="prisim-service-panel${index === 0 ? " is-active" : ""}"
      style="--service-image: url('${image}'); --service-image-position: ${position}"
      data-service-index="${index}"
      role="group"
      aria-label="${title} service"
      aria-current="${index === 0 ? "true" : "false"}"
      tabindex="0"
    >
      <div class="prisim-service-overlay" aria-hidden="true"></div>
      <div class="prisim-service-content">
        <div class="prisim-service-details">
          <span class="prisim-service-category">${category}</span>
          <h3>${title}</h3>
          <p>${description}</p>
          <a href="/service-details/" class="prisim-service-link">
            Learn More <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span class="prisim-service-inactive-label" aria-hidden="true">
          <span class="prisim-service-title-desktop">${title}</span>
          <span class="prisim-service-title-mobile">${id}</span>
        </span>
      </div>
    </article>
  `;

  const applyServicesGallery = () => {
    const sections = [...document.querySelectorAll('[data-framer-name="Section - Services"]')];
    if (!sections.length) return false;

    let foundGallery = false;
    sections.forEach((section) => {
      const cards = section.querySelector(".framer-s3790c");
      if (!cards) return;
      foundGallery = true;
      if (cards.dataset.prisimServicesGallery === "true") return;

      cards.className = "prisim-services-gallery";
      cards.removeAttribute("style");
      cards.setAttribute("role", "list");
      cards.innerHTML = services.map(renderService).join("");
      cards.dataset.prisimServicesGallery = "true";

      const panels = [...cards.querySelectorAll(".prisim-service-panel")];
      const activate = (panel) => {
        panels.forEach((item) => {
          const isActive = item === panel;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-current", isActive ? "true" : "false");
        });
      };

      panels.forEach((panel) => {
        panel.setAttribute("role", "listitem");
        panel.addEventListener("mouseenter", () => activate(panel));
        panel.addEventListener("focusin", () => activate(panel));
        panel.addEventListener("click", (event) => {
          if (!event.target.closest("a")) activate(panel);
        });
        panel.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate(panel);
          }
        });
      });
    });

    return foundGallery;
  };

  const start = () => {
    if (!applyServicesGallery()) {
      return;
    }
  };

  const observer = new MutationObserver(start);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  if (document.readyState === "complete") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
