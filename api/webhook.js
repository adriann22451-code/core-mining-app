// Vercel Serverless Function — handles Telegram bot updates via webhook.
// Deployed automatically at: https://<your-app>.vercel.app/api/webhook
//
// Setup (one-time):
//   1. In the Vercel dashboard: Project → Settings → Environment Variables,
//      add TELEGRAM_BOT_TOKEN = <token from @BotFather> and BOT_WEBAPP_URL =
//      https://core-mining-app.vercel.app (your Mini App URL). Redeploy.
//   2. Tell Telegram where to send updates (run once from your own machine
//      or any terminal — replace <TOKEN> and <VERCEL_URL>):
//      curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<VERCEL_URL>/api/webhook"
//   3. Send /start to your bot in Telegram to test.

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId, text, extra = {}) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...extra }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(200).send("CORE Miner bot webhook is alive.");
    return;
  }

  try {
    const update = req.body;
    const message = update?.message;
    const chatId = message?.chat?.id;
    const text = message?.text || "";

    if (chatId && text.startsWith("/start")) {
      const webAppUrl = process.env.BOT_WEBAPP_URL || "https://core-mining-app.vercel.app";
      const firstName = message?.from?.first_name || "Miner";

      await sendMessage(
        chatId,
        `👋 Welcome, ${firstName}!\n\n⚡ <b>CORE Miner</b> — build your rig fleet, mine CORE, and climb the network.\n\nTap the button below to start mining.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⛏️ Launch CORE Miner", web_app: { url: webAppUrl } }],
            ],
          },
        }
      );
    } else if (chatId && text.startsWith("/help")) {
      await sendMessage(
        chatId,
        "Send /start to open CORE Miner, or tap the menu button next to the message box."
      );
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    // Still 200 — Telegram retries aggressively on non-200 responses.
    res.status(200).json({ ok: false });
  }
}
