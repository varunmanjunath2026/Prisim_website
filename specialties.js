(() => {
  const cards = [
    {
      label: "Digital Marketing",
      heading: "Turn Attention Into Opportunities.",
      description:
        "Performance-driven digital marketing, SEO, social media management, Meta Ads and lead generation to help brands reach and convert their target audience.",
      visual: `<div class="prisim-specialty-art" aria-hidden="true">
        <svg class="prisim-marketing-visual" viewBox="0 0 340 96" preserveAspectRatio="none">
          <path d="M8 76 C46 68, 51 52, 88 58 S137 73, 168 48 S214 43, 245 30 S294 36, 332 12"></path>
        </svg>
        <div class="prisim-marketing-bars"><span></span><span></span><span></span><span></span><span></span><span></span></div>
      </div>`,
    },
    {
      label: "Software Development",
      heading: "Build Smarter Digital Experiences.",
      description:
        "Custom websites, SaaS platforms, CRM systems, business dashboards and workflow automation tailored to business requirements.",
      visual: `<div class="prisim-specialty-art prisim-specialty-art--photo" aria-hidden="true">
        <img src="/assets/framerusercontent.com/images/bSyfY8yZnWIysRpCPEUdiMrzb2o.1909qho.jpg" alt="" loading="lazy">
      </div>`,
    },
    {
      label: "Marketing Outcomes",
      heading: "From Clicks to Clients.",
      description:
        "Connect advertising, landing pages, lead capture and follow-ups to create a more structured customer acquisition process.",
      visual: `<div class="prisim-specialty-art" aria-hidden="true">
        <div class="prisim-journey">
          <span class="prisim-journey-step">Ads</span>
          <span class="prisim-journey-step">Landing page</span>
          <span class="prisim-journey-step">Lead capture</span>
          <span class="prisim-journey-step">Follow-up</span>
        </div>
      </div>`,
    },
    {
      label: "Product Engineering",
      heading: "Ideas Into Products.",
      description:
        "Transform business requirements into functional digital products through UI/UX design, development, API integrations, testing and deployment.",
      visual: `<div class="prisim-specialty-art" aria-hidden="true">
        <div class="prisim-product-visual">
          <div class="prisim-product-window"><span></span><span></span><span></span></div>
          <div class="prisim-product-panel"><span></span><span></span></div>
        </div>
      </div>`,
      orange: true,
    },
  ];

  const renderCard = ({ label, heading, description, visual, orange }) => `
    <article class="prisim-specialty-card${orange ? " prisim-specialty-card--orange" : ""}">
      <p class="prisim-specialty-label">${label}</p>
      ${visual}
      <h3 class="prisim-specialty-heading">${heading}</h3>
      <p class="prisim-specialty-description">${description}</p>
    </article>
  `;

  const applySpecialties = () => {
    const heading = [...document.querySelectorAll("h2")].find((item) =>
      /^Our Special(?:ties|ities)$/i.test(item.textContent.trim())
    );
    if (!heading) return false;

    const section = heading.closest(".framer-1mng6ye");
    const content = section?.querySelector(".framer-x3dn5k");
    if (!content) return false;

    const intro = [...section.querySelectorAll("p")].find((item) =>
      item.textContent.trim().startsWith("How we plan, report and work with your team")
    );
    const updatedIntro = "Digital Marketing and Software Development, built around your business.";
    if (content.dataset.prisimSpecialties === "true" && content.querySelector("#prisim-specialties-grid")) {
      if (heading.textContent.trim() !== "Our Specialties") heading.textContent = "Our Specialties";
      if (intro && intro.textContent.trim() !== updatedIntro) intro.textContent = updatedIntro;
      return true;
    }

    if (heading.textContent.trim() !== "Our Specialties") heading.textContent = "Our Specialties";
    if (intro && intro.textContent.trim() !== updatedIntro) intro.textContent = updatedIntro;
    content.innerHTML = `<div id="prisim-specialties-grid">${cards.map(renderCard).join("")}</div>`;
    content.classList.add("prisim-specialties-content");
    content.dataset.prisimSpecialties = "true";
    return true;
  };

  const observer = new MutationObserver(() => {
    applySpecialties();
  });
  observer.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  const start = () => {
    if (!applySpecialties()) {
      console.error("Could not find the existing Our Specialities section to update.");
    }
  };

  if (document.readyState === "complete") {
    window.setTimeout(start, 0);
  } else {
    window.addEventListener("load", start, { once: true });
  }
})();
