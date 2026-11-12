// Lead forms on the standalone pages (Contact page form and the footer "Let's Talk!" form).
// Posts to /api/lead/, which forwards to the CRM webhook set in Vercel.
(() => {
  const ENDPOINT = (window.__PB || "") + "/api/lead/";
  const PHONE = "+91 97425 02964";

  document.querySelectorAll("[data-whatsapp]").forEach((a) => a.addEventListener("click", (e) => {
    const wa = document.getElementById("prisim-whatsapp");
    if (wa) { e.preventDefault(); window.open(wa.href, "_blank", "noopener"); }
  }));

  document.querySelectorAll("form.lead-form").forEach((form) => {
    const status = form.querySelector(".status");
    const button = form.querySelector("button[type=submit]");
    const label = button.textContent;
    const say = (msg, ok) => { status.textContent = msg; status.style.color = ok ? "#7ee2a8" : "#ff8a7a"; };
    const v = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!v("name") || !v("phone")) { say("Please enter your name and phone number.", false); return; }
      button.disabled = true; button.textContent = "Sending…";
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: v("name"), email: v("email"), phone: v("phone"), message: v("message"), website: v("website"), page: location.href }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) { form.reset(); say("Thank you! We have received your message and will contact you soon.", true); }
        else say(data.error || `Something went wrong. Please call ${PHONE}.`, false);
      } catch {
        say(`Could not send. Please check your connection, or call ${PHONE}.`, false);
      } finally {
        button.disabled = false; button.textContent = label;
      }
    });
  });
})();
