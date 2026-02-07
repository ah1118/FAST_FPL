/************************************
 * CONFIGURATION (TOP OF FILE)
 ************************************/
const SERVICE_ACCOUNT_EMAIL =
  "fpl-web-123@fpl2024-438115.iam.gserviceaccount.com";

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDNOVTdwpkhJVrx\nr5MIhggrk41YrOMlJaFVu8ffi0P4+k5gaynq5Nse7q4+xqswkVOfdP172P0F/uW7\nwIOYEPZEr1nQMRfiHOOXGETGL0kzj6jLP4hg50Bx3XDBHceI5n4uMd5AiZujBBYz\nok5QuxaYbjclD/mdvX5Zlw6ngoTOEIaRJ0a7SChLrhUNpj60xbvbJxSXj/16fPvL\n0nUymlu14feXGjO8NfSnoeZW8CsZypG3vB1Y9tKhl++bQVDzzUzYJWe/Jqux8cGm\n/9dTo3ojUjWXeBymNFKqiJQOfxonkQtWcwMv1sDvDDWKiK3qVJyGvF07nvellcrX\nxxDtH0E1AgMBAAECggEAG0C0y2ovKZ6rUBMPxH8AEMFccN0soN85aIgyR7ZXxXV/\n+P/iJiZUDuyFSSLa0u1JnJBNpSewmh46Zc9v6j6+ZWqf06zhTg6mDoeTgnn/D5DR\nSoRaWPv8q+JLOen5eG2bbgkDSbC8cU52oE66dbASlRV1zz8q1861O7J6qLYFatO7\nz2kEh8Cb+UtBxsQ8z/f90CrWavaoixxKtb7wLdYaQRM8+PRoLKu1cs2DdcYuICLr\nMDm9Tw/KAnPaU1ykSg8A7wTjUVfgJphWEyPM8mKLvCD8n36z/jAimPbbM1Ae3mxn\n06ucOHjMPjTpXJQNDWB0b/3s24CNhfhJ1t9OL1imgQKBgQD82DFwhvAPRiVFljwp\nN3OHKvaRkIlV1baOeaE4fPeGjH5dAVohqxW+cmoxHL3QtbenklVp4Eb7ieRhz2Xe\ns7SBYYGjfBwvn00Jm+BT/znS9QNQZGP+iyBZ7b4uel0ZbitVpahIIwh7RAig/hJy\nNnvmtKS7DDWvkwmuLewgEGcu1QKBgQDPyP8iOE+iXSA8zUbbY3iRz9m4Tdr85UII\n5YsLNeC4LrpoEs/zcYXO4whmkBHwx/7upHKCnmTq8NGQWV/ap05UoCZUn+Yc7i8J\n5Ex8eHYQDjHtvsLyZegIHmBwR+EbkHF/cmO412quTCzNt6GSlRA42hyq/0aovqGm\nQ0fGdK644QKBgGpX05NsbZM/AXYfFfaP5/s1yra2f8ymMj4CUhicFs90T8F2TB5V\nArQzEw7M89jQVQoZtert9WzeNjwdKs9b7dNs20WTcZdl/NTJxrQNaJidjGNHlfb9\nNQIdyBtsQ7Pqbjd7kSel9G9D0g1ETyXSXJJP7+jr3biWsz+a+PETdRJxAoGAB7Xt\nwddVHTFXgOodNwb58m9EJRK+jaP0T2A1SLU3IZ6aTEJmdSJBVOwX47Z08/p3+2Me\n3LoEBLPrEvA+Hl8XCQzoXzuPzoMIO9W9AOF3gCEGuUva8CPX+HUoHwKL1/oEPDaC\nfNmBm/Y3s2qdFFNzxqhRaAcRGDH6zbCxeSvbUAECgYBAWspYZelHO2HoIGFNW4yG\nmU9a6a27xHgoDLySTmY+0eRJfEASbA7pdeL6A66ZeHZsrOWcRrbU6u1v7NC9JdIf\nLbOjXIkvxWR7+XqnsqFFFdQmFz1fXnoxy2viF94GcgfN8NBUwjZ14iWJ/qS+JqKZ\n45b4A6BXeEvFUTRJN+AjkQ==\n-----END PRIVATE KEY-----`;

const SPREADSHEET_ID =
  "1un_lwnU3pnp3PEFBHceNPJx1qBGVDR8m-rfhDA7wLbw";

// Ranges
const RANGE_FLIGHT = "K17:Q17"; // 7 cells
const RANGE_ACFT   = "F21:I21"; // 4 cells

// Behavior
const PREFIX_WORD = "DAH"; // put before digits
const MIN_DIGITS = 3;
const MAX_DIGITS = 4;

// Aircraft mapping (7 types)
const ACFT_CODE_MAP = {
  "ATR72-500": "AT75",
  "ATR72-600": "AT76",
  "BOEING B737-600": "B736",
  "BOEING B737-700": "B737",
  "BOEING B737-800": "B738",
  "AIRBUS A332-200": "A332",
  "A330-900": "A339",
};

/************************************
 * BASE64URL
 ************************************/
function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/************************************
 * JWT + AUTH (token cache)
 ************************************/
let cachedToken = null;
let tokenExpiryMs = 0;

async function importPrivateKey() {
  // Works for multiline and \n format
  const pem = PRIVATE_KEY
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");

  const binary = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    binary,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function generateJWT() {
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(
    new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  );

  const claim = base64url(
    new TextEncoder().encode(
      JSON.stringify({
        iss: SERVICE_ACCOUNT_EMAIL,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      })
    )
  );

  const unsignedJWT = `${header}.${claim}`;
  const key = await importPrivateKey();

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedJWT)
  );

  return `${unsignedJWT}.${base64url(new Uint8Array(signature))}`;
}

async function getAccessTokenCached() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryMs) return cachedToken;

  const jwt = await generateJWT();

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const txt = await res.text();
  let json;
  try { json = JSON.parse(txt); } catch { throw new Error("Token response not JSON: " + txt); }

  if (!res.ok || !json.access_token) throw new Error("Token error: " + txt);

  cachedToken = json.access_token;
  tokenExpiryMs = now + 55 * 60 * 1000;
  return cachedToken;
}

/************************************
 * BUILD VALUES FOR RANGES
 ************************************/
function sanitizeDigits(v) {
  return String(v || "").replace(/\D/g, "").slice(0, MAX_DIGITS);
}

function isValidDigits(v) {
  return new RegExp(`^\\d{${MIN_DIGITS},${MAX_DIGITS}}$`).test(v);
}

function buildRowK17Q17(digits) {
  // "DAH" + 3/4 digits => 6 or 7 chars total
  const s = PREFIX_WORD + digits;

  const row = s.split("");     // chars -> cells
  while (row.length < 7) row.push(""); // pad to 7 cells
  if (row.length > 7) row.length = 7; // safety

  return { display: s, row };
}

function buildRowF21I21(acftType) {
  const code = ACFT_CODE_MAP[acftType] || "";

  if (!code || code.length !== 4) {
    throw new Error("Invalid aircraft type or code not found");
  }

  return { code, row: code.split("") }; // 4 chars => F,G,H,I
}

/************************************
 * ONE CALL: batchUpdate both ranges
 ************************************/
async function batchUpdateRanges(updates) {
  const token = await getAccessTokenCached();

  const resp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueInputOption: "RAW",
        data: updates, // [{range, values}]
      }),
    }
  );

  const txt = await resp.text();
  if (!resp.ok) throw new Error(txt);
  return txt;
}

function openSheet() {
  window.open(
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=0`,
    "_blank"
  );
}

/************************************
 * UI
 ************************************/
const input = document.getElementById("num");
const btn = document.getElementById("go");
const status = document.getElementById("status");
const acftSelect = document.getElementById("acftType");

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? "#a7ffb0" : "#ffb4b4";
}

// numbers only, max 4
input.addEventListener("input", () => {
  input.value = sanitizeDigits(input.value);
});

btn.onclick = async () => {
  const digits = sanitizeDigits(input.value);
  const acftType = acftSelect ? acftSelect.value : "";

  if (!isValidDigits(digits)) {
    return setStatus("❌ Enter ONLY 3 or 4 digits", false);
  }

  if (!ACFT_CODE_MAP[acftType]) {
    return setStatus("❌ Select an aircraft type", false);
  }

  setStatus("⏳ Updating Google Sheet...");

  try {
    const flight = buildRowK17Q17(digits);
    const acft = buildRowF21I21(acftType);

    await batchUpdateRanges([
      { range: RANGE_FLIGHT, values: [flight.row] }, // K17:Q17
      { range: RANGE_ACFT,   values: [acft.row] },   // F21:I21
    ]);

    setStatus(`✅ Updated → ${flight.display} | ACFT=${acft.code}`);

    setTimeout(openSheet, 200);
  } catch (err) {
    console.error(err);
    setStatus("❌ ERROR — check console", false);
  }
};
