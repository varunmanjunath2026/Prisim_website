// "Let's Talk" form: add a Phone field and send submissions to /api/lead
// (which forwards them to Wisemelon) instead of Framer's form service.
(() => {
  const ENDPOINT = (window.__PB || "") + "/api/lead/";

  const addPhoneField = (form) => {
    if (form.querySelector('input[name="Phone"]')) return;
    const email = form.querySelector('input[name="Email"]');
    const label = email && email.closest("label");
    if (!label) return;
    const copy = label.cloneNode(true);
    const text = copy.querySelector("p");
    if (text) text.textContent = "Phone";
    const input = copy.querySelector("input");
    input.type = "tel";
    input.name = "Phone";
    input.placeholder = "+91 98765 43210";
    input.required = true;
    input.autocomplete = "tel";
    input.inputMode = "tel";
    input.value = "";
    input.classList.add("framer-form-input-empty");
    input.addEventListener("input", () => input.classList.toggle("framer-form-input-empty", !input.value));
    label.after(copy);
  };

  const status = (form, message, ok) => {
    let box = form.querySelector(".prisim-form-status");
    if (!box) {
      box = document.createElement("p");
      box.className = "prisim-form-status";
      box.setAttribute("role", "status");
      box.style.cssText = "margin:10px 0 0;font:500 14px/1.4 Satoshi,Inter,sans-serif;";
      form.appendChild(box);
    }
    box.style.color = ok ? "#7ee2a8" : "#ff8a7a";
    box.textContent = message;
  };

  const value = (form, name) => {
    const field = form.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
  };

  const submit = async (form) => {
    const button = form.querySelector('button[type="submit"]');
    const label = button && button.querySelector("p");
    const original = label ? label.textContent : "";
    if (button) button.disabled = true;
    if (label) label.textContent = "Sending…";
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value(form, "Name"),
          email: value(form, "Email"),
          phone: value(form, "Phone"),
          message: value(form, "Message"),
          website: value(form, "website"), // hidden honeypot
          page: location.href,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.ok) {
        form.reset();
        form.querySelectorAll(".framer-form-input").forEach((i) => i.classList.add("framer-form-input-empty"));
        status(form, "Thank you! We have received your message and will contact you soon.", true);
      } else {
        status(form, data.error || "Something went wrong. Please call or WhatsApp +91 97425 02964.", false);
      }
    } catch {
      status(form, "Could not send. Please check your connection, or call/WhatsApp +91 97425 02964.", false);
    } finally {
      if (button) button.disabled = false;
      if (label) label.textContent = original;
    }
  };

  // Take over the submit before the site's own form handler sees it.
  window.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-framer-form")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    submit(form);
  }, true);

  const scan = () => document.querySelectorAll("form[data-framer-form]").forEach(addPhoneField);
  const start = () => {
    scan();
    let t;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 200); })
      .observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
