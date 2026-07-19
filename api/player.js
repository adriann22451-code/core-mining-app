// GET  /api/player?initData=...          -> load this player's saved progress
// POST /api/player  { initData, progress, claimedDelta } -> save progress
//
// `progress` is the same shape already saved to localStorage under
// core_miner_save_v2 (see src/CoreMiningApp.jsx persistRef). `claimedDelta`
// is how much CORE this player earned since their last sync — used to add
// to the real, global "Total CORE mined" counter (see api/stats.js).

import { getRedis } from "./_redis.js";
import { verifyTelegramInitData } from "./_telegram-auth.js";

const PLAYER_KEY = (id) => `player:${id}`;
const ACTIVE_MINERS_KEY = "active_miners";
const TOTAL_MINED_KEY = "stats:totalMined";

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
      const raw = await redis.get(PLAYER_KEY(user.id));
      return res.status(200).json({
        ok: true,
        exists: !!raw,
        progress: raw ? JSON.parse(raw) : null,
      });
    } catch (err) {
      console.error("player GET error:", err);
      return res.status(500).json({ ok: false, error: "server_error" });
    }
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const user = verifyTelegramInitData(body.initData);
    if (!user) return res.status(401).json({ ok: false, error: "invalid_init_data" });

    const { progress, claimedDelta } = body;
    if (!progress || typeof progress !== "object") {
      return res.status(400).json({ ok: false, error: "missing_progress" });
    }

    try {
      const now = Date.now();
      const pipeline = redis.pipeline();
      pipeline.set(PLAYER_KEY(user.id), JSON.stringify(progress));
      // Heartbeat: mark this player as active right now (stats.js counts
      // anyone seen within the last 24h as an "active miner").
      pipeline.zadd(ACTIVE_MINERS_KEY, now, String(user.id));

      const delta = Number(claimedDelta);
      if (Number.isFinite(delta) && delta > 0) {
        pipeline.incrbyfloat(TOTAL_MINED_KEY, delta);
      }

      await pipeline.exec();
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("player POST error:", err);
      return res.status(500).json({ ok: false, error: "server_error" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
