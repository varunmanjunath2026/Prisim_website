(() => {
  const services = [
    {
      title: "SEO",
      description:
        "We optimize your site's structure, content, and keywords to rank higher on search engine results pages, increasing your chances of being discovered by potential customers.",
      image: "/assets/framerusercontent.com/images/2Y3YDjnHm71tOfbO1d2eWDckzI.0ntg901.jpg",
    },
    {
      title: "Content Marketing",
      description:
        "Our content marketing services include creating informative blog posts, engaging videos, and shareable infographics to captivate your audience and drive traffic to your website.",
      image: "/assets/framerusercontent.com/images/3AL5wf1zCoZoGp1aSyLXxgEUE.0h36l01.jpg",
    },
    {
      title: "Website Design",
      description:
        "Our design experts craft visually stunning and user-friendly websites optimized for performance and conversion, ensuring a seamless online experience for your visitors.",
      image: "/assets/framerusercontent.com/images/bSyfY8yZnWIysRpCPEUdiMrzb2o.1909qho.jpg",
    },
    {
      title: "Social Media Marketing",
      description:
        "Engage and expand your audience across social media platforms with our tailored marketing strategies. From content creation to ad campaigns, we help you connect with your target demographic, foster brand loyalty.",
      image: "/assets/framerusercontent.com/images/QHwiFG8CdFS1wdIHWtWHvAuzLAM.05jzcui.jpg",
    },
  ];

  const slices = 16;
  const aspect = 16 / 9;
  const tileHeight = 26;
  const gap = 6;
  const axis = 56;
  const curve = (80 * Math.PI) / 180;
  const camera = 1.6;
  const maxWidth = 55;
  const orbitName = "prisim-service-orbit";

  const arc = (bend) =>
    (camera - 1 + Math.cos(bend)) / (2 * camera * Math.sin(bend));
  const turn = (radius, degrees) =>
    `translateZ(${radius}px) rotateY(${degrees}deg) translateZ(-${radius}px)`;
  const safe = (value) =>
    value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);

  const render = (container) => {
    if (container.dataset.prisimTiltedServices === "true") return;
    container.classList.add("prisim-tilted-services");
    container.innerHTML = `
      <div class="prisim-tilted-service-band" aria-hidden="true"></div>
      <div class="prisim-tilted-service-shade" aria-hidden="true"></div>
      <div class="prisim-tilted-service-content">
        <div class="prisim-tilted-service-detail" role="tabpanel" id="prisim-service-panel" aria-live="polite"></div>
        <div class="prisim-tilted-service-tabs" role="tablist" aria-label="Services"></div>
      </div>
    `;

    const band = container.querySelector(".prisim-tilted-service-band");
    const detail = container.querySelector(".prisim-tilted-service-detail");
    const tabs = container.querySelector(".prisim-tilted-service-tabs");
    let activeIndex = 0;
    const buttons = services.map((service, index) => {
      const button = document.createElement("button");
      button.className = "prisim-tilted-service-tab";
      button.type = "button";
      button.id = `prisim-service-tab-${index}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "prisim-service-panel");
      button.textContent = service.title;
      button.addEventListener("click", () => select(index));
      button.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const next = (index + direction + services.length) % services.length;
        select(next);
        buttons[next].focus();
      });
      tabs.append(button);
      return button;
    });

    function select(index) {
      activeIndex = index;
      const service = services[index];
      detail.innerHTML = `
        <span class="prisim-tilted-service-eyebrow">0${index + 1} / 0${services.length}</span>
        <h2>${safe(service.title)}</h2>
        <p>${safe(service.description)}</p>
        <a href="../service-details/" class="prisim-tilted-service-link">Learn More <span aria-hidden="true">↗</span></a>
      `;
      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
    }

    function layout() {
      const { width, height } = container.getBoundingClientRect();
      if (!(width > 0) || !(height > 0)) return;
      const tile = Math.min((tileHeight / 100) * height, ((maxWidth / 100) * width) / aspect);
      const radius = width * arc(curve);
      const degrees = (radians) => (radians * 180) / Math.PI;
      const unit = degrees(tile / radius);
      const pitch = (aspect + gap / 100) * unit;
      const limit = degrees(curve) + (aspect * unit) / 2;
      const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
      const sweep = (columns * pitch) / 2;
      const duration = columns * 4;
      const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
      const frameRadius = width * arc(curve);
      const css = `
        @keyframes ${orbitName} {
          from { transform: ${turn(frameRadius, -sweep)}; }
          to { transform: ${turn(frameRadius, sweep)}; }
          0%, ${hide}%, ${100 - hide}%, 100% { visibility: hidden; }
          ${hide + 0.001}%, ${100 - hide - 0.001}% { visibility: visible; }
        }
      `;
      let style = container.querySelector(".prisim-tilted-service-animation");
      if (!style) {
        style = document.createElement("style");
        style.className = "prisim-tilted-service-animation";
        container.prepend(style);
      }
      style.textContent = css;
      band.style.perspective = `${frameRadius * camera}px`;
      band.style.perspectiveOrigin = `50% ${axis}%`;

      const fragment = document.createDocumentFragment();
      for (let tileIndex = 0; tileIndex < columns; tileIndex += 1) {
        const first = columns - 1 - tileIndex;
        const tileElement = document.createElement("div");
        tileElement.className = "prisim-tilted-service-tile";
        tileElement.style.left = `calc(50% - ${(aspect * tile) / 2}px)`;
        tileElement.style.top = `calc(${axis}% - ${tile / 2}px)`;
        tileElement.style.width = `${aspect * tile}px`;
        tileElement.style.height = `${tile}px`;
        tileElement.style.animation = `${orbitName} ${duration}s linear ${-tileIndex * 4}s infinite`;
        tileElement.dataset.firstImage = String(first);
        tileElement.dataset.tileIndex = String(tileIndex);
        tileElement.dataset.lap = "0";
        tileElement.addEventListener("animationiteration", (event) => {
          const lap = Math.round(event.elapsedTime / duration);
          if (lap === Number(tileElement.dataset.lap)) return;
          tileElement.dataset.lap = String(lap);
          setTileImage(tileElement, (lap * columns + first) % services.length, tile, unit, frameRadius);
        });
        setTileImage(tileElement, first % services.length, tile, unit, frameRadius);
        fragment.append(tileElement);
      }
      band.replaceChildren(fragment);
    }

    function setTileImage(tileElement, imageIndex, tile, unit, radius) {
      const share = aspect / slices;
      const image = services[imageIndex].image;
      const fragment = document.createDocumentFragment();
      for (let slice = 0; slice < slices; slice += 1) {
        const strip = document.createElement("div");
        strip.className = "prisim-tilted-service-slice";
        strip.style.left = `${((aspect - share) / 2) * tile}px`;
        strip.style.width = `${(slice === slices - 1 ? share : share) * tile + (slice === slices - 1 ? 0 : 1)}px`;
        strip.style.height = `${tile}px`;
        strip.style.transform = turn(
          radius,
          (aspect / 2 - (slice + 0.5) * share) * unit,
        );
        const img = document.createElement("img");
        img.src = image;
        img.alt = "";
        img.draggable = false;
        img.style.left = `${-slice * share * tile}px`;
        img.style.width = `${aspect * tile}px`;
        img.style.height = `${tile}px`;
        strip.append(img);
        fragment.append(strip);
      }
      tileElement.replaceChildren(fragment);
    }

    select(activeIndex);
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(container);
    container.dataset.prisimTiltedServices = "true";
  };

  const start = () => {
    const section = document.querySelector('[data-framer-name="Section - Services"]');
    const container = section?.querySelector(".framer-dfum9d");
    if (container) render(container);
  };

  const observer = new MutationObserver(start);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
