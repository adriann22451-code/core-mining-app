// Verifies Telegram Mini App `initData` per Telegram's documented algorithm:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
//
// Without this, anyone could POST { initData: 'user=...&id=999' } and read
// or overwrite another player's progress. Reuses TELEGRAM_BOT_TOKEN (already
// configured for api/webhook.js).

import crypto from "crypto";

const MAX_AGE_SECONDS = 24 * 60 * 60; // reject initData older than 24h

export function verifyTelegramInitData(initData) {
  if (!initData || typeof initData !== "string") return null;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN is not set — cannot verify initData.");
    return null;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.keys()]
    .sort()
    .map((key) => `${key}=${params.get(key)}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  // Constant-time compare to avoid timing side-channels.
  const a = Buffer.from(computedHash, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = parseInt(params.get("auth_date") || "0", 10);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;

  try {
    const user = JSON.parse(userRaw);
    if (!user?.id) return null;
    return user;
  } catch {
    return null;
  }
}
