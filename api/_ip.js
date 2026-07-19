// Best-effort client IP extraction for Vercel serverless functions.
// Used only for referral anti-fraud (see api/referral.js) — not for
// anything security-critical on its own, since IPs can be shared (NAT,
// campus wifi, VPN) or spoofed in theory. Combined with initData
// verification, it's a reasonable deterrent against someone farming
// referral milestones with throwaway Telegram accounts on the same device.
export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const first = Array.isArray(xff) ? xff[0] : xff;
    return first.split(",")[0].trim();
  }
  const xRealIp = req.headers["x-real-ip"];
  if (xRealIp) return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
  return req.socket?.remoteAddress || null;
}
