// GET /api/stats -> { activeMiners, totalMined } computed from real player
// data (not the presentational simulation in CoreMiningApp.jsx). Public,
// read-only, no auth needed — it's just an aggregate count.

import { getRedis } from "./_redis.js";

const ACTIVE_MINERS_KEY = "active_miners";
const TOTAL_MINED_KEY = "stats:totalMined";
const ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000; // "active" = seen in the last 24h

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const redis = getRedis();
    const now = Date.now();

    // Drop stale heartbeats first so ZCARD only reflects the active window.
    await redis.zremrangebyscore(ACTIVE_MINERS_KEY, 0, now - ACTIVE_WINDOW_MS);

    const [activeMiners, totalMinedRaw] = await Promise.all([
      redis.zcard(ACTIVE_MINERS_KEY),
      redis.get(TOTAL_MINED_KEY),
    ]);

    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=30");
    return res.status(200).json({
      ok: true,
      activeMiners,
      totalMined: parseFloat(totalMinedRaw || "0"),
    });
  } catch (err) {
    console.error("stats GET error:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}
