/************************************
 * CONFIGURATION (TOP OF FILE)
 ************************************/
const SERVICE_ACCOUNT_EMAIL =
  "fpl-web-123@fpl2024-438115.iam.gserviceaccount.com";

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDNOVTdwpkhJVrx\nr5MIhggrk41YrOMlJaFVu8ffi0P4+k5gaynq5Nse7q4+xqswkVOfdP172P0F/uW7\nwIOYEPZEr1nQMRfiHOOXGETGL0kzj6jLP4hg50Bx3XDBHceI5n4uMd5AiZujBBYz\nok5QuxaYbjclD/mdvX5Zlw6ngoTOEIaRJ0a7SChLrhUNpj60xbvbJxSXj/16fPvL\n0nUymlu14feXGjO8NfSnoeZW8CsZypG3vB1Y9tKhl++bQVDzzUzYJWe/Jqux8cGm\n/9dTo3ojUjWXeBymNFKqiJQOfxonkQtWcwMv1sDvDDWKiK3qVJyGvF07nvellcrX\nxxDtH0E1AgMBAAECggEAG0C0y2ovKZ6rUBMPxH8AEMFccN0soN85aIgyR7ZXxXV/\n+P/iJiZUDuyFSSLa0u1JnJBNpSewmh46Zc9v6j6+ZWqf06zhTg6mDoeTgnn/D5DR\nSoRaWPv8q+JLOen5eG2bbgkDSbC8cU52oE66dbASlRV1zz8q1861O7J6qLYFatO7\nz2kEh8Cb+UtBxsQ8z/f90CrWavaoixxKtb7wLdYaQRM8+PRoLKu1cs2DdcYuICLr\nMDm9Tw/KAnPaU1ykSg8A7wTjUVfgJphWEyPM8mKLvCD8n36z/jAimPbbM1Ae3mxn\n06ucOHjMPjTpXJQNDWB0b/3s24CNhfhJ1t9OL1imgQKBgQD82DFwhvAPRiVFljwp\nN3OHKvaRkIlV1baOeaE4fPeGjH5dAVohqxW+cmoxHL3QtbenklVp4Eb7ieRhz2Xe\ns7SBYYGjfBwvn00Jm+BT/znS9QNQZGP+iyBZ7b4uel0ZbitVpahIIwh7RAig/hJy\nNnvmtKS7DDWvkwmuLewgEGcu1QKBgQDPyP8iOE+iXSA8zUbbY3iRz9m4Tdr85UII\n5YsLNeC4LrpoEs/zcYXO4whmkBHwx/7upHKCnmTq8NGQWV/ap05UoCZUn+Yc7i8J\n5Ex8eHYQDjHtvsLyZegIHmBwR+EbkHF/cmO412quTCzNt6GSlRA42hyq/0aovqGm\nQ0fGdK644QKBgGpX05NsbZM/AXYfFfaP5/s1yra2f8ymMj4CUhicFs90T8F2TB5V\nArQzEw7M89jQVQoZtert9WzeNjwdKs9b7dNs20WTcZdl/NTJxrQNaJidjGNHlfb9\nNQIdyBtsQ7Pqbjd7kSel9G9D0g1ETyXSXJJP7+jr3biWsz+a+PETdRJxAoGAB7Xt\nwddVHTFXgOodNwb58m9EJRK+jaP0T2A1SLU3IZ6aTEJmdSJBVOwX47Z08/p3+2Me\n3LoEBLPrEvA+Hl8XCQzoXzuPzoMIO9W9AOF3gCEGuUva8CPX+HUoHwKL1/oEPDaC\nfNmBm/Y3s2qdFFNzxqhRaAcRGDH6zbCxeSvbUAECgYBAWspYZelHO2HoIGFNW4yG\nmU9a6a27xHgoDLySTmY+0eRJfEASbA7pdeL6A66ZeHZsrOWcRrbU6u1v7NC9JdIf\nLbOjXIkvxWR7+XqnsqFFFdQmFz1fXnoxy2viF94GcgfN8NBUwjZ14iWJ/qS+JqKZ\n45b4A6BXeEvFUTRJN+AjkQ==\n-----END PRIVATE KEY-----`;

const SPREADSHEET_ID =
  "1un_lwnU3pnp3PEFBHceNPJx1qBGVDR8m-rfhDA7wLbw";

// Target range
const TARGET_RANGE = "K17:Q17";

// Behavior
const PREFIX_WORD = "DAH";     // ✅ add the WORD DAH before digits
const MIN_DIGITS = 3;         // ✅ accept only 3 or 4 digits
const MAX_DIGITS = 4;

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
 * JWT + AUTH (with token cache)
 ************************************/
let cachedToken = null;
let tokenExpiryMs = 0;

async function importPrivateKey() {
  // Works whether PRIVATE_KEY is multiline or contains \n
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
  try {
    json = JSON.parse(txt);
  } catch {
    throw new Error("Token response not JSON: " + txt);
  }

  if (!res.ok || !json.access_token) {
    throw new Error("Token error: " + txt);
  }

  cachedToken = json.access_token;
  tokenExpiryMs = now + 55 * 60 * 1000; // 55min cache
  return cachedToken;
}

/************************************
 * SHEETS UPDATE (K17:Q17)
 ************************************/
function buildRowForK17Q17(digits) {
  // digits is "123" or "1234"
  const s = PREFIX_WORD + digits; // "DAH123" or "DAH1234"

  // K17:Q17 = 7 cells total
  const row = s.split(""); // chars spread across cells
  while (row.length < 7) row.push(""); // pad remaining cells with blanks
  if (row.length > 7) row.length = 7;  // safety
  return { display: s, row };
}

async function updateK17Q17(row) {
  const token = await getAccessTokenCached();

  const resp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
      TARGET_RANGE
    )}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );

  const bodyText = await resp.text();
  if (!resp.ok) {
    // This shows the real reason (403, permission, etc.)
    throw new Error(bodyText);
  }

  return bodyText;
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

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? "#a7ffb0" : "#ffb4b4";
}

function sanitizeDigits(v) {
  // numbers only, max 4 digits
  return String(v || "").replace(/\D/g, "").slice(0, MAX_DIGITS);
}

function isValidDigits(v) {
  return new RegExp(`^\\d{${MIN_DIGITS},${MAX_DIGITS}}$`).test(v);
}

input.addEventListener("input", () => {
  input.value = sanitizeDigits(input.value);
});

btn.onclick = async () => {
  const digits = sanitizeDigits(input.value);

  if (!isValidDigits(digits)) {
    return setStatus(`❌ Enter ONLY ${MIN_DIGITS} or ${MAX_DIGITS} digits`, false);
  }

  const { display, row } = buildRowForK17Q17(digits);

  setStatus("⏳ Updating Google Sheet...");

  try {
    await updateK17Q17(row);
    setStatus(`✅ Updated → ${display}`);

    setTimeout(openSheet, 200);
  } catch (err) {
    console.error(err);
    setStatus("❌ ERROR — check console (likely 403 permissions)", false);
  }
};
