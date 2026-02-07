/************************************
 * CONFIGURATION (TOP OF FILE)
 ************************************/
const SERVICE_ACCOUNT_EMAIL =
  "fpl-web-123@fpl2024-438115.iam.gserviceaccount.com";

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDNOVTdwpkhJVrx\nr5MIhggrk41YrOMlJaFVu8ffi0P4+k5gaynq5Nse7q4+xqswkVOfdP172P0F/uW7\nwIOYEPZEr1nQMRfiHOOXGETGL0kzj6jLP4hg50Bx3XDBHceI5n4uMd5AiZujBBYz\nok5QuxaYbjclD/mdvX5Zlw6ngoTOEIaRJ0a7SChLrhUNpj60xbvbJxSXj/16fPvL\n0nUymlu14feXGjO8NfSnoeZW8CsZypG3vB1Y9tKhl++bQVDzzUzYJWe/Jqux8cGm\n/9dTo3ojUjWXeBymNFKqiJQOfxonkQtWcwMv1sDvDDWKiK3qVJyGvF07nvellcrX\nxxDtH0E1AgMBAAECggEAG0C0y2ovKZ6rUBMPxH8AEMFccN0soN85aIgyR7ZXxXV/\n+P/iJiZUDuyFSSLa0u1JnJBNpSewmh46Zc9v6j6+ZWqf06zhTg6mDoeTgnn/D5DR\nSoRaWPv8q+JLOen5eG2bbgkDSbC8cU52oE66dbASlRV1zz8q1861O7J6qLYFatO7\nz2kEh8Cb+UtBxsQ8z/f90CrWavaoixxKtb7wLdYaQRM8+PRoLKu1cs2DdcYuICLr\nMDm9Tw/KAnPaU1ykSg8A7wTjUVfgJphWEyPM8mKLvCD8n36z/jAimPbbM1Ae3mxn\n06ucOHjMPjTpXJQNDWB0b/3s24CNhfhJ1t9OL1imgQKBgQD82DFwhvAPRiVFljwp\nN3OHKvaRkIlV1baOeaE4fPeGjH5dAVohqxW+cmoxHL3QtbenklVp4Eb7ieRhz2Xe\ns7SBYYGjfBwvn00Jm+BT/znS9QNQZGP+iyBZ7b4uel0ZbitVpahIIwh7RAig/hJy\nNnvmtKS7DDWvkwmuLewgEGcu1QKBgQDPyP8iOE+iXSA8zUbbY3iRz9m4Tdr85UII\n5YsLNeC4LrpoEs/zcYXO4whmkBHwx/7upHKCnmTq8NGQWV/ap05UoCZUn+Yc7i8J\n5Ex8eHYQDjHtvsLyZegIHmBwR+EbkHF/cmO412quTCzNt6GSlRA42hyq/0aovqGm\nQ0fGdK644QKBgGpX05NsbZM/AXYfFfaP5/s1yra2f8ymMj4CUhicFs90T8F2TB5V\nArQzEw7M89jQVQoZtert9WzeNjwdKs9b7dNs20WTcZdl/NTJxrQNaJidjGNHlfb9\nNQIdyBtsQ7Pqbjd7kSel9G9D0g1ETyXSXJJP7+jr3biWsz+a+PETdRJxAoGAB7Xt\nwddVHTFXgOodNwb58m9EJRK+jaP0T2A1SLU3IZ6aTEJmdSJBVOwX47Z08/p3+2Me\n3LoEBLPrEvA+Hl8XCQzoXzuPzoMIO9W9AOF3gCEGuUva8CPX+HUoHwKL1/oEPDaC\nfNmBm/Y3s2qdFFNzxqhRaAcRGDH6zbCxeSvbUAECgYBAWspYZelHO2HoIGFNW4yG\nmU9a6a27xHgoDLySTmY+0eRJfEASbA7pdeL6A66ZeHZsrOWcRrbU6u1v7NC9JdIf\nLbOjXIkvxWR7+XqnsqFFFdQmFz1fXnoxy2viF94GcgfN8NBUwjZ14iWJ/qS+JqKZ\n45b4A6BXeEvFUTRJN+AjkQ==\n-----END PRIVATE KEY-----`;

const SPREADSHEET_ID =
  "1un_lwnU3pnp3PEFBHceNPJx1qBGVDR8m-rfhDA7wLbw";

// Ranges
const RANGE_FLIGHT = "K17:Q17";   // 7 cells
const RANGE_ACFT   = "F21:I21";   // 4 cells
const RANGE_CODE   = "R21:AF21";  // long text (will be written starting in R21)

// Behavior
const PREFIX_WORD = "DAH"; // before digits
const MIN_DIGITS = 3;
const MAX_DIGITS = 4;

// Aircraft mapping (7 types -> 4-char code)
const ACFT_CODE_MAP = {
  "ATR72-500": "AT75",
  "ATR72-600": "AT76",
  "BOEING B737-600": "B736",
  "BOEING B737-700": "B737",
  "BOEING B737-800": "B738",
  "AIRBUS A332-200": "A332",
  "A330-900": "A339",
};

// R21:AF21 long-code mapping by aircraft code
const LONG_CODE_BY_ACFT_CODE = {
  // Boeing: same for 600/700/800
  B736: "SDE1FGHIJ1M1RWY     /     LB1",
  B737: "SDE1FGHIJ1M1RWY     /     LB1",
  B738: "SDE1FGHIJ1M1RWY     /     LB1",

  // ATR
  AT75: "SDFGIRYZ     /     H",
  AT76: "SDFGIRYZ     /     HB1",

  // Airbus
  A332: "SDE2FGHIJ2J4J5M1P2RWXYZ     /     LB1D1",
  A339: "SDE1E2E3GHIJ1J4J5M1P2RWXY     /     LB1D1",
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
 * BUILD VALUES
 ************************************/
function sanitizeDigits(v) {
  return String(v || "").replace(/\D/g, "").slice(0, MAX_DIGITS);
}

function isValidDigits(v) {
  return new RegExp(`^\\d{${MIN_DIGITS},${MAX_DIGITS}}$`).test(v);
}

function buildRowK17Q17(digits) {
  const s = PREFIX_WORD + digits; // DAH123 or DAH1234

  const row = s.split("");
  while (row.length < 7) row.push("");
  if (row.length > 7) row.length = 7;

  return { display: s, row };
}

function getAcftCode(acftType) {
  const code = ACFT_CODE_MAP[acftType];
  if (!code) throw new Error("Select aircraft type");
  return code;
}

function buildRowF21I21(acftCode) {
  if (acftCode.length !== 4) throw new Error("Invalid aircraft code");
  return acftCode.split(""); // 4 cells
}

function getLongCode(acftCode) {
  const s = LONG_CODE_BY_ACFT_CODE[acftCode];
  if (!s) throw new Error("No long code mapping for " + acftCode);
  return s;
}

/************************************
 * BATCH UPDATE
 ************************************/
async function batchUpdateRanges(data) {
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
        data,
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

input.addEventListener("input", () => {
  input.value = sanitizeDigits(input.value);
});

btn.onclick = async () => {
  const digits = sanitizeDigits(input.value);
  const acftType = acftSelect ? acftSelect.value : "";

  if (!isValidDigits(digits)) {
    return setStatus("❌ Enter ONLY 3 or 4 digits", false);
  }

  if (!acftType) {
    return setStatus("❌ Select an aircraft type", false);
  }

  setStatus("⏳ Updating Google Sheet...");

  try {
    const flight = buildRowK17Q17(digits);

    const acftCode = getAcftCode(acftType);
    const acftRow = buildRowF21I21(acftCode);

    const longCode = getLongCode(acftCode);

    await batchUpdateRanges([
      { range: RANGE_FLIGHT, values: [flight.row] },   // K17:Q17
      { range: RANGE_ACFT,   values: [acftRow] },      // F21:I21
      { range: RANGE_CODE,   values: [[longCode]] },   // R21:AF21 (string goes in R21)
    ]);

    setStatus(`✅ Updated → ${flight.display} | ${acftCode}`);

    setTimeout(openSheet, 200);
  } catch (err) {
    console.error(err);
    setStatus("❌ ERROR — check console", false);
  }
};
