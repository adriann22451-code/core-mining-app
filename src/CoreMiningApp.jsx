import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { soundEngine } from "./sound";
import {
  Home, Store, Package, ArrowUpCircle, User, Zap, Database,
  Gift, Trophy, Users, Target, ChevronLeft, Bell, Settings, Sparkles,
  Gauge, ShieldCheck, Flame, Coins, Check, X, Boxes, BatteryMedium,
  Search, Wrench, Star, Plus, Volume2, Vibrate, Globe, ChevronDown, ChevronRight,
  HelpCircle, FileText, Music, ArrowUpDown, Cpu,
  ArrowDownToLine, ArrowUpFromLine, Loader2, CheckCircle2, Wallet
} from "lucide-react";

// ---------------------------------------------------------------------------
// TOKENS
// ---------------------------------------------------------------------------
const C = {
  cyan: "#00E5FF",
  blue: "#0A6DFF",
  orange: "#FFB300",
  green: "#00FFAB",
  purple: "#8F5CFF",
  white: "#FFFFFF",
};

const RARITY_STYLE = {
  common: { color: "#8FA3B8", label: "Common" },
  rare: { color: C.cyan, label: "Rare" },
  epic: { color: C.purple, label: "Epic" },
  legendary: { color: C.orange, label: "Legendary" },
};

// ---------------------------------------------------------------------------
// I18N — LANGUAGE SYSTEM
// ---------------------------------------------------------------------------
// Central translation dictionary. Every UI string lives here under a stable
// key, translated into every code listed in SETTINGS_LANGUAGES. Components
// call useLanguage() to get `t(key, vars?)`, which looks up the string for
// the current language (falling back to English, then the key itself).
// `vars` supports simple {{name}} interpolation for dynamic values.
const TRANSLATIONS = {
  // Navigation
  nav_home: { en: "Home", id: "Beranda", ru: "Главная", zh: "主页" },
  nav_market: { en: "Shop", id: "Toko", ru: "Магазин", zh: "商店" },
  nav_inventory: { en: "Inventory", id: "Inventaris", ru: "Инвентарь", zh: "库存" },
  nav_upgrade: { en: "Upgrade", id: "Tingkatkan", ru: "Улучшить", zh: "升级" },
  nav_profile: { en: "Profile", id: "Profil", ru: "Профиль", zh: "个人资料" },
  nav_pools: { en: "Pools", id: "Pool", ru: "Пулы", zh: "矿池" },
  nav_marketplace: { en: "Marketplace", id: "Bursa", ru: "Барахолка", zh: "交易市场" },

  // Common / buttons
  common_close: { en: "Close", id: "Tutup", ru: "Закрыть", zh: "关闭" },
  common_back: { en: "Back", id: "Kembali", ru: "Назад", zh: "返回" },
  common_cancel: { en: "Cancel", id: "Batal", ru: "Отмена", zh: "取消" },
  common_confirm: { en: "Confirm", id: "Konfirmasi", ru: "Подтвердить", zh: "确认" },
  common_claim: { en: "Claim", id: "Klaim", ru: "Забрать", zh: "领取" },
  common_buy: { en: "Buy", id: "Beli", ru: "Купить", zh: "购买" },
  common_sell: { en: "Sell", id: "Jual", ru: "Продать", zh: "出售" },
  common_upgrade: { en: "Upgrade", id: "Tingkatkan", ru: "Улучшить", zh: "升级" },
  common_repair: { en: "Repair", id: "Perbaiki", ru: "Ремонт", zh: "维修" },
  common_install: { en: "Install", id: "Pasang", ru: "Установить", zh: "安装" },
  common_uninstall: { en: "Uninstall", id: "Lepas", ru: "Снять", zh: "卸载" },
  common_join: { en: "Join", id: "Gabung", ru: "Вступить", zh: "加入" },
  common_leave: { en: "Leave", id: "Keluar", ru: "Покинуть", zh: "离开" },
  common_create: { en: "Create", id: "Buat", ru: "Создать", zh: "创建" },

  // Settings modal
  settings_title: { en: "SETTINGS", id: "PENGATURAN", ru: "НАСТРОЙКИ", zh: "设置" },
  settings_audio: { en: "AUDIO", id: "AUDIO", ru: "АУДИО", zh: "音频" },
  settings_music: { en: "Music", id: "Musik", ru: "Музыка", zh: "音乐" },
  settings_sfx: { en: "Sound Effects", id: "Efek Suara", ru: "Звуковые эффекты", zh: "音效" },
  settings_feedback: { en: "FEEDBACK", id: "UMPAN BALIK", ru: "ОБРАТНАЯ СВЯЗЬ", zh: "反馈" },
  settings_vibration: { en: "Vibration", id: "Getaran", ru: "Вибрация", zh: "振动" },
  settings_notifications: { en: "Push Notifications", id: "Notifikasi Push", ru: "Push-уведомления", zh: "推送通知" },
  settings_language: { en: "LANGUAGE", id: "BAHASA", ru: "ЯЗЫК", zh: "语言" },
  settings_language_row: { en: "Language", id: "Bahasa", ru: "Язык", zh: "语言" },
  settings_support: { en: "SUPPORT", id: "DUKUNGAN", ru: "ПОДДЕРЖКА", zh: "支持" },
  settings_help: { en: "Help & Support", id: "Bantuan & Dukungan", ru: "Помощь и поддержка", zh: "帮助与支持" },
  settings_privacy: { en: "Privacy Policy", id: "Kebijakan Privasi", ru: "Политика конфиденциальности", zh: "隐私政策" },
  settings_terms: { en: "Terms of Service", id: "Ketentuan Layanan", ru: "Условия обслуживания", zh: "服务条款" },
  settings_help_toast: { en: "Opening support chat...", id: "Membuka obrolan dukungan...", ru: "Открытие чата поддержки...", zh: "正在打开支持聊天…" },
  settings_privacy_toast: { en: "Opening Privacy Policy...", id: "Membuka Kebijakan Privasi...", ru: "Открытие политики конфиденциальности...", zh: "正在打开隐私政策…" },
  settings_terms_toast: { en: "Opening Terms of Service...", id: "Membuka Ketentuan Layanan...", ru: "Открытие условий обслуживания...", zh: "正在打开服务条款…" },

  // Wallet
  wallet_title: { en: "TON Wallet", id: "Dompet TON", ru: "TON-кошелёк", zh: "TON 钱包" },
  wallet_connected_desc: { en: "Your wallet is linked to this account.", id: "Dompet kamu sudah terhubung ke akun ini.", ru: "Ваш кошелёк привязан к этому аккаунту.", zh: "您的钱包已关联到此账户。" },
  wallet_disconnected_desc: { en: "Connect your TON wallet to prepare for CORE withdrawals.", id: "Sambungkan dompet TON kamu untuk persiapan penarikan CORE.", ru: "Подключите TON-кошелёк для будущего вывода CORE.", zh: "连接您的 TON 钱包，为提现 CORE 做准备。" },
};

const LanguageContext = createContext({ language: "en", t: (key) => (TRANSLATIONS[key]?.en ?? key) });
function useLanguage() {
  return useContext(LanguageContext);
}
function makeTranslator(language) {
  return function t(key, vars) {
    const entry = TRANSLATIONS[key];
    let str = entry ? (entry[language] || entry.en || key) : key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp(`{{${k}}}`, "g"), vars[k]);
      });
    }
    return str;
  };
}

// ---------------------------------------------------------------------------
// TELEGRAM WEBAPP INTEGRATION
// ---------------------------------------------------------------------------
// Wraps window.Telegram.WebApp. Safe to use outside Telegram (e.g. this
// preview) — everything just falls back to null/no-ops so the app still
// works normally in a regular browser.
function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (!telegram) return; // not running inside Telegram — fine, just skip

    telegram.ready();
    telegram.expand(); // full height, no collapsed sheet
    telegram.setHeaderColor?.("#05070E");
    telegram.setBackgroundColor?.("#05070E");
    telegram.enableClosingConfirmation?.();

    setTg(telegram);
    if (telegram.initDataUnsafe?.user) {
      setUser(telegram.initDataUnsafe.user);
    }
  }, []);

  const haptic = useCallback(
    (style = "light") => {
      if (tg?.HapticFeedback?.impactOccurred) {
        tg.HapticFeedback.impactOccurred(style);
      } else if (navigator.vibrate) {
        // Outside Telegram (e.g. testing in a regular mobile browser) —
        // Telegram's HapticFeedback API doesn't exist, so fall back to the
        // standard Vibration API instead of doing nothing.
        navigator.vibrate(style === "heavy" ? 35 : style === "medium" ? 20 : 10);
      }
    },
    [tg]
  );
  const hapticNotify = useCallback(
    (type = "success") => {
      if (tg?.HapticFeedback?.notificationOccurred) {
        tg.HapticFeedback.notificationOccurred(type);
      } else if (navigator.vibrate) {
        navigator.vibrate(type === "error" ? [15, 40, 15] : 15);
      }
    },
    [tg]
  );

  // Raw initData string — sent as-is to our API so the server can verify it
  // (HMAC) came from Telegram and identify which user it belongs to. Never
  // trust telegram.initDataUnsafe.user for anything that touches the
  // database; it's client-supplied and unverified.
  const initData = tg?.initData || null;
  // Set only when this session was opened via a referral link
  // (t.me/<bot>/<app>?startapp=<code>) — used once, on a fresh account, to
  // report the referral to /api/referral. Also client-supplied/unverified;
  // the server re-derives the referrer from the code itself.
  const startParam = tg?.initDataUnsafe?.start_param || null;

  return { tg, user, initData, startParam, isTelegram: !!tg, haptic, hapticNotify };
}

// Cost efficiency (CORE per TH/s) used to get WORSE at higher tiers
// (190 → 256 → 288 → 317), which made the cheap Starter Rig the
// "rational" buy forever. Rebalanced so efficiency improves as you go up,
// rewarding progression instead of punishing it.
//
// Prices cut to ~40% of the original pass (was 800/2200/5600/11800) since
// mining income was separately tightened (harder difficulty, smaller
// rewards elsewhere) — at the old prices even the Starter Rig took an
// unreasonable number of hours to earn back. New efficiency curve:
// 76 → 70 → 66 → 58 CORE/TH/s, same improving-with-tier shape as before.
//
// `kwh` = real-world-equivalent power draw per hour while this rig is
// active/on — this IS the game's energy drain rate now too (see
// MAX_ENERGY_KWH below), so the number a player sees on a rig card is
// exactly what it costs them. `wearPerHour` = durability points (0–100)
// lost per hour of active mining — higher-tier rigs run hotter and harder,
// so they need more frequent repairs.
const RIG_CATALOG = [
  { key: "starter", name: "Starter Rig", brand: "Generic", rarity: "common", basePower: 4.2, baseCost: 320, kwh: 1.1, wearPerHour: 4.5, desc: "Entry-level rig for new miners. Low power draw, easy to maintain." },
  { key: "pro", name: "Pro Rig", brand: "Generic", rarity: "rare", basePower: 12.5, baseCost: 880, kwh: 2.4, wearPerHour: 6, desc: "Balanced multi-GPU setup with solid efficiency for steady daily income." },
  { key: "hyper", name: "Hyper Rig", brand: "Generic", rarity: "epic", basePower: 34, baseCost: 2240, kwh: 4.2, wearPerHour: 8, desc: "High-density rack with reinforced cooling for sustained heavy loads." },
  { key: "quantum", name: "Quantum Rig", brand: "Generic", rarity: "legendary", basePower: 82, baseCost: 4720, kwh: 6.8, wearPerHour: 10, desc: "Flagship immersion-cooled unit — the highest hash power in the fleet." },
  // ASIC line — real dedicated hashing hardware instead of a GPU-slot
  // chassis (Bitmain/MicroBT/Canaan are the three biggest real ASIC
  // manufacturers). Flavor stat is much lower kwh-per-TH than the Generic
  // line, mirroring the real efficiency edge purpose-built ASICs have over
  // general-purpose GPUs — the in-game trade-off is efficiency (ASIC) vs.
  // flexibility (Generic rigs can still take any GPU component in their
  // slots; ASIC "slots" represent firmware/cooling mod bays, not GPUs).
  { key: "avalon_nano", name: "Avalon Nano 3S", brand: "Canaan", rarity: "common", basePower: 4.6, baseCost: 340, kwh: 0.5, wearPerHour: 3, desc: "Compact home ASIC miner. Whisper-quiet, sips power, easy first upgrade from a GPU rig." },
  { key: "avalon_a15", name: "Avalon A15", brand: "Canaan", rarity: "rare", basePower: 14, baseCost: 950, kwh: 1.5, wearPerHour: 4.5, desc: "Mid-size ASIC miner with a real efficiency edge over general-purpose GPU rigs." },
  { key: "whatsminer_m60s", name: "Whatsminer M60S", brand: "MicroBT", rarity: "epic", basePower: 37, baseCost: 2350, kwh: 3.2, wearPerHour: 6.5, desc: "Industrial-grade ASIC miner built for 24/7 farm operation." },
  { key: "antminer_s21", name: "Antminer S21 Hydro", brand: "Bitmain", rarity: "legendary", basePower: 88, baseCost: 4900, kwh: 5.5, wearPerHour: 7.5, desc: "Flagship hydro-cooled ASIC — the most efficient hash power in the fleet." },
];

// How many component slots a rig has, by rarity, and the max number of rig
// units a player can own at once (each purchase is a separate unit now).
// Raised from 5 → 25 so late-game players have real room to grow a fleet —
// the energy pool (see MAX_ENERGY_KWH) is the actual soft-cap on how many
// can run active at once, not this number. Components have no equivalent
// cap: buyComponent() only checks CORE balance, so inventory size is
// already unlimited — bounded in practice only by CORE and rig slot count.
const SLOT_CAPACITY = { common: 2, rare: 4, epic: 6, legendary: 8 };
const MAX_RIGS = 25;

// Real-world GPU specs (FP32 TFLOPS, VRAM, MSRP as of mid-2026) rescaled into
// game stats: `power` adds flat TH/s, `boostPct` adds % income boost, `price`
// is the in-game CORE cost. `tflops`/`vram`/`msrp` are shown as flavor text so
// the numbers are grounded in the real card, not made up.
// `wearPerHour` = durability points (0–100) the component itself loses per
// hour while installed on an active (ON) rig. This is independent from the
// rig's own durability — a component's effective power/boost output is
// scaled by BOTH its own durability AND its host rig's durability (see
// componentPower/componentBoostPct below), so a worn-out GPU sitting in a
// worn-out rig degrades output twice over.
//
// Repriced (5080/4090/5090 cut) so CORE-per-TH/s no longer gets worse at
// higher tiers (was 60.0 → 69.6 → 77.6 → 76.2 CORE/TH/s — since slots have
// no rarity lock, a common RTX 5060 fits any rig's slots just as well as a
// legendary RTX 5090, so nobody had any reason to ever buy the 3 pricier
// GPUs). Now roughly flat on raw power (60.0 → 58.7 → 59.1 → 56.0), and once
// each GPU's `boostPct` (which scales with total fleet power, unlike the
// flat `power` stat) is factored in, higher tiers clearly pull ahead for
// players with a bigger fleet — rewarding progression instead of making it
// pointless.
//
// `brand` groups these into 3 real GPU makers for shop filtering/flavor —
// slots have no brand lock either (same as no rarity lock), so any GPU from
// any brand fits any rig. AMD priced ~5-10% below the equivalent NVIDIA tier
// for similar power (real-world price/perf positioning); Intel's Arc line is
// the budget option and currently only ships up to a mid-range card in real
// life, so it stops at "rare" instead of getting a legendary tier.
const COMPONENT_CATALOG = [
  { key: "rtx5060", name: "RTX 5060", brand: "NVIDIA", rarity: "common", tflops: 19.2, vram: "8GB GDDR7", msrp: 299, boostPct: 10, power: 8, price: 480, wearPerHour: 3, desc: "NVIDIA's mainstream Blackwell-generation card — an affordable 1080p/1440p workhorse, not built for serious hashing but cheap to slot in." },
  { key: "rtx5080", name: "RTX 5080", brand: "NVIDIA", rarity: "rare", tflops: 56.3, vram: "16GB GDDR7", msrp: 999, boostPct: 28, power: 23, price: 1350, wearPerHour: 4, desc: "High-end Blackwell card with GDDR7 memory — a big step up in compute and bandwidth over the previous generation's mid-range." },
  { key: "rtx4090", name: "RTX 4090", brand: "NVIDIA", rarity: "epic", tflops: 82.6, vram: "24GB GDDR6X", msrp: 1599, boostPct: 41, power: 33, price: 1950, wearPerHour: 5, desc: "The previous-generation Ada Lovelace flagship — still one of the most powerful consumer cards ever made, and a favorite in compute rigs." },
  { key: "rtx5090", name: "RTX 5090", brand: "NVIDIA", rarity: "legendary", tflops: 104.8, vram: "32GB GDDR7", msrp: 1999, boostPct: 52, power: 42, price: 2350, wearPerHour: 6.5, desc: "NVIDIA's current flagship — 32GB of GDDR7 and the highest raw throughput of any card on the market today." },
  { key: "rx7600", name: "Radeon RX 7600", brand: "AMD", rarity: "common", tflops: 21.5, vram: "8GB GDDR6", msrp: 269, boostPct: 9, power: 7, price: 430, wearPerHour: 3, desc: "AMD's budget RDNA 3 card — solid 1080p performance at a price built to undercut the equivalent NVIDIA tier." },
  { key: "rx7800xt", name: "Radeon RX 7800 XT", brand: "AMD", rarity: "rare", tflops: 37.3, vram: "16GB GDDR6", msrp: 499, boostPct: 26, power: 21, price: 1220, wearPerHour: 4, desc: "A mid-high RDNA 3 card known for strong price-to-performance and generous 16GB VRAM for the tier." },
  { key: "rx7900xtx", name: "Radeon RX 7900 XTX", brand: "AMD", rarity: "epic", tflops: 61.4, vram: "24GB GDDR6", msrp: 999, boostPct: 39, power: 31, price: 1780, wearPerHour: 5, desc: "AMD's RDNA 3 flagship — a chiplet-based design that matches high-end NVIDIA cards in raw power at a lower price." },
  { key: "rx9070xt", name: "Radeon RX 9070 XT", brand: "AMD", rarity: "legendary", tflops: 48.7, vram: "16GB GDDR6", msrp: 599, boostPct: 50, power: 40, price: 2150, wearPerHour: 6.5, desc: "AMD's newer RDNA 4 architecture — a big efficiency jump per watt over RDNA 3, aimed squarely at the mid-to-high tier." },
  { key: "arc_a380", name: "Arc A380", brand: "Intel", rarity: "common", tflops: 4.1, vram: "6GB GDDR6", msrp: 139, boostPct: 5, power: 4, price: 150, wearPerHour: 2.5, desc: "Intel's first-generation Alchemist discrete GPU — an entry-level card that put Intel back in the graphics card market." },
  { key: "arc_b580", name: "Arc B580", brand: "Intel", rarity: "rare", tflops: 13.7, vram: "12GB GDDR6", msrp: 249, boostPct: 16, power: 13, price: 620, wearPerHour: 3.5, desc: "Intel's Battlemage-generation card — praised at launch for unusually strong price-to-performance and a generous 12GB of VRAM." },
];

// ---------------------------------------------------------------------------
// CRAFTING — materials, quests, and recipes
// ---------------------------------------------------------------------------
// Raw parts a GPU/rig is assembled from in real life. These have no direct
// stat effect on their own — they're only ever consumed by RECIPES (below)
// to craft a real COMPONENT_CATALOG entry, or produced by dismantling one
// (see recycleComponent) or by completing a QUEST.
const MATERIAL_CATALOG = [
  { key: "silicon_die", name: "Silicon Die", rarity: "common", desc: "Raw unpackaged chip die — the compute core before it's mounted." },
  { key: "vram_chip", name: "GDDR Memory Chip", rarity: "common", desc: "High-speed memory chip used on graphics cards and hash boards." },
  { key: "pcb_board", name: "PCB Board", rarity: "common", desc: "Multi-layer circuit board everything else solders onto." },
  { key: "power_connector", name: "Power Connector", rarity: "common", desc: "High-current connector rated for sustained draw." },
  { key: "cooling_fan", name: "Cooling Fan", rarity: "common", desc: "High-static-pressure fan for forced-air cooling." },
  { key: "thermal_paste", name: "Thermal Compound", rarity: "common", desc: "Conductive paste that fills microscopic gaps between die and heatsink." },
  { key: "copper_heatsink", name: "Copper Heatsink", rarity: "rare", desc: "High-conductivity cooling block for heavy thermal loads." },
  { key: "asic_chip", name: "ASIC Hash Chip", rarity: "rare", desc: "Chip hard-wired for one hashing algorithm — faster and more efficient than a general-purpose GPU at it." },
];

// One-time tasks that reward crafting MATERIALS instead of CORE (see MISSIONS
// for the repeatable-daily CORE equivalent, and ACHIEVEMENTS for the
// one-time CORE equivalent). `metric` is looked up on the same live
// `metrics` object ACHIEVEMENTS reads from — see metrics below for the 3
// extra fields (level, invitedCount, poolJoined) added just for these.
//
// Rebalanced (v2): targets raised and per-quest payouts trimmed — the
// original pass let a player clear "own 2 rigs" and "join a pool" in the
// first few minutes and walk away with enough materials for a free craft,
// which made the whole Craft tab feel like a non-choice. Now each quest
// takes real playtime/spend to clear, payouts are just enough to nudge a
// craft along (not fund one outright), and 3 new higher-tier quests
// (q_full_rig, q_core_hoarder, q_daily_grinder) keep material income
// trickling in through the mid/late game instead of drying up after the
// original 6 are cleared once.
const QUESTS = [
  { key: "q_rig_rookie", label: "Rig Rookie", desc: "Own at least 3 rigs.", metric: "rigCount", target: 3, materials: [{ key: "silicon_die", qty: 2 }, { key: "pcb_board", qty: 1 }], xp: 40 },
  { key: "q_wrench_time", label: "Wrench Time", desc: "Repair a rig 15 times.", metric: "repairsCount", target: 15, materials: [{ key: "copper_heatsink", qty: 1 }, { key: "thermal_paste", qty: 2 }], xp: 100 },
  { key: "q_power_climber", label: "Power Climber", desc: "Reach 400 TH/s total mining power.", metric: "miningPower", target: 400, materials: [{ key: "vram_chip", qty: 2 }, { key: "cooling_fan", qty: 1 }], xp: 160 },
  { key: "q_network_node", label: "Network Node", desc: "Join a mining pool.", metric: "poolJoined", target: 1, materials: [{ key: "power_connector", qty: 1 }], xp: 60 },
  { key: "q_squad_up", label: "Squad Up", desc: "Invite 8 friends to CORE.", metric: "invitedCount", target: 8, materials: [{ key: "pcb_board", qty: 2 }, { key: "silicon_die", qty: 2 }], xp: 130 },
  { key: "q_level_grinder", label: "Level Grinder", desc: "Reach account level 18.", metric: "level", target: 18, materials: [{ key: "vram_chip", qty: 2 }, { key: "copper_heatsink", qty: 1 }, { key: "asic_chip", qty: 1 }], xp: 260 },
  { key: "q_full_rig", label: "Fully Loaded", desc: "Fill every slot on one rig with components.", metric: "maxFillRatio", target: 1, materials: [{ key: "pcb_board", qty: 1 }, { key: "cooling_fan", qty: 1 }, { key: "thermal_paste", qty: 1 }], xp: 90 },
  { key: "q_core_hoarder", label: "Core Hoarder", desc: "Earn 4,000 CORE lifetime.", metric: "totalEarned", target: 4000, materials: [{ key: "silicon_die", qty: 2 }, { key: "vram_chip", qty: 1 }, { key: "power_connector", qty: 1 }], xp: 150 },
  { key: "q_daily_grinder", label: "Daily Grinder", desc: "Reach a 7-day login streak.", metric: "dailyStreak", target: 7, materials: [{ key: "copper_heatsink", qty: 1 }, { key: "asic_chip", qty: 1 }, { key: "thermal_paste", qty: 1 }], xp: 180 },
];

// Fixed CORE fee to craft, keyed by the OUTPUT component's rarity — every
// recipe of the same rarity costs the same to craft, regardless of which
// GPU it produces. This is a flat crafting fee, not a discount off the
// Market `price` for that GPU.
const CRAFT_COST_BY_RARITY = { common: 200, rare: 550, epic: 900, legendary: 1150 };

// Craft a real COMPONENT_CATALOG entry from materials + a fixed CORE fee
// (see CRAFT_COST_BY_RARITY above) — crafting is meant to
// be the cheaper path, paid for in quest-earned materials instead of CORE.
const RECIPES = [
  { key: "craft_rtx5060", outputKey: "rtx5060", materials: [{ key: "silicon_die", qty: 2 }, { key: "pcb_board", qty: 1 }, { key: "vram_chip", qty: 1 }, { key: "cooling_fan", qty: 1 }] },
  { key: "craft_rtx5080", outputKey: "rtx5080", materials: [{ key: "silicon_die", qty: 3 }, { key: "pcb_board", qty: 2 }, { key: "vram_chip", qty: 2 }, { key: "thermal_paste", qty: 1 }] },
  { key: "craft_rtx4090", outputKey: "rtx4090", materials: [{ key: "silicon_die", qty: 4 }, { key: "pcb_board", qty: 2 }, { key: "vram_chip", qty: 3 }, { key: "copper_heatsink", qty: 1 }] },
  { key: "craft_rtx5090", outputKey: "rtx5090", materials: [{ key: "silicon_die", qty: 5 }, { key: "pcb_board", qty: 3 }, { key: "vram_chip", qty: 4 }, { key: "copper_heatsink", qty: 2 }, { key: "asic_chip", qty: 1 }] },
  { key: "craft_rx7600", outputKey: "rx7600", materials: [{ key: "silicon_die", qty: 2 }, { key: "pcb_board", qty: 1 }, { key: "vram_chip", qty: 1 }, { key: "power_connector", qty: 1 }] },
  { key: "craft_rx7800xt", outputKey: "rx7800xt", materials: [{ key: "silicon_die", qty: 3 }, { key: "pcb_board", qty: 2 }, { key: "vram_chip", qty: 2 }, { key: "thermal_paste", qty: 1 }] },
  { key: "craft_rx7900xtx", outputKey: "rx7900xtx", materials: [{ key: "silicon_die", qty: 4 }, { key: "pcb_board", qty: 2 }, { key: "vram_chip", qty: 3 }, { key: "copper_heatsink", qty: 1 }] },
  { key: "craft_rx9070xt", outputKey: "rx9070xt", materials: [{ key: "silicon_die", qty: 5 }, { key: "pcb_board", qty: 3 }, { key: "vram_chip", qty: 4 }, { key: "copper_heatsink", qty: 2 }, { key: "asic_chip", qty: 1 }] },
  { key: "craft_arc_a380", outputKey: "arc_a380", materials: [{ key: "silicon_die", qty: 1 }, { key: "pcb_board", qty: 1 }, { key: "cooling_fan", qty: 1 }] },
  { key: "craft_arc_b580", outputKey: "arc_b580", materials: [{ key: "silicon_die", qty: 2 }, { key: "pcb_board", qty: 1 }, { key: "vram_chip", qty: 1 }, { key: "power_connector", qty: 1 }] },
];
// Dismantling an owned (uninstalled) component pays back this fraction of
// its recipe's materials, rounded up (min 1 each) — lets a player recover
// materials from a duplicate/unwanted craft instead of it being dead weight.
const RECYCLE_REFUND_RATE = 0.5;


// Temporary income buffs modeled on real ASIC/mining-farm optimisation
// techniques. boostPct = % extra CORE/hour while active, durationHours =
// how long the buff lasts once activated. Real-world figures cited in `fact`.
// Prices cut to ~40% of the original pass, same reasoning as RIG_CATALOG.
const BOOSTER_CATALOG = [
  {
    key: "poolswitch",
    name: "Low-Fee Pool Switch",
    rarity: "common",
    boostPct: 2,
    durationHours: 6,
    price: 60,
    fact: "Braiins Pool charges ~2% vs the 4% FPPS fee on bigger pools — net gain on the same hashrate.",
  },
  {
    key: "braiinsos",
    name: "Braiins OS+ Firmware",
    rarity: "rare",
    boostPct: 15,
    durationHours: 12,
    price: 880,
    fact: "Open-source ASIC firmware — real-world autotuning reports 5–25% J/TH efficiency gains (2% dev fee applies).",
  },
  {
    key: "immersion",
    name: "Immersion Cooling",
    rarity: "epic",
    boostPct: 25,
    durationHours: 24,
    price: 2720,
    fact: "Submerging rigs in dielectric fluid gives 20–30°C headroom — operators report 15–30% safe overclocks.",
  },
  {
    key: "hydroovc",
    name: "Hydro Overclock Rig",
    rarity: "legendary",
    boostPct: 40,
    durationHours: 24,
    price: 4800,
    fact: "Hydro-cooled ASICs have been demoed pushed 40–60% past stock hashrate at mining industry showcases.",
  },
];

// Energy pool is now denominated in real kWh instead of an abstract 0-100
// number — capacity, drain, and refills all use the same unit as each rig's
// `kwh` stat (see RIG_CATALOG above), so a player can look at one number and
// know exactly how many hours of a given rig it buys. Raised 100 → 500 to
// match MAX_RIGS going 5 → 25: a big legendary fleet (up to 25 × 6.8 kWh/hr
// ≈ 170 kWh/hr if every rig is a Quantum Rig) would drain a 100-cap pool in
// well under an hour — 500 kWh gives real runway (~3h at that worst case,
// much longer for a normal mixed fleet) without making energy irrelevant.
const MAX_ENERGY_KWH = 500;

// How much energy a brand-new account starts with (welcome grant), separate
// from MAX_ENERGY_KWH. A new user only owns the free Starter Rig
// (1.1 kWh/hr), so granting the full 500 kWh cap gave ~454 hours (~19 days)
// of runway before ever needing a refill — the energy pack shop went
// completely unused during onboarding. Sized instead to roughly match
// NEW_MINER_BOOST_HOURS (48h) at Starter Rig drain: 48 * 1.1 ≈ 53 kWh,
// rounded up a bit for slack. This way the energy bar and the boost window
// run out around the same time, and the player hits the "buy an Energy
// Pack" moment while the game is still teaching them the ropes — instead of
// three weeks in, once they've already forgotten packs exist.
const NEW_MINER_START_ENERGY_KWH = 60;

// Energy refills, sold under the Market "Packs" tab. Energy drains by the
// sum of every active rig's `kwh` per hour and gates income at 0 — buying a
// pack is the only way back up. `amount` is in kWh, same 20%/50%/100% of
// MAX_ENERGY_KWH as before.
//
// Repriced so CORE-per-kWh improves monotonically with pack size/rarity
// (0.100 → 0.088 → 0.080), rewarding bulk buys instead of punishing them.
// Previously Power Cell (35 CORE/250kWh = 0.140/kWh) was strictly worse
// value than both Quick Charge (0.100/kWh) AND Full Charge (0.120/kWh) —
// a dominated option nobody should ever have bought — and Full Charge was
// itself worse per-kWh than Quick Charge, so the "optimal" play was to
// spam the smallest pack and ignore the other two entirely.
const ENERGY_PACK_CATALOG = [
  { key: "quickcharge", name: "Quick Charge", rarity: "common", amount: 100, price: 10, desc: "A small top-up — like plugging into a standard wall circuit for a quick refill between shifts." },
  { key: "powercell", name: "Power Cell", rarity: "rare", amount: 250, price: 22, desc: "A mid-size reserve, the kind of buffer a small farm keeps on a battery bank for brief grid outages." },
  { key: "fullcharge", name: "Full Charge", rarity: "epic", amount: 500, price: 40, desc: "A full tank — comparable to the backup capacity an industrial UPS gives a rack of miners." },
];

// Mining Kit tiers — each bundles a rig + matching-rarity component + an
// energy top-up at a discount vs. buying each piece separately, sold in
// their own "Kits" tab from cheapest to most expensive. Paid in real TON
// (see buyBundle), priced off the CORE value of their contents at the
// fixed DEPOSIT_CORE_PER_TON ratio — nothing here is hardcoded in TON.
const BUNDLE_CATALOG = [
  {
    key: "starter_kit",
    name: "Starter Miner Kit",
    rarity: "common",
    rigKey: "starter",
    componentKey: "rtx5060",
    energyAmount: 100,
    tonPrice: 5,
    desc: "An easy on-ramp — a starter rig, a starter GPU, and a quick energy top-up bundled together.",
  },
  {
    key: "miners_kit",
    name: "Miner's Kit",
    rarity: "rare",
    rigKey: "pro",
    componentKey: "rtx5080",
    energyAmount: 250,
    tonPrice: 10,
    desc: "A solid mid-tier step up — balanced rig, high-end GPU, and a real energy reserve.",
  },
  {
    key: "pro_kit",
    name: "Pro Miner Kit",
    rarity: "epic",
    rigKey: "hyper",
    componentKey: "rtx4090",
    energyAmount: 500,
    tonPrice: 25,
    desc: "Serious hardware for serious output — high-density rig, flagship-class GPU, full energy tank.",
  },
  {
    key: "legendary_kit",
    name: "Legendary Miner Kit",
    rarity: "legendary",
    rigKey: "quantum",
    componentKey: "rtx5090",
    energyAmount: 500,
    tonPrice: 50,
    desc: "A flagship rig, a flagship GPU, and a full energy tank — everything you need to jump straight to the top tier in one crate.",
  },
];

// Computes a bundle's contents + pricing. normalPrice is the sum of buying
// the rig, the component, and the energy (priced off the closest energy
// pack's CORE-per-kWh rate) separately, in CORE. tonPrice is the bundle's
// fixed real-money price (see BUNDLE_CATALOG above — 5/10/25/50 TON,
// cheapest to most expensive) — this is what actually gets charged via
// TonConnect (see buyBundle). price is that TON price converted back to
// its CORE equivalent at the fixed DEPOSIT_CORE_PER_TON ratio, used only
// to compute + display the "-X% OFF" savings vs. buying everything
// separately with CORE.
function getBundlePricing(bundle) {
  const rig = RIG_CATALOG.find((r) => r.key === bundle.rigKey);
  const comp = COMPONENT_CATALOG.find((c) => c.key === bundle.componentKey);
  const ref = ENERGY_PACK_CATALOG[ENERGY_PACK_CATALOG.length - 1];
  const energyValue = (bundle.energyAmount / ref.amount) * ref.price;
  const normalPrice = Math.round((rig?.baseCost ?? 0) + (comp?.price ?? 0) + energyValue);
  const tonPrice = bundle.tonPrice;
  const price = Math.round(tonPrice * DEPOSIT_CORE_PER_TON);
  const discountPct = Math.max(0, Math.round((1 - price / normalPrice) * 100));
  return { rig, comp, normalPrice, price, tonPrice, discountPct };
}

// 7-day check-in cycle for the Profile "Daily Bonus" tile. Streak wraps back
// to day 1 after day 7 (and resets to day 1 if a day is missed).
// Kept deliberately tiny — CORE is meant to be scarce and earned mainly
// through active mining, not free daily taps.
const DAILY_REWARDS = [
  { day: 1, core: 1, energy: 0 },
  { day: 2, core: 0, energy: 20 },
  { day: 3, core: 1, energy: 0 },
  { day: 4, core: 0, energy: 20 },
  { day: 5, core: 2, energy: 0 },
  { day: 6, core: 0, energy: 50 },
  { day: 7, core: 5, energy: 50 },
];

// Small helper so the claim toast/button text stays consistent wherever a
// DAILY_REWARDS entry is rendered as a string (e.g. "+1 CORE", "+20 kWh",
// or "+5 CORE + 50 kWh" for day 7).
function formatDailyReward(reward) {
  const parts = [];
  if (reward.core > 0) parts.push(`${reward.core} CORE`);
  if (reward.energy > 0) parts.push(`${reward.energy} kWh`);
  return parts.join(" + ");
}

// Permanent milestones. `metric` looks up a live value computed in the app
// (see `metrics` in the root component); `format` controls how it's shown.
// Rewards trimmed to the same small scale as daily missions/check-in/
// referral — permanent one-time bonuses, not a shortcut to easy CORE.
const ACHIEVEMENTS = [
  { key: "first_rig", label: "First Rig", desc: "Own at least 1 mining rig.", metric: "rigCount", target: 1, reward: 1, xp: 50, format: "count", unit: "rig" },
  { key: "component_tech", label: "Component Tech", desc: "Install at least 1 component on a rig.", metric: "installedCount", target: 1, reward: 5, xp: 60, format: "count", unit: "installed" },
  { key: "field_repair", label: "Field Repair", desc: "Repair a damaged rig at least once.", metric: "repairsCount", target: 1, reward: 1, xp: 40, format: "count", unit: "repair" },
  { key: "streak_master", label: "Streak Master", desc: "Reach a 7-day daily check-in streak.", metric: "dailyStreak", target: 7, reward: 3, xp: 150, format: "count", unit: "day streak" },
  { key: "fully_loaded", label: "Fully Loaded", desc: "Fill every component slot on one rig.", metric: "maxFillRatio", target: 1, reward: 5, xp: 200, format: "percent" },
  { key: "power_overwhelming", label: "Power Overwhelming", desc: "Reach 350 TH/s total mining power.", metric: "miningPower", target: 350, reward: 10, xp: 250, format: "ths" },
  { key: "rig_collector", label: "Rig Collector", desc: "Own the maximum fleet of 25 rigs.", metric: "rigCount", target: 25, reward: 100, xp: 300, format: "count", unit: "rigs" },
  { key: "six_figures", label: "Six-Figure Miner", desc: "Earn 100,000 CORE in lifetime income.", metric: "totalEarned", target: 100000, reward: 300, xp: 400, format: "core" },
];

// Daily tasks. Progress resets to 0 (and claims unlock again) at midnight.
// Rewards kept tiny — repeatable daily, so anything bigger would snowball
// into free CORE fast and undercut scarcity.
const MISSIONS = [
  { key: "claim10", label: "Claim Reward 10×", desc: "Claim your mining reward 10 times today.", metric: "claims", target: 10, reward: 1, xp: 30 },
  { key: "buy1", label: "Make a Purchase", desc: "Buy anything in the Market today.", metric: "purchases", target: 1, reward: 2, xp: 20 },
  { key: "maintain1", label: "Rig Maintenance", desc: "Upgrade or repair a rig today.", metric: "upgrades", target: 1, reward: 1, xp: 40 },
];

// Referral: reward is milestone-only (no instant per-friend payout, no
// passive income bonus) — you earn CORE + XP once when your invited-friend
// count crosses each threshold below, same claim pattern as ACHIEVEMENTS.
// Targets raised and rewards trimmed further so CORE stays scarce — this is
// a rare, one-time bonus per milestone, not a way to farm the token.
// `invitedFriends` (see root component state) is tracked client-side for
// this demo; wire a real backend/bot webhook to append to that list when a
// new user opens the app via your `startapp=<code>` link, instead of relying
// on the seeded demo friends.
const REFERRAL_MILESTONES = [
  { key: "ref_25", label: "First Squad", desc: "Invite 25 friends to CORE.", target: 25, reward: 10, xp: 20 },
  { key: "ref_50", label: "Network Builder", desc: "Invite 50 friends to CORE.", target: 50, reward: 20, xp: 40 },
  { key: "ref_100", label: "Mining Cartel", desc: "Invite 100 friends to CORE.", target: 100, reward: 50, xp: 80 },
  { key: "ref_200", label: "Syndicate Leader", desc: "Invite 200 friends to CORE.", target: 200, reward: 100, xp: 160 },
];

// Bot username + Mini App short name used to build the shareable invite
// link. Telegram Mini App deep links need the form
// t.me/<bot_username>/<app_short_name>?startapp=<code> — a plain
// t.me/<bot_username>?startapp=<code> link opens the bot chat instead of
// the Mini App itself, which was the bug (wrong/incomplete link).
const BOT_USERNAME = "COREMin_bot";
const MINI_APP_SHORT_NAME = "coreminer";

// Pool mining: miners combine hashrate and split income by hashrate share.
// The owner pays POOL_CREATE_COST to open a pool and can set a royalty fee
// (0–POOL_MAX_FEE%) that's skimmed off the top before the rest splits.
const POOL_CREATE_COST = 4000;
const POOL_MAX_MEMBERS = 200;
const POOL_MIN_FEE = 0;
const POOL_MAX_FEE = 10;

const BOT_MINER_NAMES = [
  "Aria", "Beno", "Citra", "Dimas", "Eka", "Farel", "Gita", "Hana", "Ivan", "Joko",
  "Kirana", "Luri", "Made", "Nadia", "Omar", "Putri", "Qori", "Rian", "Sinta", "Toni",
];

function makeBotMembers(idPrefix, hashrates) {
  return hashrates.map((h, i) => ({
    id: `${idPrefix}-bot-${i}`,
    name: BOT_MINER_NAMES[i % BOT_MINER_NAMES.length],
    hashrate: h,
    isYou: false,
  }));
}

// Was seeded with 3 bot-run pools (Nova Collective, Vertex Syndicate,
// Genesis Co-op) so Browse Pools wasn't empty on a fresh install. Emptied
// per request — Pools now starts empty for everyone until real pools exist
// (via a backend or players creating their own).
const INITIAL_POOLS = [];



// ---------------------------------------------------------------------------
// P2P MARKETPLACE
// ---------------------------------------------------------------------------
// Pure player-to-player trading — no sell-back to the system. CORE only
// moves buyer -> seller, so total supply is untouched and the halving
// schedule is unaffected. MARKETPLACE_FEE_PCT is taken off every sale and
// burned (removed from circulation entirely, not paid to anyone) — a sink
// to help balance the mining emission over time. See marketplace-design-spec.md
// for the full data model and transaction flow this is a client-only demo of.
const MARKETPLACE_FEE_PCT = 5;

// Was seeded with 5 bot listings (Rian, Nadia, Toni, Gita, Made) so
// Marketplace wasn't empty on a fresh install. Emptied per request —
// Marketplace now starts empty for everyone until real players list real
// gear (or a backend feeds in real listings).
const INITIAL_LISTINGS = [];

const fmt = (n, d = 2) =>
  n >= 1000
    ? n.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : n.toLocaleString(undefined, { maximumFractionDigits: d });

// Unassigned components are tracked as individual instances (not just a
// count) so each unit's own durability survives being uninstalled from a
// rig, sitting in inventory, or listed on the marketplace.
let instanceCounter = 0;
const makeComponentInstance = (key, durability = 100) => {
  instanceCounter += 1;
  return { id: `${key}-inst-${Date.now()}-${instanceCounter}`, durability };
};

// ---------------------------------------------------------------------------
// TOKENOMICS / NETWORK EMISSION
// ---------------------------------------------------------------------------
// Max supply: 100,000,000 CORE, allocated at genesis:
//   80% (80,000,000) — released only through mining, on a halving schedule
//   10% (10,000,000) — marketing
//    5% ( 5,000,000)  — reserve
//    5% ( 5,000,000)  — founder
// Mining emission halves every year: Year 1 = 20,000,000 CORE, Year 2 =
// 10,000,000, Year 3 = 5,000,000, and so on — same shape as Bitcoin's
// block-reward halving, so the schedule keeps shrinking but (mathematically,
// like BTC) never quite "runs out"; it just approaches the mining pool cap.
const MAX_SUPPLY = 100_000_000;
const ALLOCATION_PCT = { mining: 80, marketing: 10, reserve: 5, founder: 5 };
const MINING_POOL_SUPPLY = MAX_SUPPLY * (ALLOCATION_PCT.mining / 100); // 80,000,000
const MARKETING_SUPPLY = MAX_SUPPLY * (ALLOCATION_PCT.marketing / 100); // 10,000,000
const RESERVE_SUPPLY = MAX_SUPPLY * (ALLOCATION_PCT.reserve / 100); // 5,000,000
const FOUNDER_SUPPLY = MAX_SUPPLY * (ALLOCATION_PCT.founder / 100); // 5,000,000

// ---------------------------------------------------------------------------
// WALLET — TON deposit / CORE withdraw
// ---------------------------------------------------------------------------
// REPLACE with your real treasury wallet address before going live — this is
// where TonConnect sends deposited TON. Get one from your TON wallet app.
const TREASURY_TON_ADDRESS = "UQDkQYsWZm8-ib8Vco22U9kKFrPzkTDTFl2D3I3VNGu8K0YT";
// How much CORE a deposit is credited as, per TON sent. Tune to your economy.
const DEPOSIT_CORE_PER_TON = 100;
// Reference TON/USD price used only to show the "≈ $X USD" estimate under
// the balance — update this if TON's market price moves meaningfully.
// CORE's USD value is derived from it via the fixed CORE-per-TON ratio
// above, not set independently.
const TON_USD_RATE = 5.05;
const MIN_DEPOSIT_TON = 0.1;
const QUICK_DEPOSIT_AMOUNTS_TON = [0.5, 1, 2, 5];
// Withdrawals aren't paid out automatically (no live on-chain CORE token yet
// — see the disclosure in LegalModal). A request just gets queued for manual
// review; see api/withdraw.js.
const MIN_WITHDRAW_CORE = 5000;
const WITHDRAW_FEE_PCT = 2;

const YEAR1_EMISSION = 20_000_000;
const HALVING_RATE = 0.5;
const SECONDS_PER_YEAR = 365 * 24 * 3600;
const YEAR_MS = SECONDS_PER_YEAR * 1000;
// Network launch date the halving clock counts from. Set to the app's
// actual go-live date — everything (totalMined, percentMined, yearNumber,
// daysToHalving) is computed as elapsed time since this instant, so moving
// it forward resets the mined-supply counter back down toward 0 instead of
// showing months of backdated progress from an old placeholder date.
const GENESIS_DATE = new Date("2026-07-19T00:00:00Z").getTime();
// Simulated hashrate from every other independent (non-pooled) miner on the
// network — drives difficulty even when this player owns little hashrate.
// Rebalance pass: lowered from 48,000 so networkRewardRate (CORE per TH/s
// per hour) rises ~40% for EVERYONE. This is a single global dial — it
// scales every rig tier's income by the same multiplier without touching
// any rig's basePower/baseCost/wear, so the existing efficiency curve
// (76 → 70 → 66 → 58 CORE/TH/s) and payback-period ordering across tiers
// stay exactly as designed. Combine with NEW_MINER_BOOST_* below for the
// temporary onboarding lift — that one is time-limited, this one isn't.
const NETWORK_BASE_HASHRATE = 34000;
// Baseline simulated headcount of other independent miners on the network,
// used only to drive the "active miners" live stat display (see
// networkActiveMiners below) — purely presentational, doesn't affect
// difficulty/reward math the way NETWORK_BASE_HASHRATE does.
const NETWORK_BASE_MINERS = 18400;
// How many active miners are simulated to exist right at genesis (a handful
// of early/founding miners) — networkActiveMiners grows from this number up
// toward NETWORK_BASE_MINERS over time instead of starting fully "mature".
const MINER_LAUNCH_COUNT = 7;

// New-account onboarding lift (separate from the permanent dial above).
// Applies only for the first NEW_MINER_BOOST_HOURS of an account's life,
// then decays to nothing — so it boosts the first-session feel without
// permanently inflating supply. Paired with a one-time WELCOME_GRANT_CORE
// credit + free full energy top-up, conceptually funded from the 10%
// Marketing allocation (MARKETING_SUPPLY) rather than the mining pool —
// it's a promo/acquisition cost, not part of the halving emission schedule.
const NEW_MINER_BOOST_PCT = 75;
const NEW_MINER_BOOST_HOURS = 48;
const WELCOME_GRANT_CORE = 10;
// The CORE part of the welcome grant is a launch promo, not a permanent
// feature — only accounts created within WELCOME_PROMO_DAYS of GENESIS_DATE
// get the free CORE. Everyone after that still gets the energy top-up and
// a free common-rarity Starter Rig (so a fresh account never stalls), just
// without the CORE credit.
const WELCOME_PROMO_DAYS = 30;
const WELCOME_PROMO_END = GENESIS_DATE + WELCOME_PROMO_DAYS * 24 * 3600 * 1000;
// Extra reward pools earn for coordinating more members, scaling up to a
// full 200-member pool. Rewards "many people joining", per the spec.
const POOL_SYNERGY_MAX_BONUS = 10;

// Repair cost is priced against actual earning power, not a flat % of
// baseCost/price. A flat-% cost stayed constant even as networkRewardRate
// (CORE per TH/s per hour, split across the whole network's hashrate) fell —
// so repairs could cost 50-100+ hours of a rig's own income. Pricing repair
// as "N hours of this item's own raw output" keeps it proportional to
// earning automatically, however networkRewardRate moves.
const REPAIR_HOURS_COST = 3;
const REPAIR_COST_FLOOR = 3;

// Upgrade cost was `baseCost * 0.7 * level` while each level only ever adds
// a flat `basePower * 0.18` — so cost kept climbing every level while the
// hashrate gained per level never did, meaning CORE-per-TH/s got worse and
// worse the more you upgraded (the exact problem the rig/component catalogs
// were rebalanced to avoid). Pricing upgrades off each rig's own buy
// efficiency (baseCost/basePower) keeps CORE-per-TH/s roughly flat across
// levels instead of degrading, with only a mild markup and mild per-level
// growth for pacing.
const UPGRADE_POWER_GAIN_PCT = 0.18; // TH/s added per level, as a fraction of basePower
const UPGRADE_COST_PREMIUM = 1.3; // vs. buying the CORE/TH/s of the rig outright
const UPGRADE_COST_GROWTH = 0.08; // +8% cost per level, for light progression pacing
const upgradeCostFor = (rig) =>
  Math.round(
    rig.basePower * UPGRADE_POWER_GAIN_PCT * (rig.baseCost / rig.basePower) * UPGRADE_COST_PREMIUM *
    (1 + (rig.level - 1) * UPGRADE_COST_GROWTH)
  );

const yearEmission = (yearIndex) => YEAR1_EMISSION * Math.pow(HALVING_RATE, yearIndex);

// Geometric sum of a halving series: 20M + 10M + 5M + ... for `yearIndex` terms.
const minedBeforeYear = (yearIndex) =>
  yearIndex <= 0 ? 0 : Math.min(MINING_POOL_SUPPLY, YEAR1_EMISSION * 2 * (1 - Math.pow(HALVING_RATE, yearIndex)));

function getNetworkSchedule(now) {
  const elapsed = Math.max(0, now - GENESIS_DATE);
  const yearIndex = Math.floor(elapsed / YEAR_MS);
  const yearStart = GENESIS_DATE + yearIndex * YEAR_MS;
  const fractionElapsed = Math.min(1, (now - yearStart) / YEAR_MS);
  const emissionThisYear = yearEmission(yearIndex);
  const totalMined = Math.min(
    MINING_POOL_SUPPLY,
    minedBeforeYear(yearIndex) + emissionThisYear * fractionElapsed
  );
  return {
    yearIndex,
    yearNumber: yearIndex + 1,
    emissionThisYear,
    totalMined,
    emissionPerSecond: emissionThisYear / SECONDS_PER_YEAR,
    percentMined: Math.min(100, (totalMined / MINING_POOL_SUPPLY) * 100),
    daysToHalving: Math.max(0, Math.ceil((yearStart + YEAR_MS - now) / 86400000)),
  };
}

// ---------------------------------------------------------------------------
// REUSABLE BITS
// ---------------------------------------------------------------------------
function CornerBrackets({ accent }) {
  const base = { position: "absolute", width: 14, height: 14, opacity: 0.9 };
  const bt = `2px solid ${accent}`;
  return (
    <>
      <span style={{ ...base, top: -1, left: -1, borderTop: bt, borderLeft: bt }} />
      <span style={{ ...base, top: -1, right: -1, borderTop: bt, borderRight: bt }} />
      <span style={{ ...base, bottom: -1, left: -1, borderBottom: bt, borderLeft: bt }} />
      <span style={{ ...base, bottom: -1, right: -1, borderBottom: bt, borderRight: bt }} />
    </>
  );
}

function GlowCard({ children, className = "", accent = C.cyan, style = {}, brackets = false }) {
  // Tailwind's `.relative` rule is emitted after `.absolute` in the
  // generated stylesheet, so if a caller passes `absolute` (e.g. to make
  // this card fill an inset-0 parent), the hardcoded `relative` below wins
  // the cascade regardless of class order in JSX — silently turning the
  // card back into a non-positioned, zero-height box (this is what was
  // collapsing the Home rig hero to nothing). Skip the default when the
  // caller already specifies a position utility.
  const hasPositionOverride = /(^|\s)(absolute|fixed|sticky|static)(\s|$)/.test(className);
  return (
    <div
      className={`${hasPositionOverride ? "" : "relative "}rounded-2xl border ${className}`}
      style={{
        background: `linear-gradient(165deg, ${accent}3D 0%, ${accent}14 32%, rgba(10,14,24,0.95) 62%, rgba(7,10,19,0.97) 100%)`,
        borderColor: `${accent}4D`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.02) inset, 0 8px 24px -12px ${accent}66`,
        ...style,
      }}
    >
      {brackets && <CornerBrackets accent={accent} />}
      {children}
    </div>
  );
}

// Small pill used for compact spec/status readouts in shop-style rows —
// keeps every card's detail line to one consistent height/shape instead of
// stacked paragraphs of different sizes and colors.
function Chip({ children, color = "#8FA3B8", bg }) {
  return (
    <span
      className="inline-flex items-center text-[9px] font-bold px-1.5 py-[3px] rounded-full whitespace-nowrap leading-none"
      style={{ background: bg ?? `${color}17`, color }}
    >
      {children}
    </span>
  );
}

// One row in a shop-style list (Rigs/Components/Boosters/Packs/Marketplace).
// Fixed structure — icon, 2-line info block, price, action — so every card
// in every catalog reads at the same height and rhythm instead of each
// section stacking its own ad-hoc pile of text lines.
function ShopRow({ accent, icon, title, rarityLabel, badges, chips, price, priceNote, action }) {
  return (
    <GlowCard accent={accent} brackets className="p-3">
      <div
        className="absolute inset-x-3 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}77, transparent)` }}
      />
      <div className="flex items-start gap-2.5">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-white text-[13px] font-bold leading-snug">{title}</p>
            {rarityLabel && (
              <span className="text-[9px] font-bold shrink-0" style={{ color: accent }}>
                {rarityLabel}
              </span>
            )}
          </div>
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">{badges}</div>
          )}
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">{chips}</div>
          )}
        </div>
      </div>
      <div
        className="flex items-center justify-between gap-2 mt-2.5 pt-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p
          className="text-white text-[11px] font-semibold tabular-nums whitespace-nowrap px-2 py-1 rounded-md shrink-0"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {price}
          {priceNote && <span className="text-[9px] text-slate-500 font-normal"> {priceNote}</span>}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">{action}</div>
      </div>
    </GlowCard>
  );
}

// Compact vertical card used for the Shop grid (2 columns, ~8 cards visible
// per screen with no scrolling) — same accent/glow/bracket language as
// ShopRow, just reflowed top-to-bottom instead of left-to-right so each
// item takes far less vertical room.
// Compact grid tile used on the Profile screen's menu (Achievements, Daily
// Bonus, Network, Referral, Missions, Quests, Codex). Deliberately mirrors
// ShopCard's language (glow icon box, top gradient hairline, corner
// brackets) so Profile and Shop read as the same visual system instead of
// two different UIs bolted together.
function ProfileMenuTile({ icon: Icon, label, accent, showDot, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`w-full text-left ${className}`}>
      <GlowCard
        accent={accent}
        brackets
        className="p-2 flex flex-col items-center justify-center gap-1 text-center transition-transform duration-150 active:scale-[0.95]"
      >
        <div
          className="absolute inset-x-3 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}77, transparent)` }}
        />
        {showDot && (
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: C.green, boxShadow: `0 0 6px 1px ${C.green}` }}
          />
        )}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${accent}55, transparent 68%), radial-gradient(circle, rgba(5,8,16,0.65), transparent 75%)`,
            boxShadow: `inset 0 0 0 1px ${accent}66`,
            filter: `drop-shadow(0 0 8px ${accent}cc) drop-shadow(0 0 16px ${accent}55)`,
          }}
        >
          <Icon size={16} color={accent} />
        </div>
        <span className="text-white text-[11px] font-semibold leading-tight">{label}</span>
      </GlowCard>
    </button>
  );
}

function ShopCard({ accent, icon, title, rarityLabel, stat, price, action }) {
  return (
    <GlowCard
      accent={accent}
      brackets
      className="p-2.5 flex flex-col items-center text-center transition-transform duration-150 active:scale-[0.95]"
    >
      <div
        className="absolute inset-x-3 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}77, transparent)` }}
      />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-1.5"
        style={{
          background: `radial-gradient(circle, ${accent}55, transparent 68%), radial-gradient(circle, rgba(5,8,16,0.65), transparent 75%)`,
          boxShadow: `inset 0 0 0 1px ${accent}66`,
          filter: `drop-shadow(0 0 8px ${accent}cc) drop-shadow(0 0 16px ${accent}55)`,
        }}
      >
        {icon}
      </div>
      <p className="text-white text-[11px] font-bold leading-tight w-full truncate">{title}</p>
      {rarityLabel && (
        <p className="text-[9px] font-bold tracking-wide mt-0.5" style={{ color: accent }}>
          {rarityLabel}
        </p>
      )}
      {stat && <div className="flex flex-wrap justify-center gap-1 mt-1.5">{stat}</div>}
      <p
        className="text-white text-[10px] font-semibold tabular-nums mt-2 px-2 py-1 rounded-md w-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        {price}
      </p>
      <div className="w-full mt-1.5">{action}</div>
    </GlowCard>
  );
}

// Promo crate for a bundle deal (top-tier rig + top-tier component + energy,
// sold together at a discount). Wider than a normal ShopCard so all three
// contents plus the price comparison fit in one glanceable card — a treasure
// chest ("Package") as the hero icon, mini icons of exactly what's inside,
// and a discount ribbon so the deal is obvious before reading any numbers.
function BundleCard({ bundle, onBuy, disabled, disabledReason, sending }) {
  const { rig, comp, normalPrice, tonPrice, discountPct } = getBundlePricing(bundle);
  const rar = RARITY_STYLE[bundle.rarity];
  if (!rig || !comp) return null;
  const normalTon = Math.round((normalPrice / DEPOSIT_CORE_PER_TON) * 10) / 10;
  return (
    <GlowCard accent={rar.color} brackets className="p-4 relative overflow-hidden">
      <div
        className="absolute inset-x-3 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${rar.color}aa, transparent)` }}
      />
      <span
        className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
        style={{ color: "#0A1220", background: rar.color, boxShadow: `0 0 10px -1px ${rar.color}` }}
      >
        -{discountPct}% OFF
      </span>

      <div className="flex items-center gap-3 pr-14">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: `radial-gradient(circle, ${rar.color}55, transparent 68%), radial-gradient(circle, rgba(5,8,16,0.65), transparent 75%)`,
            boxShadow: `inset 0 0 0 1px ${rar.color}66`,
            filter: `drop-shadow(0 0 10px ${rar.color}cc) drop-shadow(0 0 20px ${rar.color}55)`,
          }}
        >
          <Package size={28} color={rar.color} />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold tracking-wide" style={{ color: rar.color }}>
            {rar.label.toUpperCase()} KIT
          </p>
          <p className="text-white font-extrabold text-sm leading-snug truncate">{bundle.name}</p>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed mt-2">{bundle.desc}</p>

      <div className="flex items-center gap-1.5 mt-3">
        <div className="rounded-lg p-1" style={{ background: "rgba(255,255,255,0.04)" }}>
          <RigIcon rigKey={rig.key} rarity={rig.rarity} size={28} />
        </div>
        <Plus size={11} color="#5B6B82" className="shrink-0" />
        <div className="rounded-lg p-1" style={{ background: "rgba(255,255,255,0.04)" }}>
          <ComponentIcon compKey={comp.key} rarity={comp.rarity} size={28} />
        </div>
        <Plus size={11} color="#5B6B82" className="shrink-0" />
        <div
          className="w-[28px] h-[28px] rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(155deg, ${C.orange}2E, #0A1220)`, border: `1px solid ${C.orange}66` }}
        >
          <Zap size={14} color={C.orange} />
        </div>
        <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: C.orange }}>
          +{bundle.energyAmount} kWh
        </span>
      </div>

      <div
        className="flex items-center justify-between gap-2 mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div>
          <p className="text-[10px] text-slate-500 line-through tabular-nums">{fmt(normalTon, 1)} TON</p>
          <p className="text-white text-sm font-extrabold tabular-nums">
            {fmt(tonPrice, 1)} <span style={{ color: rar.color }}>TON</span>
          </p>
        </div>
        <FuturisticButton onClick={onBuy} disabled={disabled || sending} accent={rar.color} accent2={C.blue} size="sm">
          {sending ? "Sending…" : "Buy with TON"}
        </FuturisticButton>
      </div>
      {disabled && disabledReason && (
        <p className="text-[9px] mt-1.5 text-center" style={{ color: C.orange }}>
          {disabledReason}
        </p>
      )}
    </GlowCard>
  );
}

function StatBar({ label, value, max = 100, color = C.cyan, suffix = "%" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[11px] mb-1 tracking-wide text-slate-400">
        <span>{label}</span>
        <span className="tabular-nums" style={{ color }}>{fmt(value, 0)}{suffix}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CUSTOM ASSETS
// ---------------------------------------------------------------------------
// Drop your own image URLs / data-URIs in here and every icon that has a
// matching entry will use your image instead of the built-in placeholder.
// Leave a slot as `null` to keep the default icon for that item.
const ASSET_URLS = {
  logo: "data:image/webp;base64,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", // main CORE brand mark (used in top-left of Home + splash spots)
  rigs: {
    starter: null, // "Starter Rig" icon
    pro: null, // "Pro Rig" icon
    hyper: null, // "Hyper Rig" icon
    quantum: null, // "Quantum Rig" icon
  },
  components: {
    rtx5060: null,
    rtx5080: null,
    rtx4090: null,
    rtx5090: null,
  },
  boosters: {
    poolswitch: null,
    braiinsos: null,
    immersion: null,
    hydroovc: null,
  },
  packs: {
    quickcharge: null,
    powercell: null,
    fullcharge: null,
  },
  materials: {
    silicon_die: null,
    vram_chip: null,
    pcb_board: null,
    power_connector: null,
    cooling_fan: null,
    thermal_paste: null,
    copper_heatsink: null,
    asic_chip: null,
  },
  nav: {
    home: "data:image/webp;base64,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",
    market: "data:image/webp;base64,UklGRmwQAABXRUJQVlA4WAoAAAAQAAAAfwAAfwAAQUxQSKkEAAABGTNt28aUpN8W0f/gNw8VB3l8wf9n2oJtW2Xbtm3b1qNtu+qtXl3Ttm3btm3bHn1MDM2W2V/n/FZkRNns8YuYOW2PERk1/9N2H5XTc5ZrPLUebar81CMiJmAChskneDwsqX4NR+rQycwYXlY9SvogM8gjAAshqd4oNW0yy1rM7EYzqmd5oke4sQ2Mj5DqSwo1M9rJ2XzsrGYxjyVt7gB7mBSdVEfSh+T9rAuCCUIIZWBym1oVdTSVE7s1KLMkkbMspZJ4OFYvVDOO26NZZcvwfh/wbsZwKiOVtFKqEyneFM3jQsV93NXTvROHL2Ad1/cyZEvGW0WsHuT+XVCOIozkGY7nY1/tlZ7nHvZ2bW8HiPuhHqZyGluIleUbuAWyIqSUK97hlJfDYn6OB1Lwn+KeKBP/7if3GxBjDKHiDUCm/fUn7ylM6GhT+sq1VCHQ06o857EmEqoHWEWKvsvlisbVHNFTHKIKRs+PaG7nOsrqPWZzWoqeM1ZgkU+B0UtpdM83qeYR67utqvRcDTPTSN7qngj0Ooer29n7/P26tuc72cgmgZ7mjWR9EFfwAM0jTlldih6S1F2KExgf/KjKZRfqiWxMzzYp/jOvGnpo0fyQYqSn7yL4c0nfPsTZscMMXqEnkKIPckhzm9hILEYDUQ4cAZ9bXkUVxRE/sAqOsLJUZT/4+67OCLn/rL//plldckRSPPm0R3mvHNzLYSq3tBR6uzmK+kybeKrKuaqc3T1MJ2KgbhKYdWVdGOrCsiBYT5SvOvEuKsdyuai7GSwreqvU1cc/5LiVMjuVwjLubiyhwt0o7SUkh5It6MvnhYzLFg+0npjdkZ1/XvMI3A62D6I7kZMs47hpDlOy5Irst8dIrmGjOQY5w+BvcT/SwuHzKuScMQ3kivgtMTkHJ2HutDCcF5PA4b/6AI4huvMFPCjCqEyORL6AfDCeNq4ak8KLYxhCbshG1yK5pxq1nGGgjQ8jU3AFhi5BHoDp4aiYFB3woPga5soxmA+g5QqcgxfFgGrkhHEO8kPjKtw0GnhyaAA5ERnyg+wzk3JDnNci+YAaBnFSDLbxozE15EbjByYvwEk4OgkinmxhLoj/YX4QgegC/A9Pisn8vZMcMM7xx0AbN/6K/AA/+y0uxtzwhaIaqHii3fIFxmTcGBobvuzEDHBQhGzyBJyDuTAtIp4UDZz8GuYLCMTiGVfgzcT/vmkqXOR/yBfQaFA42Zd/4g/ZEW0HmNRk/EENJ7nwhSOiPzrxPwovrsDw6BeKBxf5pYEVzfgVHhWTIRatQzqJ5JNJfaaTiiWGfoJ80mpTcDGJ3+LVn12FinaOauQPWRoqXgPDo9EGKXwyvKpLihb5szB/RL3fk2AFS493kFx6wyzt7kVSLBaWzj/5iA6esJi/9b0ccTDiCww3RZNo8gBDSE4gvoAQ6saEFcAEmAATGBWXYLhqn8GD7/MOGO6GD7irlR0zMKZR/Kb55fIbWM7vZSFk2rHMVbAy/T2WZhUKEukb/T+IxOYlBLWrH5h+ky75xtuddSsYLgsgf6YRPxMCria3LCma8bECQ12or2QCDAEGwoQMDwpMGCDr4pNLBABWUDggnAsAAPAuAJ0BKoAAgAA+MRaJQyIhIRVMlWQgAwSxgGtS5l8Hk23dsxBercnoq25HmA85r0R+Sb1inoAfsB6dHsifuxhDH8A7Iv7Z4F+I70Li6d0/qLtvPsvNDvP+Mn9P6gXsL/W70XZHvt/q54u3+J6GfXT/c+4B+oP+w41ryn2AP5x/Zv9l9znyQ/9P+l/LH3AfSX/Z+4D7DP5d/W/9r/eP3s/y3zhexj91fYg/V47pXNuK4SLVwL47+4HI3llVkGTXFLqFECgezq/YxmEU7lQOIJGalcD3zO0Q1zo9CRUaCpxX6F47Zra9uydajDNm4M/w60/FmbqgyasdvLYUavRs1GfU8bqYf90hV5MEeGpUf4iN8PBpLXrLMZ8LKWB0PuUCEobpJEmmEoP96fyIh3hoVsaFFHkWRs4XIkSAOBRRLRdk5ttgBOiAHkcmLTplkt1M3X+R3DC9WlHafFdMwff/g6lt3A3QdKJWmKTZLTpJ5vFisGW1o950/5M+WGbnFcHoAAD+/u6qAHV5XMbatiJDPS9OZXGS6zaVXIUyd2fzJf0Ws3fGbZ8fcXu3BFDKQD+oWV+V9HZzUNdo8lKEDqdreqQRMqT3I623cYY1zpaTOp/cGL2SuG/xf4uAePZjP/r/rNp9WImu5EqeYZ4T7Ut0m5vmydVB0EX8X8wrA4c+cgVoVn+jGaEdQkIcp3+LuXBpfzk0yR66NXnn/OqN3bu7969TteHL+RzqI2UAuWSFkh8BoRQnw7aLzp7O2ymCGYz4kgwJuHuynnW/0RFdjPYBDZyJ232sB0uF14k4oRmKAlJMUZleq60Cbb0mbBE466fbzaaeM+BJuEyh4kk3YuY/jo+SOOV/PF0revLakeUmJ+zeUKXh8xwcPEJ6uilpuoxJD6fLZ7VwM3/16YD7JDLE9cGXAYnFgl5N54bR/R/9xFWfE+KmOJOtyPZ0i2KcOk+m0dMbiyxTtn9VNdEc2Bon+UXCzGsqbso6FqVt2/tca+R0xFb0npiG+wbH8z7gqW9ZonXjM+JHQYvM+sTcgOXPwSYbnvXjQlbnSL6Uj3HBWjoyYU2o17axsMmclhdSiOrDYGdvFVH0gFyBKcFSmPrzq0GPhpzuehbJyaDJGTv08NZ7WLuAHK8Tl+sQ9KwDtHLA/eGPVIeYzs0xsuJhwrNYaASh4VD52l0I8WbD6XtA41eiDSwMUPlKIgIoqIyXS9M4RC8/BMWyhYEc96DFgyDOmTrF9l2/nubCVPdVyKhxJ8OJVx01KicFT54knXUYmoRsclgk/fsdQDv7/DL0PuOjoOdYqmzyF0krhIxFi2JZW5ZMxfHVDNYumg6mHAq35JjfYCM+R7LJa+EsJmh8V6R8bTsZvoRyNd7+saBlk12595DMnrA8MpHu20y/agiYRMr8P03atk9NJ5IqX+XmgCxLhB6NdPwPjGATUV0IswzzbK4reyiQfHZ/y5u7YhfXUJKPM35Sq4KYNif6J/1/65/t7eSZ9LH4o77hSitUclrIr8cpwXT5M/8trOhOxqsYoZkOMPeyXXp7bmMp/U473G/77vQcNtvp0HeHO83i/zgPP/ryHWcLsi9RgYYBQkvf/RdBrQd6I73Bf7jXotgV5fOpswYs4pjWDnCT+K+aTQI62gC2voVepsN2Z2lxJBCYsHobEAnb2/e6Svw1vddACCXNDte46vhJBC0czqSgNckGG7Gmcz1Ggm+eCmYJGHjs888aucD2PPRnMrStCbskn+mh5v/yB63M0CCOYg5qk4mkR+zygStck52yTvcMGn+NOIU45ogT+hzOFoR5pKFrZfZc02vibGzjuvuPZ8K5NI33AQWwHftHgtjSml3JbiMtOSlHWgSw2P2s9xGXaB5+aa47Htb2gP+IFxupzjjf/2LJY5sK5JRyIbbVmkku9MLsW7bT1wuDXFqYhz2nmGbrfTfO/ExEz4JED8aExpaLtjgaUh8Fu6jCQ8nFdKbaoP0YFe+14LIvJ2M3/H++mQ/FpwaA2dnG/aMObbwDKMHN8w3WmJfgAQmAdXmioxZ4Y9ur44CVBauR+/IfcVjUtbOop1JZGh6+AyDYn9zQrtFNX82I7TwGZueYKM0RWtrGty6Fb/j5V2HjF+Qh2WHr2omwKpGQaZh+pJa3LFVBdxl0vgS+C5Pog/dZmpZ6IxGmkDcF8iP5y7Frwqd1/YNCl980wqmUyaSKwSG6+u+FawMAYufbMWknHadd6cOrDGuwBCO89dyaF//JDlt5k6kABSy7YKNf5msONgZj407b07F3X+cX59g7F7fdqEeFy/KsY0BuOz1D3lOwZVWBhT7QuES1jUIO0PFM6IbJXNPDZnXev1OZaXSliVR7Narbzao49slKITFM2tRiSi80eDZm0BD5YO7/6ORj9Dp1za76S04kJayeRWIPKHq/DrHxpiA/FDZkG9PUobJm1YHUjvtJLaD08G5zQO7qqi0rZ4HRdv30/8MX7No7f8waZ71zcxxeyVeJckj0pg0DD6QzvNNGf2RDTvjiMHOhUwQhe4i6LCgaSMDH9BvYnhOeBTh3Awh6b08jfgRaZc/4xApw3vh1VtAiMWOx+Jcvi09I8T3L30nIO7RhyVAQoILOGEwimC5lJ7TC+hJLfv0JkUclJjQkYL0aYICgjG4ujFQ1XwIfXQTKimVskwHuDT3tyU2d3ZUhDS0swBNRHLHYLoGnxJz977yLaemrUGaeojroLtWoBEogXL7wpxwO8o6s9YDqkuHuRUwFXHsR2kC5jX4yougr/9Z+KlV3uFt50LNSmIW6j1+OwUkuERjxGAUfkg+Eh/yZZX/KSrSAOPWiJ9sN+BP8ao7jhVcWx3NnIS5XXdWGdX4pH35Et0HXpIGGF1s/4ux5PG0LZXh2/YSMqOBiOaqb4YOTecPURaZwjGnHVgiPSziP561MCdqLYJX/Tk42RaAJcZAFvHaeshmkC6MnpBdWtuOdmvT9rx3hzyskagq5kAEhIqB5mymqV24ZPwt++3Ncfys8iz6UPPOuzJitZcfFkwugzOt5lZ8G3oz32RStGlskgXhor2JB45cfcSLmyAOpD6bnvaRFZEysTyu6prZUvDABK7ASA7ZyOqYDrPQleKKktM0abvNrJkCNs9CSzj743pEXDQeDIiiOumL0v9HAi2DpA6aCGrSZ0coaYMoiNjBBT2b9xjnp7rRYsKpRbHSHm2cUzcYubDG+1FIkEdKsQBX6cvpz2IaAxV6L6NU5/FPL9KHsZJVyf3MQ2RFkSH1NQjG33X7ZxDMx7fOuI7EJ6IbmLXTLGptl6cPxLAkf79ThSpXOWCPg3KzxGHaE8MbdqEgu3K15E4CeuoXVgF+CR2KB1rBKZaJ7d1zWDjov+OipdcsUincqyOQ9yD93P8KOJ/H/jlp6veRhlWzdCiQtAnRuNWzCP2KHXqGDQwYNme6z8vLeyTSKiAUdx53VuXjy/ejb8qehqaO27eA/GKAZDmGFtgZDOpBDQ3Iz5PkLaRy4/H+/JplK6UdXTEOsEvFbxde9nh4zAlX1x2j5BkK2nG72wjBaFStAvckvJIV8g1fvMJBkrf+1sIT7pLzWUmRYKIL1xbHPT3tPyakCAHn1qkujBHgdTcQPp7yWPXCQjZETdRly/euQ/5XqLSbIoMBMW6Bm6H9X2ix0iylsQXAqH0yGgn6aIYX6Sykj07+Flloza9IF5tAVA7ylm6P+tZR3GwnnWFByMxJ379GN1DLIbCFdFAt1e6t50y7tic/BlPWA2t7VrkDsIsfObE8Y8jLVvHlmXCxlj9QdIKMaykLM13gu4zbUrAFGu69uKRgrXFCINyCkFqpATxiAKLV/SDOqmA8H6tT6EZ5HHQd8cFkWUBLqb4GAweMd3Nw3pkwTL9HCKrwXT8dj4PGBFanXapMymxUS6nly5dK9/2YdMjgifWqqP/G6NEHBypZXvyAK23HaogBpc45z7KIi1zsXNwAAAAAA",
    inventory: "data:image/webp;base64,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",
    upgrade: "data:image/webp;base64,UklGRtoNAABXRUJQVlA4WAoAAAAQAAAAfwAARQAAQUxQSKoDAAABoETbtmnbmWvtHdu2bdtmzbZt27Zt26h927YZJ3vvNYOfh33WSzkiJgD/80VEOiyNQTFHjVGlo9Eo+Pd8Cy00P+YYgnQcEgFgzVte/aLPqIkTx/T77pUrNgsAonQMEgBsdcMPv7LF1u+BneYCgnQAAVj6gi4kmVIuxayUnBJJ9r1sGSB4p4Jlbp5EMmVji60kIyffuixEPZMInDOezIVtWjI58SJBFLcUWPVTMhnb3BL5zRqAOhWwyr2TmIztaokT71kN0aWIzceRme2eyXE7IToUsMVU/mms0P7kb3tD3VHZdCozK838dRdVZ0TnGsTMajMHQ8WXgH2YWa+VX7ZFcEVl6bGlVMTCMUuKehLwLjOrznwfwZGAw5lZeeKRCG6IzjfCSm3FRi2g4kXA+cysPvMCRCdEFp5gpb5i4xYU8SHiBGY2MPN0RB9EO1kzrIuKC4r1MptpeSOoB1HOY2pG4i2IHii+ZG5GYX8VBxSr/kRrBq1sh9C8iBOZ2dDEmxA9uNdSUzI/hDZP8SEb1AnSPKAbS1MK+yvEgV5NGjFv8wRzDWnS+AU9mGd4k0bN1zwAvZs0OLrQo65iLesNBxXfMNfU8swvoc0LeMpSPYUfDKP9V+LrCM2LOIm5HuOJPVlacgti8wQLjmaphvydLSwcuRCkeQh4h6kiWgsyP4LCwSgXVmVsYeJVEj0I2KxYRS022xLBA5G5BrM0oXDI3BAPEHE9UxMSb0GEi4pVfjOrz+yXlaE+IOAppvoSn0KAkyor/1qsNiu/rSbqBQKuZaot8SYEuCk6dz+WugoHzqfiBwK2Tclqsvzn9gjwNOI65poyb0eEqxLm+Zq5nsyeiwTxBRGHkKWWYjwEEb6KzDuAE1jqKPyJneYT8UWxBf9Y52mWGgqf3/ZP7oTgS8CBNnwuPMzcfpmPY4EJ5QhEb/blpMVWeKeGwi+WWXgqD/NGZaU/2H0GqzRO/oy/LK/iS8AhvxWyVEEj7bd1EVxRLD+MORsrtVxs5JYIjogu+Bn/pCWrwxL5B7ssouKHYmPO2cxKSrkUs9aYlZJTKmbGOW+N4AcQ1t5tn423OPNHtrSknHNKKaecs7GlM8/beLN9D9hsLnj8+Myffx7w2is/dBs6aRZbOXPCyJ7fvvbysOm/zHgULmsIGiKWXnUFBYC5Fl5m37NPOfG4s04798SzTjztqF2WXnBeAJh7idWWRAwagnrT4hBV0LYaAtwXVQEAEQmxxUFEAEBExTePAVZQOCAKCgAAsCkAnQEqgABGAD4xFohCoiEhFZ0l2CADBLGGwA/gAVdeVeZPfydsvB3VL9foZ22vmM/YD9gPeF/G73cf5j1AOkc9Bj9VfTg9kv+z/9r2CP1pu+P7B4J+Ej1N7a+ohjz6Df7T0M/j/2V/U/2PzQ7wfghqBer/9V3yvaFZ//ePQC9ifpv+88IvUC7vewB+nv/F9Qv9b4IvhHsAfzr+xf8H7lfis/1/8b+UHtB/O/8F/3f8b8A/8x/pf+7/vH+K/8fxseub9zvZF/VpDPvCc2lasZGsn3vcWeofla9e9slm3g43WAzLX22jktdyY69kzuWyQpVMZifWE8Ju49eI+yJtMAB4tZQO+JDGDxIT83QexvrsCjEHxoib1avzxEFqYmDForFaxpZjqH0Mai6WOcVUz5bdZtgW6agsqyT1Fi6Vji96ispv0xvYLczKD6Om5ZrtHXUWq6+gAP7/DWi+nf0If2jJKtvDG99m83+wfBvY3ui6np9jFLzm9gquLHLSPUqZ+qX4PPLKIIY9FBV7a//gGMniHCJvpfDGTEb/ATtGWZ9EvuvzqpjvjsuwvxBDusb44+G+IlfrHjSMS4sbr7WNJsWe6w25rLBa3fRgauunKOJpzjJI7uGqoewpApBlTB5Oq8C1+zacuqu0w3ic/UtDDBKnsFN/7RXSSK9Bk9xJ/MX60HW3O+PjknYWzT/zSQMpttcxDX531nXDb22GMFuBADt8ccXU/cXvr87X0Ot8LAAk3/4bs8junfj/N8P9HaAN74N716fYp+A0Dqx0CuHuljYO+XsMSdWOJY74MlyK6yrrTrTSvK1qEjqzi91m1xpB4/6I4QmM4kVWumf2pFeQCeyDRtSVwb6EGYIuZ2T5WAdHLg3mOlC5Ij14Pdhy9JsbkabMjUbN627x/vG04j5aZOpIIas2Wv+xIu/6FLiRfvFbEE+PKnW3ZuqXy7uFZVrRyBHpXWnqpgJD1pLgCl/mYsRrNkFNMLTt7IdM85PqYq37nPXlJF6GbMJ29BTD16n/3UCLVRBu2SopLRGRVyJarQBrtlWKBaxSF6tc7ojHEI1TtOwESpiHs+cbcG0FXG3SOlSqatA5LyqYIuYoPqrH0UJn22EL+O5dezsIW9tMUZ++5+0O5f34qKiRF1dUr1QHTWQRf6+FOMRncdeupAkrf74XAPs+AOXv+htgfPw2kElRRxLsytwjBDxh3D5pu+mIVVFKlyKjy2v6eb2LsbdUSgbCWGbqyJrK8XSixXP4e/SOcFXphlCOaoRmZhubj1zejvaEFCTty++Y1FP1AS8uLgjrWLbw4IvmGW4L52F7gfVpPp2GiksHln3uWgDb/eh5gmLXxRif2PKxylhzfMfWhVIvl48CBttBRVhgh9cIFfWrPPvbpdrCuauDOQYZgakxPxPOuWgOVvUxSj0cdx9V2FPUf6g3tA/yZnnfXliqZuHiIdTAOsKmUfUBBH8nMydzevFYm0KWeaxs7HGkLhhjlhAPUiZO4tbttAJ2+u6zfjNWCKeqC1tHPmptMIKfQjhbOrdmYIh6lkiAsRu2xtPPfS0ivbthF6fhSTSWf5AfJ4d/G7zXOqRg2aUyVrgnK7mm1VgpvRLKiYHmNOqdfEnpWuKxmWJ8VP+kIBGkfIHPzgg3Hlem402PhCIWWsETc3T34YNbr5bQ2oV+vhYhfhl3EcneiLrW44SQELr7PfF+n/Vj7uOmsThh7S6OtG6t/OUbnGg8sNcE6KIcLajG9f8dvwx8lPi0jEMxgAz3wr3n7vGQ7ua9BilEpupQEob7PwavmM/J8RfPxpp+bkIPuMHVuv8TvU6Fn8mHWkFbtodcFX4S9C8AQsvXNeaxpCy0A5nWxIJD+AodAEg+ZPsdS3jN13/DnKd6V0V32/CoV3Wcmiosm5svjjIViKrGN5yHZ+gOqxHb7Ols78io6a6dAwbbdOuA/oIGJPbpuwUh4cNcv5JesWMsRuQq0Kp4Q74TpstbywK99s6NpoZ1BnuktuVOWtVpiWuOZmvaMSaLSvdkK3+HyQZBZGXW+0Vccit1nMYqcb+G8W7dPwtmuERKgQDrlJixfPjVBUml5hkae2PDpKU8b+G27mU2TOHXdOH9TdSXBZq9By9Iiax5lb8TgAiyXNd5p/B/3keMzk5F93Ry1CthQvxQYj6D9gZ7DgCaheXfHeE2OsOpZjXLK2ttXHr9MelkGY2its51T6rAeYx+lBccdHIuXtAyVMGeyXEG/3ObLoaSLHOCopuazGs+uhFyqm4q5dvU44tXoB0O18rziJDpnXUl0zsttMstU098ofFjwcf0PmVK5ccOpVjYRrHwSDYD96pZyVp9pa8LdV7Ieq77YwRMCA8FLN6yQyhTeG9oj/0A6lIYknAUisKH2JEfPUluJakXpl6cIjOtqUOrn3MUtCg5hcGje+1pD1nDX07//94k//vBN//7vOc//mhcUH/mhUn+rMuMR9RwLvV7WDziZRPvOgSHVgRZVvKymLbV+U0YqpkpahkUK7tyDnoYZtSLcJ4sgB1yAhx7anOxs/k+Lg6f4VDS4754aj/t/XAVcHbfvbPQapV/xBq9HsHkjoT69sy63yCTy8BmyLwthsmz453PJhO4TBdTlyBnIUVZvXV1Z5ren0HBeRiRllPYQtXpUhunsmfmLX+sJVa0mRVVvjEaiGGaC9FrU02tWbrWnhMC8uzZ6SfyMzK6Bz/nzhA06tbWVpbMBilTl209S0/i9qyXP2M4omC1SbPBHQTizyr/1IZUG4z2PrYX28WAhV2/x3/daFqFUXYBwafYI1FnK5t0BNduyCl9g4LfdQg5R4XueGKtm+noCfLCPZPGNMU8JyqNqY1mTiAoXjujyoVtqotDcuTTbDM6IPmJOW42i6s+C+LbQLgrlQ/xAq6zuOR3NhFj65SXDdSsAJIr/efv4ZGiI+gSSmytmPfKZVOm1wikGXeRC2hERTGfM9gC3raTJIMIPvvQVK9w+/nDaO0a7CvDilKVqAzqnqshK9gn193Io1lActpA11sQ+EtmXUJDRh0acT4L02U2H3ate95+lW+P4vIG25gmHQbewWXOGF3mJTpcnsavg5fNWuz38kgk/8gxwzu2fCAdBIXWo8EhYRobf0UdesgfDb0mamViHXZCq7vsOaYP16b1buZ4zFaGhBOlbkUn0YU3JfkLp9qTEO+LFYrnLKX4Uk+QVikMneI9Tve0hjavJh7SUs5TDuWHwVtkus5vM2zXTgDnGSvMalk+DYH6z8QuUxAofz/ie2vlzJhuYuXVbkOgt+gu6oODcCuhZw2ABGOuvqeH1Z9E79ZZKPCTsQgXASwp9FnqromWIT0QZLLnnbSToD+gx4Q9LEcuP/WP/RgQG6m/PHxeAmdAWcx3wZf8FMG6EF90BStslwR0I3vw7qQAxOfjaZQNoN+QBgpAIAA=",
    profile: "data:image/webp;base64,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",
  },
};

function CoreMark({ size = 44, spin = false }) {
  if (ASSET_URLS.logo) {
    return (
      <img
        src={ASSET_URLS.logo}
        alt="CORE"
        style={{ width: size, height: size, objectFit: "contain" }}
        className={spin ? "animate-[spin_8s_linear_infinite]" : ""}
      />
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center ${spin ? "animate-[spin_8s_linear_infinite]" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="55%" stopColor={C.blue} />
            <stop offset="100%" stopColor={C.orange} />
          </linearGradient>
        </defs>
        <polygon
          points="50,4 90,27 90,73 50,96 10,73 10,27"
          fill="none"
          stroke="url(#coreGrad)"
          strokeWidth="6"
        />
        <circle cx="50" cy="50" r="10" fill={C.cyan} opacity="0.9" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HARDWARE GLYPHS — original geometric icon set (not modeled on any real
// product photo/logo), one distinct shape per catalog key so items in a
// list are visually distinguishable at a glance.
// ---------------------------------------------------------------------------
// Shared gradient defs for the 2.5D glyph set. `uid` keeps ids unique per
// glyph instance so multiple icons on screen at once don't fight over the
// same <linearGradient>/<radialGradient> definition.
function GlyphDefs({ uid, color }) {
  return (
    <defs>
      {/* top face: brightest, catches the "overhead light" */}
      <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3A4A66" />
        <stop offset="100%" stopColor="#1C2740" />
      </linearGradient>
      {/* front face: mid tone */}
      <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#141D33" />
        <stop offset="100%" stopColor="#0A0F1E" />
      </linearGradient>
      {/* side face: darkest, in shadow */}
      <linearGradient id={`${uid}-side`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0A0F1C" />
        <stop offset="100%" stopColor="#050810" />
      </linearGradient>
      {/* accent glow used for LEDs / fan hubs / active elements */}
      <radialGradient id={`${uid}-glow`} cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor={color} stopOpacity="0.95" />
        <stop offset="60%" stopColor={color} stopOpacity="0.55" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
      {/* fan blade shading (used on GPU/rig fans) */}
      <radialGradient id={`${uid}-fan`} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#4A5A78" />
        <stop offset="100%" stopColor="#0D1424" />
      </radialGradient>
    </defs>
  );
}

// Isometric "mining box" body shared by all rig tiers — modeled loosely on
// real ASIC/rack-miner chassis: a top face, a lit front face and a shaded
// side face, so the icon reads as a physical box rather than a flat line glyph.
function IsoRigShell({ uid, color, children }) {
  return (
    <>
      {/* side face (right, in shadow) */}
      <polygon points="50,46 85,28 85,68 50,86" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.25" strokeWidth="1.5" />
      {/* front face (left, lit) */}
      <polygon points="15,28 50,46 50,86 15,68" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.35" strokeWidth="1.5" />
      {/* top face (brightest) */}
      <polygon points="50,10 85,28 50,46 15,28" fill={`url(#${uid}-top)`} stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
      {children}
    </>
  );
}

function HardwareGlyph({ id, color, size = 20 }) {
  const s = { width: size, height: size };
  const uid = id || "glyph";

  switch (id) {
    // ---- Rigs: isometric mining-box chassis, tiers differ by front grille ----
    case "rig-starter":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* single fan on front face */}
            <circle cx="32" cy="60" r="11" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="32" cy="60" r="3" fill={`url(#${uid}-glow)`} />
            {/* status LED on top face */}
            <circle cx="50" cy="24" r="2.4" fill={color} />
          </IsoRigShell>
        </svg>
      );
    case "rig-pro":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* twin fans, slightly larger unit */}
            <circle cx="27" cy="55" r="9" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.7" />
            <circle cx="27" cy="55" r="2.4" fill={`url(#${uid}-glow)`} />
            <circle cx="34" cy="74" r="9" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.7" />
            <circle cx="34" cy="74" r="2.4" fill={`url(#${uid}-glow)`} />
            <rect x="63" y="18" width="16" height="4" rx="1.5" fill={color} fillOpacity="0.7" />
          </IsoRigShell>
        </svg>
      );
    case "rig-hyper":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* stacked rack unit: three fan rows referencing multi-tray rigs */}
            <circle cx="30" cy="46" r="6.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
            <circle cx="30" cy="63" r="6.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
            <circle cx="30" cy="80" r="6.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
            <circle cx="30" cy="46" r="1.8" fill={`url(#${uid}-glow)`} />
            <circle cx="30" cy="63" r="1.8" fill={`url(#${uid}-glow)`} />
            <circle cx="30" cy="80" r="1.8" fill={`url(#${uid}-glow)`} />
            <rect x="60" y="16" width="20" height="3.5" rx="1.5" fill={color} fillOpacity="0.75" />
          </IsoRigShell>
        </svg>
      );
    case "rig-quantum":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* hex core vent on the top face — flagship tier */}
            <polygon points="50,18 60,23 60,33 50,38 40,33 40,23" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="1.5" />
            <circle cx="33" cy="60" r="10" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.75" />
            <circle cx="33" cy="60" r="2.6" fill={`url(#${uid}-glow)`} />
          </IsoRigShell>
        </svg>
      );

    // ---- ASIC rigs: same iso chassis, but a rectangular vent grille instead
    // of round GPU-style fans, reflecting real ASIC miner intake screens ----
    case "rig-avalon_nano":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* single small grille — compact home unit */}
            <rect x="22" y="52" width="20" height="16" rx="2" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.7" />
            <line x1="25" y1="56" x2="39" y2="56" stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />
            <line x1="25" y1="60" x2="39" y2="60" stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />
            <line x1="25" y1="64" x2="39" y2="64" stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />
            <circle cx="50" cy="24" r="2.4" fill={color} />
          </IsoRigShell>
        </svg>
      );
    case "rig-avalon_a15":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* twin grilles — mid-size unit */}
            <rect x="18" y="46" width="16" height="14" rx="2" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="21" y1="50" x2="31" y2="50" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <line x1="21" y1="53" x2="31" y2="53" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <line x1="21" y1="56" x2="31" y2="56" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <rect x="18" y="66" width="16" height="14" rx="2" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="21" y1="70" x2="31" y2="70" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <line x1="21" y1="73" x2="31" y2="73" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <line x1="21" y1="76" x2="31" y2="76" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
            <rect x="60" y="18" width="18" height="4" rx="1.5" fill={color} fillOpacity="0.7" />
          </IsoRigShell>
        </svg>
      );
    case "rig-whatsminer_m60s":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* stacked triple grille — industrial farm unit */}
            <rect x="18" y="42" width="15" height="12" rx="1.8" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.1" strokeOpacity="0.7" />
            <rect x="18" y="58" width="15" height="12" rx="1.8" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.1" strokeOpacity="0.7" />
            <rect x="18" y="74" width="15" height="12" rx="1.8" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.1" strokeOpacity="0.7" />
            <rect x="58" y="15" width="24" height="3.5" rx="1.5" fill={color} fillOpacity="0.75" />
            <rect x="58" y="20" width="18" height="3" rx="1.5" fill={color} fillOpacity="0.5" />
          </IsoRigShell>
        </svg>
      );
    case "rig-antminer_s21":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <IsoRigShell uid={uid} color={color}>
            {/* coolant loop on the top face — marks this as the hydro-cooled flagship */}
            <path d="M40 24 Q50 14 60 24 Q70 34 60 40 Q50 46 40 40 Q30 34 40 24 Z" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.7" />
            <circle cx="50" cy="32" r="3" fill={`url(#${uid}-glow)`} />
            <rect x="20" y="50" width="18" height="14" rx="2" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
            <circle cx="29" cy="57" r="4.5" fill={`url(#${uid}-glow)`} />
          </IsoRigShell>
        </svg>
      );

    // ---- Components: GPU card silhouette (shroud + fans + backplate edge),
    // referencing the general shape of real graphics cards ----
    case "comp-rtx5060":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="10" y="20" width="14" height="14" rx="2" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="12" y="34" width="76" height="34" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.55" />
          <rect x="16" y="38" width="68" height="4" rx="2" fill={color} fillOpacity="0.3" />
          <circle cx="50" cy="55" r="12" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.75" />
          <circle cx="50" cy="55" r="3" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-rtx5080":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="8" y="20" width="14" height="14" rx="2" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="10" y="34" width="80" height="34" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.55" />
          <rect x="14" y="38" width="72" height="4" rx="2" fill={color} fillOpacity="0.3" />
          <circle cx="36" cy="55" r="10.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="64" cy="55" r="10.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="36" cy="55" r="2.6" fill={`url(#${uid}-glow)`} />
          <circle cx="64" cy="55" r="2.6" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-rtx4090":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          {/* power-connector pins along the top edge, like a real triple-fan card */}
          <rect x="18" y="16" width="8" height="16" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="30" y="14" width="8" height="18" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="64" y="14" width="8" height="18" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="10" y="36" width="80" height="32" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="34" cy="52" r="10" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="66" cy="52" r="10" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="34" cy="52" r="2.5" fill={`url(#${uid}-glow)`} />
          <circle cx="66" cy="52" r="2.5" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-rtx5090":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="16" y="14" width="7" height="20" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="28" y="12" width="7" height="22" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="65" y="12" width="7" height="22" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="77" y="14" width="7" height="20" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="8" y="38" width="84" height="30" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          <circle cx="28" cy="53" r="8.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
          <circle cx="50" cy="53" r="8.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
          <circle cx="72" cy="53" r="8.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
          <circle cx="28" cy="53" r="2.2" fill={`url(#${uid}-glow)`} />
          <circle cx="50" cy="53" r="2.6" fill={`url(#${uid}-glow)`} />
          <circle cx="72" cy="53" r="2.2" fill={`url(#${uid}-glow)`} />
        </svg>
      );

    // ---- AMD cards: same shroud/fan language as the NVIDIA line, plus a
    // diagonal accent cut on the shroud so the brand reads at a glance ----
    case "comp-rx7600":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="10" y="20" width="14" height="14" rx="2" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="12" y="34" width="76" height="34" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.55" />
          <path d="M16 40 L30 40 L24 62 L16 62 Z" fill={color} fillOpacity="0.22" />
          <circle cx="56" cy="55" r="12" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.75" />
          <circle cx="56" cy="55" r="3" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-rx7800xt":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="8" y="20" width="14" height="14" rx="2" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="10" y="34" width="80" height="34" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.55" />
          <path d="M14 40 L26 40 L20 62 L14 62 Z" fill={color} fillOpacity="0.22" />
          <circle cx="42" cy="55" r="10.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="70" cy="55" r="10.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="42" cy="55" r="2.6" fill={`url(#${uid}-glow)`} />
          <circle cx="70" cy="55" r="2.6" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-rx7900xtx":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="18" y="16" width="8" height="16" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="30" y="14" width="8" height="18" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="64" y="14" width="8" height="18" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="10" y="36" width="80" height="32" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M14 42 L28 42 L20 66 L14 66 Z" fill={color} fillOpacity="0.22" />
          <circle cx="40" cy="52" r="10" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="72" cy="52" r="10" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="40" cy="52" r="2.5" fill={`url(#${uid}-glow)`} />
          <circle cx="72" cy="52" r="2.5" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-rx9070xt":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="16" y="14" width="7" height="20" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="28" y="12" width="7" height="22" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="65" y="12" width="7" height="22" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="77" y="14" width="7" height="20" rx="1.5" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="8" y="38" width="84" height="30" rx="9" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          <path d="M12 44 L26 44 L18 64 L12 64 Z" fill={color} fillOpacity="0.22" />
          <circle cx="34" cy="53" r="8.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
          <circle cx="56" cy="53" r="8.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
          <circle cx="78" cy="53" r="8.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
          <circle cx="34" cy="53" r="2.2" fill={`url(#${uid}-glow)`} />
          <circle cx="56" cy="53" r="2.6" fill={`url(#${uid}-glow)`} />
          <circle cx="78" cy="53" r="2.2" fill={`url(#${uid}-glow)`} />
        </svg>
      );

    // ---- Intel Arc: smaller budget-tier shroud with hexagonal fan hubs,
    // reading as a distinct, more compact card family ----
    case "comp-arc_a380":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="22" y="38" width="56" height="26" rx="7" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.55" />
          <rect x="26" y="42" width="48" height="3" rx="1.5" fill={color} fillOpacity="0.3" />
          <polygon points="50,45 58,49.5 58,58.5 50,63 42,58.5 42,49.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.75" />
          <circle cx="50" cy="54" r="2.6" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "comp-arc_b580":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="10" y="22" width="12" height="12" rx="2" fill={`url(#${uid}-side)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.1" />
          <rect x="14" y="36" width="72" height="30" rx="8" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.55" />
          <rect x="18" y="40" width="64" height="3" rx="1.5" fill={color} fillOpacity="0.3" />
          <polygon points="38,44 45,48 45,56 38,60 31,56 31,48" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.75" />
          <polygon points="62,44 69,48 69,56 62,60 55,56 55,48" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.2" strokeOpacity="0.75" />
          <circle cx="38" cy="52" r="2.3" fill={`url(#${uid}-glow)`} />
          <circle cx="62" cy="52" r="2.3" fill={`url(#${uid}-glow)`} />
        </svg>
      );

    // ---- Boosters: kept symbolic (not physical hardware), given the same
    // gradient/glow treatment so they sit visually consistent with the rest ----
    case "boost-poolswitch":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="38" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
          <path d="M25 38 H68 M68 38 L58 28 M68 38 L58 48" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M75 62 H32 M32 62 L42 52 M32 62 L42 72" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "boost-braiinsos":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="38" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="26" stroke={color} strokeWidth="4" fill="none" />
          <line x1="50" y1="18" x2="50" y2="27" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="73" x2="50" y2="82" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="18" y1="50" x2="27" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="73" y1="50" x2="82" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <polygon points="54,34 42,54 49,54 46,66 60,46 52,46" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "boost-immersion":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="38" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
          <path d="M50 18 C62 38 70 50 70 64 C70 78 61 87 50 87 C39 87 30 78 30 64 C30 50 38 38 50 18 Z" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="3" />
          <path d="M38 62 Q44 58 50 62 T62 62" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M38 72 Q44 68 50 72 T62 72" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "boost-hydroovc":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="38" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
          <path d="M50 44 C59 57 65 66 65 76 C65 84 58 90 50 90 C42 90 35 84 35 76 C35 66 41 57 50 44 Z" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="3" />
          <path d="M50 14 L50 36 M50 14 L41 24 M50 14 L59 24" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ---- Energy packs: 2.5D battery/cell block with beveled top ----
    case "pack-quickcharge":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="38" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="27" fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.5" />
          <polygon points="56,24 33,56 47,56 43,80 68,46 52,46" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "pack-powercell":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="16" y="16" width="56" height="10" rx="2" fill={`url(#${uid}-top)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="16" y="26" width="56" height="46" rx="6" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.55" />
          <rect x="74" y="42" width="9" height="18" rx="2.5" fill={color} fillOpacity="0.75" />
          <rect x="23" y="34" width="16" height="30" rx="2" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "pack-fullcharge":
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="12" y="16" width="60" height="10" rx="2" fill={`url(#${uid}-top)`} stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="12" y="26" width="60" height="46" rx="6" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.5" strokeOpacity="0.55" />
          <rect x="72" y="42" width="9" height="18" rx="2.5" fill={color} fillOpacity="0.75" />
          <rect x="19" y="34" width="46" height="30" rx="2" fill={`url(#${uid}-glow)`} />
        </svg>
      );

    // ---- Crafting materials: real GPU/rig teardown parts, each drawn to
    // read at a glance (die, memory IC, board, connector, fan, paste,
    // heatsink, ASIC) rather than sharing one generic "part" glyph ----
    case "mat-silicon_die":
      // Bare unpackaged chip die — small square with a fine bond-pad grid
      // and four corner pads, like a die photographed before packaging.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="24" y="24" width="52" height="52" rx="3" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          <rect x="34" y="34" width="32" height="32" rx="1" fill={`url(#${uid}-glow)`} opacity="0.55" />
          <line x1="34" y1="44" x2="66" y2="44" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <line x1="34" y1="54" x2="66" y2="54" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <line x1="44" y1="34" x2="44" y2="66" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <line x1="54" y1="34" x2="54" y2="66" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
          <rect x="18" y="18" width="6" height="6" fill={color} fillOpacity="0.8" />
          <rect x="76" y="18" width="6" height="6" fill={color} fillOpacity="0.8" />
          <rect x="18" y="76" width="6" height="6" fill={color} fillOpacity="0.8" />
          <rect x="76" y="76" width="6" height="6" fill={color} fillOpacity="0.8" />
        </svg>
      );
    case "mat-vram_chip":
      // Memory IC — wide rectangular package with pins along both long
      // edges and a notch marking pin 1, like a GDDR BGA/FBGA part.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="20" y="32" width="60" height="36" rx="4" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          {[38, 46, 54, 62].map((y) => (
            <React.Fragment key={y}>
              <rect x="10" y={y} width="10" height="4" fill={color} fillOpacity="0.7" />
              <rect x="80" y={y} width="10" height="4" fill={color} fillOpacity="0.7" />
            </React.Fragment>
          ))}
          <circle cx="28" cy="40" r="2.4" fill={`url(#${uid}-glow)`} />
          <line x1="34" y1="52" x2="66" y2="52" stroke={color} strokeOpacity="0.35" strokeWidth="1.4" />
          <line x1="34" y1="58" x2="58" y2="58" stroke={color} strokeOpacity="0.35" strokeWidth="1.4" />
        </svg>
      );
    case "mat-pcb_board":
      // Bare circuit board — traces running to via dots and a couple of
      // mounted-pad silhouettes, the substrate everything else solders onto.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="14" y="14" width="72" height="72" rx="5" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.6" />
          <path d="M22 30 H50 V44 H70" stroke={color} strokeOpacity="0.45" strokeWidth="2" fill="none" />
          <path d="M22 70 H40 V56 H78" stroke={color} strokeOpacity="0.45" strokeWidth="2" fill="none" />
          <circle cx="22" cy="30" r="2.6" fill={color} fillOpacity="0.8" />
          <circle cx="70" cy="44" r="2.6" fill={color} fillOpacity="0.8" />
          <circle cx="22" cy="70" r="2.6" fill={color} fillOpacity="0.8" />
          <circle cx="78" cy="56" r="2.6" fill={color} fillOpacity="0.8" />
          <rect x="46" y="60" width="20" height="14" rx="2" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "mat-power_connector":
      // High-current connector — a trapezoidal plug shell with a row of
      // pin sockets, modeled on a PCIe/ATX-style power connector.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <path d="M22 30 L78 30 L70 76 L30 76 Z" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          {[36, 50, 64].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="44" r="4.2" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="1" strokeOpacity="0.6" />
              <circle cx={x} cy="62" r="4.2" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="1" strokeOpacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="16" y="22" width="10" height="10" rx="2" fill={color} fillOpacity="0.7" />
        </svg>
      );
    case "mat-cooling_fan":
      // Bare fan blade assembly — hub with radial blades, no shroud, unlike
      // the fans built into RigIcon/ComponentIcon glyphs.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="38" fill={`url(#${uid}-front)`} stroke={color} strokeOpacity="0.35" strokeWidth="1.4" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M50 50 L50 20 Q60 26 58 40 Z"
              fill={color}
              fillOpacity="0.35"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="9" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.8" />
          <circle cx="50" cy="50" r="2.6" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "mat-thermal_paste":
      // Syringe-style tube — the way thermal compound is actually sold and
      // applied, with a bead of paste at the nozzle tip.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="38" y="16" width="10" height="10" rx="1.5" fill={color} fillOpacity="0.7" />
          <path d="M40 26 L44 26 L48 40 L36 40 Z" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.3" strokeOpacity="0.6" />
          <rect x="30" y="40" width="24" height="40" rx="7" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          <rect x="34" y="46" width="16" height="8" rx="2" fill={color} fillOpacity="0.25" />
          <circle cx="42" cy="82" r="6" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "mat-copper_heatsink":
      // Finned metal block — parallel cooling fins over a base plate, the
      // real geometry that gives a heatsink its surface area.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="16" y="60" width="68" height="16" rx="3" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.6" strokeOpacity="0.65" />
          {[20, 32, 44, 56, 68, 80].map((x) => (
            <rect key={x} x={x - 3} y="22" width="6" height="40" rx="1.5" fill={`url(#${uid}-fan)`} stroke={color} strokeWidth="1" strokeOpacity="0.5" />
          ))}
          <rect x="34" y="66" width="32" height="5" rx="1.5" fill={`url(#${uid}-glow)`} />
        </svg>
      );
    case "mat-asic_chip":
      // Hash-specific ASIC die — same die silhouette as silicon_die but
      // with a dense hex/dot core instead of a plain grid, reading as a
      // more specialised, purpose-built chip.
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <rect x="22" y="22" width="56" height="56" rx="4" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="1.7" strokeOpacity="0.7" />
          <polygon points="50,32 64,40 64,58 50,66 36,58 36,40" fill={`url(#${uid}-glow)`} stroke={color} strokeWidth="1.4" strokeOpacity="0.8" />
          {[28, 42, 58, 72].map((x) => (
            <rect key={`t-${x}`} x={x - 2} y="14" width="4" height="8" fill={color} fillOpacity="0.75" />
          ))}
          {[28, 42, 58, 72].map((x) => (
            <rect key={`b-${x}`} x={x - 2} y="78" width="4" height="8" fill={color} fillOpacity="0.75" />
          ))}
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" {...s}>
          <GlyphDefs uid={uid} color={color} />
          <circle cx="50" cy="50" r="30" fill={`url(#${uid}-front)`} stroke={color} strokeWidth="4" strokeOpacity="0.6" />
          <circle cx="50" cy="50" r="10" fill={`url(#${uid}-glow)`} />
        </svg>
      );
  }
}

function RigIcon({ rigKey, rarity = "common", size = 40 }) {
  const rar = RARITY_STYLE[rarity];
  const customSrc = ASSET_URLS.rigs[rigKey];
  return (
    <div
      className="relative flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${rar.color}2E, #0A1220)`,
        border: `1px solid ${rar.color}66`,
        boxShadow: `0 0 14px -4px ${rar.color}AA inset, 0 0 10px -3px ${rar.color}88`,
      }}
    >
      {customSrc ? (
        <img src={customSrc} alt={rigKey} className="w-full h-full object-cover" />
      ) : (
        <HardwareGlyph id={`rig-${rigKey}`} color={rar.color} size={Math.round(size * 0.58)} />
      )}
    </div>
  );
}

function ComponentIcon({ compKey, rarity = "common", size = 40 }) {
  const rar = RARITY_STYLE[rarity];
  const customSrc = ASSET_URLS.components[compKey];
  return (
    <div
      className="relative flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${rar.color}2E, #0A1220)`,
        border: `1px solid ${rar.color}66`,
        boxShadow: `0 0 14px -4px ${rar.color}AA inset, 0 0 10px -3px ${rar.color}88`,
      }}
    >
      {customSrc ? (
        <img src={customSrc} alt={compKey} className="w-full h-full object-cover" />
      ) : (
        <HardwareGlyph id={`comp-${compKey}`} color={rar.color} size={Math.round(size * 0.58)} />
      )}
    </div>
  );
}

function BoosterIcon({ boostKey, rarity = "common", size = 40 }) {
  const rar = RARITY_STYLE[rarity];
  const customSrc = ASSET_URLS.boosters[boostKey];
  return (
    <div
      className="relative flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${rar.color}2E, #0A1220)`,
        border: `1px solid ${rar.color}66`,
        boxShadow: `0 0 14px -4px ${rar.color}AA inset, 0 0 10px -3px ${rar.color}88`,
      }}
    >
      {customSrc ? (
        <img src={customSrc} alt={boostKey} className="w-full h-full object-cover" />
      ) : (
        <HardwareGlyph id={`boost-${boostKey}`} color={rar.color} size={Math.round(size * 0.58)} />
      )}
    </div>
  );
}

function PackIcon({ packKey, rarity = "common", size = 40 }) {
  const rar = RARITY_STYLE[rarity];
  const customSrc = ASSET_URLS.packs[packKey];
  return (
    <div
      className="relative flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${rar.color}2E, #0A1220)`,
        border: `1px solid ${rar.color}66`,
        boxShadow: `0 0 14px -4px ${rar.color}AA inset, 0 0 10px -3px ${rar.color}88`,
      }}
    >
      {customSrc ? (
        <img src={customSrc} alt={packKey} className="w-full h-full object-cover" />
      ) : (
        <HardwareGlyph id={`pack-${packKey}`} color={rar.color} size={Math.round(size * 0.58)} />
      )}
    </div>
  );
}

function MaterialIcon({ materialKey, rarity = "common", size = 40 }) {
  const rar = RARITY_STYLE[rarity];
  const customSrc = ASSET_URLS.materials[materialKey];
  return (
    <div
      className="relative flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${rar.color}2E, #0A1220)`,
        border: `1px solid ${rar.color}66`,
        boxShadow: `0 0 14px -4px ${rar.color}AA inset, 0 0 10px -3px ${rar.color}88`,
      }}
    >
      {customSrc ? (
        <img src={customSrc} alt={materialKey} className="w-full h-full object-cover" />
      ) : (
        <HardwareGlyph id={`mat-${materialKey}`} color={rar.color} size={Math.round(size * 0.58)} />
      )}
    </div>
  );
}

// Stylised mining-rig hardware graphic used as the Home tab hero image.
// Renders an isometric "mining box" (top/front/side faces, like RigIcon's
// IsoRigShell) whose slot cells and overall glow react to the rig's real
// installed components — empty slots stay dark, filled slots light up in
// their component's rarity color, and glow intensity scales with how many
// slots are filled and how rare they are.
function RigDevice({ rig, fill = false }) {
  const slots = rig?.slots || [];
  const slotCount = slots.length || 4;
  const filled = slots.filter(Boolean);

  // Dominant rarity = highest-rarity installed component; drives glow color.
  const RARITY_ORDER = ["common", "rare", "epic", "legendary"];
  let dominant = null;
  filled.forEach((slot) => {
    const comp = COMPONENT_CATALOG.find((c) => c.key === slot.key);
    if (!comp) return;
    if (!dominant || RARITY_ORDER.indexOf(comp.rarity) > RARITY_ORDER.indexOf(dominant)) {
      dominant = comp.rarity;
    }
  });
  const glowColor = dominant ? RARITY_STYLE[dominant].color : C.cyan;
  const fillRatio = slotCount ? filled.length / slotCount : 0;
  const glowBlur = 18 + fillRatio * 26;
  const uid = "rigdevice";

  // Up to 6 slot cells laid out on the chassis front face; extras are hidden
  // rather than drawn off-panel if a rig somehow has more.
  const cellPositions = [
    [30, 50], [50, 58], [70, 66],
    [30, 68], [50, 76], [70, 84],
  ].slice(0, Math.min(slotCount, 6));

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center"
      style={{
        ...(fill ? { height: "100%" } : { aspectRatio: "16/9" }),
        background: "linear-gradient(160deg, #101A2C, #05070E)",
        border: `1px solid ${glowColor}33`,
        boxShadow: filled.length ? `0 0 ${glowBlur}px -12px ${glowColor}88 inset` : undefined,
        perspective: 700,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 55%, ${glowColor}${filled.length ? "33" : "1A"}, transparent 60%)` }}
      />
      {/* Scene wrapper: cube + its floor-glow live in the same centered flex
          column, so they move and center together as one unit. Previously
          the floor was pinned to a fixed % of the *outer* container while
          the cube was independently flex-centered — on a tall card the two
          drifted apart, leaving a large dead gap above the status pill. */}
      <div className="relative flex flex-col items-center" style={{ width: "84%" }}>
        {/* Outer wrapper handles the up/down hover-float; inner wrapper spins
            independently so the two motions don't fight over `transform`. */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/0.72",
            animation: `core-hover ${filled.length ? "3.2s" : "4.5s"} ease-in-out infinite`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: "50% 50%",
              animation: `core-turntable ${filled.length ? "9s" : "16s"} linear infinite`,
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3A4A66" />
                  <stop offset="100%" stopColor="#1C2740" />
                </linearGradient>
                <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#141D33" />
                  <stop offset="100%" stopColor="#0A0F1E" />
                </linearGradient>
                <linearGradient id={`${uid}-side`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0A0F1C" />
                  <stop offset="100%" stopColor="#050810" />
                </linearGradient>
              </defs>
              {/* side face */}
              <polygon points="50,46 85,28 85,68 50,86" fill={`url(#${uid}-side)`} stroke={glowColor} strokeOpacity="0.3" strokeWidth="1.5" />
              {/* front face */}
              <polygon points="15,28 50,46 50,86 15,68" fill={`url(#${uid}-front)`} stroke={glowColor} strokeOpacity="0.4" strokeWidth="1.5" />
              {/* top face */}
              <polygon points="50,10 85,28 50,46 15,28" fill={`url(#${uid}-top)`} stroke={glowColor} strokeOpacity="0.55" strokeWidth="1.5" />
              {/* slot cells on the front face, one per rig component slot */}
              {cellPositions.map(([cx, cy], i) => {
                const slot = slots[i];
                const comp = slot ? COMPONENT_CATALOG.find((c) => c.key === slot.key) : null;
                const cellColor = comp ? RARITY_STYLE[comp.rarity].color : "#2A3550";
                return (
                  <rect
                    key={i}
                    x={cx - 6}
                    y={cy - 5}
                    width="12"
                    height="10"
                    rx="2.5"
                    fill={comp ? `${cellColor}33` : "rgba(255,255,255,0.03)"}
                    stroke={cellColor}
                    strokeWidth={comp ? 1.4 : 1}
                    strokeOpacity={comp ? 0.9 : 0.35}
                    style={comp ? { filter: `drop-shadow(0 0 4px ${cellColor}AA)` } : undefined}
                  />
                );
              })}
              {/* status LED on the top face */}
              <circle
                cx="50"
                cy="24"
                r="2.6"
                fill={filled.length ? glowColor : "#3A4560"}
                style={filled.length ? { animation: "core-led-pulse 1.6s ease-in-out infinite" } : undefined}
              />
            </svg>
          </div>
        </div>
        {/* glowing floor the chassis appears to hover above — now stacked
            directly beneath the cube in normal flow instead of absolutely
            anchored to the container edge, so it always tracks the cube. */}
        <div
          className="pointer-events-none"
          style={{
            marginTop: "-8%",
            width: "58%",
            height: "12px",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${glowColor}${filled.length ? "AA" : "66"} 0%, ${glowColor}44 45%, transparent 75%)`,
            filter: "blur(2px)",
            animation: `core-floor-glow ${filled.length ? "3.2s" : "4.5s"} ease-in-out infinite`,
          }}
        />
        <div
          className="pointer-events-none"
          style={{
            marginTop: "-9px",
            width: "38%",
            height: "3px",
            borderRadius: "50%",
            background: glowColor,
            boxShadow: `0 0 10px 2px ${glowColor}`,
            opacity: filled.length ? 0.9 : 0.5,
          }}
        />
      </div>
      <div className="absolute top-2.5 left-4 text-[10px] font-extrabold tracking-[0.2em] text-white/60">
        CORE
      </div>
      {/* Rig name/level badge, matching the photo variant (RigHero) so both
          look consistent whether or not the rig has a custom image. */}
      {rig && (
        <div
          className="absolute top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: "rgba(5,7,14,0.7)", border: `1px solid ${glowColor}66`, color: glowColor }}
        >
          {rig.name} · Lv.{rig.level}
        </div>
      )}
      <div
        className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
        style={
          filled.length
            ? { background: "rgba(5,7,14,0.75)", border: `1px solid ${glowColor}66`, color: glowColor }
            : { background: "rgba(5,7,14,0.75)", border: "1px solid #4A556855", color: "#8FA3B8" }
        }
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={filled.length ? { background: glowColor, boxShadow: `0 0 6px 1px ${glowColor}` } : { background: "#4A5568" }}
        />
        {filled.length ? "Mining Active" : "No components installed"}
      </div>
    </div>
  );
}

// Home tab hero: shows a real photo of the player's best owned rig (falls
// back to the CSS chassis illustration if no rig is owned / has no image).
class RigHeroErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position: "absolute", inset: 0, background: "#300", color: "#FF6666", fontSize: 11, padding: 8, overflow: "auto", fontFamily: "monospace", zIndex: 999 }}>
          RIGHERO CRASHED:
          <br />
          {String(this.state.error && this.state.error.message)}
          <br />
          {String(this.state.error && this.state.error.stack).slice(0, 500)}
        </div>
      );
    }
    return this.props.children;
  }
}

function RigHero({ rig, fill = false }) {
  const photo = rig ? ASSET_URLS.rigs[rig.key] : null;
  const rar = rig ? RARITY_STYLE[rig.rarity] : RARITY_STYLE.common;

  if (!photo) return <RigDevice rig={rig} fill={fill} />;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        ...(fill ? { height: "100%" } : { aspectRatio: "16/9" }),
        border: `1px solid ${rar.color}44`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 30px -10px ${rar.color}66`,
      }}
    >
      {/* backdrop glow behind the photo so it doesn't float on flat black */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 40%, ${rar.color}22, #05070E 75%)` }}
      />
      {/* glowing floor the rig appears to hover above */}
      <div
        className="absolute left-1/2 bottom-[18%] pointer-events-none"
        style={{
          width: "58%",
          height: "14px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${rar.color}AA 0%, ${rar.color}44 45%, transparent 75%)`,
          filter: "blur(2px)",
          animation: "core-floor-glow 3.6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[18%] pointer-events-none"
        style={{
          width: "40%",
          height: "3px",
          borderRadius: "50%",
          background: rar.color,
          boxShadow: `0 0 12px 2px ${rar.color}`,
          opacity: 0.9,
        }}
      />
      <img
        src={photo}
        alt={rig.name}
        className="absolute inset-0 w-full h-full object-contain p-1"
        style={{
          filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.55)) drop-shadow(0 0 18px ${rar.color}33)`,
          animation: "core-hover 3.6s ease-in-out infinite",
        }}
      />
      {/* subtle scanline sweep across the hero for a "live feed" feel */}
      <div
        className="absolute inset-x-0 h-10 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent, ${C.cyan}22, transparent)`,
          animation: "core-scan 5s linear infinite",
          mixBlendMode: "screen",
        }}
      />
      {/* bottom gradient so badges stay legible over any photo */}
      <div
        className="absolute inset-x-0 bottom-0 h-16"
        style={{ background: "linear-gradient(180deg, transparent, rgba(3,5,10,0.85))" }}
      />
      <div className="absolute top-2.5 left-3 text-[10px] font-extrabold tracking-[0.2em] text-white/70">
        CORE
      </div>
      <div
        className="absolute top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
        style={{ background: "rgba(5,7,14,0.7)", border: `1px solid ${rar.color}66`, color: rar.color }}
      >
        {rig.name} · Lv.{rig.level}
      </div>
      {(() => {
        const dur = rig.durability ?? 100;
        if (dur <= 0) {
          return (
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(5,7,14,0.75)", border: "1px solid #FF525288", color: "#FF7A7A" }}
            >
              <Wrench size={11} /> Broken — repair in Upgrade
            </div>
          );
        }
        if (dur < 30) {
          return (
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(5,7,14,0.75)", border: `1px solid ${C.orange}66`, color: C.orange }}
            >
              <Wrench size={11} /> Low durability ({Math.round(dur)}%)
            </div>
          );
        }
        return (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: "rgba(5,7,14,0.75)", border: `1px solid ${C.green}55`, color: C.green }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.green, boxShadow: `0 0 6px 1px ${C.green}` }} />
            Mining Active
          </div>
        );
      })()}
    </div>
  );
}
function FuturisticButton({
  children,
  onClick,
  disabled = false,
  accent = C.cyan,
  accent2,
  full = true,
  size = "md",
  className = "",
}) {
  const grad2 = accent2 || C.blue;
  const pad = size === "sm" ? "10px 16px" : "13px 20px";
  const clip = "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group overflow-hidden font-bold tracking-widest uppercase text-xs transition-transform duration-150 active:scale-[0.97] ${full ? "w-full" : ""} ${className}`}
      style={{
        padding: pad,
        clipPath: clip,
        WebkitClipPath: clip,
        background: disabled ? "#141C2C" : `linear-gradient(115deg, ${accent} 0%, ${grad2} 60%, ${accent} 100%)`,
        backgroundSize: "220% 100%",
        color: disabled ? "#4A5568" : "#04070E",
        boxShadow: disabled
          ? "none"
          : `0 0 22px -4px ${accent}AA, 0 0 0 1px ${accent}66 inset, 0 1px 0 rgba(255,255,255,0.25) inset`,
      }}
    >
      {/* thin outer frame line to sell the "cut corner" panel look */}
      {!disabled && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: clip, boxShadow: `0 0 0 1px ${accent}` , opacity: 0.35 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {!disabled && (
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-active:opacity-100"
          style={{
            background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
            backgroundSize: "220% 100%",
            animation: "core-shine 0.7s ease",
          }}
        />
      )}
    </button>
  );
}

function GhostButton({ children, onClick, accent = C.cyan, full = true, className = "" }) {
  const clip = "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";
  return (
    <button
      onClick={onClick}
      className={`relative font-bold tracking-widest uppercase text-[11px] transition-colors duration-150 active:scale-[0.97] ${full ? "w-full" : ""} ${className}`}
      style={{
        padding: "9px 14px",
        clipPath: clip,
        WebkitClipPath: clip,
        background: `${accent}14`,
        border: `1px solid ${accent}77`,
        color: accent,
      }}
    >
      {children}
    </button>
  );
}
function NavItem({ icon: Icon, label, active, onClick, navKey }) {
  const customSrc = navKey ? ASSET_URLS.nav[navKey] : null;
  return (
    <button
      onClick={onClick}
      className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
    >
      {active && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
          style={{ background: C.cyan, boxShadow: `0 0 8px 1px ${C.cyan}` }}
        />
      )}
      {customSrc ? (
        <img
          src={customSrc}
          alt={label}
          className="w-5 h-5 object-contain"
          style={{ opacity: active ? 1 : 0.55, filter: active ? `drop-shadow(0 0 6px ${C.cyan}AA)` : undefined }}
        />
      ) : (
        <Icon
          size={20}
          strokeWidth={2.2}
          color={active ? C.cyan : "#5B6B82"}
          style={active ? { filter: `drop-shadow(0 0 6px ${C.cyan}AA)` } : undefined}
        />
      )}
      <span
        className="text-[10px] tracking-wide"
        style={{ color: active ? C.cyan : "#5B6B82" }}
      >
        {label}
      </span>
    </button>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="w-8">
        {onBack && (
          <button onClick={onBack} className="text-slate-400">
            <ChevronLeft size={22} />
          </button>
        )}
      </div>
      <h1 className="text-white font-extrabold tracking-wide text-[15px] uppercase">{title}</h1>
      <div className="w-8 flex justify-end text-slate-400">{right}</div>
    </div>
  );
}

// A single on/off row used throughout SettingsModal — icon + label on the
// left, the same pill toggle switch used for "Rig is ON/OFF" in Upgrade.
function SettingsToggleRow({ icon: Icon, label, isOn, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
    >
      <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
        <Icon size={15} color={isOn ? C.cyan : "#5B6B82"} /> {label}
      </span>
      <span
        className="relative inline-flex items-center rounded-full transition-colors"
        style={{ width: 34, height: 18, background: isOn ? C.cyan : "#2a3346" }}
      >
        <span
          className="absolute rounded-full bg-white transition-all"
          style={{ width: 14, height: 14, top: 2, left: isOn ? 18 : 2 }}
        />
      </span>
    </button>
  );
}

// A single tappable row that goes somewhere else / triggers an action (Help,
// Privacy Policy, Terms) — no toggle, just a chevron-style affordance.
function SettingsLinkRow({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
    >
      <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
        <Icon size={15} color="#8FA3B8" /> {label}
      </span>
      <ChevronLeft size={14} color="#5B6B82" style={{ transform: "rotate(180deg)" }} />
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type !== "error";
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 top-3 z-50 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-lg"
      style={{
        background: "rgba(10,14,24,0.95)",
        borderColor: ok ? `${C.green}55` : "#FF525255",
        color: ok ? C.green : "#FF7A7A",
      }}
    >
      {ok ? <Check size={14} /> : <X size={14} />} {toast.msg}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SAVE / LOAD (localStorage)
// ---------------------------------------------------------------------------
// This build has no backend/database, so all progress previously lived only
// in React state — it reset to the hardcoded demo values every time the Mini
// App was closed and reopened (that's why balance/daily-streak never seemed
// to change). We now persist progress to the browser's localStorage, keyed
// per device. It does NOT sync across devices — a real multi-device account
// system would need a backend (e.g. keyed by the Telegram user id).
const SAVE_KEY = "core_miner_save_v2";
function loadSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// BACKEND SYNC (Redis-backed progress + real network stats)
// ---------------------------------------------------------------------------
// Thin wrappers around the two API routes. All failures are swallowed and
// logged only — the app must keep working from localStorage alone if the
// network/API is unreachable (matches the existing "safe to use outside
// Telegram" philosophy).
async function apiLoadPlayer(initData) {
  try {
    const res = await fetch(`/api/player?initData=${encodeURIComponent(initData)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.exists ? data.progress : null;
  } catch (err) {
    console.warn("apiLoadPlayer failed:", err);
    return null;
  }
}

async function apiSavePlayer(initData, progress, claimedDelta) {
  try {
    await fetch("/api/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, progress, claimedDelta }),
    });
  } catch (err) {
    console.warn("apiSavePlayer failed:", err);
  }
}

async function apiLoadStats() {
  try {
    const res = await fetch("/api/stats");
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? { activeMiners: data.activeMiners, totalMined: data.totalMined } : null;
  } catch (err) {
    console.warn("apiLoadStats failed:", err);
    return null;
  }
}

async function apiLoadReferrals(initData) {
  try {
    const res = await fetch(`/api/referral?initData=${encodeURIComponent(initData)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? data.invitedFriends : null;
  } catch (err) {
    console.warn("apiLoadReferrals failed:", err);
    return null;
  }
}

async function apiSubmitReferral(initData, referrerCode) {
  try {
    const res = await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, referrerCode }),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.warn("apiSubmitReferral failed:", err);
    return null;
  }
}

// Logs a TON deposit after TonConnect has broadcast it (see api/deposit.js).
// This only records the tx for reconciliation — CORE is credited optimistically
// on the client the moment the wallet confirms the send.
async function apiSubmitDeposit(initData, { txHash, tonAmount, coreAmount, walletAddress }) {
  try {
    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, txHash, tonAmount, coreAmount, walletAddress }),
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.warn("apiSubmitDeposit failed:", err);
    return null;
  }
}

// Queues a CORE withdrawal request for manual review (see api/withdraw.js).
async function apiSubmitWithdraw(initData, { coreAmount, walletAddress }) {
  try {
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, coreAmount, walletAddress }),
    });
    return res.ok ? await res.json() : { ok: false, error: "network_error" };
  } catch (err) {
    console.warn("apiSubmitWithdraw failed:", err);
    return { ok: false, error: "network_error" };
  }
}

// ---------------------------------------------------------------------------
// MAIN APP
// ---------------------------------------------------------------------------
export default function CoreMiningApp() {
  const { tg, user, initData, startParam, isTelegram, haptic: hapticRaw, hapticNotify: hapticNotifyRaw } = useTelegram();
  // Read the saved game once per mount (lazy ref, not re-read every render).
  const savedGameRef = useRef(null);
  if (savedGameRef.current === null) savedGameRef.current = loadSavedGame();
  const savedGame = savedGameRef.current;

  // ---- Settings -------------------------------------------------------------
  // Music/SFX toggles drive the synthesized sound engine (see ./sound.js) —
  // SFX rides the existing haptic()/hapticNotify() wrappers below, and music
  // starts on the player's first tap (browsers block audio before a real
  // user gesture). Vibration gates the same wrappers' haptic calls (with a
  // navigator.vibrate() fallback outside Telegram). Notifications is synced
  // to the backend as part of `progress` (see persistRef below) and read by
  // api/notify-cron.js, which is what actually sends the Telegram bot
  // messages — this toggle itself does nothing client-side beyond opting
  // in/out. Language is what a future i18n pass would read.
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [musicOn, setMusicOn] = useState(savedGame.musicOn ?? true);
  const [sfxOn, setSfxOn] = useState(savedGame.sfxOn ?? true);
  const [vibrationOn, setVibrationOn] = useState(savedGame.vibrationOn ?? true);
  const [notificationsOn, setNotificationsOn] = useState(savedGame.notificationsOn ?? true);
  const SUPPORTED_LANGS = ["en", "id", "ru", "zh"];
  const [language, setLanguage] = useState(
    SUPPORTED_LANGS.includes(savedGame.language) ? savedGame.language : "en"
  );
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [sendingKitKey, setSendingKitKey] = useState(null);
  const t = useCallback(makeTranslator(language), [language]);
  // Wrapping here means every existing haptic("light")/hapticNotify(...)
  // call site elsewhere in the app automatically respects the Vibration
  // toggle, with no changes needed at each call site. Sound effects ride
  // along the same wrappers for the same reason — one place to gate SFX
  // behind the Settings toggle instead of touching 50+ call sites.
  const haptic = useCallback((style) => {
    if (vibrationOn) hapticRaw(style);
    soundEngine.playSfx(style);
  }, [vibrationOn, hapticRaw]);
  const hapticNotify = useCallback((type) => {
    if (vibrationOn) hapticNotifyRaw(type);
    soundEngine.playNotify(type);
  }, [vibrationOn, hapticNotifyRaw]);

  // Keep the sound engine's enabled flags in sync with Settings.
  useEffect(() => { soundEngine.setSfxEnabled(sfxOn); }, [sfxOn]);
  useEffect(() => { soundEngine.setMusicEnabled(musicOn); }, [musicOn]);
  // Browsers block audio until a real user gesture — start music on the
  // first tap anywhere rather than on mount, so it isn't silently blocked.
  useEffect(() => {
    if (!musicOn) return;
    const startOnce = () => { soundEngine.startMusic(); window.removeEventListener("pointerdown", startOnce); };
    window.addEventListener("pointerdown", startOnce, { once: true });
    return () => window.removeEventListener("pointerdown", startOnce);
  }, [musicOn]);
  const [tab, setTab] = useState("home");
  // NOTE: these used to default to hardcoded "demo showcase" numbers
  // (balance 24.85, level 12, xp 8540, totalEarned 1248.35) so the app never
  // looked empty in screenshots. But for an actual new user (no savedGame
  // yet) those demo numbers became their real starting stats, and — since
  // the welcome-grant effect below ADDS its bonus on top of `balance`
  // instead of setting it — a new user ended up with 24.85 + 10 CORE
  // instead of just the intended 10 CORE welcome grant. Starting everyone
  // at true zero/starter values means the welcome grant is the only thing
  // that sets a new user's starting balance/rig, as intended.
  const [balance, setBalance] = useState(savedGame.balance ?? 0);
  const [pending, setPending] = useState(savedGame.pending ?? 0);
  const [energy, setEnergy] = useState(savedGame.energy ?? 460); // ~92% of MAX_ENERGY_KWH, same starting fraction as before
  // storageCap is derived below (after income is computed) — see effectiveIncomePerHour.
  // (Storage % itself is now derived directly from pending/storageCap below,
  // not tracked as separate state — see storagePct.)
  const [level, setLevel] = useState(savedGame.level ?? 1);
  const [xp, setXp] = useState(savedGame.xp ?? 0);
  const xpToNext = 12000 + level * 400;
  const [totalEarned, setTotalEarned] = useState(savedGame.totalEarned ?? 0);
  const [toast, setToast] = useState(null);
  // Store the selected rig's ID, not the rig object itself — otherwise
  // toggling/repairing/upgrading a rig updates `owned` but this old object
  // snapshot stays stale, so the detail card can visually lag behind the
  // real state. Deriving `selectedRig` fresh from `owned` every render
  // (right after `owned` is declared below) keeps it always in sync.
  const [selectedRigId, setSelectedRigId] = useState(null);
  const [marketFilter, setMarketFilter] = useState("Rigs");

  // Was previously seeded with 3 demo showcase rigs (Quantum/Hyper/Pro) so
  // the Inventory/Home tabs never looked empty in screenshots. For a real
  // new user this stacked on top of the welcome-grant Starter Rig below,
  // handing out 4 rigs (~19,600 CORE worth) instead of just the intended
  // starter kit. Starts empty now — the welcome-grant effect is solely
  // responsible for a new user's first rig.
  const [owned, setOwned] = useState(savedGame.owned ?? []);
  const selectedRig = (selectedRigId && owned.find((r) => r.id === selectedRigId)) || null;
  const [componentInventory, setComponentInventory] = useState(savedGame.componentInventory ?? {}); // { [componentKey]: [{id, durability}] }
  // Crafting materials — simple counts, unlike componentInventory (no
  // per-unit durability to track since a material is just a stack of parts).
  const [materialInventory, setMaterialInventory] = useState(savedGame.materialInventory ?? {}); // { [materialKey]: count }
  const [questClaimed, setQuestClaimed] = useState(savedGame.questClaimed ?? []);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showCodexModal, setShowCodexModal] = useState(false);
  const [featuredRigId, setFeaturedRigId] = useState(savedGame.featuredRigId ?? null); // manually pinned rig instance for Home hero
  const [activeBooster, setActiveBooster] = useState(savedGame.activeBooster ?? null); // { key, name, boostPct, expiresAt }
  const [nowTick, setNowTick] = useState(Date.now());
  // Real elapsed-time tracker for the tick effect below — using an actual
  // timestamp delta (instead of assuming exactly 1s passed) keeps energy
  // drain/durability wear correct even if the browser throttles the timer
  // (e.g. a backgrounded tab), instead of silently falling behind.
  //
  // BUGFIX: this used to always start at `Date.now()` on every mount, which
  // meant closing the app and reopening it later reset the clock to "now" —
  // so the very first tick's deltaHours was ~0 and none of the offline time
  // was ever counted, even though the server is a real-time simulation.
  // Seeding it from the persisted `lastActiveAt` (falling back to "now" only
  // for a genuinely fresh install) makes the first tick after reopening
  // compute the real elapsed offline duration, so pending CORE/energy drain/
  // durability wear all catch up exactly like they would have if the app
  // had stayed open.
  const lastTickRef = useRef(savedGame.lastActiveAt ?? Date.now());
  // Was: dailyStreak defaulted to 3 with lastClaimDate defaulted to
  // "yesterday", so dailyCurrentDay = (3 % 7) + 1 = 4 for every new user —
  // the daily bonus opened straight to Day 4 instead of Day 1. Defaulting
  // both to "never claimed" (streak 0, no last-claim date) makes
  // streakContinuing false on a fresh install, so dailyCurrentDay correctly
  // falls through to 1.
  const [dailyStreak, setDailyStreak] = useState(savedGame.dailyStreak ?? 0);
  const [lastClaimDate, setLastClaimDate] = useState(savedGame.lastClaimDate ?? null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [repairsCount, setRepairsCount] = useState(savedGame.repairsCount ?? 0);
  const [achievementsClaimed, setAchievementsClaimed] = useState(savedGame.achievementsClaimed ?? []);
  const [missionProgress, setMissionProgress] = useState(savedGame.missionProgress ?? { claims: 0, purchases: 0, upgrades: 0 });
  const [missionClaimed, setMissionClaimed] = useState(savedGame.missionClaimed ?? []);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const missionDateRef = useRef(new Date().toDateString());

  // ---- Inbox / notifications ------------------------------------------------
  // Bell icon on Home opens an email-inbox-style modal: a list of event/
  // system messages, some of which carry a claimable CORE/energy reward.
  // Seeded with a couple of starter messages so the inbox isn't empty on a
  // fresh install; real events (drops, promos, server announcements) would
  // get pushed into this same array from the backend later.
  const [inboxItems, setInboxItems] = useState(
    savedGame.inboxItems ?? [
      {
        id: "welcome",
        title: "Welcome to CORE",
        body: "Thanks for joining — here's a starter bonus to help your first rig run longer.",
        reward: { core: 2, energy: 5 },
        read: false,
        claimed: false,
        ts: Date.now(),
      },
      {
        id: "weekend_event",
        title: "Weekend Boost Event",
        body: "Mining income is boosted across the network this weekend. Claim your event bonus before it ends.",
        reward: { core: 1.5 },
        read: false,
        claimed: false,
        ts: Date.now(),
      },
    ]
  );
  const [showInboxModal, setShowInboxModal] = useState(false);
  const unreadInboxCount = inboxItems.filter((n) => !n.read).length;

  const openInbox = () => {
    haptic("light");
    setShowInboxModal(true);
    setInboxItems((items) => items.map((n) => ({ ...n, read: true })));
  };

  const claimInboxReward = (id) => {
    const item = inboxItems.find((n) => n.id === id);
    if (!item || item.claimed || !item.reward) return;
    haptic("medium");
    if (item.reward.core) setBalance((b) => b + item.reward.core);
    if (item.reward.energy) setEnergy((e) => Math.min(MAX_ENERGY_KWH, e + item.reward.energy));
    setInboxItems((items) => items.map((n) => (n.id === id ? { ...n, claimed: true, read: true } : n)));
    notify(`Claimed ${[item.reward.core ? `${fmt(item.reward.core)} CORE` : null, item.reward.energy ? `${item.reward.energy} kWh` : null].filter(Boolean).join(" + ")}`);
  };

  // ---- Referral -----------------------------------------------------------
  // Stable per-session code derived from the Telegram user id when available;
  // falls back to a random one in preview mode (outside Telegram).
  const [referralCode] = useState(() =>
    user?.id ? `CORE${user.id}` : `CORE${Math.floor(100000 + Math.random() * 900000)}`
  );
  // Was seeded with 2 fake friends (Bagas, Wulan) so the modal wasn't empty
  // on a fresh install — but that also counted toward this new user's real
  // referral milestone progress (see invitedFriends.length checks below).
  // Starts empty now; a real user's referred-friends list should only ever
  // come from actual referral signups via the backend.
  const [invitedFriends, setInvitedFriends] = useState(savedGame.invitedFriends ?? []);
  const [referralMilestonesClaimed, setReferralMilestonesClaimed] = useState(savedGame.referralMilestonesClaimed ?? []);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const [pools, setPools] = useState(savedGame.pools ?? INITIAL_POOLS);
  const [joinedPoolId, setJoinedPoolId] = useState(savedGame.joinedPoolId ?? null);
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState(null);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [listings, setListings] = useState(savedGame.listings ?? INITIAL_LISTINGS);
  const [showSellModal, setShowSellModal] = useState(false);
  const yourDisplayName = user?.first_name || "You";

  // ---- Onboarding boost ---------------------------------------------------
  // accountCreatedAt/welcomeGrantClaimed now come from the local save (see
  // SAVE_KEY below) when one exists, and only fall back to "now"/false for a
  // genuinely fresh install.
  const [accountCreatedAt] = useState(() => savedGame.accountCreatedAt ?? Date.now());
  const [welcomeGrantClaimed, setWelcomeGrantClaimed] = useState(savedGame.welcomeGrantClaimed ?? false);
  const newMinerBoostActive = nowTick - accountCreatedAt < NEW_MINER_BOOST_HOURS * 3600 * 1000;
  const newMinerMultiplier = newMinerBoostActive ? 1 + NEW_MINER_BOOST_PCT / 100 : 1;

  // ---- Persistence ----------------------------------------------------------
  // Keep a ref that always mirrors the latest game state (cheap — just an
  // assignment on every render, no re-render triggered by it) and flush it to
  // localStorage on an interval plus whenever the Mini App is
  // backgrounded/closed, instead of writing on every single state change
  // (balance/energy tick every ~1s, which would mean writing every second).
  const persistRef = useRef({});
  persistRef.current = {
    balance, pending, energy, level, xp, totalEarned, owned, componentInventory,
    materialInventory, questClaimed,
    featuredRigId, activeBooster, dailyStreak, lastClaimDate, repairsCount,
    achievementsClaimed, missionProgress, missionClaimed, invitedFriends,
    referralMilestonesClaimed, pools, joinedPoolId, listings, inboxItems,
    musicOn, sfxOn, vibrationOn, notificationsOn, language,
    accountCreatedAt, welcomeGrantClaimed,
  };
  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(
          SAVE_KEY,
          JSON.stringify({ ...persistRef.current, lastActiveAt: Date.now() })
        );
      } catch {
        // localStorage can throw (private mode, quota, etc.) — safe to ignore,
        // just means this particular save attempt is skipped.
      }
    };
    const id = setInterval(save, 5000);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", save);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", save);
      save();
    };
  }, []);

  // ---- Backend sync (Redis via /api/player, /api/stats) --------------------
  // Tracks how much of `totalEarned` has already been reported to the server
  // so we only ever add each CORE once to the global "Total CORE mined"
  // counter, even though totalEarned itself is saved in full each time.
  const lastSyncedTotalEarnedRef = useRef(savedGame.totalEarned ?? 0);
  const hasLoadedServerProgressRef = useRef(false);

  const applyServerProgress = useCallback((p) => {
    if (!p) return;
    if (typeof p.balance === "number") setBalance(p.balance);
    if (typeof p.pending === "number") setPending(p.pending);
    if (typeof p.energy === "number") setEnergy(p.energy);
    if (typeof p.level === "number") setLevel(p.level);
    if (typeof p.xp === "number") setXp(p.xp);
    if (typeof p.totalEarned === "number") {
      setTotalEarned(p.totalEarned);
      lastSyncedTotalEarnedRef.current = p.totalEarned;
    }
    if (Array.isArray(p.owned)) setOwned(p.owned);
    if (p.componentInventory && typeof p.componentInventory === "object") setComponentInventory(p.componentInventory);
    if (p.materialInventory && typeof p.materialInventory === "object") setMaterialInventory(p.materialInventory);
    if (Array.isArray(p.questClaimed)) setQuestClaimed(p.questClaimed);
    if ("featuredRigId" in p) setFeaturedRigId(p.featuredRigId);
    if ("activeBooster" in p) setActiveBooster(p.activeBooster);
    if (typeof p.dailyStreak === "number") setDailyStreak(p.dailyStreak);
    if ("lastClaimDate" in p) setLastClaimDate(p.lastClaimDate);
    if (typeof p.repairsCount === "number") setRepairsCount(p.repairsCount);
    if (Array.isArray(p.achievementsClaimed)) setAchievementsClaimed(p.achievementsClaimed);
    if (p.missionProgress && typeof p.missionProgress === "object") setMissionProgress(p.missionProgress);
    if (Array.isArray(p.missionClaimed)) setMissionClaimed(p.missionClaimed);
    // invitedFriends intentionally NOT restored here — it's authoritatively
    // sourced from /api/referral (server-validated), not the generic
    // progress blob, so a stale local copy can never clobber it.
    if (Array.isArray(p.referralMilestonesClaimed)) setReferralMilestonesClaimed(p.referralMilestonesClaimed);
    if (Array.isArray(p.pools)) setPools(p.pools);
    if ("joinedPoolId" in p) setJoinedPoolId(p.joinedPoolId);
    if (Array.isArray(p.listings)) setListings(p.listings);
    if (typeof p.musicOn === "boolean") setMusicOn(p.musicOn);
    if (typeof p.sfxOn === "boolean") setSfxOn(p.sfxOn);
    if (typeof p.vibrationOn === "boolean") setVibrationOn(p.vibrationOn);
    if (typeof p.notificationsOn === "boolean") setNotificationsOn(p.notificationsOn);
    if (typeof p.language === "string") setLanguage(p.language);
    if (typeof p.welcomeGrantClaimed === "boolean") setWelcomeGrantClaimed(p.welcomeGrantClaimed);
  }, []);

  // Load from the server once, on first mount inside Telegram. The server
  // copy (if any) wins over whatever's in localStorage on this device, since
  // it's the cross-device source of truth. If there's no server copy yet
  // (brand-new player) or the request fails, we just keep using local state.
  useEffect(() => {
    if (!isTelegram || !initData || hasLoadedServerProgressRef.current) return;
    hasLoadedServerProgressRef.current = true;
    apiLoadPlayer(initData).then((progress) => {
      if (progress) applyServerProgress(progress);
    });
  }, [isTelegram, initData, applyServerProgress]);

  // Push progress to the server on the same cadence as the localStorage
  // save. claimedDelta is however much totalEarned grew since the last
  // successful sync — that's what gets added to the real, global
  // "Total CORE mined" counter (see api/player.js + api/stats.js).
  useEffect(() => {
    if (!isTelegram || !initData) return;
    const sync = () => {
      const delta = Math.max(0, persistRef.current.totalEarned - lastSyncedTotalEarnedRef.current);
      apiSavePlayer(initData, persistRef.current, delta);
      lastSyncedTotalEarnedRef.current = persistRef.current.totalEarned;
    };
    const id = setInterval(sync, 5000);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", sync);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", sync);
    };
  }, [isTelegram, initData]);

  // Real network stats (Active Miners / Total CORE mined), aggregated from
  // every player's saved progress server-side. Public endpoint — polled
  // regardless of Telegram/auth state. null while loading; consumers below
  // fall back to the presentational simulation only until the first
  // successful response lands.
  const [serverStats, setServerStats] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const poll = () => apiLoadStats().then((s) => { if (s && !cancelled) setServerStats(s); });
    poll();
    const id = setInterval(poll, 25000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Referral: if this session was opened via someone's link
  // (?startapp=CORE<id>), report it once so the server can validate and
  // credit it (see api/referral.js — same-IP-as-referrer or a reused IP
  // under that referrer both get rejected there, not here). The server is
  // idempotent per invitee, so an accidental double-call is harmless.
  const referralSubmittedRef = useRef(false);
  useEffect(() => {
    if (!isTelegram || !initData || !startParam || referralSubmittedRef.current) return;
    if (startParam === referralCode) return; // opened your own link — ignore
    referralSubmittedRef.current = true;
    apiSubmitReferral(initData, startParam);
  }, [isTelegram, initData, startParam, referralCode]);

  // Load this player's own real, server-validated invited-friends list
  // (drives the Referral modal + milestone progress). Overrides whatever
  // was in localStorage, since the server is the source of truth here.
  useEffect(() => {
    if (!isTelegram || !initData) return;
    apiLoadReferrals(initData).then((list) => {
      if (list) setInvitedFriends(list);
    });
  }, [isTelegram, initData]);

  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    hapticNotify(type === "error" ? "error" : "success");
    clearTimeout(notify._t);
    notify._t = setTimeout(() => setToast(null), 2200);
  }, [hapticNotify]);

  // One-time welcome grant for a new account: full energy top-up and a free
  // Starter Rig always apply, so the very first session never stalls on an
  // empty energy bar or an empty rig list. The CORE credit on top of that is
  // a launch promo — only accounts created within WELCOME_PROMO_DAYS of
  // GENESIS_DATE get it (see WELCOME_PROMO_END above); everyone who joins
  // after the promo window still gets the energy + rig, just no CORE.
  // The gifted rig is marked tradeable: false (enforced in listRigForSale +
  // SellItemModal below) so it can't be instantly flipped on the
  // Marketplace for free CORE — it has to actually be used to mine. Runs
  // once (guarded by welcomeGrantClaimed); in production this should also
  // check a persisted backend flag so returning users never get it twice.
  useEffect(() => {
    if (welcomeGrantClaimed) return;
    const promoActive = Date.now() < WELCOME_PROMO_END;
    if (promoActive) {
      setBalance((b) => b + WELCOME_GRANT_CORE);
      setTotalEarned((t) => t + WELCOME_GRANT_CORE);
    }
    setEnergy(NEW_MINER_START_ENERGY_KWH);
    const starter = RIG_CATALOG.find((r) => r.key === "starter");
    setOwned((o) => [
      ...o,
      {
        id: `welcome-starter-${Date.now()}`,
        key: starter.key,
        name: starter.name,
        rarity: starter.rarity,
        basePower: starter.basePower,
        baseCost: starter.baseCost,
        level: 1,
        durability: 100,
        active: true,
        tradeable: false,
        slots: Array(SLOT_CAPACITY[starter.rarity] ?? 2).fill(null),
      },
    ]);
    setWelcomeGrantClaimed(true);
    notify(
      promoActive
        ? `Welcome! +${WELCOME_GRANT_CORE} CORE, a free Starter Rig & ${NEW_MINER_START_ENERGY_KWH} kWh energy — New Miner Boost active for 48h`
        : `Welcome! A free Starter Rig & ${NEW_MINER_START_ENERGY_KWH} kWh energy — New Miner Boost active for 48h`
    );
  }, [welcomeGrantClaimed, notify]);

  const addXp = useCallback((amount) => {
    setXp((prevXp) => {
      let newXp = prevXp + amount;
      let newLevel = level;
      let threshold = 12000 + newLevel * 400;
      while (newXp >= threshold) {
        newXp -= threshold;
        newLevel += 1;
        threshold = 12000 + newLevel * 400;
      }
      if (newLevel !== level) {
        setLevel(newLevel);
        notify(`Level up! You're now Level ${newLevel}`);
        soundEngine.playFanfare();
      }
      return newXp;
    });
  }, [level, notify]);

  // Rigs that are switched off (active === false) contribute nothing —
  // no hash power, no component power/boost, and (below) no durability wear.
  const activeOwned = owned.filter((r) => r.active !== false);
  // Each installed component carries its own durability AND inherits its
  // host rig's durability, so we tag every slot with the rig it came from
  // before flattening — that's what lets the power/boost math below apply
  // both durability penalties at once.
  const installedComponents = activeOwned.flatMap((r) =>
    (r.slots || [])
      .filter(Boolean)
      .map((slot) => ({ ...slot, rigDurability: r.durability ?? 100 }))
  );
  // A component's contribution is scaled down by BOTH its own durability
  // and its host rig's durability (each 0–100, applied as independent
  // 0–1 multipliers) — a worn GPU in a worn rig loses output twice over,
  // not once. Fully-repaired component + fully-repaired rig = full value.
  const componentPower = installedComponents.reduce((sum, inst) => {
    const c = COMPONENT_CATALOG.find((x) => x.key === inst.key);
    if (!c) return sum;
    const compDurabilityFactor = (inst.durability ?? 100) / 100;
    const rigDurabilityFactor = (inst.rigDurability ?? 100) / 100;
    return sum + c.power * compDurabilityFactor * rigDurabilityFactor;
  }, 0);
  // % income boost from installed GPUs. Applied as a multiplier (like a
  // booster) instead of a flat CORE/hour add-on, so it still scales with
  // networkRewardRate (halving/difficulty) and still gets taxed by pool fees.
  const componentBoostPct = installedComponents.reduce((sum, inst) => {
    const c = COMPONENT_CATALOG.find((x) => x.key === inst.key);
    if (!c) return sum;
    const compDurabilityFactor = (inst.durability ?? 100) / 100;
    const rigDurabilityFactor = (inst.rigDurability ?? 100) / 100;
    return sum + c.boostPct * compDurabilityFactor * rigDurabilityFactor;
  }, 0);
  const componentBoostMultiplier = 1 + componentBoostPct / 100;

  const boosterActive = !!(activeBooster && activeBooster.expiresAt > nowTick);
  const boosterMultiplier = boosterActive ? 1 + activeBooster.boostPct / 100 : 1;

  const rigEffectivePower = (r) => r.basePower * (1 + (r.level - 1) * 0.18) * ((r.durability ?? 100) / 100);

  const miningPower = activeOwned.reduce((sum, r) => sum + rigEffectivePower(r), 0) + componentPower;

  // Live per-hour energy draw of every currently-active rig, summed in real
  // kWh (same stat shown per rig in Market/Upgrade) — used by the tick
  // effect below to drain the shared energy pool, so the number on Home is
  // the actual real-world-equivalent power draw, not an abstract rate.
  const totalEnergyPerHourActive = activeOwned.reduce((sum, r) => {
    const cat = RIG_CATALOG.find((c) => c.key === r.key);
    return sum + (cat?.kwh ?? 1);
  }, 0);

  // Live values ACHIEVEMENTS' `metric` field looks up (see catalog above).
  const metrics = {
    rigCount: owned.length,
    installedCount: installedComponents.length,
    repairsCount,
    dailyStreak,
    maxFillRatio: owned.length
      ? Math.max(...owned.map((r) => (r.slots && r.slots.length ? r.slots.filter(Boolean).length / r.slots.length : 0)))
      : 0,
    miningPower,
    totalEarned,
    // Extra fields used only by QUESTS (see catalog above) — kept separate
    // from the ACHIEVEMENTS-era fields above for clarity, same object so
    // both features can share the identical claim/progress-bar pattern.
    level,
    invitedCount: invitedFriends.length,
    poolJoined: joinedPoolId ? 1 : 0,
  };

  // ---- Network / tokenomics ---------------------------------------------
  // Max supply 100,000,000 CORE. 80% (80M) is released purely through
  // mining with a yearly halving schedule (Year 1 = 20,000,000 CORE, then
  // -50% every year after — same shape as Bitcoin's block-reward halving).
  // The remaining 20% is pre-allocated at genesis: 10% marketing, 5%
  // reserve, 5% founder. The live mining emission for "this instant" is
  // split across ALL active hashrate on the network (every rig + every
  // pool's members, everywhere) — so as network hashrate/difficulty rises,
  // the reward per TH/s falls and each CORE gets harder (more valuable) to
  // mine, exactly like real difficulty adjustment.
  const schedule = getNetworkSchedule(nowTick);
  const networkBaseHashrate = NETWORK_BASE_HASHRATE * (1 + 0.03 * Math.sin(nowTick / 600000));
  const poolNetworkHashrate = pools.reduce(
    (s, p) => s + p.members.reduce((s2, m) => s2 + m.hashrate, 0),
    0
  );
  const networkHashrateTotal = networkBaseHashrate + poolNetworkHashrate + miningPower;
  // CORE earned per TH/s per hour, right now, network-wide.
  const networkRewardRate =
    networkHashrateTotal > 0 ? (schedule.emissionPerSecond * 3600) / networkHashrateTotal : 0;

  // "Active miners" — a simulated live headcount for the network status
  // display (there's no real multi-user backend here, so this is modeled
  // the same way networkBaseHashrate is: a curve anchored to GENESIS_DATE
  // plus a gentle sine wave for tick-to-tick liveliness). Starts small
  // (a handful of genesis miners) right after launch and grows toward the
  // NETWORK_BASE_MINERS plateau over ~1-2 months, so it doesn't jump
  // straight to a large "mature network" number the instant mining opens.
  const daysSinceGenesis = Math.max(0, (nowTick - GENESIS_DATE) / 86400000);
  const minerGrowthProgress = 1 - Math.exp(-daysSinceGenesis / 30); // 0 at day 0, ~95% by ~day 90
  const networkActiveMinersBase =
    MINER_LAUNCH_COUNT + (NETWORK_BASE_MINERS - MINER_LAUNCH_COUNT) * minerGrowthProgress;
  const networkActiveMiners = Math.round(
    networkActiveMinersBase *
      (1 + 0.05 * Math.sin(nowTick / 900000) + 0.02 * Math.sin(nowTick / 137000))
  );

  // Real, server-aggregated versions of the two "network" display stats —
  // these are what's actually shown in HomeTab/NetworkStatsModal. Falls
  // back to the presentational simulation above only until the first
  // /api/stats response lands (avoids a "0 miners" flash on first paint).
  const displayActiveMiners = serverStats?.activeMiners ?? networkActiveMiners;
  const realTotalMined = serverStats?.totalMined ?? schedule.totalMined;
  const displaySchedule = {
    ...schedule,
    totalMined: realTotalMined,
    percentMined: Math.min(100, (realTotalMined / MINING_POOL_SUPPLY) * 100),
  };

  const incomePerHour =
    activeOwned.reduce((sum, r) => sum + rigEffectivePower(r) * networkRewardRate, 0) *
    componentBoostMultiplier *
    boosterMultiplier *
    newMinerMultiplier;

  // Pool mining: your income is your hashrate's share of the pool's total
  // output (at the same network reward rate as solo mining), after the
  // owner's royalty fee is taken off the top. Bigger pools also earn a
  // synergy bonus (up to +10% at a full 200-member pool) for coordinating
  // more hashrate together. The owner still earns their own normal share
  // on top of the royalty.
  const joinedPool = pools.find((p) => p.id === joinedPoolId) || null;
  const isPoolOwner = joinedPool?.ownerId === "you";
  const poolBotHashrate = joinedPool ? joinedPool.members.reduce((s, m) => s + m.hashrate, 0) : 0;
  const poolTotalHashrate = poolBotHashrate + miningPower;
  const poolMemberCount = joinedPool ? joinedPool.members.length + 1 : 0;
  const poolSynergyBonusPct = joinedPool
    ? Math.min(POOL_SYNERGY_MAX_BONUS, (poolMemberCount / POOL_MAX_MEMBERS) * POOL_SYNERGY_MAX_BONUS)
    : 0;
  const poolGrossIncome = poolTotalHashrate * networkRewardRate * (1 + poolSynergyBonusPct / 100);
  const poolRoyalty = joinedPool ? poolGrossIncome * (joinedPool.feePct / 100) : 0;
  const poolDistributable = poolGrossIncome - poolRoyalty;
  const yourPoolShareRatio = joinedPool && poolTotalHashrate > 0 ? miningPower / poolTotalHashrate : 0;
  const poolIncomePerHour = joinedPool
    ? poolDistributable * yourPoolShareRatio * componentBoostMultiplier * boosterMultiplier * newMinerMultiplier +
      (isPoolOwner ? poolRoyalty : 0)
    : 0;
  const effectiveIncomePerHour = joinedPool ? poolIncomePerHour : incomePerHour;

  // storageCap = max CORE that can sit unclaimed before it's wasted. Fixed
  // at a tiny "5" before, which meant most income above a trickle was lost
  // the moment a player's rig got even slightly strong. Now it scales with
  // actual earning power — roughly 4 hours of buffer — with a floor so a
  // brand-new player still has room to breathe.
  const storageCap = Math.max(100, Math.round(effectiveIncomePerHour * 4));
  // Storage bar = how full the unclaimed-CORE buffer is, computed straight
  // from pending/storageCap every render. Previously this was a separate
  // piece of state seeded at a hardcoded 48% and nudged by a disconnected
  // formula each tick, so it could show e.g. "48% full" while `pending` was
  // still near 0 — confusing since the two numbers had nothing to do with
  // each other. Deriving it directly guarantees the bar always matches the
  // CORE amount shown right below it.
  const storagePct = storageCap > 0 ? Math.min(100, (pending / storageCap) * 100) : 0;

  // Refs mirroring the latest derived values, kept in sync every render.
  // The passive tick effect below reads from these instead of listing them
  // as dependencies — previously the effect depended on
  // [effectiveIncomePerHour, energy, storageCap, totalEnergyPerHourActive],
  // all of which change on almost every single tick, so React was tearing
  // down and recreating the setInterval every ~1 second, forever, for the
  // entire time the app was mounted. That constant churn — on top of a
  // full-tree re-render every second from setNowTick — is what made the UI
  // (most noticeably a modal like Achievements, sitting on top of blurred/
  // animated backgrounds) feel like it was freezing, especially on slower
  // phones inside the Telegram WebView. Using refs lets the interval be
  // created once and just read live values each tick.
  const effectiveIncomeRef = useRef(effectiveIncomePerHour);
  effectiveIncomeRef.current = effectiveIncomePerHour;
  const storageCapRef = useRef(storageCap);
  storageCapRef.current = storageCap;
  const totalEnergyPerHourRef = useRef(totalEnergyPerHourActive);
  totalEnergyPerHourRef.current = totalEnergyPerHourActive;
  const energyRef = useRef(energy);
  energyRef.current = energy;
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const notifyRef = useRef(notify);
  notifyRef.current = notify;

  // passive tick — created once (empty dep array) instead of every second.
  useEffect(() => {
    // Sanity cap on a single catch-up jump (e.g. a corrupted/very old
    // timestamp) — 30 days is far more than enough since pending is already
    // capped by storageCap and energy floors at 0 either way.
    const MAX_CATCHUP_HOURS = 24 * 30;
    let firstTick = true;
    const id = setInterval(() => {
      const now = Date.now();
      const rawDeltaHours = Math.max(0, (now - lastTickRef.current) / 3600000);
      const deltaHours = Math.min(rawDeltaHours, MAX_CATCHUP_HOURS);
      lastTickRef.current = now;
      setNowTick(now);
      setActiveBooster((b) => (b && b.expiresAt <= now ? null : b));
      // Report offline earnings once, the first time this interval fires
      // after (re)opening the app — anything under ~1 minute is just normal
      // background-tab throttling, not a real "you were away" gap.
      if (firstTick) {
        firstTick = false;
        if (deltaHours > 1 / 60 && energyRef.current > 0) {
          const cap = storageCapRef.current;
          const earned = Math.min(effectiveIncomeRef.current * deltaHours, Math.max(0, cap - pendingRef.current));
          if (earned > 0) {
            notifyRef.current(`Welcome back! +${fmt(earned)} CORE mined while you were away`);
          }
        }
      }
      if (energyRef.current <= 0) return;
      const income = effectiveIncomeRef.current;
      const cap = storageCapRef.current;
      setPending((p) => Math.min(p + income * deltaHours, cap));
      setEnergy((e) => Math.max(0, e - totalEnergyPerHourRef.current * deltaHours));
      setOwned((os) =>
        os.map((r) => {
          if (r.active === false) return r;
          const wearPerHour = RIG_CATALOG.find((c) => c.key === r.key)?.wearPerHour ?? 12;
          // Installed components wear down independently of the rig while
          // it's active — each slot tracks its own durability.
          const nextSlots = (r.slots || []).map((slot) => {
            if (!slot) return slot;
            const compWearPerHour = COMPONENT_CATALOG.find((c) => c.key === slot.key)?.wearPerHour ?? 8;
            return { ...slot, durability: Math.max(0, (slot.durability ?? 100) - compWearPerHour * deltaHours) };
          });
          return {
            ...r,
            durability: Math.max(0, (r.durability ?? 100) - wearPerHour * deltaHours),
            slots: nextSlots,
          };
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Daily missions reset at midnight — check every 30s whether the date
  // has rolled over, and if so, clear progress + unlock claims again.
  useEffect(() => {
    const id = setInterval(() => {
      const today = new Date().toDateString();
      if (missionDateRef.current !== today) {
        missionDateRef.current = today;
        setMissionProgress({ claims: 0, purchases: 0, upgrades: 0 });
        setMissionClaimed([]);
      }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const claimMission = (mission) => {
    haptic("medium");
    const progress = missionProgress[mission.metric] || 0;
    if (progress < mission.target) {
      notify("Mission not complete yet", "error");
      return;
    }
    if (missionClaimed.includes(mission.key)) {
      notify("Already claimed today", "error");
      return;
    }
    setBalance((b) => b + mission.reward);
    setTotalEarned((t) => t + mission.reward);
    addXp(mission.xp);
    setMissionClaimed((mc) => [...mc, mission.key]);
    notify(`+${mission.reward} CORE — ${mission.label} complete`);
  };

  // Refs so claimAchievement (and the modal's onClose below) can stay
  // referentially stable across renders — required for the AchievementsModal
  // React.memo above to actually skip re-renders — while still always
  // reading the latest metrics/claimed list instead of a stale closure.
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;
  const achievementsClaimedRef = useRef(achievementsClaimed);
  achievementsClaimedRef.current = achievementsClaimed;

  const claimAchievement = useCallback((ach) => {
    haptic("medium");
    const progress = metricsRef.current[ach.metric] || 0;
    if (progress < ach.target) {
      notify("Not reached yet", "error");
      return;
    }
    if (achievementsClaimedRef.current.includes(ach.key)) {
      notify("Already claimed", "error");
      return;
    }
    setBalance((b) => b + ach.reward);
    setTotalEarned((t) => t + ach.reward);
    addXp(ach.xp);
    setAchievementsClaimed((c) => [...c, ach.key]);
    notify(`+${ach.reward} CORE — ${ach.label} complete`);
    soundEngine.playFanfare();
  }, [haptic, notify, addXp]);

  const closeAchievementsModal = useCallback(() => setShowAchievementsModal(false), []);

  // Same pattern as claimAchievement, but the reward is a bundle of crafting
  // materials (see QUESTS catalog) instead of a flat CORE amount.
  const questClaimedRef = useRef(questClaimed);
  questClaimedRef.current = questClaimed;

  const claimQuest = useCallback((quest) => {
    haptic("medium");
    const progress = metricsRef.current[quest.metric] || 0;
    if (progress < quest.target) {
      notify("Not reached yet", "error");
      return;
    }
    if (questClaimedRef.current.includes(quest.key)) {
      notify("Already claimed", "error");
      return;
    }
    setMaterialInventory((inv) => {
      const next = { ...inv };
      for (const m of quest.materials) next[m.key] = (next[m.key] || 0) + m.qty;
      return next;
    });
    addXp(quest.xp);
    setQuestClaimed((c) => [...c, quest.key]);
    const summary = quest.materials.map((m) => `${m.qty}× ${MATERIAL_CATALOG.find((x) => x.key === m.key)?.name ?? m.key}`).join(", ");
    notify(`${quest.label} complete — got ${summary}`);
  }, [haptic, notify, addXp]);

  const closeQuestsModal = useCallback(() => setShowQuestsModal(false), []);
  const closeCodexModal = useCallback(() => setShowCodexModal(false), []);

  const referralLink = `https://t.me/${BOT_USERNAME}/${MINI_APP_SHORT_NAME}?startapp=${referralCode}`;

  // Same stable-ref pattern as claimAchievement/closeAchievementsModal above —
  // required so ReferralModal (now React.memo'd below) can actually skip the
  // once-a-second re-render from the passive tick effect instead of
  // rebuilding its whole friend/milestone list every tick, which is what was
  // causing the modal to feel "frozen" while open.
  const invitedFriendsRef = useRef(invitedFriends);
  invitedFriendsRef.current = invitedFriends;
  const referralMilestonesClaimedRef = useRef(referralMilestonesClaimed);
  referralMilestonesClaimedRef.current = referralMilestonesClaimed;

  const shareReferral = useCallback(() => {
    haptic("light");
    const shareText = "Join me mining CORE! 🚀";
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`
      );
    } else if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => notify("Referral link copied!"))
        .catch(() => notify(`Your link: ${referralLink}`));
    } else {
      notify(`Your link: ${referralLink}`);
    }
  }, [haptic, notify, tg, referralLink]);

  const claimReferralMilestone = useCallback((ms) => {
    haptic("medium");
    const progress = invitedFriendsRef.current.length;
    if (progress < ms.target) {
      notify("Not enough friends invited yet", "error");
      return;
    }
    if (referralMilestonesClaimedRef.current.includes(ms.key)) {
      notify("Already claimed", "error");
      return;
    }
    setBalance((b) => b + ms.reward);
    setTotalEarned((t) => t + ms.reward);
    addXp(ms.xp);
    setReferralMilestonesClaimed((c) => [...c, ms.key]);
    notify(`+${ms.reward} CORE — ${ms.label} complete`);
  }, [haptic, notify, addXp]);

  const closeReferralModal = useCallback(() => setShowReferralModal(false), []);


  const claimReward = () => {
    haptic("medium");
    if (pending <= 0) {
      notify("Nothing to claim yet", "error");
      return;
    }
    setBalance((b) => b + pending);
    setTotalEarned((t) => t + pending);
    setMissionProgress((mp) => ({ ...mp, claims: mp.claims + 1 }));
    notify(`Claimed ${fmt(pending)} CORE`);
    setPending(0);
  };

  const buyRig = (rig) => {
    haptic("light");
    if (owned.length >= MAX_RIGS) {
      notify(`Rig limit reached (${MAX_RIGS}/${MAX_RIGS})`, "error");
      return;
    }
    const cost = Math.round(rig.baseCost);
    if (balance < cost) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - cost);
    const id = `${rig.key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const capacity = SLOT_CAPACITY[rig.rarity] ?? 2;
    setOwned((o) => [...o, { ...rig, id, level: 1, durability: 100, active: true, slots: Array(capacity).fill(null) }]);
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`${rig.name} acquired`);
  };

  const buyComponent = (comp) => {
    haptic("light");
    if (balance < comp.price) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - comp.price);
    setComponentInventory((inv) => ({
      ...inv,
      [comp.key]: [...(inv[comp.key] || []), makeComponentInstance(comp.key, 100)],
    }));
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`${comp.name} added to inventory`);
  };

  // Craft a component from a recipe: consumes the recipe's materials + a
  // CORE fee, produces one fresh (100% durability) unit of the output
  // component — same shape as buying it in the Market, just a cheaper
  // materials-gated path instead of a pure-CORE one.
  const craftComponent = (recipe) => {
    haptic("light");
    const comp = COMPONENT_CATALOG.find((c) => c.key === recipe.outputKey);
    if (!comp) return;
    const cost = CRAFT_COST_BY_RARITY[comp.rarity] ?? 0;
    const missing = recipe.materials.find((m) => (materialInventory[m.key] || 0) < m.qty);
    if (missing) {
      notify("Missing materials", "error");
      return;
    }
    if (balance < cost) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - cost);
    setMaterialInventory((inv) => {
      const next = { ...inv };
      for (const m of recipe.materials) next[m.key] = (next[m.key] || 0) - m.qty;
      return next;
    });
    setComponentInventory((inv) => ({
      ...inv,
      [comp.key]: [...(inv[comp.key] || []), makeComponentInstance(comp.key, 100)],
    }));
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`${comp.name} crafted`);
  };

  // Dismantle one owned, uninstalled unit of a component back into a
  // fraction of its recipe's materials (RECYCLE_REFUND_RATE) — recovers
  // value from a duplicate/unwanted craft or Market buy instead of it just
  // sitting in inventory forever.
  const recycleComponent = (compKey) => {
    haptic("light");
    const stock = componentInventory[compKey] || [];
    if (stock.length === 0) {
      notify("None in inventory", "error");
      return;
    }
    const recipe = RECIPES.find((r) => r.outputKey === compKey);
    if (!recipe) {
      notify("Can't recycle this item", "error");
      return;
    }
    // Recycle the lowest-durability unit first — keeps the best-condition
    // copies available for installing.
    const target = stock.slice().sort((a, b) => (a.durability ?? 100) - (b.durability ?? 100))[0];
    setComponentInventory((inv) => ({
      ...inv,
      [compKey]: (inv[compKey] || []).filter((u) => u.id !== target.id),
    }));
    setMaterialInventory((inv) => {
      const next = { ...inv };
      for (const m of recipe.materials) {
        next[m.key] = (next[m.key] || 0) + Math.max(1, Math.ceil(m.qty * RECYCLE_REFUND_RATE));
      }
      return next;
    });
    const comp = COMPONENT_CATALOG.find((c) => c.key === compKey);
    notify(`${comp?.name ?? "Component"} recycled for parts`);
  };

  const installComponent = (rigId, slotIndex, key, instanceId) => {
    haptic("light");
    const stock = componentInventory[key] || [];
    // Default to the freshest (highest-durability) unit in stock if no
    // specific instance was chosen.
    const inst = instanceId
      ? stock.find((u) => u.id === instanceId)
      : stock.slice().sort((a, b) => (b.durability ?? 100) - (a.durability ?? 100))[0];
    if (!inst) {
      notify("None in stock — buy one in Market", "error");
      return;
    }
    setComponentInventory((inv) => ({
      ...inv,
      [key]: (inv[key] || []).filter((u) => u.id !== inst.id),
    }));
    setOwned((os) =>
      os.map((r) =>
        r.id === rigId
          ? { ...r, slots: r.slots.map((s, i) => (i === slotIndex ? { key, durability: inst.durability ?? 100 } : s)) }
          : r
      )
    );
    notify("Component installed");
  };

  const uninstallComponent = (rigId, slotIndex) => {
    haptic("light");
    const rig = owned.find((r) => r.id === rigId);
    const slot = rig?.slots?.[slotIndex];
    if (!slot) return;
    setOwned((os) =>
      os.map((r) => (r.id === rigId ? { ...r, slots: r.slots.map((s, i) => (i === slotIndex ? null : s)) } : r))
    );
    // Returned to inventory as its own instance — its current durability
    // (however worn) travels with it, not reset to 100.
    setComponentInventory((inv) => ({
      ...inv,
      [slot.key]: [...(inv[slot.key] || []), makeComponentInstance(slot.key, slot.durability ?? 100)],
    }));
    notify("Component removed");
  };

  // Repair a single installed component back to 100% durability, separate
  // from repairing the rig itself — cost scales off the component's price.
  const repairComponent = (rigId, slotIndex) => {
    haptic("medium");
    const rig = owned.find((r) => r.id === rigId);
    const slot = rig?.slots?.[slotIndex];
    if (!slot) return;
    const missing = 100 - (slot.durability ?? 100);
    if (missing <= 0) {
      notify("Already at full durability", "error");
      return;
    }
    const comp = COMPONENT_CATALOG.find((c) => c.key === slot.key);
    const cost = Math.max(REPAIR_COST_FLOOR, Math.round((comp?.power ?? 8) * networkRewardRate * REPAIR_HOURS_COST * (missing / 100)));
    if (balance < cost) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - cost);
    setOwned((os) =>
      os.map((r) =>
        r.id === rigId
          ? { ...r, slots: r.slots.map((s, i) => (i === slotIndex ? { ...s, durability: 100 } : s)) }
          : r
      )
    );
    setRepairsCount((c) => c + 1);
    notify(`${comp?.name ?? "Component"} repaired to 100%`);
  };

  const buyBooster = (boost) => {
    haptic("light");
    if (balance < boost.price) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - boost.price);
    setActiveBooster({
      key: boost.key,
      name: boost.name,
      boostPct: boost.boostPct,
      expiresAt: Date.now() + boost.durationHours * 3600 * 1000,
    });
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`${boost.name} activated for ${boost.durationHours}h`);
  };

  const buyEnergyPack = (pack) => {
    haptic("light");
    if (energy >= MAX_ENERGY_KWH) {
      notify("Energy already full", "error");
      return;
    }
    if (balance < pack.price) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - pack.price);
    setEnergy((e) => Math.min(MAX_ENERGY_KWH, e + pack.amount));
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`+${pack.amount} kWh from ${pack.name}`);
  };

  // Mining Kit purchase: paid in real TON (sent on-chain to
  // TREASURY_TON_ADDRESS via the connected TonConnect wallet), at the
  // fixed DEPOSIT_CORE_PER_TON ratio — same treasury + same reconciliation
  // log (/api/deposit) as a regular wallet deposit. Grants the rig +
  // component + energy the moment the wallet confirms the send.
  const buyBundle = async (bundle) => {
    haptic("light");
    if (owned.length >= MAX_RIGS) {
      notify(`Rig limit reached (${MAX_RIGS}/${MAX_RIGS})`, "error");
      return;
    }
    if (!tonAddress) {
      notify("Connect your TON wallet first", "error");
      return;
    }
    const { rig, comp, price, tonPrice } = getBundlePricing(bundle);
    if (!rig || !comp) return;
    setSendingKitKey(bundle.key);
    try {
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: TREASURY_TON_ADDRESS,
            amount: String(Math.round(tonPrice * 1e9)), // TON -> nanoTON
          },
        ],
      });
      const id = `${rig.key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const capacity = SLOT_CAPACITY[rig.rarity] ?? 2;
      setOwned((o) => [...o, { ...rig, id, level: 1, durability: 100, active: true, slots: Array(capacity).fill(null) }]);
      setComponentInventory((inv) => ({
        ...inv,
        [comp.key]: [...(inv[comp.key] || []), makeComponentInstance(comp.key, 100)],
      }));
      setEnergy((e) => Math.min(MAX_ENERGY_KWH, e + bundle.energyAmount));
      setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
      haptic("success");
      notify(`${bundle.name} unlocked — ${rig.name}, ${comp.name} + ${bundle.energyAmount} kWh`);
      apiSubmitDeposit(initData, {
        txHash: result?.boc ?? null,
        tonAmount: tonPrice,
        coreAmount: price,
        walletAddress: tonAddress,
      });
    } catch (err) {
      console.warn("bundle purchase failed:", err);
      notify(
        err?.message?.toLowerCase().includes("reject")
          ? "Purchase was cancelled in your wallet."
          : "Couldn't send the transaction. Please try again.",
        "error"
      );
    } finally {
      setSendingKitKey(null);
    }
  };

  // ---- Marketplace ---------------------------------------------------------
  // List a rig you own for sale: it's snapshotted (level, durability) and
  // pulled out of `owned` — stops mining/wearing while listed. Installed
  // components are stripped back to your inventory first (rig sells bare).
  const listRigForSale = (rigId, price) => {
    haptic("light");
    const rig = owned.find((r) => r.id === rigId);
    if (!rig) return;
    if (rig.tradeable === false) {
      notify("Welcome gift rigs can't be sold", "error");
      return;
    }
    if (!price || price <= 0) {
      notify("Set a price first", "error");
      return;
    }
    const installed = (rig.slots || []).filter(Boolean);
    if (installed.length) {
      setComponentInventory((inv) => {
        const next = { ...inv };
        installed.forEach((slot) => {
          next[slot.key] = [...(next[slot.key] || []), makeComponentInstance(slot.key, slot.durability ?? 100)];
        });
        return next;
      });
    }
    setOwned((os) => os.filter((r) => r.id !== rigId));
    setListings((ls) => [
      ...ls,
      {
        id: `listing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sellerId: "you",
        sellerName: yourDisplayName,
        itemType: "rig",
        item: { key: rig.key, name: rig.name, rarity: rig.rarity, basePower: rig.basePower, level: rig.level, durability: Math.round(rig.durability ?? 100) },
        price,
        listedAt: Date.now(),
      },
    ]);
    setShowSellModal(false);
    notify(`${rig.name} listed for ${fmt(price, 0)} CORE`);
  };

  const listComponentForSale = (key, price, instanceId) => {
    haptic("light");
    const stock = componentInventory[key] || [];
    const inst = instanceId
      ? stock.find((u) => u.id === instanceId)
      : stock.slice().sort((a, b) => (b.durability ?? 100) - (a.durability ?? 100))[0];
    if (!inst) return;
    if (!price || price <= 0) {
      notify("Set a price first", "error");
      return;
    }
    const comp = COMPONENT_CATALOG.find((c) => c.key === key);
    setComponentInventory((inv) => ({
      ...inv,
      [key]: (inv[key] || []).filter((u) => u.id !== inst.id),
    }));
    setListings((ls) => [
      ...ls,
      {
        id: `listing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sellerId: "you",
        sellerName: yourDisplayName,
        itemType: "component",
        item: { key: comp.key, name: comp.name, rarity: comp.rarity, durability: Math.round(inst.durability ?? 100) },
        price,
        listedAt: Date.now(),
      },
    ]);
    setShowSellModal(false);
    notify(`${comp.name} listed for ${fmt(price, 0)} CORE`);
  };

  // Cancel your own listing: item returns to owned/inventory, no fee.
  const cancelListing = (listingId) => {
    haptic("light");
    const listing = listings.find((l) => l.id === listingId);
    if (!listing || listing.sellerId !== "you") return;
    if (listing.itemType === "rig") {
      const capacity = SLOT_CAPACITY[listing.item.rarity] ?? 2;
      setOwned((o) => [
        ...o,
        {
          id: `${listing.item.key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          key: listing.item.key,
          name: listing.item.name,
          rarity: listing.item.rarity,
          basePower: listing.item.basePower,
          level: listing.item.level,
          durability: listing.item.durability,
          active: true,
          slots: Array(capacity).fill(null),
        },
      ]);
    } else {
      setComponentInventory((inv) => ({
        ...inv,
        [listing.item.key]: [...(inv[listing.item.key] || []), makeComponentInstance(listing.item.key, listing.item.durability ?? 100)],
      }));
    }
    setListings((ls) => ls.filter((l) => l.id !== listingId));
    notify("Listing cancelled");
  };

  // Buy someone else's listing: full price leaves your balance, 95% goes to
  // the seller, 5% (MARKETPLACE_FEE_PCT) is burned — see constant comment.
  const buyListing = (listingId) => {
    haptic("light");
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    if (listing.sellerId === "you") return;
    if (balance < listing.price) {
      notify("Not enough CORE", "error");
      return;
    }
    if (listing.itemType === "rig" && owned.length >= MAX_RIGS) {
      notify(`Rig limit reached (${MAX_RIGS}/${MAX_RIGS})`, "error");
      return;
    }
    setBalance((b) => b - listing.price);
    if (listing.itemType === "rig") {
      const capacity = SLOT_CAPACITY[listing.item.rarity] ?? 2;
      setOwned((o) => [
        ...o,
        {
          id: `${listing.item.key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          key: listing.item.key,
          name: listing.item.name,
          rarity: listing.item.rarity,
          basePower: listing.item.basePower,
          level: listing.item.level,
          durability: listing.item.durability,
          active: true,
          slots: Array(capacity).fill(null),
        },
      ]);
    } else {
      setComponentInventory((inv) => ({
        ...inv,
        [listing.item.key]: [...(inv[listing.item.key] || []), makeComponentInstance(listing.item.key, listing.item.durability ?? 100)],
      }));
    }
    setListings((ls) => ls.filter((l) => l.id !== listingId));
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`Bought ${listing.item.name} for ${fmt(listing.price, 0)} CORE`);
  };

  const createPool = (name, feePct) => {
    haptic("medium");
    const trimmed = (name || "").trim();
    if (!trimmed) {
      notify("Enter a pool name", "error");
      return;
    }
    if (joinedPoolId) {
      notify("Leave your current pool first", "error");
      return;
    }
    if (miningPower <= 0) {
      notify("You need mining power to open a pool", "error");
      return;
    }
    if (balance < POOL_CREATE_COST) {
      notify("Not enough CORE to create a pool", "error");
      return;
    }
    const clampedFee = Math.min(POOL_MAX_FEE, Math.max(POOL_MIN_FEE, feePct));
    const id = `pool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setBalance((b) => b - POOL_CREATE_COST);
    setPools((ps) => [
      ...ps,
      {
        id,
        name: trimmed,
        ownerId: "you",
        ownerName: yourDisplayName,
        feePct: clampedFee,
        createdAt: Date.now(),
        members: [],
      },
    ]);
    setJoinedPoolId(id);
    setShowCreatePoolModal(false);
    setMissionProgress((mp) => ({ ...mp, purchases: mp.purchases + 1 }));
    notify(`${trimmed} pool created`);
  };

  const joinPool = (poolId) => {
    haptic("light");
    if (joinedPoolId) {
      notify("Leave your current pool first", "error");
      return;
    }
    if (miningPower <= 0) {
      notify("You need mining power to join a pool", "error");
      return;
    }
    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return;
    if (pool.members.length >= POOL_MAX_MEMBERS) {
      notify("Pool is full", "error");
      return;
    }
    setJoinedPoolId(poolId);
    notify(`Joined ${pool.name}`);
  };

  const leavePool = () => {
    haptic("light");
    if (!joinedPoolId) return;
    const pool = pools.find((p) => p.id === joinedPoolId);
    if (pool?.ownerId === "you") {
      setPools((ps) => ps.filter((p) => p.id !== joinedPoolId));
      notify(`${pool.name} disbanded`);
    } else if (pool) {
      notify(`Left ${pool.name}`);
    }
    setJoinedPoolId(null);
    setSelectedPoolId(null);
  };

  const updatePoolFee = (feePct) => {
    const clamped = Math.min(POOL_MAX_FEE, Math.max(POOL_MIN_FEE, feePct));
    setPools((ps) => ps.map((p) => (p.id === joinedPoolId ? { ...p, feePct: clamped } : p)));
  };

  const upgradeRig = (rig) => {
    haptic("light");
    const cost = upgradeCostFor(rig);
    if (balance < cost) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - cost);
    setOwned((o) => o.map((r) => (r.id === rig.id ? { ...r, level: r.level + 1 } : r)));
    setMissionProgress((mp) => ({ ...mp, upgrades: mp.upgrades + 1 }));
    notify(`${rig.name} upgraded to Lv.${rig.level + 1}`);
  };

  const repairRig = (rig) => {
    haptic("medium");
    const missing = 100 - (rig.durability ?? 100);
    if (missing <= 0) {
      notify("Already at full durability", "error");
      return;
    }
    const cost = Math.max(REPAIR_COST_FLOOR, Math.round(rig.basePower * networkRewardRate * REPAIR_HOURS_COST * (missing / 100)));
    if (balance < cost) {
      notify("Not enough CORE", "error");
      return;
    }
    setBalance((b) => b - cost);
    setOwned((o) => o.map((r) => (r.id === rig.id ? { ...r, durability: 100 } : r)));
    setMissionProgress((mp) => ({ ...mp, upgrades: mp.upgrades + 1 }));
    setRepairsCount((c) => c + 1);
    notify(`${rig.name} repaired to 100%`);
  };

  // Turns a rig on/off. An OFF rig (and any GPUs installed in it) stops
  // contributing hash power/income and stops wearing down durability —
  // it just sits idle until switched back on.
  const toggleRigActive = (rig) => {
    haptic("light");
    const turningOn = rig.active === false;
    setOwned((o) => o.map((r) => (r.id === rig.id ? { ...r, active: turningOn } : r)));
    notify(turningOn ? `${rig.name} powered on` : `${rig.name} powered off`);
  };

  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  const claimedToday = lastClaimDate === todayStr;
  const streakContinuing = lastClaimDate === yesterdayStr || claimedToday;
  const dailyCurrentDay = claimedToday ? dailyStreak : streakContinuing ? (dailyStreak % 7) + 1 : 1;

  const claimDaily = () => {
    haptic("medium");
    if (claimedToday) return;
    const reward = DAILY_REWARDS[dailyCurrentDay - 1];
    if (reward.core > 0) {
      setBalance((b) => b + reward.core);
      setTotalEarned((t) => t + reward.core);
    }
    if (reward.energy > 0) setEnergy((e) => Math.min(MAX_ENERGY_KWH, e + reward.energy));
    setDailyStreak(dailyCurrentDay);
    setLastClaimDate(todayStr);
    notify(`Day ${dailyCurrentDay}: +${formatDailyReward(reward)}`);
  };

  // Native Telegram MainButton is intentionally NOT mirrored here — the
  // in-app Claim button on Home already covers this, and showing both at
  // once looked like a duplicate "Claim" button to the user.
  useEffect(() => {
    if (!tg) return;
    tg.MainButton.hide();
  }, [tg, tab]);

  // Native Telegram BackButton — returns to Home from any other tab.
  useEffect(() => {
    if (!tg) return;
    if (tab !== "home") {
      tg.BackButton.show();
      const handler = () => setTab("home");
      tg.BackButton.onClick(handler);
      return () => tg.BackButton.offClick(handler);
    }
    tg.BackButton.hide();
  }, [tg, tab]);

  return (
    <LanguageContext.Provider value={{ language, t }}>
    <div
      className="relative w-full max-w-[420px] mx-auto h-dvh flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px) 0 0/100% 26px, " +
          "linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px) 0 0/26px 100%, " +
          "radial-gradient(circle at 50% -10%, rgba(10,109,255,0.22), transparent 45%), " +
          "radial-gradient(circle at 90% 8%, rgba(255,179,0,0.12), transparent 40%), " +
          "radial-gradient(circle at 10% 95%, rgba(143,92,255,0.14), transparent 40%), " +
          "#05070E",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Global keyframes for the futuristic UI chrome */}
      <style>{`
        @keyframes core-shine {
          from { background-position: 220% 0; }
          to { background-position: -20% 0; }
        }
        @keyframes core-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          8% { opacity: 0.5; }
          92% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes core-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -14px) scale(1.08); }
        }
        @keyframes core-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0,229,255,0.45); }
          70% { box-shadow: 0 0 0 14px rgba(0,229,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,229,255,0); }
        }
        @keyframes core-float {
          0%, 100% { transform: rotateX(38deg) rotateZ(-32deg) translateY(0px); }
          50% { transform: rotateX(38deg) rotateZ(-32deg) translateY(-8px); }
        }
        @keyframes core-hover {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes core-floor-glow {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.55; }
          50% { transform: translateX(-50%) scale(0.85); opacity: 0.85; }
        }
        @keyframes core-claim-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.04); }
        }
        @keyframes core-turntable {
          0% { transform: rotateX(38deg) rotateZ(-32deg); }
          100% { transform: rotateX(38deg) rotateZ(328deg); }
        }
        @keyframes core-led-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes core-modal-pop {
          0% { opacity: 0; transform: scale(0.92) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Ambient scanline sweeping down the whole screen */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 h-24 z-0"
        style={{
          background: `linear-gradient(180deg, transparent, ${C.cyan}22, transparent)`,
          animation: "core-scan 6s linear infinite",
          mixBlendMode: "screen",
        }}
      />
      {/* Drifting glow orbs for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full z-0"
        style={{ background: `${C.blue}22`, filter: "blur(50px)", animation: "core-orb 9s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 -left-14 w-48 h-48 rounded-full z-0"
        style={{ background: `${C.purple}1F`, filter: "blur(50px)", animation: "core-orb 11s ease-in-out infinite reverse" }}
      />

      <Toast toast={toast} />

      {showDailyModal && (
        <DailyBonusModal
          onClose={() => setShowDailyModal(false)}
          dailyStreak={dailyStreak}
          claimedToday={claimedToday}
          currentDay={dailyCurrentDay}
          balance={balance}
          onClaim={claimDaily}
        />
      )}

      {showMissionsModal && (
        <MissionsModal
          onClose={() => setShowMissionsModal(false)}
          missionProgress={missionProgress}
          missionClaimed={missionClaimed}
          onClaim={claimMission}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal
          onClose={closeAchievementsModal}
          metrics={metrics}
          claimed={achievementsClaimed}
          onClaim={claimAchievement}
        />
      )}

      {showQuestsModal && (
        <QuestsModal
          onClose={closeQuestsModal}
          metrics={metrics}
          claimed={questClaimed}
          onClaim={claimQuest}
        />
      )}

      {showCodexModal && <CodexModal onClose={closeCodexModal} />}

      {showReferralModal && (
        <ReferralModal
          onClose={closeReferralModal}
          referralCode={referralCode}
          invitedFriends={invitedFriends}
          milestonesClaimed={referralMilestonesClaimed}
          onClaimMilestone={claimReferralMilestone}
          onShare={shareReferral}
        />
      )}

      {showCreatePoolModal && (
        <CreatePoolModal
          balance={balance}
          miningPower={miningPower}
          onClose={() => setShowCreatePoolModal(false)}
          onCreate={createPool}
        />
      )}

      {selectedPoolId && pools.find((p) => p.id === selectedPoolId) && (
        <PoolDetailModal
          pool={pools.find((p) => p.id === selectedPoolId)}
          joinedPoolId={joinedPoolId}
          miningPower={miningPower}
          poolIncomePerHour={poolIncomePerHour}
          onClose={() => setSelectedPoolId(null)}
          onJoin={(id) => { joinPool(id); setSelectedPoolId(null); }}
          onLeave={() => leavePool()}
          onUpdateFee={updatePoolFee}
        />
      )}

      {showInboxModal && (
        <InboxModal
          onClose={() => setShowInboxModal(false)}
          items={inboxItems}
          onClaim={claimInboxReward}
        />
      )}

      {showNetworkModal && (
        <NetworkStatsModal
          onClose={() => setShowNetworkModal(false)}
          schedule={displaySchedule}
          networkHashrateTotal={networkHashrateTotal}
          networkRewardRate={networkRewardRate}
          networkActiveMiners={displayActiveMiners}
          miningPower={miningPower}
          poolSynergyBonusPct={poolSynergyBonusPct}
          joinedPool={joinedPool}
        />
      )}

      {showDepositModal && (
        <WalletDepositModal
          onClose={() => setShowDepositModal(false)}
          balance={balance}
          setBalance={setBalance}
          initData={initData}
          notify={notify}
          haptic={haptic}
        />
      )}

      {showWithdrawModal && (
        <WalletWithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          balance={balance}
          setBalance={setBalance}
          initData={initData}
          notify={notify}
          haptic={haptic}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          musicOn={musicOn}
          onToggleMusic={() => setMusicOn((v) => !v)}
          sfxOn={sfxOn}
          onToggleSfx={() => setSfxOn((v) => !v)}
          vibrationOn={vibrationOn}
          onToggleVibration={() => setVibrationOn((v) => !v)}
          notificationsOn={notificationsOn}
          onToggleNotifications={() => setNotificationsOn((v) => !v)}
          language={language}
          onSetLanguage={setLanguage}
          notify={notify}
          tg={tg}
        />
      )}

      <div className="relative z-10 flex-1 min-h-0 flex flex-col overflow-y-auto pb-20">
        {tab === "home" && (
          <HomeTab
            balance={balance}
            pending={pending}
            energy={energy}
            energyDrainPerHour={totalEnergyPerHourActive}
            storage={storagePct}
            storageCap={storageCap}
            miningPower={miningPower}
            incomePerHour={effectiveIncomePerHour}
            onClaim={claimReward}
            activeBooster={boosterActive ? activeBooster : null}
            newMinerBoostActive={newMinerBoostActive}
            newMinerBoostHoursLeft={Math.max(0, Math.ceil((NEW_MINER_BOOST_HOURS * 3600 * 1000 - (nowTick - accountCreatedAt)) / 3600000))}
            nowTick={nowTick}
            owned={owned}
            featuredRigId={featuredRigId}
            poolInfo={joinedPool ? { name: joinedPool.name, feePct: joinedPool.feePct, isOwner: isPoolOwner } : null}
            schedule={displaySchedule}
            networkHashrateTotal={networkHashrateTotal}
            networkActiveMiners={displayActiveMiners}
            onOpenNetwork={() => { haptic("light"); setShowNetworkModal(true); }}
            user={user}
            onOpenProfile={() => { haptic("light"); setTab("profile"); }}
            onOpenInbox={openInbox}
            unreadInboxCount={unreadInboxCount}
          />
        )}
        {tab === "pools" && (
          <PoolsTab
            pools={pools}
            joinedPoolId={joinedPoolId}
            miningPower={miningPower}
            poolIncomePerHour={poolIncomePerHour}
            onOpenCreate={() => { haptic("light"); setShowCreatePoolModal(true); }}
            onOpenDetail={(id) => { haptic("light"); setSelectedPoolId(id); }}
          />
        )}
        {tab === "inventory" && (
          selectedRig ? (
            <UpgradeTab
              owned={owned}
              selected={selectedRig}
              onSelect={(r) => setSelectedRigId(r.id)}
              onBack={() => { haptic("light"); setSelectedRigId(null); }}
              balance={balance}
              onUpgrade={upgradeRig}
              onRepair={repairRig}
              onToggleActive={toggleRigActive}
              componentInventory={componentInventory}
              onInstall={installComponent}
              onUninstall={uninstallComponent}
              onRepairComponent={repairComponent}
              networkRewardRate={networkRewardRate}
            />
          ) : (
            <InventoryTab
              owned={owned}
              componentInventory={componentInventory}
              featuredRigId={featuredRigId}
              onSetFeatured={setFeaturedRigId}
              onBack={() => { haptic("light"); setTab("home"); }}
              onSelect={(r) => setSelectedRigId(r.id)}
              balance={balance}
              materialInventory={materialInventory}
              onCraft={craftComponent}
              onRecycle={recycleComponent}
            />
          )
        )}
        {tab === "market" && (
          <MarketTab
            balance={balance}
            filter={marketFilter}
            setFilter={setMarketFilter}
            onBuy={buyRig}
            ownedRigCount={owned.length}
            componentInventory={componentInventory}
            onBuyComponent={buyComponent}
            activeBooster={boosterActive ? activeBooster : null}
            onBuyBooster={buyBooster}
            energy={energy}
            onBuyEnergyPack={buyEnergyPack}
            onBuyBundle={buyBundle}
            tonAddress={tonAddress}
            sendingKitKey={sendingKitKey}
          />
        )}
        {tab === "marketplace" && (
          <MarketplaceTab
            balance={balance}
            listings={listings}
            onBuyListing={buyListing}
            onCancelListing={cancelListing}
            onOpenSell={() => { haptic("light"); setShowSellModal(true); }}
            onBack={() => { haptic("light"); setTab("home"); }}
          />
        )}
        {showSellModal && (
          <SellItemModal
            owned={owned}
            componentInventory={componentInventory}
            onClose={() => setShowSellModal(false)}
            onListRig={listRigForSale}
            onListComponent={listComponentForSale}
          />
        )}
        {tab === "profile" && (
          <ProfileTab
            level={level}
            xp={xp}
            xpToNext={xpToNext}
            totalEarned={totalEarned}
            miningPower={miningPower}
            notify={notify}
            user={user}
            isTelegram={isTelegram}
            onOpenDaily={() => { haptic("light"); setShowDailyModal(true); }}
            dailyClaimAvailable={!claimedToday}
            onOpenNetwork={() => { haptic("light"); setShowNetworkModal(true); }}
            onOpenMissions={() => { haptic("light"); setShowMissionsModal(true); }}
            missionsClaimReady={MISSIONS.some(
              (m) => (missionProgress[m.metric] || 0) >= m.target && !missionClaimed.includes(m.key)
            )}
            onOpenAchievements={() => { haptic("light"); setShowAchievementsModal(true); }}
            achievementsClaimReady={ACHIEVEMENTS.some(
              (a) => (metrics[a.metric] || 0) >= a.target && !achievementsClaimed.includes(a.key)
            )}
            onOpenReferral={() => { haptic("light"); setShowReferralModal(true); }}
            referralClaimReady={REFERRAL_MILESTONES.some(
              (m) => invitedFriends.length >= m.target && !referralMilestonesClaimed.includes(m.key)
            )}
            onOpenQuests={() => { haptic("light"); setShowQuestsModal(true); }}
            questsClaimReady={QUESTS.some(
              (q) => (metrics[q.metric] || 0) >= q.target && !questClaimed.includes(q.key)
            )}
            onOpenCodex={() => { haptic("light"); setShowCodexModal(true); }}
            onOpenSettings={() => { haptic("light"); setShowSettingsModal(true); }}
            balance={balance}
            onOpenDeposit={() => { haptic("light"); setShowDepositModal(true); }}
            onOpenWithdraw={() => { haptic("light"); setShowWithdrawModal(true); }}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] flex z-20 backdrop-blur-md"
        style={{
          background: "rgba(6,9,17,0.85)",
          borderTop: `1px solid ${C.cyan}2A`,
          boxShadow: `0 -8px 24px -12px ${C.cyan}33`,
        }}
      >
        <NavItem navKey="home" icon={Home} label={t("nav_home")} active={tab === "home"} onClick={() => { haptic("light"); setSelectedRigId(null); setTab("home"); }} />
        <NavItem navKey="market" icon={Store} label={t("nav_market")} active={tab === "market"} onClick={() => { haptic("light"); setSelectedRigId(null); setTab("market"); }} />
        <NavItem navKey="pools" icon={Users} label={t("nav_pools")} active={tab === "pools"} onClick={() => { haptic("light"); setSelectedRigId(null); setTab("pools"); }} />
        <NavItem navKey="inventory" icon={Package} label={t("nav_inventory")} active={tab === "inventory"} onClick={() => { haptic("light"); setSelectedRigId(null); setTab("inventory"); }} />
        <NavItem navKey="marketplace" icon={Boxes} label={t("nav_marketplace")} active={tab === "marketplace"} onClick={() => { haptic("light"); setSelectedRigId(null); setTab("marketplace"); }} />
      </div>
    </div>
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// HOME
// ---------------------------------------------------------------------------
function HomeTab({ balance, pending, energy, energyDrainPerHour, storage, storageCap, miningPower, incomePerHour, onClaim, activeBooster, newMinerBoostActive, newMinerBoostHoursLeft, nowTick, owned, featuredRigId, poolInfo, schedule, networkHashrateTotal, networkActiveMiners, onOpenNetwork, user, onOpenProfile, onOpenInbox, unreadInboxCount = 0 }) {
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const boosterMinsLeft = activeBooster ? Math.max(0, Math.round((activeBooster.expiresAt - nowTick) / 60000)) : 0;
  const powerOf = (r) => r.basePower * (1 + (r.level - 1) * 0.18);
  const autoTopRig = owned && owned.length ? [...owned].sort((a, b) => powerOf(b) - powerOf(a))[0] : null;
  const topRig = (featuredRigId && owned?.find((r) => r.id === featuredRigId)) || autoTopRig;
  // Carousel list: featured/best rig first, then the rest by power — so the
  // default view (index 0) matches the old single-rig behavior, but a swipe
  // reveals the whole collection without leaving the home tab.
  const heroList = owned && owned.length
    ? [topRig, ...[...owned].filter((r) => r.id !== topRig?.id).sort((a, b) => powerOf(b) - powerOf(a))].filter(Boolean)
    : [];
  const safeHeroIndex = heroList.length ? Math.min(heroIndex, heroList.length - 1) : 0;
  const currentRig = heroList[safeHeroIndex] || null;
  const heroTouchRef = useRef(null);
  const onHeroTouchStart = (e) => { heroTouchRef.current = e.touches[0].clientX; };
  const onHeroTouchEnd = (e) => {
    if (heroTouchRef.current == null || heroList.length < 2) return;
    const delta = e.changedTouches[0].clientX - heroTouchRef.current;
    heroTouchRef.current = null;
    if (delta > 40) setHeroIndex((i) => (i - 1 + heroList.length) % heroList.length);
    else if (delta < -40) setHeroIndex((i) => (i + 1) % heroList.length);
  };
  // Energy pool is denominated in real kWh (see MAX_ENERGY_KWH), and
  // energyDrainPerHour is already the sum of every active rig's real `kwh`
  // draw — so the bar's own number IS the real-world-equivalent draw now,
  // no separate flavor stat needed.
  const activeOwnedRigs = (owned || []).filter((r) => r.active !== false);
  // Hours left before energy hits 0 at the current drain rate — this is the
  // number a player actually needs to decide "should I buy a refill now?".
  const energyHoursLeft = energyDrainPerHour > 0 ? energy / energyDrainPerHour : null;
  // Any live boost gets folded into one small badge stack next to the
  // balance instead of full-width banners — keeps the header compact so the
  // rig hero below can claim most of the screen.
  const boosts = [
    newMinerBoostActive && {
      key: "newminer",
      color: C.green,
      icon: Sparkles,
      text: `+${NEW_MINER_BOOST_PCT}% · ${newMinerBoostHoursLeft}h`,
    },
    activeBooster && {
      key: "booster",
      color: C.orange,
      icon: Zap,
      text: `+${activeBooster.boostPct}% · ${boosterMinsLeft}m`,
    },
  ].filter(Boolean);
  const energyPct = MAX_ENERGY_KWH > 0 ? energy / MAX_ENERGY_KWH : 0;
  const energyColor = energy <= 0 ? "#FF7A7A" : energyPct <= 0.25 ? C.orange : C.green;

  // Gold/amber "luxury" palette for the Home tab's cards only — kept local
  // here rather than added to the shared `C` tokens so it doesn't bleed
  // into Shop/Inventory/Marketplace, which still use the cyan/green theme.
  const GOLD = {
    bright: "#FFD966",
    amber: "#FFB300",
    deep: "#C98A2C",
    line: "#8A6A2F",
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <CoreMark size={24} />
          <span className="text-white font-extrabold tracking-widest text-sm">CORE</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <button onClick={() => setShowEnergyModal(true)} aria-label="Open energy" className="relative">
            <BatteryMedium size={18} color={energyColor} style={{ filter: `drop-shadow(0 0 5px ${energyColor}88)` }} />
          </button>
          <button onClick={onOpenInbox} aria-label="Open inbox" className="relative">
            <Bell size={17} />
            {unreadInboxCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-[3px] rounded-full flex items-center justify-center text-[8px] font-extrabold text-white"
                style={{ background: C.orange, boxShadow: `0 0 5px ${C.orange}AA` }}
              >
                {unreadInboxCount}
              </span>
            )}
          </button>
          <button onClick={onOpenProfile} aria-label="Open profile">
            <div
              className="w-7 h-7 rounded-full border overflow-hidden flex items-center justify-center"
              style={{ borderColor: `${C.cyan}55`, background: "#111a2b" }}
            >
              {user?.photo_url ? (
                <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={14} color={C.cyan} />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Balance + boost badges */}
      <div className="flex items-end justify-between shrink-0 mt-2">
        <div>
          <p className="text-slate-400 text-[10px] mb-0.5 tracking-wide">TOTAL BALANCE</p>
          <div className="flex items-end gap-1.5">
            <span className="text-white text-[26px] leading-none font-extrabold tabular-nums">{fmt(balance)}</span>
            <span className="text-xs font-bold mb-0.5" style={{ color: C.cyan }}>CORE</span>
          </div>
          <p className="text-slate-500 text-[10px] mt-0.5">≈ ${fmt((balance / DEPOSIT_CORE_PER_TON) * TON_USD_RATE, 2)} USD</p>
        </div>
        {boosts.length > 0 && (
          <div className="flex flex-col gap-1 items-end">
            {boosts.map((b) => (
              <span
                key={b.key}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                style={{ background: `${b.color}15`, border: `1px solid ${b.color}55`, color: b.color }}
              >
                <b.icon size={11} /> {b.text}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rig visual — the hero, gets whatever space is left. Swipeable when
          more than one rig is owned so the full collection is reachable
          without leaving the home tab. */}
      <div className="relative mt-2" style={{ height: "40vh", minHeight: "260px", flexShrink: 0 }}>
        <GlowCard
          accent={GOLD.amber}
          brackets
          className="absolute inset-0 p-2"
        >
          <div
            onTouchStart={onHeroTouchStart}
            onTouchEnd={onHeroTouchEnd}
            className="absolute inset-2"
          >
            <RigHeroErrorBoundary>
              <RigHero rig={currentRig} fill />
            </RigHeroErrorBoundary>
          </div>
        </GlowCard>
        {heroList.length > 1 && (
          <>
            <button
              aria-label="Previous rig"
              onClick={() => setHeroIndex((i) => (i - 1 + heroList.length) % heroList.length)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(5,7,14,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ChevronLeft size={16} color="#CBD5E1" />
            </button>
            <button
              aria-label="Next rig"
              onClick={() => setHeroIndex((i) => (i + 1) % heroList.length)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(5,7,14,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ChevronRight size={16} color="#CBD5E1" />
            </button>
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums"
              style={{ background: "rgba(5,7,14,0.75)", border: "1px solid rgba(255,255,255,0.12)", color: "#CBD5E1" }}
            >
              {safeHeroIndex + 1} / {heroList.length}
            </div>
          </>
        )}
      </div>

      {/* Mining power + income, merged into one compact, color-coded card */}
      <div className="shrink-0 mt-2">
        <GlowCard accent={GOLD.amber} className="p-1">
          <div className="grid grid-cols-2 gap-1">
            <div
              className="rounded-xl px-2.5 py-1.5"
              style={{ background: `linear-gradient(135deg, ${GOLD.bright}22, transparent)` }}
            >
              <div className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: `${GOLD.bright}CC` }}>
                <Gauge size={11} /> POWER
              </div>
              <p className="text-white font-extrabold text-[13px] tabular-nums leading-tight">{fmt(miningPower)} <span className="text-[9px] font-semibold text-slate-400">TH/s</span></p>
            </div>
            <div
              className="rounded-xl px-2.5 py-1.5"
              style={{ background: `linear-gradient(135deg, ${GOLD.deep}33, transparent)` }}
            >
              <div className="flex items-center gap-1 text-[9px] font-semibold" style={{ color: `${GOLD.amber}CC` }}>
                <Coins size={11} /> INCOME/HR
              </div>
              <p className="text-white font-extrabold text-[13px] tabular-nums leading-tight">{fmt(incomePerHour)} <span className="text-[9px] font-semibold text-slate-400">CORE</span></p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Pool status + network, one tappable strip */}
      <button className="shrink-0 mt-1.5 w-full text-left" onClick={onOpenNetwork}>
        <div
          className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-[10px] font-semibold"
          style={{
            background: `linear-gradient(100deg, ${GOLD.deep}2A 0%, ${GOLD.amber}1F 55%, #0A0F1E 100%)`,
            border: `1px solid ${GOLD.amber}44`,
          }}
        >
          <span className="flex items-center gap-1.5 text-slate-300 truncate">
            <Users size={12} color={poolInfo ? GOLD.bright : "#8FA3B8"} />
            {poolInfo ? `${poolInfo.name} pool · ${poolInfo.feePct}% fee` : "Solo mining"}
          </span>
          <span className="flex items-center gap-1.5 shrink-0" style={{ color: GOLD.amber }}>
            <Database size={11} />
            Y{schedule.yearNumber} · {schedule.percentMined.toFixed(1)}% mined
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: GOLD.bright, boxShadow: `0 0 6px 2px ${GOLD.bright}`, animation: "core-pulse-ring 1.6s ease-out infinite" }}
            />
          </span>
        </div>
      </button>

      {/* Claim */}
      <div className="shrink-0 mt-2 pb-2">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[11px] text-slate-400 tracking-wide">Ready to claim</span>
          <span className="text-sm font-extrabold tabular-nums" style={{ color: C.green }}>
            +{fmt(pending, 4)} CORE
          </span>
        </div>
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-1.5 rounded-2xl pointer-events-none"
            style={{
              background: `linear-gradient(100deg, ${C.cyan}, ${C.green}, ${C.cyan})`,
              filter: "blur(10px)",
              animation: "core-claim-glow 2.2s ease-in-out infinite",
            }}
          />
          <button
            onClick={onClaim}
            className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-[13px] active:scale-[0.97] transition-transform"
            style={{
              background: `linear-gradient(115deg, ${C.cyan} 0%, ${C.green} 100%)`,
              color: "#04070E",
              boxShadow: `0 6px 20px -4px ${C.green}88, 0 0 0 1px rgba(255,255,255,0.15) inset`,
            }}
          >
            <Coins size={17} />
            Claim Reward
          </button>
        </div>
      </div>

      {showEnergyModal && (
        <EnergyModal
          onClose={() => setShowEnergyModal(false)}
          energy={energy}
          energyHoursLeft={energyHoursLeft}
          activeOwnedRigs={activeOwnedRigs}
          storage={storage}
          pending={pending}
          storageCap={storageCap}
        />
      )}
    </div>
  );
}

// Energy + storage detail, now a popup (opened via the header battery icon)
// instead of a fixed card, so the rig hero above can use the freed-up space.
function EnergyModal({ onClose, energy, energyHoursLeft, activeOwnedRigs, storage, pending, storageCap }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.orange} brackets className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BatteryMedium size={16} color={C.orange} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">ENERGY & STORAGE</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <StatBar label="ENERGY" value={energy} max={MAX_ENERGY_KWH} color={C.orange} suffix=" kWh" />
          <p className="text-[10px] text-slate-500 -mt-2 mb-2">
            {energyHoursLeft == null
              ? "not in use (rig off)"
              : energyHoursLeft >= 1
              ? `~${fmt(energyHoursLeft, 1)}h left`
              : `~${fmt(energyHoursLeft * 60, 0)}m left`}
            {activeOwnedRigs.length > 0 && ` · ${activeOwnedRigs.length} rig${activeOwnedRigs.length > 1 ? "s" : ""} active`}
          </p>
          <StatBar label="STORAGE" value={storage} color={C.purple} />
          <p className="text-[10px] text-slate-500 -mt-2">
            {fmt(pending, 2)} / {fmt(storageCap, 0)} CORE buffer
          </p>
          {(energy <= 0 || (energy > 0 && energy <= MAX_ENERGY_KWH * 0.25) || pending >= storageCap * 0.9) && (
            <p className="text-[10px] mt-1.5" style={{ color: energy <= 0 ? "#FF7A7A" : C.orange }}>
              {energy <= 0
                ? "Out of energy — mining paused. Buy a pack in Market → Packs."
                : pending >= storageCap * 0.9
                ? "Storage almost full — claim now."
                : "Energy running low — refill in Market → Packs."}
            </p>
          )}
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INVENTORY
// ---------------------------------------------------------------------------
function InventoryTab({ owned, onSelect, componentInventory = {}, featuredRigId, onSetFeatured, onBack, balance = 0, materialInventory = {}, onCraft, onRecycle }) {
  const [panel, setPanel] = useState("items"); // "items" | "craft"
  const stockEntries = Object.entries(componentInventory).filter(([, units]) => (units || []).length > 0);
  return (
    <div>
      <TopBar title="Inventory" onBack={onBack} right={<Search size={17} />} />

      <div className="px-4 flex gap-4 text-xs mb-1 mt-1">
        {[
          { key: "items", label: "My Items" },
          { key: "craft", label: "Craft" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPanel(p.key)}
            className="pb-2 font-semibold"
            style={{
              color: panel === p.key ? C.cyan : "#5B6B82",
              borderBottom: panel === p.key ? `2px solid ${C.cyan}` : "2px solid transparent",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {panel === "craft" ? (
        <CraftPanel
          balance={balance}
          componentInventory={componentInventory}
          materialInventory={materialInventory}
          onCraft={onCraft}
          onRecycle={onRecycle}
        />
      ) : (
      <>
      <div className="px-4 flex items-center justify-between mt-1 mb-2">
        <p className="text-[11px] text-slate-400 tracking-wide">YOUR RIGS</p>
        <p className="text-[11px] tabular-nums" style={{ color: owned.length >= MAX_RIGS ? C.orange : "#5B6B82" }}>
          {owned.length}/{MAX_RIGS}
        </p>
      </div>
      <div className="px-4 grid grid-cols-2 gap-3">
        {owned.map((r) => {
          const rar = RARITY_STYLE[r.rarity];
          const dur = r.durability ?? 100;
          const durColor = dur <= 0 ? "#FF5252" : dur < 30 ? C.orange : C.green;
          const isFeatured = featuredRigId === r.id;
          const filledSlots = (r.slots || []).filter(Boolean).length;
          return (
            <GlowCard
              key={r.id}
              accent={rar.color}
              brackets
              className="p-3 relative transition-transform duration-150 active:scale-[0.97]"
            >
              <div
                className="absolute inset-x-3 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${rar.color}77, transparent)` }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetFeatured(isFeatured ? null : r.id);
                }}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: isFeatured ? `${C.cyan}33` : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isFeatured ? C.cyan : "#2a3346"}`,
                }}
                title="Feature on Home"
              >
                <Star size={12} color={isFeatured ? C.cyan : "#5B6B82"} fill={isFeatured ? C.cyan : "none"} />
              </button>
              <button onClick={() => onSelect(r)} className="text-left w-full">
                <div className="flex items-center justify-center h-16 relative">
                  <div
                    className="absolute w-14 h-14 rounded-xl"
                    style={{ background: `radial-gradient(circle, ${rar.color}22, transparent 70%)` }}
                  />
                  <RigIcon rigKey={r.key} rarity={r.rarity} size={52} />
                </div>
                <p className="text-white text-xs font-bold mt-2">{r.name}</p>
                <p className="text-[10px] mb-0.5" style={{ color: rar.color }}>Lv.{r.level} · {rar.label}</p>
                <p className="text-[10px] mb-1.5" style={{ color: C.cyan }}>
                  {fmt(r.basePower * (1 + (r.level - 1) * 0.18) * ((r.durability ?? 100) / 100))} TH/s
                </p>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${dur}%`, background: durColor }} />
                  </div>
                  <span className="text-[9px] tabular-nums" style={{ color: durColor }}>{Math.round(dur)}%</span>
                </div>
                <p className="text-[9px]" style={{ color: C.purple }}>
                  {filledSlots}/{(r.slots || []).length} component slots
                </p>
                <p className="text-[9px] flex items-center gap-1 mt-0.5" style={{ color: C.orange }}>
                  <Zap size={8} /> {RIG_CATALOG.find((c) => c.key === r.key)?.kwh ?? 1} kWh/hr
                </p>
                {dur <= 0 && (
                  <p className="text-[9px] mt-1 flex items-center gap-1" style={{ color: "#FF7A7A" }}>
                    <Wrench size={9} /> Needs repair
                  </p>
                )}
              </button>
            </GlowCard>
          );
        })}
        {owned.length === 0 && (
          <p className="text-slate-500 text-xs col-span-2 text-center mt-8">
            No rigs yet — visit the Market to get started.
          </p>
        )}
      </div>

      <div className="px-4 mt-5">
        <p className="text-[11px] text-slate-400 tracking-wide mb-2">COMPONENTS (unassigned)</p>
        {stockEntries.length === 0 ? (
          <p className="text-slate-500 text-[11px]">
            None in stock — buy components in Market, then install them onto a rig from the Upgrade tab.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stockEntries.map(([key, units]) => {
              const c = COMPONENT_CATALOG.find((x) => x.key === key);
              if (!c) return null;
              const rar = RARITY_STYLE[c.rarity];
              const sorted = units.slice().sort((a, b) => (b.durability ?? 100) - (a.durability ?? 100));
              return (
                <GlowCard
                  key={key}
                  accent={rar.color}
                  brackets
                  className="p-3 relative transition-transform duration-150 active:scale-[0.97]"
                >
                  <div
                    className="absolute inset-x-3 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${rar.color}77, transparent)` }}
                  />
                  <span
                    className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${rar.color}22`, color: rar.color }}
                  >
                    x{units.length}
                  </span>
                  <div className="flex items-center justify-center h-16 relative">
                    <div
                      className="absolute w-14 h-14 rounded-xl"
                      style={{ background: `radial-gradient(circle, ${rar.color}22, transparent 70%)` }}
                    />
                    <ComponentIcon compKey={c.key} rarity={c.rarity} size={52} />
                  </div>
                  <p className="text-white text-xs font-bold mt-2">{c.name}</p>
                  <p className="text-[10px]" style={{ color: rar.color }}>
                    +{c.boostPct}% · {rar.label}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {sorted.map((u) => {
                      const d = Math.round(u.durability ?? 100);
                      const dColor = d <= 0 ? "#FF5252" : d < 30 ? C.orange : C.green;
                      return (
                        <span
                          key={u.id}
                          className="text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full"
                          style={{ background: `${dColor}18`, color: dColor }}
                        >
                          {d}%
                        </span>
                      );
                    })}
                  </div>
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 mt-5 mb-4">
        <p className="text-[11px] text-slate-400 tracking-wide mb-2">MATERIALS</p>
        {MATERIAL_CATALOG.every((m) => !(materialInventory[m.key] > 0)) ? (
          <p className="text-slate-500 text-[11px]">
            None yet — earn materials from Quests (Profile tab).
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {MATERIAL_CATALOG.filter((m) => materialInventory[m.key] > 0).map((m) => {
              const rar = RARITY_STYLE[m.rarity];
              return (
                <GlowCard
                  key={m.key}
                  accent={rar.color}
                  brackets
                  className="p-3 relative transition-transform duration-150 active:scale-[0.97]"
                >
                  <div
                    className="absolute inset-x-3 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${rar.color}77, transparent)` }}
                  />
                  <span
                    className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${rar.color}22`, color: rar.color }}
                  >
                    ×{materialInventory[m.key]}
                  </span>
                  <div className="flex items-center justify-center h-16 relative">
                    <div
                      className="absolute w-14 h-14 rounded-xl"
                      style={{ background: `radial-gradient(circle, ${rar.color}22, transparent 70%)` }}
                    />
                    <MaterialIcon materialKey={m.key} rarity={m.rarity} size={48} />
                  </div>
                  <p className="text-white text-xs font-bold mt-2">{m.name}</p>
                  <p className="text-[10px]" style={{ color: rar.color }}>{rar.label}</p>
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}

// A standalone crafting panel — lives in Inventory (not Shop), since crafting
// consumes materials + owned rigs' context rather than being a CORE purchase.
// Each recipe's CORE fee is fixed per output rarity (CRAFT_COST_BY_RARITY),
// not a discount off the Market price.
function CraftPanel({ balance, componentInventory = {}, materialInventory = {}, onCraft, onRecycle }) {
  return (
    <div className="px-4 flex flex-col gap-3 mt-2">
      <GlowCard accent={C.purple} className="p-3">
        <p className="text-[11px] font-bold text-white mb-2">Your materials</p>
        {MATERIAL_CATALOG.every((m) => !(materialInventory[m.key] > 0)) ? (
          <p className="text-[10px] text-slate-500">None yet — earn materials from Quests (Profile tab).</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {MATERIAL_CATALOG.filter((m) => materialInventory[m.key] > 0).map((m) => {
              const rar = RARITY_STYLE[m.rarity];
              return (
                <div key={m.key} className="flex flex-col items-center gap-1">
                  <MaterialIcon materialKey={m.key} rarity={m.rarity} size={36} />
                  <span className="text-[8px] text-slate-400 text-center leading-tight">{m.name}</span>
                  <span className="text-[9px] font-bold" style={{ color: rar.color }}>×{materialInventory[m.key]}</span>
                </div>
              );
            })}
          </div>
        )}
      </GlowCard>

      <div className="grid grid-cols-2 gap-2.5">
        {RECIPES.map((recipe) => {
          const comp = COMPONENT_CATALOG.find((c) => c.key === recipe.outputKey);
          if (!comp) return null;
          const rar = RARITY_STYLE[comp.rarity];
          const cost = CRAFT_COST_BY_RARITY[comp.rarity] ?? 0;
          const owned = (componentInventory[comp.key] || []).length;
          const hasMaterials = recipe.materials.every((m) => (materialInventory[m.key] || 0) >= m.qty);
          const canAfford = balance >= cost && hasMaterials;
          return (
            <ShopCard
              key={recipe.key}
              accent={rar.color}
              icon={<ComponentIcon compKey={comp.key} rarity={comp.rarity} size={30} />}
              title={comp.name}
              rarityLabel={rar.label}
              stat={[
                owned > 0 && <Chip key="owned" color={rar.color}>owned x{owned}</Chip>,
                ...recipe.materials.map((m) => {
                  const mat = MATERIAL_CATALOG.find((x) => x.key === m.key);
                  const matRar = mat ? RARITY_STYLE[mat.rarity] : null;
                  const have = materialInventory[m.key] || 0;
                  const enough = have >= m.qty;
                  return (
                    <Chip key={m.key} color={enough ? (matRar?.color ?? C.green) : C.orange}>
                      {m.qty}× {mat?.name ?? m.key} ({have})
                    </Chip>
                  );
                }),
              ].filter(Boolean)}
              price={<>{fmt(cost, 0)} <span style={{ color: C.cyan }}>CORE</span></>}
              action={
                <div className="flex flex-col gap-1">
                  <FuturisticButton
                    onClick={() => onCraft(recipe)}
                    disabled={!canAfford}
                    accent={rar.color}
                    accent2={C.blue}
                    size="sm"
                  >
                    Craft
                  </FuturisticButton>
                  {owned > 0 && (
                    <button
                      onClick={() => onRecycle(comp.key)}
                      className="text-[9px] font-semibold px-2 py-1 rounded-lg w-full"
                      style={{ border: "1px solid #2a3346", color: "#8FA3B8" }}
                    >
                      Recycle
                    </button>
                  )}
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MARKET
// ---------------------------------------------------------------------------
function MarketTab({ balance, filter, setFilter, onBuy, ownedRigCount, componentInventory, onBuyComponent, activeBooster, onBuyBooster, energy, onBuyEnergyPack, onBuyBundle, tonAddress, sendingKitKey }) {
  const tabs = ["Rigs", "Components", "Boosters", "Packs", "Kits"];
  const RARITY_RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };
  const sortList = (list, priceKey) => {
    if (!sort.key) return list.slice().reverse();
    return list.slice().sort((a, b) => {
      const cmp = sort.key === "rarity" ? RARITY_RANK[a.rarity] - RARITY_RANK[b.rarity] : a[priceKey] - b[priceKey];
      return sort.dir === "asc" ? cmp : -cmp;
    });
  };
  const SortBar = () => (
    <div className="col-span-2 flex items-center gap-2 -mt-0.5 mb-0.5">
      <span className="text-[10px] text-slate-500 font-semibold">Sort:</span>
      {[["rarity", "Rarity"], ["price", "Price"]].map(([key, label]) => (
        <button
          key={key}
          onClick={() => toggleSort(key)}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
          style={{
            background: sort.key === key ? `${C.cyan}18` : "rgba(255,255,255,0.03)",
            border: `1px solid ${sort.key === key ? C.cyan : "#1c2536"}`,
            color: sort.key === key ? C.cyan : "#7C8AA0",
          }}
        >
          {label}
          {sort.key === key && (sort.dir === "asc" ? " ↑" : " ↓")}
        </button>
      ))}
    </div>
  );
  return (
    <div>
      <TopBar title="Shop" right={<Search size={17} />} />
      <div className="px-4 flex gap-4 text-xs mb-1 mt-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="pb-2 font-semibold whitespace-nowrap"
            style={{
              color: filter === t ? C.cyan : "#5B6B82",
              borderBottom: filter === t ? `2px solid ${C.cyan}` : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 grid grid-cols-2 gap-2.5 mt-2">
        {filter === "Rigs" ? (
          <>
            <SortBar />
            {sortList(RIG_CATALOG, "baseCost").map((rig) => {
              const rar = RARITY_STYLE[rig.rarity];
              const atCap = ownedRigCount >= MAX_RIGS;
              const canAfford = balance >= rig.baseCost && !atCap;
              return (
                <ShopCard
                  key={rig.key}
                  accent={rar.color}
                  icon={<RigIcon rigKey={rig.key} rarity={rig.rarity} size={30} />}
                  title={rig.name}
                  rarityLabel={rar.label}
                  stat={[
                    <Chip key="power" color={C.cyan}>{fmt(rig.basePower)} TH/s</Chip>,
                    <Chip key="kwh" color={C.orange}>{rig.kwh} kWh/hr</Chip>,
                  ]}
                  price={<>{fmt(rig.baseCost, 0)} <span style={{ color: C.cyan }}>CORE</span></>}
                  action={
                    <FuturisticButton
                      onClick={() => onBuy(rig)}
                      disabled={!canAfford}
                      accent={rar.color}
                      accent2={C.blue}
                      size="sm"
                    >
                      {atCap ? `${MAX_RIGS}/${MAX_RIGS}` : "Buy"}
                    </FuturisticButton>
                  }
                />
              );
            })}
          </>
        ) : filter === "Components" ? (
          <>
            <SortBar />
            {sortList(COMPONENT_CATALOG, "price").map((comp) => {
              const rar = RARITY_STYLE[comp.rarity];
              const owned = (componentInventory[comp.key] || []).length;
              const canAfford = balance >= comp.price;
              return (
                <ShopCard
                  key={comp.key}
                  accent={rar.color}
                  icon={<ComponentIcon compKey={comp.key} rarity={comp.rarity} size={30} />}
                  title={comp.name}
                  rarityLabel={rar.label}
                  stat={[
                    <Chip key="boost" color={C.green}>+{comp.boostPct}% boost</Chip>,
                    owned > 0 && <Chip key="owned" color={rar.color}>x{owned}</Chip>,
                  ].filter(Boolean)}
                  price={<>{fmt(comp.price, 0)} <span style={{ color: C.cyan }}>CORE</span></>}
                  action={
                    <FuturisticButton
                      onClick={() => onBuyComponent(comp)}
                      disabled={!canAfford}
                      accent={rar.color}
                      accent2={C.blue}
                      size="sm"
                    >
                      Buy
                    </FuturisticButton>
                  }
                />
              );
            })}
          </>
        ) : filter === "Boosters" ? (
          BOOSTER_CATALOG.slice()
            .reverse()
            .map((boost) => {
              const rar = RARITY_STYLE[boost.rarity];
              const isActive = activeBooster && activeBooster.key === boost.key;
              const canAfford = balance >= boost.price;
              return (
                <ShopCard
                  key={boost.key}
                  accent={rar.color}
                  icon={<BoosterIcon boostKey={boost.key} rarity={boost.rarity} size={30} />}
                  title={boost.name}
                  rarityLabel={rar.label}
                  stat={[
                    <Chip key="boost" color={C.green}>+{boost.boostPct}%</Chip>,
                    <Chip key="dur" color={C.orange}>{boost.durationHours}h</Chip>,
                  ]}
                  price={<>{fmt(boost.price, 0)} <span style={{ color: C.cyan }}>CORE</span></>}
                  action={
                    <FuturisticButton
                      onClick={() => onBuyBooster(boost)}
                      disabled={!canAfford}
                      accent={rar.color}
                      accent2={C.orange}
                      size="sm"
                    >
                      {isActive ? "Extend" : "Activate"}
                    </FuturisticButton>
                  }
                />
              );
            })
        ) : filter === "Packs" ? (
          ENERGY_PACK_CATALOG.map((pack) => {
            const rar = RARITY_STYLE[pack.rarity];
            const isFull = energy >= MAX_ENERGY_KWH;
            const canAfford = balance >= pack.price;
            return (
              <ShopCard
                key={pack.key}
                accent={rar.color}
                icon={<PackIcon packKey={pack.key} rarity={pack.rarity} size={30} />}
                title={pack.name}
                rarityLabel={rar.label}
                stat={[<Chip key="amount" color={C.orange}>+{pack.amount} kWh</Chip>]}
                price={<>{fmt(pack.price, 0)} <span style={{ color: C.cyan }}>CORE</span></>}
                action={
                  <FuturisticButton
                    onClick={() => onBuyEnergyPack(pack)}
                    disabled={isFull || !canAfford}
                    accent={C.orange}
                    accent2={rar.color}
                    size="sm"
                  >
                    {isFull ? "Full" : "Buy"}
                  </FuturisticButton>
                }
              />
            );
          })
        ) : filter === "Kits" ? (
          <>
            <p className="col-span-2 text-[10px] text-slate-500 -mt-0.5 mb-0.5">
              Mining Kits bundle a rig + GPU + energy at a discount — paid in real TON, sent directly to the treasury wallet.
            </p>
            {BUNDLE_CATALOG.map((bundle) => {
              const atCap = ownedRigCount >= MAX_RIGS;
              const sending = sendingKitKey === bundle.key;
              const disabledReason = atCap
                ? `Rig limit reached (${MAX_RIGS}/${MAX_RIGS})`
                : !tonAddress
                ? "Connect your TON wallet first"
                : null;
              return (
                <div key={bundle.key} className="col-span-2">
                  <BundleCard
                    bundle={bundle}
                    onBuy={() => onBuyBundle(bundle)}
                    disabled={atCap || !tonAddress}
                    disabledReason={disabledReason}
                    sending={sending}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <p className="text-slate-500 text-xs text-center mt-10 col-span-2">
            {filter} coming soon.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MARKETPLACE (P2P listings — now its own top-level tab)
// ---------------------------------------------------------------------------
function MarketplaceTab({ balance, listings, onBuyListing, onCancelListing, onOpenSell, onBack }) {
  const catTabs = ["All", "Rigs", "Components", "My Listings"];
  const [catFilter, setCatFilter] = useState("All");
  const matchesCat = (l, cat) => {
    if (cat === "All") return true;
    if (cat === "Rigs") return l.itemType === "rig";
    if (cat === "Components") return l.itemType === "component";
    return l.sellerId === "you"; // "My Listings"
  };
  const filteredListings = listings.filter((l) => matchesCat(l, catFilter));

  const SORT_OPTIONS = [
    { key: "default", label: "Default" },
    { key: "price_desc", label: "Price: Highest first" },
    { key: "price_asc", label: "Price: Lowest first" },
    { key: "durability_desc", label: "Durability: Highest first" },
    { key: "durability_asc", label: "Durability: Lowest first" },
  ];
  const [sortBy, setSortBy] = useState("default");
  const [showSortPicker, setShowSortPicker] = useState(false);
  const currentSort = SORT_OPTIONS.find((o) => o.key === sortBy) || SORT_OPTIONS[0];
  const getDurability = (l) => l.item.durability ?? 100;
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price_desc":
        return b.price - a.price;
      case "price_asc":
        return a.price - b.price;
      case "durability_desc":
        return getDurability(b) - getDurability(a);
      case "durability_asc":
        return getDurability(a) - getDurability(b);
      default:
        return 0; // keep listings' original order
    }
  });
  return (
    <div>
      <TopBar title="Marketplace" onBack={onBack} right={<Search size={17} />} />
      <div className="px-4 flex flex-col gap-3 mt-2">
        <button
          onClick={onOpenSell}
          className="flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl py-2.5 mb-1"
          style={{ background: `${C.cyan}15`, border: `1px solid ${C.cyan}55`, color: C.cyan }}
        >
          <Plus size={14} /> Sell an item
        </button>
        <p className="text-[9px] text-slate-500 -mt-1 mb-1">
          {MARKETPLACE_FEE_PCT}% marketplace fee is burned on every sale — sellers keep the rest.
        </p>
        {listings.length > 0 && (
          <div className="flex gap-4 text-xs -mt-1 mb-1">
            {catTabs.map((t) => (
              <button
                key={t}
                onClick={() => setCatFilter(t)}
                className="pb-2 font-semibold"
                style={{
                  color: catFilter === t ? C.cyan : "#5B6B82",
                  borderBottom: catFilter === t ? `2px solid ${C.cyan}` : "2px solid transparent",
                }}
              >
                {t}
                {t !== "All" && ` (${listings.filter((l) => matchesCat(l, t)).length})`}
              </button>
            ))}
          </div>
        )}
        {listings.length > 0 && (
          <div className="-mt-2 mb-1">
            <button
              onClick={() => setShowSortPicker((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536", color: "#B8C4D6" }}
            >
              <ArrowUpDown size={12} color={C.cyan} /> Sort: {currentSort.label}
              <ChevronDown size={12} style={{ transform: showSortPicker ? "rotate(180deg)" : "none" }} />
            </button>
            {showSortPicker && (
              <div className="flex flex-col gap-1 mt-1.5 rounded-xl p-1.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => { setSortBy(o.key); setShowSortPicker(false); }}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
                    style={{
                      background: sortBy === o.key ? `${C.cyan}15` : "transparent",
                      color: sortBy === o.key ? C.cyan : "#B8C4D6",
                    }}
                  >
                    {o.label}
                    {sortBy === o.key && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {listings.length === 0 && (
          <p className="text-slate-500 text-xs text-center mt-8">No listings right now.</p>
        )}
        {listings.length > 0 && filteredListings.length === 0 && (
          <p className="text-slate-500 text-xs text-center mt-8">No {catFilter.toLowerCase()} listed right now.</p>
        )}
        {sortedListings.map((l) => {
          const rar = RARITY_STYLE[l.item.rarity];
          const isYou = l.sellerId === "you";
          const canAfford = balance >= l.price;
          return (
            <ShopRow
              key={l.id}
              accent={rar.color}
              icon={
                l.itemType === "rig" ? (
                  <RigIcon rigKey={l.item.key} rarity={l.item.rarity} size={44} />
                ) : (
                  <ComponentIcon compKey={l.item.key} rarity={l.item.rarity} size={44} />
                )
              }
              title={l.item.name}
              rarityLabel={rar.label}
              badges={isYou ? [<Chip key="you" color={C.cyan}>your listing</Chip>] : null}
              chips={[
                l.itemType === "rig" && <Chip key="lvl" color={C.cyan}>Lv.{l.item.level}</Chip>,
                <Chip key="dur" color={C.cyan}>{l.item.durability ?? 100}% durability</Chip>,
                <Chip key="seller">Seller: {l.sellerName}</Chip>,
              ].filter(Boolean)}
              price={<>{fmt(l.price, 0)} <span style={{ color: C.cyan }}>CORE</span></>}
              action={
                isYou ? (
                  <FuturisticButton onClick={() => onCancelListing(l.id)} accent={C.orange} accent2="#FF6B6B" full={false} size="sm">
                    Cancel
                  </FuturisticButton>
                ) : (
                  <FuturisticButton onClick={() => onBuyListing(l.id)} disabled={!canAfford} accent={rar.color} accent2={C.blue} full={false} size="sm">
                    Buy
                  </FuturisticButton>
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SELL ITEM (Marketplace listing composer)
// ---------------------------------------------------------------------------
function SellItemModal({ owned, componentInventory, onClose, onListRig, onListComponent }) {
  const componentUnits = Object.entries(componentInventory || {}).flatMap(([key, units]) =>
    (units || []).map((u) => ({ key, ...u }))
  );
  const [pick, setPick] = useState(null); // { kind: "rig", id } | { kind: "component", key, instanceId }
  const [price, setPrice] = useState("");

  const confirm = () => {
    const p = Number(price);
    if (!pick || !p || p <= 0) return;
    if (pick.kind === "rig") onListRig(pick.id, Math.round(p));
    else onListComponent(pick.key, Math.round(p), pick.instanceId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.cyan} brackets className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-extrabold text-sm tracking-wide">SELL AN ITEM</h2>
            <button onClick={onClose}><X size={18} color="#5B6B82" /></button>
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">YOUR RIGS</p>
          <div className="flex flex-col gap-1.5 mb-3">
            {owned.length === 0 && <p className="text-slate-500 text-[11px]">No rigs to sell.</p>}
            {owned.map((r) => {
              const rar = RARITY_STYLE[r.rarity];
              const selected = pick?.kind === "rig" && pick.id === r.id;
              const locked = r.tradeable === false;
              return (
                <button
                  key={r.id}
                  onClick={() => !locked && setPick({ kind: "rig", id: r.id })}
                  disabled={locked}
                  className="flex items-center justify-between text-[11px] rounded-lg px-2.5 py-2 text-left"
                  style={{
                    background: selected ? `${C.cyan}18` : "rgba(255,255,255,0.02)",
                    border: selected ? `1px solid ${C.cyan}` : "1px solid transparent",
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  <span style={{ color: selected ? C.cyan : "#B8C4D6" }}>
                    {r.name} <span className="text-slate-500">Lv.{r.level} · {Math.round(r.durability ?? 100)}%</span>
                  </span>
                  {locked ? (
                    <span className="text-[9px] font-bold text-slate-500">Not tradeable</span>
                  ) : (
                    <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">YOUR COMPONENTS</p>
          <div className="flex flex-col gap-1.5 mb-4">
            {componentUnits.length === 0 && <p className="text-slate-500 text-[11px]">No unassigned components.</p>}
            {componentUnits
              .slice()
              .sort((a, b) => (b.durability ?? 100) - (a.durability ?? 100))
              .map((u) => {
                const c = COMPONENT_CATALOG.find((x) => x.key === u.key);
                if (!c) return null;
                const rar = RARITY_STYLE[c.rarity];
                const d = Math.round(u.durability ?? 100);
                const dColor = d <= 0 ? "#FF5252" : d < 30 ? C.orange : C.green;
                const selected = pick?.kind === "component" && pick.instanceId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setPick({ kind: "component", key: u.key, instanceId: u.id })}
                    className="flex items-center justify-between text-[11px] rounded-lg px-2.5 py-2 text-left"
                    style={{ background: selected ? `${C.cyan}18` : "rgba(255,255,255,0.02)", border: selected ? `1px solid ${C.cyan}` : "1px solid transparent" }}
                  >
                    <span style={{ color: selected ? C.cyan : "#B8C4D6" }}>
                      {c.name} <span style={{ color: dColor }}>· {d}% durability</span>
                    </span>
                    <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                  </button>
                );
              })}
          </div>

          {pick && (
            <div className="mb-3">
              <p className="text-[11px] text-slate-400 mb-1">Price (CORE)</p>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 500"
                className="w-full rounded-xl px-3 py-2 text-sm text-white bg-white/5 border outline-none"
                style={{ borderColor: `${C.cyan}55` }}
              />
              <p className="text-[9px] text-slate-500 mt-1">
                {MARKETPLACE_FEE_PCT}% fee is burned on sale — you'll receive {price ? fmt(Number(price) * (1 - MARKETPLACE_FEE_PCT / 100), 0) : "…"} CORE if it sells.
              </p>
            </div>
          )}

          <FuturisticButton onClick={confirm} disabled={!pick || !price || Number(price) <= 0} accent={C.cyan} accent2={C.purple}>
            List for sale
          </FuturisticButton>
        </GlowCard>
      </div>
    </div>
  );
}


function UpgradeTab({ owned, selected, onSelect, balance, onUpgrade, onRepair, onToggleActive, onBack, componentInventory = {}, onInstall, onUninstall, onRepairComponent, networkRewardRate = 0 }) {
  const [pickerSlot, setPickerSlot] = useState(null); // slot index currently choosing a component for

  const rig = selected || owned[0];
  if (!rig) {
    return (
      <div>
        <TopBar title="Upgrade" onBack={onBack} />
        <p className="text-slate-500 text-xs text-center mt-10">No rigs owned yet.</p>
      </div>
    );
  }
  const rar = RARITY_STYLE[rig.rarity];
  const level = rig.level;
  const cost = upgradeCostFor(rig);
  const power = rig.basePower * (1 + (level - 1) * 0.18);
  const nextPower = rig.basePower * (1 + level * 0.18);
  const dur = rig.durability ?? 100;
  const isBroken = dur <= 0;
  const canAfford = balance >= cost && !isBroken;

  const catalogEntry = RIG_CATALOG.find((c) => c.key === rig.key);
  const eff = Math.min(96, 60 + level * 6);
  const kwh = catalogEntry?.kwh ?? 1;
  const wearPerHour = catalogEntry?.wearPerHour ?? 12;
  const durColor = dur <= 0 ? "#FF5252" : dur < 30 ? C.orange : C.purple;

  const repairCost = Math.max(REPAIR_COST_FLOOR, Math.round(rig.basePower * networkRewardRate * REPAIR_HOURS_COST * ((100 - dur) / 100)));
  const needsRepair = dur < 100;

  const slots = rig.slots || [];
  const filledSlots = slots.filter(Boolean).length;
  const stockEntries = Object.entries(componentInventory).filter(([, units]) => (units || []).length > 0);

  const isOn = rig.active !== false;

  return (
    <div>
      <TopBar title="Upgrade" onBack={onBack} right={<Search size={17} />} />

      <div className="px-4 flex gap-2 overflow-x-auto pb-1">
        {owned.map((r) => {
          const rOn = r.active !== false;
          return (
            <button
              key={r.id}
              onClick={() => {
                onSelect(r);
                setPickerSlot(null);
              }}
              className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5"
              style={{
                background: r.id === rig.id ? `${RARITY_STYLE[r.rarity].color}22` : "transparent",
                border: `1px solid ${r.id === rig.id ? RARITY_STYLE[r.rarity].color : "#1c2536"}`,
                color: r.id === rig.id ? RARITY_STYLE[r.rarity].color : "#8FA3B8",
                opacity: rOn ? 1 : 0.5,
              }}
            >
              {r.name}
              {!rOn && (
                <span className="text-[9px] font-bold" style={{ color: "#FF7A7A" }}>
                  OFF
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-4 mt-3">
        <GlowCard accent={rar.color} brackets className="p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm">{rig.name}</p>
              <p className="text-[11px]" style={{ color: rar.color }}>{rar.label}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              Lv.{level} <ArrowUpCircle size={12} color={C.green} /> Lv.{level + 1}
            </div>
          </div>

          <button
            onClick={() => onToggleActive(rig)}
            className="w-full flex items-center justify-between mt-2.5 px-2.5 py-1.5 rounded-xl"
            style={{
              background: isOn ? `${C.green}12` : "rgba(255,255,255,0.03)",
              border: `1px solid ${isOn ? C.green + "55" : "#2a3346"}`,
            }}
          >
            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: isOn ? C.green : "#8FA3B8" }}>
              <Zap size={12} color={isOn ? C.green : "#5B6B82"} />
              {isOn ? "Mining actively" : "Rig OFF — not mining"}
            </span>
            <span
              className="relative inline-flex items-center rounded-full transition-colors"
              style={{ width: 30, height: 16, background: isOn ? C.green : "#2a3346" }}
            >
              <span
                className="absolute rounded-full bg-white transition-all"
                style={{ width: 12, height: 12, top: 2, left: isOn ? 16 : 2 }}
              />
            </span>
          </button>

          <div className="flex justify-center my-3">
            <div className="rounded-2xl" style={{ animation: "core-pulse-ring 2.4s ease-out infinite" }}>
              <RigIcon rigKey={rig.key} rarity={rig.rarity} size={64} />
            </div>
          </div>

          {isBroken && (
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold mb-3"
              style={{ background: "#FF525215", border: "1px solid #FF525255", color: "#FF7A7A" }}
            >
              <Wrench size={12} /> Broken — mining at 0% until repaired.
            </div>
          )}

          <p className="text-[10px] text-slate-400 leading-snug mb-3">{RIG_CATALOG.find((c) => c.key === rig.key)?.desc}</p>

          <div className="flex items-center justify-between text-[11px] mb-2.5">
            <span className="text-slate-400">Hash Power</span>
            <span className="text-white tabular-nums">
              {fmt(power)} TH/s <span style={{ color: C.green }}>→ {fmt(nextPower)} TH/s</span>
            </span>
          </div>

          <StatBar label="Efficiency" value={eff} color={C.cyan} />
          <div className="flex items-center justify-between text-[11px] mb-2.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap size={11} color={C.orange} /> Energy Draw
            </span>
            <span className="text-white tabular-nums">
              {kwh} kWh/hr
            </span>
          </div>
          <StatBar label="Durability" value={dur} color={durColor} />
          <p className="text-[10px] text-slate-500 -mt-2 mb-2.5">
            Wears {wearPerHour}%/hr while active · full charge lasts ~{Math.round(100 / wearPerHour)}h.
          </p>

          {/* Component slots */}
          <div className="mt-1 mb-3">
            <p className="text-[11px] text-slate-400 tracking-wide mb-1">
              COMPONENT SLOTS ({filledSlots}/{slots.length})
            </p>
            <p className="text-[9px] text-slate-500 mb-1.5 leading-snug">
              Each GPU's output is reduced by its own durability and the rig's, together.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot, i) => {
                if (slot) {
                  const c = COMPONENT_CATALOG.find((x) => x.key === slot.key);
                  const compDur = slot.durability ?? 100;
                  const compDurColor = compDur <= 0 ? "#FF5252" : compDur < 30 ? C.orange : C.green;
                  return (
                    <button
                      key={i}
                      onClick={() => onUninstall(rig.id, i)}
                      className="relative"
                      title={`${Math.round(compDur)}% durability — tap to remove`}
                    >
                      <ComponentIcon compKey={slot.key} rarity={c?.rarity} size={40} />
                      <span
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                        style={{ background: "#0A0D16", border: "1px solid #FF525288" }}
                      >
                        <X size={8} color="#FF7A7A" />
                      </span>
                      <div className="absolute -bottom-1 left-0.5 right-0.5 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
                        <div className="h-full" style={{ width: `${compDur}%`, background: compDurColor }} />
                      </div>
                    </button>
                  );
                }
                return (
                  <button
                    key={i}
                    onClick={() => setPickerSlot(pickerSlot === i ? null : i)}
                    className="rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      border: `1px dashed ${pickerSlot === i ? C.cyan : "#2a3346"}`,
                      background: pickerSlot === i ? `${C.cyan}10` : "transparent",
                    }}
                  >
                    <Plus size={14} color={pickerSlot === i ? C.cyan : "#5B6B82"} />
                  </button>
                );
              })}
            </div>

            {pickerSlot !== null && (
              <GlowCard accent={C.cyan} className="p-2.5 mt-1.5">
                <p className="text-[10px] text-slate-400 mb-2">Choose a component to install</p>
                {stockEntries.length === 0 ? (
                  <p className="text-[11px] text-slate-500">
                    Nothing in stock — buy components in Market → Components first.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {stockEntries.map(([key, units]) => {
                      const c = COMPONENT_CATALOG.find((x) => x.key === key);
                      if (!c) return null;
                      const crar = RARITY_STYLE[c.rarity];
                      const sorted = units.slice().sort((a, b) => (b.durability ?? 100) - (a.durability ?? 100));
                      const best = sorted[0];
                      const bestDur = Math.round(best?.durability ?? 100);
                      const bestColor = bestDur <= 0 ? "#FF5252" : bestDur < 30 ? C.orange : C.green;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            onInstall(rig.id, pickerSlot, key, best.id);
                            setPickerSlot(null);
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${crar.color}44` }}
                        >
                          <ComponentIcon compKey={key} rarity={c.rarity} size={28} />
                          <div className="flex-1 text-left">
                            <p className="text-white text-xs font-semibold">{c.name}</p>
                            <p className="text-[10px]" style={{ color: C.green }}>+{c.boostPct}% · +{c.power} TH/s</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold block" style={{ color: crar.color }}>x{units.length}</span>
                            <span className="text-[9px] font-semibold tabular-nums" style={{ color: bestColor }}>{bestDur}% dur.</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </GlowCard>
            )}

            {slots.some((s) => s && (s.durability ?? 100) < 100) && (
              <div className="flex flex-col gap-1.5 mt-2">
                {slots.map((slot, i) => {
                  if (!slot || (slot.durability ?? 100) >= 100) return null;
                  const c = COMPONENT_CATALOG.find((x) => x.key === slot.key);
                  const compDur = slot.durability ?? 100;
                  const missing = 100 - compDur;
                  const compCost = Math.max(REPAIR_COST_FLOOR, Math.round((c?.power ?? 8) * networkRewardRate * REPAIR_HOURS_COST * (missing / 100)));
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] rounded-lg px-2.5 py-1.5"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1c2536" }}
                    >
                      <span className="text-slate-300">
                        {c?.name ?? slot.key} <span className="text-slate-500">· {Math.round(compDur)}%</span>
                      </span>
                      <button
                        onClick={() => onRepairComponent(rig.id, i)}
                        disabled={balance < compCost}
                        className="font-semibold flex items-center gap-1 px-2 py-1 rounded-md disabled:opacity-40"
                        style={{ color: C.orange, background: `${C.orange}15` }}
                      >
                        <Wrench size={10} /> {fmt(compCost, 0)} CORE
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {needsRepair && (
            <FuturisticButton
              onClick={() => onRepair(rig)}
              disabled={balance < repairCost}
              accent={durColor}
              accent2={C.orange}
              size="sm"
              className="mt-1.5"
            >
              <Wrench size={13} /> Repair · {fmt(repairCost, 0)} CORE
            </FuturisticButton>
          )}

          <FuturisticButton
            onClick={() => onUpgrade(rig)}
            disabled={!canAfford}
            accent={C.cyan}
            accent2={C.purple}
            size="sm"
            className="mt-1.5"
          >
            <Sparkles size={13} /> Upgrade · {fmt(cost, 0)} CORE
          </FuturisticButton>
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DAILY BONUS
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// INBOX / NOTIFICATIONS — bell icon on Home opens this. Styled like a mail
// inbox: a scrollable list of messages, unread ones highlighted, and any
// message carrying a reward gets its own inline Claim button.
// ---------------------------------------------------------------------------
function InboxModal({ onClose, items, onClaim }) {
  const sorted = [...items].sort((a, b) => b.ts - a.ts);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[80vh] flex flex-col"
        style={{ animation: "core-modal-pop 0.22s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlowCard accent={C.cyan} brackets className="p-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Bell size={16} color={C.cyan} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">INBOX</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>

          {sorted.length === 0 ? (
            <p className="text-[12px] text-slate-500 text-center py-8">No messages yet.</p>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto min-h-0 pr-1">
              {sorted.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-xl p-3"
                  style={{
                    background: item.read
                      ? "linear-gradient(160deg, rgba(255,255,255,0.03), rgba(10,14,24,0.9))"
                      : `linear-gradient(160deg, ${C.cyan}18, rgba(10,14,24,0.92))`,
                    border: `1px solid ${item.read ? "#1c2536" : `${C.cyan}55`}`,
                  }}
                >
                  {!item.read && (
                    <span
                      className="absolute top-3 right-3 w-2 h-2 rounded-full"
                      style={{ background: C.cyan, boxShadow: `0 0 6px 1px ${C.cyan}` }}
                    />
                  )}
                  <p className="text-white text-[12px] font-bold pr-4">{item.title}</p>
                  <p className="text-slate-400 text-[11px] mt-1 leading-snug">{item.body}</p>

                  {item.reward && (
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: C.green }}>
                        {item.reward.core > 0 && <span>+{fmt(item.reward.core)} CORE</span>}
                        {item.reward.energy > 0 && <span style={{ color: C.orange }}>+{item.reward.energy} kWh</span>}
                      </div>
                      <button
                        onClick={() => onClaim(item.id)}
                        disabled={item.claimed}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide"
                        style={
                          item.claimed
                            ? { background: "rgba(255,255,255,0.05)", color: "#5B6B82" }
                            : { background: `linear-gradient(135deg, ${C.cyan}, ${C.green})`, color: "#04121A" }
                        }
                      >
                        {item.claimed ? "Claimed" : "Claim"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}

function DailyBonusModal({ onClose, dailyStreak, claimedToday, currentDay, onClaim, balance }) {
  const doneUpTo = claimedToday ? currentDay : currentDay - 1;
  const reward = DAILY_REWARDS[currentDay - 1];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.purple} brackets className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Gift size={16} color={C.purple} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">DAILY CHECK-IN</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-4">
            {dailyStreak}-day streak · come back every day for bigger rewards
          </p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {DAILY_REWARDS.map((r) => {
              const done = r.day <= doneUpTo;
              const isToday = r.day === currentDay;
              const borderColor = isToday ? C.cyan : done ? C.green : "#1c2536";
              return (
                <div
                  key={r.day}
                  className="relative rounded-xl p-2 flex flex-col items-center gap-1"
                  style={{
                    background: isToday
                      ? `linear-gradient(160deg, ${C.cyan}30, rgba(10,14,24,0.92))`
                      : done
                      ? `linear-gradient(160deg, ${C.green}22, rgba(10,14,24,0.92))`
                      : "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(10,14,24,0.92))",
                    border: `1px solid ${borderColor}`,
                    boxShadow: isToday
                      ? `0 0 14px -3px ${C.cyan}AA, inset 0 0 0 1px ${C.cyan}33`
                      : done
                      ? `0 0 10px -4px ${C.green}88`
                      : "none",
                    animation: isToday && !claimedToday ? "core-pulse-ring 2.4s ease-out infinite" : undefined,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: done ? `${C.green}2E` : isToday ? `${C.cyan}2E` : "rgba(255,255,255,0.05)",
                      filter: done
                        ? `drop-shadow(0 0 5px ${C.green}99)`
                        : isToday
                        ? `drop-shadow(0 0 6px ${C.cyan}bb)`
                        : "none",
                    }}
                  >
                    {done ? (
                      <Check size={12} color={C.green} />
                    ) : (
                      <Gift size={12} color={isToday ? C.cyan : "#5B6B82"} />
                    )}
                  </div>
                  <span className="text-[8px] text-slate-500">Day {r.day}</span>
                  {r.core > 0 && (
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{ color: isToday ? C.cyan : done ? C.green : "#8FA3B8" }}
                    >
                      {r.core} CORE
                    </span>
                  )}
                  {r.energy > 0 && (
                    <span
                      className="text-[9px] font-bold tabular-nums text-center leading-tight"
                      style={{ color: r.core > 0 ? C.orange : (isToday ? C.cyan : done ? C.green : "#8FA3B8") }}
                    >
                      {r.energy} kWh
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <FuturisticButton
            onClick={onClaim}
            disabled={claimedToday}
            accent={C.cyan}
            accent2={C.purple}
          >
            {claimedToday ? "Come back tomorrow" : `Claim Day ${currentDay} · +${formatDailyReward(reward)}`}
          </FuturisticButton>
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MISSIONS
// ---------------------------------------------------------------------------
function MissionsModal({ onClose, missionProgress, missionClaimed, onClaim }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.blue} brackets className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Target size={16} color={C.blue} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">DAILY MISSIONS</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-4">Resets every day at midnight.</p>

          <div className="flex flex-col gap-2.5">
            {MISSIONS.map((m) => {
              const progress = Math.min(m.target, missionProgress[m.metric] || 0);
              const pct = Math.min(100, (progress / m.target) * 100);
              const complete = progress >= m.target;
              const claimed = missionClaimed.includes(m.key);
              return (
                <div
                  key={m.key}
                  className="rounded-xl p-3"
                  style={{
                    background: claimed ? `${C.green}0C` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${claimed ? C.green + "44" : "#1c2536"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-xs font-bold">{m.label}</p>
                    <span className="text-[10px] font-bold" style={{ color: C.orange }}>
                      +{m.reward} CORE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">{m.desc}</p>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: claimed ? C.green : `linear-gradient(90deg, ${C.cyan}, ${C.blue})` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {progress}/{m.target}
                    </span>
                    {claimed ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.green }}>
                        <Check size={11} /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaim(m)}
                        disabled={!complete}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: complete ? `${C.cyan}1F` : "transparent",
                          border: `1px solid ${complete ? C.cyan : "#2a3346"}`,
                          color: complete ? C.cyan : "#5B6B82",
                        }}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QUESTS (crafting materials)
// ---------------------------------------------------------------------------
function QuestsModal({ onClose, metrics, claimed, onClaim }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.purple} brackets className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Boxes size={16} color={C.purple} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">QUESTS</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-4">Complete a quest once to earn crafting materials — spend them in Market → Craft.</p>

          <div className="flex flex-col gap-2.5">
            {QUESTS.map((q) => {
              const progress = Math.min(q.target, metrics[q.metric] || 0);
              const pct = Math.min(100, (progress / q.target) * 100);
              const complete = progress >= q.target;
              const isClaimed = claimed.includes(q.key);
              return (
                <div
                  key={q.key}
                  className="rounded-xl p-3"
                  style={{
                    background: isClaimed ? `${C.green}0C` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isClaimed ? C.green + "44" : "#1c2536"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-xs font-bold">{q.label}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">{q.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {q.materials.map((m) => {
                      const mat = MATERIAL_CATALOG.find((x) => x.key === m.key);
                      const color = mat ? RARITY_STYLE[mat.rarity].color : C.purple;
                      return (
                        <span
                          key={m.key}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${color}18`, color }}
                        >
                          {m.qty}× {mat?.name ?? m.key}
                        </span>
                      );
                    })}
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: isClaimed ? C.green : `linear-gradient(90deg, ${C.purple}, ${C.blue})` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {q.target <= 1 ? `${Math.round(pct)}%` : `${fmt(progress, 0)}/${fmt(q.target, 0)}`}
                    </span>
                    {isClaimed ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.green }}>
                        <Check size={11} /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaim(q)}
                        disabled={!complete}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: complete ? `${C.purple}1F` : "transparent",
                          border: `1px solid ${complete ? C.purple : "#2a3346"}`,
                          color: complete ? C.purple : "#5B6B82",
                        }}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CODEX (in-game encyclopedia — every rig/component/booster/pack/material)
// ---------------------------------------------------------------------------
// Pure reference — no economy effects, just the flavor/desc text already
// attached to each catalog entry (grounded in real mining/GPU-hardware facts,
// see the comments on each catalog above) surfaced in one browsable place.
const CODEX_SECTIONS = [
  { key: "rigs", label: "Rigs", icon: Gauge, catalog: RIG_CATALOG, iconRender: (item) => <RigIcon rigKey={item.key} rarity={item.rarity} size={40} /> },
  { key: "components", label: "Components", icon: Cpu, catalog: COMPONENT_CATALOG, iconRender: (item) => <ComponentIcon compKey={item.key} rarity={item.rarity} size={40} /> },
  { key: "boosters", label: "Boosters", icon: Flame, catalog: BOOSTER_CATALOG, iconRender: (item) => <BoosterIcon boostKey={item.key} rarity={item.rarity} size={40} /> },
  { key: "packs", label: "Packs", icon: Zap, catalog: ENERGY_PACK_CATALOG, iconRender: (item) => <PackIcon packKey={item.key} rarity={item.rarity} size={40} /> },
  { key: "materials", label: "Materials", icon: Boxes, catalog: MATERIAL_CATALOG, iconRender: (item) => <MaterialIcon materialKey={item.key} rarity={item.rarity} size={40} /> },
];

function CodexModal({ onClose }) {
  const [section, setSection] = useState("rigs");
  const active = CODEX_SECTIONS.find((s) => s.key === section) ?? CODEX_SECTIONS[0];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.cyan} brackets className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <FileText size={16} color={C.cyan} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">CODEX</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">A field guide to every rig, part, booster, and material in CORE — grounded in real mining and GPU hardware.</p>

          <div className="flex gap-1.5 mb-3 flex-wrap">
            {CODEX_SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
                style={{
                  background: section === s.key ? `${C.cyan}1F` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${section === s.key ? C.cyan : "#1c2536"}`,
                  color: section === s.key ? C.cyan : "#8FA3B8",
                }}
              >
                <s.icon size={11} /> {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {active.catalog.map((item) => {
              const rar = RARITY_STYLE[item.rarity];
              const desc = item.desc ?? item.fact;
              return (
                <div
                  key={item.key}
                  className="rounded-xl p-3 flex gap-2.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
                >
                  {active.iconRender ? (
                    <div className="shrink-0 flex items-center justify-center">{active.iconRender(item)}</div>
                  ) : (
                    <div
                      className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${rar.color}18` }}
                    >
                      <Boxes size={18} color={rar.color} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-white text-xs font-bold">{item.name}</p>
                      <span className="text-[9px] font-bold" style={{ color: rar.color }}>{rar.label}</span>
                    </div>
                    {item.brand && (
                      <p className="text-[9px] mt-0.5" style={{ color: "#5B6B82" }}>{item.brand}</p>
                    )}
                    {desc && (
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}


const ACHIEVEMENTS_PER_PAGE = 4;

// Memoized with a custom comparator: only the metric fields ACHIEVEMENTS
// actually reads matter here. Without this, the modal re-rendered (and
// recomputed every progress bar/label) every ~1s along with the rest of
// the app because `metrics` and `onClaim`/`onClose` were fresh references
// every render — one of the causes of the "freeze" when this modal was open.
const AchievementsModal = React.memo(function AchievementsModal({ onClose, metrics, claimed, onClaim }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(ACHIEVEMENTS.length / ACHIEVEMENTS_PER_PAGE));
  const pageItems = ACHIEVEMENTS.slice(page * ACHIEVEMENTS_PER_PAGE, page * ACHIEVEMENTS_PER_PAGE + ACHIEVEMENTS_PER_PAGE);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[75vh] flex flex-col min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.orange} brackets className="flex flex-col overflow-hidden max-h-full min-h-0">
          <div className="flex items-center justify-between px-5 pt-5 pb-1 shrink-0">
            <div className="flex items-center gap-2">
              <Trophy size={16} color={C.orange} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">ACHIEVEMENTS</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 px-5 mb-2 shrink-0">Permanent milestones — claim once, keep forever.</p>

          <div className="flex flex-col gap-2.5 overflow-y-auto min-h-0 px-5 pb-3">
            {pageItems.map((a) => {
              const raw = metrics[a.metric] || 0;
              const progress = Math.min(a.target, raw);
              const pct = Math.min(100, (progress / a.target) * 100);
              const complete = raw >= a.target;
              const isClaimed = claimed.includes(a.key);
              const progressLabel =
                a.format === "percent"
                  ? `${Math.round(pct)}%`
                  : a.format === "ths"
                  ? `${fmt(progress, 0)}/${a.target} TH/s`
                  : a.format === "core"
                  ? `${fmt(progress, 0)}/${fmt(a.target, 0)} CORE`
                  : `${fmt(progress, 0)}/${a.target}${a.unit ? " " + a.unit : ""}`;
              return (
                <div
                  key={a.key}
                  className="rounded-xl p-3"
                  style={{
                    background: isClaimed ? `${C.green}0C` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isClaimed ? C.green + "44" : "#1c2536"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-xs font-bold">{a.label}</p>
                    <span className="text-[10px] font-bold" style={{ color: C.orange }}>
                      +{a.reward} CORE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">{a.desc}</p>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: isClaimed ? C.green : `linear-gradient(90deg, ${C.orange}, ${C.purple})` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 tabular-nums">{progressLabel}</span>
                    {isClaimed ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.green }}>
                        <Check size={11} /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaim(a)}
                        disabled={!complete}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: complete ? `${C.orange}1F` : "transparent",
                          border: `1px solid ${complete ? C.orange : "#2a3346"}`,
                          color: complete ? C.orange : "#5B6B82",
                        }}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 pt-3 pb-5 shrink-0" style={{ borderTop: "1px solid #1c2536" }}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                style={{
                  background: page === 0 ? "transparent" : `${C.orange}1F`,
                  border: `1px solid ${page === 0 ? "#2a3346" : C.orange}`,
                  color: page === 0 ? "#5B6B82" : C.orange,
                }}
              >
                ‹ Prev
              </button>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
                style={{
                  background: page === totalPages - 1 ? "transparent" : `${C.orange}1F`,
                  border: `1px solid ${page === totalPages - 1 ? "#2a3346" : C.orange}`,
                  color: page === totalPages - 1 ? "#5B6B82" : C.orange,
                }}
              >
                Next ›
              </button>
            </div>
          )}
          {totalPages <= 1 && <div className="pb-5 shrink-0" />}
        </GlowCard>
      </div>
    </div>
  );
}, (prev, next) => {
  if (prev.onClose !== next.onClose || prev.onClaim !== next.onClaim) return false;
  if (prev.claimed !== next.claimed) return false;
  // Round to whole numbers before comparing — that's the same precision the
  // UI actually displays (see `progressLabel`/`pct` above), so tiny
  // per-second jitter in e.g. miningPower (from ongoing rig durability
  // decay) doesn't force a re-render when nothing visible would change.
  return ACHIEVEMENTS.every((a) => {
    const p = Math.round(Math.min(a.target, prev.metrics[a.metric] || 0));
    const n = Math.round(Math.min(a.target, next.metrics[a.metric] || 0));
    return p === n;
  });
});

// ---------------------------------------------------------------------------
// REFERRAL
// ---------------------------------------------------------------------------
const ReferralModal = React.memo(function ReferralModal({ onClose, referralCode, invitedFriends, milestonesClaimed, onClaimMilestone, onShare }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[75vh] flex flex-col min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.green} brackets className="flex flex-col overflow-hidden max-h-full min-h-0">
          <div className="flex items-center justify-between px-5 pt-5 pb-1 shrink-0">
            <div className="flex items-center gap-2">
              <Users size={16} color={C.green} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">REFERRAL</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>

          <div className="overflow-y-auto min-h-0 px-5 pb-5">
          <p className="text-[11px] text-slate-400 mb-3">
            Invite friends with your code — earn CORE rewards each time your friend count crosses a milestone below.
          </p>

          <div
            className="rounded-xl p-3 mb-3 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
          >
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Your referral code</p>
              <span className="text-white font-bold text-sm tracking-widest">{referralCode}</span>
            </div>
            <button
              onClick={onShare}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: `${C.green}1F`, border: `1px solid ${C.green}`, color: C.green }}
            >
              Bagikan
            </button>
          </div>

          <div
            className="rounded-xl p-2.5 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
          >
            <p className="text-[10px] text-slate-500">Total friends invited</p>
            <p className="text-white font-bold text-sm tabular-nums">{invitedFriends.length}</p>
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">MILESTONE</p>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
            {REFERRAL_MILESTONES.map((ms) => {
              const progress = Math.min(ms.target, invitedFriends.length);
              const pct = (progress / ms.target) * 100;
              const complete = invitedFriends.length >= ms.target;
              const isClaimed = milestonesClaimed.includes(ms.key);
              return (
                <div
                  key={ms.key}
                  className="rounded-xl p-2.5 shrink-0"
                  style={{
                    width: 128,
                    background: isClaimed ? `${C.green}0C` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isClaimed ? C.green + "44" : "#1c2536"}`,
                  }}
                >
                  <p className="text-white text-[11px] font-bold leading-tight mb-1 truncate">{ms.label}</p>
                  <span className="text-[9px] font-bold" style={{ color: C.orange }}>
                    +{ms.reward} CORE
                  </span>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden my-1.5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, pct)}%`, background: isClaimed ? C.green : `linear-gradient(90deg, ${C.cyan}, ${C.green})` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 tabular-nums mb-1.5">
                    {progress}/{ms.target} friends
                  </p>
                  {isClaimed ? (
                    <span className="flex items-center justify-center gap-1 text-[9px] font-semibold py-1" style={{ color: C.green }}>
                      <Check size={10} /> Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => onClaimMilestone(ms)}
                      disabled={!complete}
                      className="w-full text-[9px] font-bold py-1 rounded-lg"
                      style={{
                        background: complete ? `${C.green}1F` : "transparent",
                        border: `1px solid ${complete ? C.green : "#2a3346"}`,
                        color: complete ? C.green : "#5B6B82",
                      }}
                    >
                      Claim
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">YOUR FRIENDS</p>
          <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
            {invitedFriends.length === 0 && (
              <p className="text-[11px] text-slate-500">No friends have joined yet. Share your code!</p>
            )}
            {invitedFriends.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between text-[11px] rounded-lg px-2.5 py-1.5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span style={{ color: "#B8C4D6" }}>{f.name}</span>
                <span className="text-slate-500">{new Date(f.joinedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// PROFILE
// ---------------------------------------------------------------------------
function ProfileTab({ level, xp, xpToNext, totalEarned, miningPower, balance, notify, user, isTelegram, onOpenDaily, dailyClaimAvailable, onOpenNetwork, onOpenMissions, missionsClaimReady, onOpenAchievements, achievementsClaimReady, onOpenReferral, referralClaimReady, onOpenQuests, questsClaimReady, onOpenCodex, onOpenSettings, onOpenDeposit, onOpenWithdraw }) {
  const pct = (xp / xpToNext) * 100;
  const tiles = [
    { icon: Trophy, label: "Achievements", color: C.orange },
    { icon: Gift, label: "Daily Bonus", color: C.purple },
    { icon: Database, label: "Network", color: C.cyan },
    { icon: Users, label: "Referral", color: C.green },
    { icon: Target, label: "Missions", color: C.blue },
    { icon: Boxes, label: "Quests", color: C.purple },
    { icon: FileText, label: "Codex", color: C.cyan },
  ];

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "CORE Miner";
  const displayId = user ? `TG-${user.id}` : "ID: CORE-78321";
  const { t } = useLanguage();
  const tonAddress = useTonAddress();
  const [walletChain, setWalletChain] = useState("ton");

  const tileHandlers = {
    Achievements: onOpenAchievements,
    "Daily Bonus": onOpenDaily,
    Network: onOpenNetwork,
    Referral: onOpenReferral,
    Missions: onOpenMissions,
    Quests: onOpenQuests,
    Codex: onOpenCodex,
  };
  const tileDots = {
    Achievements: achievementsClaimReady,
    "Daily Bonus": dailyClaimAvailable,
    Referral: referralClaimReady,
    Missions: missionsClaimReady,
    Quests: questsClaimReady,
  };

  return (
    <div>
      <TopBar
        title="Profile"
        right={
          <button onClick={onOpenSettings}>
            <Settings size={18} />
          </button>
        }
      />
      <div className="px-4 flex flex-col items-center mt-1">
        <div
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden"
          style={{ borderColor: C.cyan, background: "#0c1322" }}
        >
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={22} color={C.cyan} />
          )}
        </div>
        <p className="text-white font-bold mt-1 text-sm">{displayName}</p>
        <p className="text-slate-500 text-[11px]">
          {displayId}
          {user?.username ? ` · @${user.username}` : ""}
        </p>
        {!isTelegram && (
          <p className="text-[10px] mt-1 px-2 py-0.5 rounded-full" style={{ color: C.orange, background: `${C.orange}15` }}>
            Preview mode — open inside Telegram to see your real profile
          </p>
        )}

        <div className="w-full mt-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Level {level}</span>
            <span className="tabular-nums">{fmt(xp, 0)} / {fmt(xpToNext, 0)} XP</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 mt-1.5">
        <GlowCard accent={C.green} className="p-2.5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[11px]">Total Earned</p>
            <p className="text-white font-extrabold tabular-nums">
              {fmt(totalEarned)} <span style={{ color: C.green }}>CORE</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[11px]">Mining Power</p>
            <p className="text-white font-bold tabular-nums text-sm">{fmt(miningPower)} TH/s</p>
          </div>
        </GlowCard>
      </div>

      <div className="px-4 mt-1.5">
        <GlowCard accent={C.blue} className="p-2.5">
          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={() => setWalletChain("ton")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg text-[11px] font-bold"
              style={{
                background: walletChain === "ton" ? `${C.blue}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${walletChain === "ton" ? C.blue : "#1c2536"}`,
                color: walletChain === "ton" ? C.blue : "#7C8AA0",
              }}
            >
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black" style={{ background: "#0098EA", color: "#fff" }}>T</span>
              TON
            </button>
            <button
              onClick={() => setWalletChain("sol")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg text-[11px] font-bold"
              style={{
                background: walletChain === "sol" ? `${C.purple}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${walletChain === "sol" ? C.purple : "#1c2536"}`,
                color: walletChain === "sol" ? C.purple : "#7C8AA0",
              }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
              >
                S
              </span>
              Solana
            </button>
          </div>

          {walletChain === "ton" ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Wallet size={14} color={C.blue} /> {t("wallet_title")}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1 truncate">
                    {tonAddress
                      ? `${tonAddress.slice(0, 6)}...${tonAddress.slice(-4)}`
                      : t("wallet_disconnected_desc")}
                  </p>
                </div>
                <div className="shrink-0">
                  <TonConnectButton />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={onOpenDeposit}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg"
                  style={{ background: `${C.green}15`, border: `1px solid ${C.green}33` }}
                >
                  <ArrowDownToLine size={13} color={C.green} />
                  <span className="text-[11px] font-bold" style={{ color: C.green }}>Deposit</span>
                </button>
                <button
                  onClick={onOpenWithdraw}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg"
                  style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}33` }}
                >
                  <ArrowUpFromLine size={13} color={C.orange} />
                  <span className="text-[11px] font-bold" style={{ color: C.orange }}>Withdraw</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Wallet size={14} color={C.purple} /> Solana Wallet
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">
                    Not connected — support coming soon
                  </p>
                </div>
                <button
                  onClick={() => notify("Solana wallet support is coming soon")}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1c2536", color: "#7C8AA0" }}
                >
                  Connect
                </button>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={() => notify("Solana deposit is coming soon")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg opacity-50"
                  style={{ background: `${C.green}15`, border: `1px solid ${C.green}33` }}
                >
                  <ArrowDownToLine size={13} color={C.green} />
                  <span className="text-[11px] font-bold" style={{ color: C.green }}>Deposit</span>
                </button>
                <button
                  onClick={() => notify("Solana withdraw is coming soon")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg opacity-50"
                  style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}33` }}
                >
                  <ArrowUpFromLine size={13} color={C.orange} />
                  <span className="text-[11px] font-bold" style={{ color: C.orange }}>Withdraw</span>
                </button>
              </div>
            </>
          )}
        </GlowCard>
      </div>

      <div className="px-4 grid grid-cols-4 gap-1.5 mt-1.5 pb-1">
        {tiles.map((t) => (
          <ProfileMenuTile
            key={t.label}
            icon={t.icon}
            label={t.label}
            accent={t.color}
            showDot={!!tileDots[t.label]}
            onClick={() => (tileHandlers[t.label] ? tileHandlers[t.label]() : notify(`${t.label} opened`))}
            className={t.label === "Codex" ? "col-span-4" : "col-span-2"}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LEGAL (Privacy Policy / Terms of Service)
// ---------------------------------------------------------------------------
// Real, editable copy instead of a "coming soon" toast. Written to match
// what this app actually does today (Telegram profile + game-progress
// storage, optional TON wallet connect with no live withdrawal yet, a
// virtual in-game currency) — update the specifics (company name, contact,
// jurisdiction) before shipping, and have it reviewed by a lawyer if CORE
// ever becomes redeemable for anything of real-world value.
const LEGAL_CONTENT = {
  privacy: {
    titleKey: "settings_privacy",
    sections: [
      {
        heading: { en: "Information we collect", id: "Informasi yang kami kumpulkan" },
        body: {
          en: "When you open CORE Miner through Telegram, we receive the basic profile info Telegram shares with Mini Apps (your name and Telegram user ID). We also store your in-game progress (balance, rigs, level, settings) and, if you connect one, your TON wallet address.",
          id: "Saat kamu membuka CORE Miner lewat Telegram, kami menerima info profil dasar yang dibagikan Telegram ke Mini App (nama dan ID pengguna Telegram kamu). Kami juga menyimpan progres game kamu (saldo, rig, level, pengaturan) dan, jika kamu menyambungkannya, alamat dompet TON kamu.",
        },
      },
      {
        heading: { en: "How we use it", id: "Bagaimana kami menggunakannya" },
        body: {
          en: "This data is used only to save and restore your game progress across sessions, show your position on leaderboards/pools if applicable, and process referral rewards. We do not sell your data to third parties.",
          id: "Data ini hanya digunakan untuk menyimpan dan memulihkan progres game kamu antar sesi, menampilkan posisi kamu di leaderboard/pool jika berlaku, dan memproses hadiah referral. Kami tidak menjual data kamu ke pihak ketiga.",
        },
      },
      {
        heading: { en: "Wallet connection", id: "Koneksi dompet" },
        body: {
          en: "Connecting a TON wallet is optional and only shares your public wallet address — never your private keys or seed phrase. We never ask for those, and neither should anyone claiming to represent CORE Miner.",
          id: "Menyambungkan dompet TON bersifat opsional dan hanya membagikan alamat dompet publik kamu — bukan private key atau seed phrase. Kami tidak pernah meminta itu, begitu juga siapa pun yang mengaku mewakili CORE Miner.",
        },
      },
      {
        heading: { en: "Your choices", id: "Pilihan kamu" },
        body: {
          en: "You can disconnect your wallet at any time from the Wallet screen. To request deletion of your saved progress, contact support (below).",
          id: "Kamu bisa memutus dompet kapan saja dari layar Wallet. Untuk meminta penghapusan progres tersimpan, hubungi dukungan (lihat di bawah).",
        },
      },
    ],
  },
  terms: {
    titleKey: "settings_terms",
    sections: [
      {
        heading: { en: "Virtual currency", id: "Mata uang virtual" },
        body: {
          en: "CORE is a virtual in-game currency with no guaranteed real-world monetary value. Balances shown in the app do not represent a deposit, security, or financial instrument of any kind.",
          id: "CORE adalah mata uang virtual dalam game tanpa jaminan nilai moneter dunia nyata. Saldo yang ditampilkan di aplikasi bukan merupakan simpanan, sekuritas, atau instrumen keuangan dalam bentuk apa pun.",
        },
      },
      {
        heading: { en: "Fair play", id: "Bermain adil" },
        body: {
          en: "Botting, exploiting bugs, or using multiple accounts to farm referral rewards may result in progress being reset or access being revoked.",
          id: "Penggunaan bot, eksploitasi bug, atau memakai banyak akun untuk memanfaatkan hadiah referral dapat mengakibatkan progres direset atau akses dicabut.",
        },
      },
      {
        heading: { en: "No guarantees", id: "Tanpa jaminan" },
        body: {
          en: "The app is provided \"as is\" during active development. Features, rates, and prices shown may change as the game is balanced and updated.",
          id: "Aplikasi disediakan \"apa adanya\" selama masa pengembangan aktif. Fitur, rate, dan harga yang ditampilkan bisa berubah seiring penyeimbangan dan pembaruan game.",
        },
      },
      {
        heading: { en: "Contact", id: "Kontak" },
        body: {
          en: "Questions about these terms can be sent through Help & Support.",
          id: "Pertanyaan seputar ketentuan ini bisa dikirim lewat Bantuan & Dukungan.",
        },
      },
    ],
  },
};

function LegalModal({ kind, onClose }) {
  const { t, language } = useLanguage();
  const content = LEGAL_CONTENT[kind];
  const lang = (k) => k[language] || k.en;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.cyan} brackets className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {kind === "privacy" ? <ShieldCheck size={16} color={C.cyan} /> : <FileText size={16} color={C.cyan} />}
              <h2 className="text-white font-extrabold text-sm tracking-wide">{t(content.titleKey)}</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <div className="flex flex-col gap-3.5">
            {content.sections.map((s, i) => (
              <div key={i}>
                <p className="text-white text-xs font-bold mb-1">{lang(s.heading)}</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">{lang(s.body)}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-4">
            {language === "id" ? "Terakhir diperbarui" : "Last updated"}: 2026
          </p>
        </GlowCard>
      </div>
    </div>
  );
}

const SETTINGS_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
];

function SettingsModal({
  onClose,
  musicOn,
  onToggleMusic,
  sfxOn,
  onToggleSfx,
  vibrationOn,
  onToggleVibration,
  notificationsOn,
  onToggleNotifications,
  language,
  onSetLanguage,
  notify,
  tg,
}) {
  const { t } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // "privacy" | "terms" | null
  const currentLang = SETTINGS_LANGUAGES.find((l) => l.code === language) || SETTINGS_LANGUAGES[0];

  const openSupport = () => {
    const url = `https://t.me/${BOT_USERNAME}`;
    if (tg?.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.cyan} brackets className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings size={16} color={C.cyan} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">{t("settings_title")}</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">{t("settings_audio")}</p>
          <div className="flex flex-col gap-1.5 mb-4">
            <SettingsToggleRow icon={Music} label={t("settings_music")} isOn={musicOn} onToggle={onToggleMusic} />
            <SettingsToggleRow icon={Volume2} label={t("settings_sfx")} isOn={sfxOn} onToggle={onToggleSfx} />
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">{t("settings_feedback")}</p>
          <div className="flex flex-col gap-1.5 mb-4">
            <SettingsToggleRow icon={Vibrate} label={t("settings_vibration")} isOn={vibrationOn} onToggle={onToggleVibration} />
            <SettingsToggleRow icon={Bell} label={t("settings_notifications")} isOn={notificationsOn} onToggle={onToggleNotifications} />
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">{t("settings_language")}</p>
          <button
            onClick={() => setShowLangPicker((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
          >
            <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
              <Globe size={15} color={C.cyan} /> {t("settings_language_row")}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              {currentLang.label}
              <ChevronDown size={14} style={{ transform: showLangPicker ? "rotate(180deg)" : "none" }} />
            </span>
          </button>
          {showLangPicker && (
            <div className="flex flex-col gap-1 mb-4 -mt-2.5">
              {SETTINGS_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { onSetLanguage(l.code); setShowLangPicker(false); }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-semibold"
                  style={{
                    background: language === l.code ? `${C.cyan}15` : "transparent",
                    color: language === l.code ? C.cyan : "#B8C4D6",
                  }}
                >
                  {l.label}
                  {language === l.code && <Check size={13} />}
                </button>
              ))}
            </div>
          )}

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">{t("settings_support")}</p>
          <div className="flex flex-col gap-1.5 mb-1">
            <SettingsLinkRow
              icon={HelpCircle}
              label={t("settings_help")}
              onClick={openSupport}
            />
            <SettingsLinkRow
              icon={ShieldCheck}
              label={t("settings_privacy")}
              onClick={() => setLegalModal("privacy")}
            />
            <SettingsLinkRow
              icon={FileText}
              label={t("settings_terms")}
              onClick={() => setLegalModal("terms")}
            />
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-4">CORE Miner v1.19</p>
        </GlowCard>
      </div>
      {legalModal && <LegalModal kind={legalModal} onClose={() => setLegalModal(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// POOLS
// ---------------------------------------------------------------------------
function PoolsTab({ pools, joinedPoolId, miningPower, poolIncomePerHour, onOpenCreate, onOpenDetail }) {
  const joinedPool = pools.find((p) => p.id === joinedPoolId) || null;
  const otherPools = pools.filter((p) => p.id !== joinedPoolId);

  const poolStats = (pool) => {
    const botTotal = pool.members.reduce((s, m) => s + m.hashrate, 0);
    const isMine = pool.id === joinedPoolId;
    const total = botTotal + (isMine ? miningPower : 0);
    const count = pool.members.length + (isMine ? 1 : 0);
    return { total, count };
  };

  return (
    <div>
      <TopBar title="Mining Pools" right={<Users size={18} />} />

      <div className="px-4 mt-2">
        <GlowCard accent={C.purple} className="p-4">
          <p className="text-white text-xs font-bold mb-1">Mine together, earn together</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Combine hash power with other miners. Income splits by each member's share of
            total hashrate — the pool owner can set a royalty fee from 0–{POOL_MAX_FEE}%.
          </p>
        </GlowCard>
      </div>

      {joinedPool ? (
        <div className="px-4 mt-3">
          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">YOUR POOL</p>
          <button className="w-full text-left" onClick={() => onOpenDetail(joinedPool.id)}>
            <GlowCard accent={C.cyan} brackets className="p-4">
              <div
                className="absolute inset-x-3 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}77, transparent)` }}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{joinedPool.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {poolStats(joinedPool).count}/{POOL_MAX_MEMBERS} miners · {joinedPool.feePct}% owner fee
                  </p>
                </div>
                {joinedPool.ownerId === "you" && (
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: C.orange, background: `${C.orange}18` }}
                  >
                    OWNER
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-slate-500">
                  Pool hashrate:{" "}
                  <span className="text-white font-semibold tabular-nums">
                    {fmt(poolStats(joinedPool).total)} TH/s
                  </span>
                </p>
                <p className="text-[11px]" style={{ color: C.cyan }}>Details →</p>
              </div>
              <div
                className="flex items-center justify-between mt-2 rounded-lg px-2.5 py-1.5"
                style={{ background: `${C.green}12` }}
              >
                <span className="text-[11px] text-slate-400">Your earnings</span>
                <span className="text-[12px] font-bold tabular-nums" style={{ color: C.green }}>
                  +{fmt(poolIncomePerHour)} CORE/hr
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-1">
                Claimed from the Claim button on the Home tab, same as solo mining.
              </p>
            </GlowCard>
          </button>
        </div>
      ) : (
        <div className="px-4 mt-3">
          <FuturisticButton onClick={onOpenCreate} accent={C.purple} accent2={C.cyan}>
            <span className="flex items-center justify-center gap-2">
              <Plus size={16} /> Create Pool · {fmt(POOL_CREATE_COST, 0)} CORE
            </span>
          </FuturisticButton>
          {miningPower <= 0 && (
            <p className="text-[10px] text-center mt-2" style={{ color: C.orange }}>
              You need mining power (own a rig) to create or join a pool.
            </p>
          )}
        </div>
      )}

      <div className="px-4 mt-4">
        <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">
          {joinedPool ? "OTHER POOLS" : "BROWSE POOLS"}
        </p>
        <div className="flex flex-col gap-2 pb-4">
          {otherPools.map((pool) => {
            const stats = poolStats(pool);
            const full = stats.count >= POOL_MAX_MEMBERS;
            return (
              <button key={pool.id} className="w-full text-left" onClick={() => onOpenDetail(pool.id)}>
                <GlowCard accent={C.blue} brackets className="p-3">
                  <div
                    className="absolute inset-x-3 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${C.blue}77, transparent)` }}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-xs">{pool.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {stats.count}/{POOL_MAX_MEMBERS} · {fmt(stats.total)} TH/s · {pool.feePct}% fee
                      </p>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: full ? "#5B6B82" : C.green }}>
                      {full ? "FULL" : "VIEW →"}
                    </span>
                  </div>
                </GlowCard>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CreatePoolModal({ balance, miningPower, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [fee, setFee] = useState(5);
  const canAfford = balance >= POOL_CREATE_COST;
  const hasPower = miningPower > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.cyan} brackets className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Plus size={16} color={C.cyan} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">CREATE POOL</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>

          <label className="text-[11px] text-slate-400">Pool name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="e.g. Midnight Miners"
            className="w-full mt-1 mb-3 rounded-lg px-3 py-2 text-sm text-white bg-white/5 border outline-none"
            style={{ borderColor: "#1c2536" }}
          />

          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-slate-400">Royalty fee (owner cut)</label>
            <span className="text-[11px] font-bold text-white tabular-nums">{fee}%</span>
          </div>
          <input
            type="range"
            min={POOL_MIN_FEE}
            max={POOL_MAX_FEE}
            step={1}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            className="w-full mb-1"
            style={{ accentColor: C.cyan }}
          />
          <p className="text-[9px] text-slate-500 mb-3">
            0–{POOL_MAX_FEE}% of total pool income goes to you before the rest splits by hashrate.
          </p>

          <div
            className="rounded-xl p-2.5 mb-3 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}
          >
            <span className="text-[11px] text-slate-400">Creation cost</span>
            <span
              className="text-[12px] font-bold tabular-nums"
              style={{ color: canAfford ? C.green : "#FF6B6B" }}
            >
              {fmt(POOL_CREATE_COST, 0)} CORE
            </span>
          </div>

          {!hasPower && (
            <p className="text-[10px] mb-2" style={{ color: C.orange }}>
              You need mining power (own a rig) before creating a pool.
            </p>
          )}

          <FuturisticButton
            onClick={() => onCreate(name, fee)}
            disabled={!canAfford || !hasPower || !name.trim()}
            accent={C.cyan}
            accent2={C.purple}
          >
            Create Pool
          </FuturisticButton>
        </GlowCard>
      </div>
    </div>
  );
}

function PoolDetailModal({ pool, joinedPoolId, miningPower, poolIncomePerHour, onClose, onJoin, onLeave, onUpdateFee }) {
  const isMine = pool.id === joinedPoolId;
  const isOwner = isMine && pool.ownerId === "you";
  const [feeDraft, setFeeDraft] = useState(pool.feePct);

  const botTotal = pool.members.reduce((s, m) => s + m.hashrate, 0);
  const total = botTotal + (isMine ? miningPower : 0);
  const count = pool.members.length + (isMine ? 1 : 0);
  const full = count >= POOL_MAX_MEMBERS;

  const roster = [...pool.members]
    .concat(isMine ? [{ id: "you", name: "You", hashrate: miningPower, isYou: true }] : [])
    .sort((a, b) => b.hashrate - a.hashrate);

  const previewTotal = botTotal + miningPower;
  const yourShare = previewTotal > 0 ? miningPower / previewTotal : 0;
  const canJoin = !joinedPoolId && miningPower > 0 && !full;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.purple} brackets className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users size={16} color={C.purple} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">{pool.name.toUpperCase()}</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Owned by {pool.ownerId === "you" ? "you" : pool.ownerName} · {count}/{POOL_MAX_MEMBERS} miners
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <p className="text-[10px] text-slate-500">Pool Hashrate</p>
              <p className="text-white font-bold text-sm tabular-nums">{fmt(total)} TH/s</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <p className="text-[10px] text-slate-500">Owner Fee</p>
              <p className="text-white font-bold text-sm tabular-nums">{pool.feePct}%</p>
            </div>
          </div>

          {isMine && (
            <div
              className="rounded-xl p-3 mb-3"
              style={{ background: `${C.green}0F`, border: `1px solid ${C.green}33` }}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Your earnings</span>
                <span className="font-bold tabular-nums" style={{ color: C.green }}>
                  +{fmt(poolIncomePerHour)} CORE/hr
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1">
                <span className="text-slate-400">Your share of pool</span>
                <span className="font-bold tabular-nums" style={{ color: C.green }}>
                  {(yourShare * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2">
                Claimed from the Claim button on the Home tab, same as solo mining.
              </p>
            </div>
          )}

          {isOwner && (
            <div className="mb-3 rounded-xl p-3" style={{ background: `${C.orange}0F`, border: `1px solid ${C.orange}33` }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-semibold" style={{ color: C.orange }}>Royalty fee (owner)</p>
                <p className="text-[11px] font-bold text-white tabular-nums">{feeDraft}%</p>
              </div>
              <input
                type="range"
                min={POOL_MIN_FEE}
                max={POOL_MAX_FEE}
                step={1}
                value={feeDraft}
                onChange={(e) => setFeeDraft(Number(e.target.value))}
                onMouseUp={() => onUpdateFee(feeDraft)}
                onTouchEnd={() => onUpdateFee(feeDraft)}
                className="w-full"
                style={{ accentColor: C.orange }}
              />
              <p className="text-[9px] text-slate-500 mt-1">
                0–{POOL_MAX_FEE}% taken off the top before the rest splits by hashrate.
              </p>
            </div>
          )}

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">TOP MINERS</p>
          <div className="flex flex-col gap-1 mb-4">
            {roster.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between text-[10px] rounded-lg px-2 py-1"
                style={{ background: m.isYou ? `${C.cyan}12` : "rgba(255,255,255,0.02)" }}
              >
                <span className={m.isYou ? "font-bold" : ""} style={{ color: m.isYou ? C.cyan : "#B8C4D6" }}>
                  {i + 1}. {m.name}
                  {m.isYou ? " (You)" : ""}
                </span>
                <span className="tabular-nums text-slate-400">{fmt(m.hashrate)} TH/s</span>
              </div>
            ))}
          </div>

          {isMine ? (
            <FuturisticButton onClick={onLeave} accent={C.orange} accent2="#FF6B6B">
              {isOwner ? "Disband Pool" : "Leave Pool"}
            </FuturisticButton>
          ) : (
            <FuturisticButton onClick={() => onJoin(pool.id)} disabled={!canJoin} accent={C.cyan} accent2={C.purple}>
              {full
                ? "Pool Full"
                : miningPower <= 0
                ? "Need hash power to join"
                : joinedPoolId
                ? "Leave current pool first"
                : `Join Pool · share ~${(yourShare * 100).toFixed(1)}%`}
            </FuturisticButton>
          )}
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NETWORK STATS
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// WALLET — DEPOSIT (TON -> CORE)
// ---------------------------------------------------------------------------
// Sends real TON via the connected TonConnect wallet to the treasury address,
// then credits CORE client-side once the wallet confirms the send. The tx is
// also logged to /api/deposit so it can be reconciled against the chain later.
function WalletDepositModal({ onClose, balance, setBalance, initData, notify, haptic }) {
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState(String(QUICK_DEPOSIT_AMOUNTS_TON[1]));
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const numAmount = parseFloat(amount) || 0;
  const coreCredit = Math.floor(numAmount * DEPOSIT_CORE_PER_TON);
  const canSend = tonAddress && numAmount >= MIN_DEPOSIT_TON && status !== "sending";

  async function handleDeposit() {
    if (!tonAddress) {
      notify("Connect your TON wallet first", "error");
      return;
    }
    if (numAmount < MIN_DEPOSIT_TON) {
      notify(`Minimum deposit is ${MIN_DEPOSIT_TON} TON`, "error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: TREASURY_TON_ADDRESS,
            amount: String(Math.round(numAmount * 1e9)), // TON -> nanoTON
          },
        ],
      });
      // Wallet confirmed + broadcast the transaction. We credit CORE right
      // away for a snappy UX; the boc is logged so it can be verified/
      // reconciled against the chain on the backend.
      setBalance((b) => b + coreCredit);
      haptic?.("success");
      setStatus("success");
      apiSubmitDeposit(initData, {
        txHash: result?.boc ?? null,
        tonAmount: numAmount,
        coreAmount: coreCredit,
        walletAddress: tonAddress,
      });
    } catch (err) {
      console.warn("deposit sendTransaction failed:", err);
      setStatus("error");
      setErrorMsg(
        err?.message?.toLowerCase().includes("reject")
          ? "Transaction was cancelled in your wallet."
          : "Couldn't send the transaction. Please try again."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: "linear-gradient(160deg, #101B33 0%, #0A0F1E 55%, #060911 100%)",
            border: `1px solid ${C.green}44`,
            boxShadow: "0 30px 60px -25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowDownToLine size={16} color={C.green} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">DEPOSIT TON</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle2 size={40} color={C.green} />
              <p className="text-white font-bold text-sm mt-3">Deposit sent!</p>
              <p className="text-slate-400 text-[12px] mt-1">
                +{fmt(coreCredit, 0)} <span style={{ color: C.green }}>CORE</span> credited to your balance.
              </p>
              <button
                onClick={onClose}
                className="w-full mt-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: C.green, color: "#062015" }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-[11px] mb-3">
                Send TON from your connected wallet to top up your CORE balance.
              </p>

              {!tonAddress && (
                <div
                  className="rounded-xl p-3 mb-3 flex items-center gap-2"
                  style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}33` }}
                >
                  <Wallet size={14} color={C.orange} />
                  <span className="text-[11px]" style={{ color: C.orange }}>
                    Connect your TON wallet in the Profile tab first.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 mb-3">
                {QUICK_DEPOSIT_AMOUNTS_TON.map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className="py-2 rounded-lg text-[11px] font-bold"
                    style={{
                      background: numAmount === v ? `${C.green}22` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${numAmount === v ? C.green : "#1c2536"}`,
                      color: numAmount === v ? C.green : "#8FA0B8",
                    }}
                  >
                    {v} TON
                  </button>
                ))}
              </div>

              <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
                <label className="text-[10px] text-slate-500">Amount (TON)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-lg tabular-nums outline-none mt-1"
                  placeholder="0.0"
                />
                <div className="flex justify-between items-center mt-2 text-[11px]">
                  <span className="text-slate-500">You'll receive</span>
                  <span className="font-bold tabular-nums" style={{ color: C.green }}>
                    +{fmt(coreCredit, 0)} CORE
                  </span>
                </div>
              </div>

              {status === "error" && (
                <p className="text-[11px] mb-2" style={{ color: "#FF6B6B" }}>{errorMsg}</p>
              )}

              <button
                onClick={handleDeposit}
                disabled={!canSend}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: canSend ? C.green : "rgba(255,255,255,0.06)",
                  color: canSend ? "#062015" : "#5B6B82",
                }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Confirm in wallet…
                  </>
                ) : (
                  <>
                    <ArrowDownToLine size={15} /> Send {numAmount || 0} TON
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-600 mt-2 text-center">
                Minimum deposit {MIN_DEPOSIT_TON} TON · sent directly on-chain via your wallet.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WALLET — WITHDRAW (CORE -> TON)
// ---------------------------------------------------------------------------
// CORE has no live on-chain token yet, so this doesn't pay out automatically.
// It deducts the balance and queues a request (api/withdraw.js) for manual
// review/payout — the same disclosure already shown in the Privacy modal.
function WalletWithdrawModal({ onClose, balance, setBalance, initData, notify, haptic }) {
  const tonAddress = useTonAddress();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const numAmount = parseFloat(amount) || 0;
  const fee = Math.ceil((numAmount * WITHDRAW_FEE_PCT) / 100);
  const netAmount = Math.max(0, numAmount - fee);
  const canSend =
    tonAddress && numAmount >= MIN_WITHDRAW_CORE && numAmount <= balance && status !== "sending";

  async function handleWithdraw() {
    if (!tonAddress) {
      notify("Connect your TON wallet first", "error");
      return;
    }
    if (numAmount < MIN_WITHDRAW_CORE) {
      notify(`Minimum withdrawal is ${fmt(MIN_WITHDRAW_CORE, 0)} CORE`, "error");
      return;
    }
    if (numAmount > balance) {
      notify("Not enough CORE balance", "error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    const result = await apiSubmitWithdraw(initData, { coreAmount: numAmount, walletAddress: tonAddress });
    if (result?.ok) {
      setBalance((b) => b - numAmount);
      haptic?.("success");
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg("Couldn't submit your request. Please try again in a moment.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: "linear-gradient(160deg, #101B33 0%, #0A0F1E 55%, #060911 100%)",
            border: `1px solid ${C.orange}44`,
            boxShadow: "0 30px 60px -25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowUpFromLine size={16} color={C.orange} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">WITHDRAW CORE</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle2 size={40} color={C.orange} />
              <p className="text-white font-bold text-sm mt-3">Request submitted</p>
              <p className="text-slate-400 text-[12px] mt-1 px-2">
                {fmt(numAmount, 0)} CORE is pending review. Approved withdrawals are typically sent within 24–48h.
              </p>
              <button
                onClick={onClose}
                className="w-full mt-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: C.orange, color: "#2B1600" }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-slate-400 text-[11px] mb-3">
                Request a CORE withdrawal to your connected wallet. Requests are reviewed before payout.
              </p>

              {!tonAddress && (
                <div
                  className="rounded-xl p-3 mb-3 flex items-center gap-2"
                  style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}33` }}
                >
                  <Wallet size={14} color={C.orange} />
                  <span className="text-[11px]" style={{ color: C.orange }}>
                    Connect your TON wallet in the Profile tab first.
                  </span>
                </div>
              )}

              <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-slate-500">Amount (CORE)</label>
                  <button
                    onClick={() => setAmount(String(Math.floor(balance)))}
                    className="text-[10px] font-bold"
                    style={{ color: C.orange }}
                  >
                    MAX
                  </button>
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-lg tabular-nums outline-none"
                  placeholder="0"
                />
                <p className="text-[10px] text-slate-600 mt-1">
                  Balance: {fmt(balance, 0)} CORE
                </p>
              </div>

              <div className="flex flex-col gap-1 mb-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Network fee ({WITHDRAW_FEE_PCT}%)</span>
                  <span className="text-slate-400 tabular-nums">-{fmt(fee, 0)} CORE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">You'll get</span>
                  <span className="font-bold tabular-nums" style={{ color: C.orange }}>{fmt(netAmount, 0)} CORE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">To wallet</span>
                  <span className="text-slate-400 tabular-nums">
                    {tonAddress ? `${tonAddress.slice(0, 6)}...${tonAddress.slice(-4)}` : "—"}
                  </span>
                </div>
              </div>

              {status === "error" && (
                <p className="text-[11px] mb-2" style={{ color: "#FF6B6B" }}>{errorMsg}</p>
              )}

              <button
                onClick={handleWithdraw}
                disabled={!canSend}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: canSend ? C.orange : "rgba(255,255,255,0.06)",
                  color: canSend ? "#2B1600" : "#5B6B82",
                }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine size={15} /> Request Withdrawal
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-600 mt-2 text-center">
                Minimum withdrawal {fmt(MIN_WITHDRAW_CORE, 0)} CORE.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Tiny deterministic PRNG so the graph's node layout stays stable across
// re-renders (same seed -> same "map") instead of jittering every mount.
function seededRandom(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Live, animated "network map" — a canvas-rendered mesh of miner nodes
// converging on a central pool hub, with traveling light-pulses standing in
// for shares being submitted across the network. Purely presentational;
// node count/pulse rate are loosely driven by real stats so it feels tied
// to the numbers on screen instead of decorative noise.
function NetworkGraphVisual({ activeMiners, hashrateTotal }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const nodeCount = Math.min(48, Math.max(18, Math.round(Math.sqrt(Math.max(activeMiners, 1)) * 1.7)));

  const nodes = React.useMemo(() => {
    const rand = seededRandom(nodeCount * 7919 + 13);
    const arr = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 0.2 + rand() * 0.8;
      arr.push({
        angle,
        baseX: 0.5 + Math.cos(angle) * radius * 0.46,
        baseY: 0.5 + Math.sin(angle) * radius * 0.42,
        phase: rand() * Math.PI * 2,
        speed: 0.35 + rand() * 0.5,
        amp: 0.008 + rand() * 0.012,
        r: rand() < 0.14 ? 2.6 : 1.5 + rand() * 1,
        peer: rand() < 0.45,
      });
    }
    // node 0 is reserved as "YOU" — pull it in a bit closer to the hub
    arr[0] = { ...arr[0], baseX: 0.5 + (arr[0].baseX - 0.5) * 0.55, baseY: 0.5 + (arr[0].baseY - 0.5) * 0.55, r: 3.2 };
    return arr;
  }, [nodeCount]);

  const meshEdges = React.useMemo(() => {
    const rand = seededRandom(nodeCount * 104729 + 7);
    const edges = [];
    for (let i = 1; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (!nodes[i].peer || !nodes[j].peer) continue;
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        if (Math.hypot(dx, dy) < 0.17 && rand() < 0.55) edges.push([i, j]);
      }
    }
    return edges.slice(0, 40);
  }, [nodes, nodeCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const hubSpokes = nodes.map((n, i) => i).filter((i) => i !== 0);
    // Pulse spawn rate loosely scales with hashrate — a busier network feels busier.
    const spawnEveryMs = Math.max(140, 900 - Math.min(hashrateTotal, 4000) / 6);
    let pulses = [];
    let lastSpawn = 0;
    let sweepAngle = 0;

    function project(n, t) {
      const dx = Math.sin(t * n.speed + n.phase) * n.amp;
      const dy = Math.cos(t * n.speed * 0.8 + n.phase) * n.amp;
      return { x: (n.baseX + dx) * width, y: (n.baseY + dy) * height };
    }

    function spawnPulse(t) {
      const toYou = Math.random() < 0.22;
      const kind = toYou ? "you" : Math.random() < 0.75 ? "hub" : "mesh";
      if (kind === "hub" && hubSpokes.length) {
        const target = hubSpokes[(Math.random() * hubSpokes.length) | 0];
        pulses.push({ type: "hub", a: 0, b: target, fwd: Math.random() < 0.6, start: t, dur: 1400 + Math.random() * 900 });
      } else if (kind === "you") {
        pulses.push({ type: "hub", a: 0, b: 0, fwd: true, start: t, dur: 1100, isYou: true });
      } else if (meshEdges.length) {
        const [a, b] = meshEdges[(Math.random() * meshEdges.length) | 0];
        pulses.push({ type: "mesh", a, b, fwd: Math.random() < 0.5, start: t, dur: 1700 + Math.random() * 1000 });
      }
      if (pulses.length > 70) pulses = pulses.slice(-70);
    }

    function frame(t) {
      if (!width || !height) { rafRef.current = requestAnimationFrame(frame); return; }
      if (t - lastSpawn > spawnEveryMs) { spawnPulse(t); lastSpawn = t; }

      // fading trail wash instead of a hard clear — lets pulses leave a soft streak
      ctx.fillStyle = "rgba(7,11,20,0.32)";
      ctx.fillRect(0, 0, width, height);

      const hub = { x: width / 2, y: height / 2 };

      // radar sweep + concentric rings around the hub
      sweepAngle += 0.006;
      ctx.save();
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, ring * Math.min(width, height) * 0.14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,${0.07 - ring * 0.015})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      const sweepR = Math.min(width, height) * 0.44;
      const grad = ctx.createConicGradient
        ? ctx.createConicGradient(sweepAngle, hub.x, hub.y)
        : null;
      if (grad) {
        grad.addColorStop(0, "rgba(0,229,255,0.16)");
        grad.addColorStop(0.06, "rgba(0,229,255,0)");
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.arc(hub.x, hub.y, sweepR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // mesh (peer-to-peer) edges — faint, organic "back roads"
      meshEdges.forEach(([ai, bi]) => {
        const a = project(nodes[ai], t / 1000);
        const b = project(nodes[bi], t / 1000);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(90,140,220,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // hub -> node spokes — the main "highways"
      hubSpokes.forEach((i) => {
        const p = project(nodes[i], t / 1000);
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(0,229,255,0.10)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // your link — brighter, distinct
      const you = project(nodes[0], t / 1000);
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      ctx.lineTo(you.x, you.y);
      ctx.strokeStyle = "rgba(0,255,171,0.35)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // pulses traveling along edges
      pulses = pulses.filter((p) => t - p.start < p.dur);
      pulses.forEach((p) => {
        const prog = (t - p.start) / p.dur;
        let sx, sy, ex, ey;
        if (p.type === "hub") {
          sx = hub.x; sy = hub.y;
          const dest = project(nodes[p.b], t / 1000);
          ex = dest.x; ey = dest.y;
        } else {
          const na = project(nodes[p.a], t / 1000);
          const nb = project(nodes[p.b], t / 1000);
          sx = na.x; sy = na.y; ex = nb.x; ey = nb.y;
        }
        const k = p.fwd ? prog : 1 - prog;
        const x = sx + (ex - sx) * k;
        const y = sy + (ey - sy) * k;
        const fade = Math.sin(Math.min(prog, 1) * Math.PI);
        const color = p.isYou ? "0,255,171" : p.type === "mesh" ? "120,170,255" : "0,229,255";
        ctx.beginPath();
        ctx.arc(x, y, p.isYou ? 2.6 : 1.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${0.9 * fade})`;
        ctx.shadowColor = `rgba(${color},0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // peer / miner nodes
      nodes.forEach((n, i) => {
        if (i === 0) return;
        const p = project(n, t / 1000);
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,170,255,0.85)";
        ctx.shadowColor = "rgba(0,229,255,0.6)";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // "YOU" node — distinct green, pulsing ring
      const yp = project(nodes[0], t / 1000);
      const yourPulse = 1 + 0.25 * Math.sin(t / 260);
      ctx.beginPath();
      ctx.arc(yp.x, yp.y, nodes[0].r * yourPulse + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,171,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(yp.x, yp.y, nodes[0].r, 0, Math.PI * 2);
      ctx.fillStyle = C.green;
      ctx.shadowColor = C.green;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // hub — the pool itself
      const hubPulse = 1 + 0.08 * Math.sin(t / 500);
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 9 * hubPulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,229,255,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = C.blue;
      ctx.shadowColor = C.cyan;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [nodes, meshEdges, hashrateTotal]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1c2536" }}>
      <div ref={wrapRef} className="relative w-full" style={{ height: 172, background: "#070b14" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-2 left-2.5 flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: C.green, boxShadow: `0 0 6px 2px ${C.green}`, animation: "core-pulse-ring 1.6s ease-out infinite" }}
          />
          <span className="text-[9px] font-extrabold tracking-widest text-slate-300">LIVE NETWORK MAP</span>
        </div>
        <div className="absolute bottom-2 right-2.5 flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-[9px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.green, boxShadow: `0 0 4px 1px ${C.green}` }} /> You
          </span>
          <span className="flex items-center gap-1 text-[9px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.blue, boxShadow: `0 0 4px 1px ${C.cyan}` }} /> Pool
          </span>
          <span className="flex items-center gap-1 text-[9px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#78AAFF" }} /> Miners
          </span>
        </div>
      </div>
    </div>
  );
}

function NetworkStatsModal({ onClose, schedule, networkHashrateTotal, networkRewardRate, networkActiveMiners, miningPower, poolSynergyBonusPct, joinedPool }) {
  const yourSharePct = networkHashrateTotal > 0 ? (miningPower / networkHashrateTotal) * 100 : 0;
  const allocRows = [
    { label: "Mining (halving)", pct: ALLOCATION_PCT.mining, amount: MINING_POOL_SUPPLY, color: C.cyan },
    { label: "Marketing", pct: ALLOCATION_PCT.marketing, amount: MARKETING_SUPPLY, color: C.orange },
    { label: "Reserve", pct: ALLOCATION_PCT.reserve, amount: RESERVE_SUPPLY, color: C.purple },
    { label: "Founder", pct: ALLOCATION_PCT.founder, amount: FOUNDER_SUPPLY, color: C.green },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.9)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" style={{ animation: "core-modal-pop 0.22s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: "linear-gradient(160deg, #101B33 0%, #0A0F1E 55%, #060911 100%)",
            border: `1px solid ${C.blue}44`,
            boxShadow: "0 30px 60px -25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${C.blue}22, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${C.cyan}18, transparent 70%)` }}
          />

          <div className="flex items-center justify-between mb-1 relative">
            <div className="flex items-center gap-2">
              <Database size={16} color={C.blue} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">NETWORK STATUS</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mb-3 relative">
            <span className="text-[11px] text-slate-500">Max supply {fmt(MAX_SUPPLY, 0)} CORE</span>
          </div>

          <NetworkGraphVisual activeMiners={networkActiveMiners} hashrateTotal={networkHashrateTotal} />

          <div className="mb-4 relative">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Mining pool mined</span>
              <span className="tabular-nums font-bold" style={{ color: C.cyan }}>
                {fmt(schedule.totalMined, 0)} / {fmt(MINING_POOL_SUPPLY, 0)} ({schedule.percentMined.toFixed(2)}%)
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full relative"
                style={{ width: `${schedule.percentMined}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})`, boxShadow: `0 0 10px 1px ${C.cyan}88` }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                    width: "35%",
                    animation: "core-scan 2.4s linear infinite",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 relative">
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Users size={12} color={C.green} /> Active Miners
              </div>
              <p className="text-white font-bold text-sm tabular-nums mt-0.5">{fmt(networkActiveMiners, 0)}</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Gauge size={12} color={C.cyan} /> Network Hashrate
              </div>
              <p className="text-white font-bold text-sm tabular-nums mt-0.5">{fmt(networkHashrateTotal, 0)} TH/s</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <p className="text-[10px] text-slate-500">Halving Year</p>
              <p className="text-white font-bold text-sm tabular-nums">Year {schedule.yearNumber}</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <p className="text-[10px] text-slate-500">Next Halving</p>
              <p className="text-white font-bold text-sm tabular-nums">{schedule.daysToHalving}d</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <p className="text-[10px] text-slate-500">This Year's Emission</p>
              <p className="text-white font-bold text-sm tabular-nums">{fmt(schedule.emissionThisYear, 0)}</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536" }}>
              <p className="text-[10px] text-slate-500">Reward Rate</p>
              <p className="text-white font-bold text-sm tabular-nums">{networkRewardRate.toFixed(4)}/TH/hr</p>
            </div>
          </div>

          <div
            className="rounded-xl p-3 mb-3 relative"
            style={{ background: `${C.green}0F`, border: `1px solid ${C.green}33` }}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Your network share</span>
              <span className="font-bold tabular-nums" style={{ color: C.green }}>
                {yourSharePct.toFixed(4)}%
              </span>
            </div>
            {joinedPool && (
              <div className="flex items-center justify-between text-[11px] mt-1">
                <span className="text-slate-400">Pool synergy bonus</span>
                <span className="font-bold tabular-nums" style={{ color: C.orange }}>
                  +{poolSynergyBonusPct.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide relative">GENESIS ALLOCATION</p>
          <div className="flex flex-col gap-1.5 mb-1 relative">
            {allocRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                  {r.label}
                </span>
                <span className="tabular-nums text-white">
                  {r.pct}% · {fmt(r.amount, 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}