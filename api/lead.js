// Receives "Let's Talk" form submissions from prisim.co.in and forwards them to Wisemelon.
//
// The Wisemelon webhook URL is a secret (anyone holding it can add leads), and this
// repository is public, so it is NOT stored in code. Set it in Vercel:
//   Project → Settings → Environment Variables → WISEMELON_WEBHOOK_URL
// then redeploy.

const MAX = { name: 120, email: 200, phone: 40, message: 4000, page: 300 };

const clean = (value, max) =>
  String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = await readBody(req);

  // Honeypot: real visitors never fill this hidden field; bots usually do.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const message = clean(body.message, MAX.message);
  const page = clean(body.page, MAX.page);

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: "Please enter your name and phone number." });
  }
  if (!/^[+\d][\d\s()-]{6,}$/.test(phone)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid phone number." });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  const target = process.env.WISEMELON_WEBHOOK_URL;
  if (!target) {
    console.error("WISEMELON_WEBHOOK_URL is not set");
    return res.status(500).json({ ok: false, error: "The form is not connected yet. Please call or WhatsApp us." });
  }

  // Common field names plus Wisemelon-style aliases, so the lead maps cleanly.
  const lead = {
    name, email, phone, message,
    fullname: name, emailid: email, contactno: phone, anything: message,
    source: "prisim.co.in contact form",
    page,
    submitted_at: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) {
      console.error("Wisemelon responded", response.status, (await response.text()).slice(0, 300));
      return res.status(502).json({ ok: false, error: "Could not send right now. Please call or WhatsApp us." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Wisemelon request failed", error && error.message);
    return res.status(502).json({ ok: false, error: "Could not send right now. Please call or WhatsApp us." });
  }
};
