// ✅ Paste your Apps Script Web App URL here (Deploy -> Web app -> copy URL)
const SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

const numEl = document.getElementById("num");
const statusEl = document.getElementById("status");
const btn = document.getElementById("go");

// numbers only (hard block)
numEl.addEventListener("input", () => {
  numEl.value = numEl.value.replace(/\D/g, "").slice(0, 6);
});

function setStatus(msg, ok=true) {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? "#a7ffb0" : "#ffb4b4";
}

btn.onclick = async () => {
  const v = numEl.value.trim();

  if (v.length !== 6) {
    return setStatus("Enter exactly 6 digits.", false);
  }
  if (!SCRIPT_URL || SCRIPT_URL.includes("PASTE_")) {
    return setStatus("Set SCRIPT_URL in app.js first.", false);
  }

  // ✅ final 7 chars for K17:Q17
  const chars = (v + "-").split(""); // ["1","2","3","4","5","6","-"]

  setStatus("Updating sheet...");

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "update_k17_q17",
        spreadsheetId: "1un_lwnU3pnp3PEFBHceNPJx1qBGVDR8m-rfhDA7wLbw",
        range: "K17:Q17",
        values: [chars]
      })
    });

    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { ok:false, error:text }; }

    if (!res.ok || !json.ok) {
      return setStatus("Failed: " + (json.error || res.status), false);
    }
    setStatus("✅ Updated K17:Q17 = " + v + "-");
  } catch (e) {
    setStatus("Network error: " + e.message, false);
  }
};
