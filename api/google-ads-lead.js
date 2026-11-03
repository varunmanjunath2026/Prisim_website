// Google Ads lead form webhook → Wisemelon.
//
// In Google Ads (lead form asset → "Lead delivery" → Webhook integration) set:
//   Webhook URL: https://www.prisim.co.in/api/google-ads-lead/
//   Key:         the same value as GOOGLE_ADS_WEBHOOK_KEY below
//
// Vercel environment variables (Project → Settings → Environment Variables):
//   WISEMELON_WEBHOOK_URL   your Wisemelon incoming webhook (shared with /api/lead)
//   GOOGLE_ADS_WEBHOOK_KEY  a long random secret; Google sends it with every lead
//
// Google sends JSON like:
//   { lead_id, form_id, campaign_id, adgroup_id, creative_id, gcl_id, is_test, google_key,
//     user_column_data: [ { column_id: "FULL_NAME", column_name, string_value }, ... ] }
// and expects HTTP 200 back.

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
};

const clip = (value, max = 500) => String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const expectedKey = process.env.GOOGLE_ADS_WEBHOOK_KEY;
  const target = process.env.WISEMELON_WEBHOOK_URL;
  if (!expectedKey || !target) {
    console.error("Missing GOOGLE_ADS_WEBHOOK_KEY or WISEMELON_WEBHOOK_URL");
    return res.status(500).json({ ok: false, error: "Not configured" });
  }

  const body = await readBody(req);
  if (body.google_key !== expectedKey) {
    return res.status(401).json({ ok: false, error: "Invalid key" });
  }

  // Turn Google's column list into simple fields.
  const columns = {};
  const extra = {};
  for (const col of Array.isArray(body.user_column_data) ? body.user_column_data : []) {
    const id = clip(col.column_id, 80).toUpperCase();
    const val = clip(col.string_value, 2000);
    if (!val) continue;
    if (id) columns[id] = val;
    else extra[clip(col.column_name, 120) || "field"] = val;
    if (id && !["FULL_NAME", "FIRST_NAME", "LAST_NAME", "PHONE_NUMBER", "EMAIL", "COMPANY_NAME", "CITY"].includes(id)) {
      extra[clip(col.column_name, 120) || id] = val; // custom questions keep their label
    }
  }

  const name = columns.FULL_NAME || [columns.FIRST_NAME, columns.LAST_NAME].filter(Boolean).join(" ");
  const phone = columns.PHONE_NUMBER || "";
  const email = columns.EMAIL || "";
  const message = Object.entries(extra).map(([k, v]) => `${k}: ${v}`).join("\n");
  const isTest = Boolean(body.is_test);

  const lead = {
    name, phone, email, message,
    fullname: name, contactno: phone, emailid: email, anything: message,
    companyname: columns.COMPANY_NAME || "",
    city: columns.CITY || "",
    source: isTest ? "Google Ads lead form (TEST)" : "Google Ads lead form",
    lead_id: clip(body.lead_id, 120),
    campaign_id: clip(body.campaign_id, 60),
    adgroup_id: clip(body.adgroup_id, 60),
    form_id: clip(body.form_id, 60),
    gclid: clip(body.gcl_id, 200),
    is_test: isTest,
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
      // Non-2xx makes Google Ads retry later instead of losing the lead.
      return res.status(502).json({ ok: false });
    }
    return res.status(200).json({});
  } catch (error) {
    console.error("Wisemelon request failed", error && error.message);
    return res.status(502).json({ ok: false });
  }
};
