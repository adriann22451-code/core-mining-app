// Shared Redis client for Vercel Serverless Functions.
//
// Vercel injects REDIS_URL automatically once you connect a Redis database
// from Storage → Marketplace Database Providers → Redis. We keep a single
// client cached at module scope so warm invocations of the same function
// instance reuse the connection instead of opening a new one every request.

import Redis from "ioredis";

let client = null;

export function getRedis() {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error(
      "REDIS_URL is not set. Connect a Redis database to this project in the Vercel dashboard (Storage tab) and redeploy."
    );
  }

  client = new Redis(url, {
    // Serverless functions are short-lived — fail fast instead of hanging
    // the request if the connection can't be established quickly.
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
    lazyConnect: false,
  });

  client.on("error", (err) => {
    console.error("Redis client error:", err);
  });

  return client;
}
