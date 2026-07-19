// GET  /api/referral?initData=...  -> the caller's own list of validly
//                                      invited friends (for the Referral
//                                      modal + milestone progress)
// POST /api/referral { initData, referrerCode } -> called once by a NEW
//                                      player who opened the app via a
//                                      referral link (?startapp=<code>)
//
// Anti-fraud rule (by request): an invite only counts if the new player's
// IP address is different from the referrer's most-recently-seen IP AND
// hasn't already been used for a previous invite under the same referrer.
// This doesn't stop a determined cheater (IPs can be shared or spoofed),
// but it blocks the easy case of one person opening their own link from a
// second Telegram account on the same phone/wifi to farm milestones.

import { getRedis } from "./_redis.js";
import { verifyTelegramInitData } from "./_telegram-auth.js";
import { getClientIp } from "./_ip.js";

const REFERRALS_KEY = (referrerId) => `referrals:${referrerId}`; // hash: inviteeId -> JSON {name, joinedAt, ip}
const REFERRAL_IPS_KEY = (referrerId) => `referral_ips:${referrerId}`; // set of IPs already credited to this referrer
const REFERRED_BY_KEY = (inviteeId) => `referred_by:${inviteeId}`; // string: which referrer this invitee is locked to
const PLAYER_IP_KEY = (id) => `player_ip:${id}`;

function referrerIdFromCode(code) {
  // Codes are generated client-side as `CORE${telegramUserId}` (see
  // referralCode in CoreMiningApp.jsx) — deterministic, so no separate
  // code->user lookup table is needed.
  if (typeof code !== "string") return null;
  const match = code.match(/^CORE(\d+)$/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  let redis;
  try {
    redis = getRedis();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "redis_unavailable" });
  }

  if (req.method === "GET") {
    const user = verifyTelegramInitData(req.query.initData);
    if (!user) return res.status(401).json({ ok: false, error: "invalid_init_data" });

    try {
      const raw = await redis.hgetall(REFERRALS_KEY(user.id));
      const invitedFriends = Object.entries(raw || {}).map(([id, json]) => {
        try {
          const { name, joinedAt } = JSON.parse(json);
          return { id, name, joinedAt };
        } catch {
          return { id, name: "Miner", joinedAt: Date.now() };
        }
      });
      return res.status(200).json({ ok: true, invitedFriends });
    } catch (err) {
      console.error("referral GET error:", err);
      return res.status(500).json({ ok: false, error: "server_error" });
    }
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const invitee = verifyTelegramInitData(body.initData);
    if (!invitee) return res.status(401).json({ ok: false, error: "invalid_init_data" });

    const referrerId = referrerIdFromCode(body.referrerCode);
    if (!referrerId) return res.status(400).json({ ok: false, error: "invalid_referrer_code" });
    if (String(referrerId) === String(invitee.id)) {
      return res.status(400).json({ ok: false, valid: false, reason: "self_referral" });
    }

    try {
      // Idempotency: each invitee can only ever be credited to one
      // referrer, and only once. If this key already exists (from this
      // call or a retry), just report whether it matched this referrer.
      const alreadyReferredBy = await redis.get(REFERRED_BY_KEY(invitee.id));
      if (alreadyReferredBy) {
        return res.status(200).json({
          ok: true,
          valid: alreadyReferredBy === String(referrerId),
          reason: "already_processed",
        });
      }

      const inviteeIp = getClientIp(req);
      const referrerIp = await redis.get(PLAYER_IP_KEY(referrerId));

      let valid = true;
      let reason = null;
      if (!inviteeIp) {
        valid = false;
        reason = "no_ip";
      } else if (referrerIp && inviteeIp === referrerIp) {
        valid = false;
        reason = "same_ip_as_referrer";
      } else {
        const ipAlreadyUsed = await redis.sismember(REFERRAL_IPS_KEY(referrerId), inviteeIp);
        if (ipAlreadyUsed) {
          valid = false;
          reason = "ip_already_used_for_this_referrer";
        }
      }

      // Lock this invitee to this referrer either way, so retries/repeat
      // link-opens can't be replayed to keep re-rolling the IP check.
      await redis.set(REFERRED_BY_KEY(invitee.id), String(referrerId));

      if (valid) {
        const pipeline = redis.pipeline();
        pipeline.hset(
          REFERRALS_KEY(referrerId),
          String(invitee.id),
          JSON.stringify({
            name: invitee.first_name || "Miner",
            joinedAt: Date.now(),
          })
        );
        if (inviteeIp) pipeline.sadd(REFERRAL_IPS_KEY(referrerId), inviteeIp);
        await pipeline.exec();
      }

      return res.status(200).json({ ok: true, valid, reason });
    } catch (err) {
      console.error("referral POST error:", err);
      return res.status(500).json({ ok: false, error: "server_error" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
