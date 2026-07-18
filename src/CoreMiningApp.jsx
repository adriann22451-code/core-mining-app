import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import {
  Home, Store, Package, ArrowUpCircle, User, Zap, Database,
  Gift, Trophy, Users, Target, ChevronLeft, Bell, Settings, Sparkles,
  Gauge, ShieldCheck, Flame, Coins, Check, X, Boxes,
  Search, Wrench, Star, Plus, Volume2, Vibrate, Globe, ChevronDown,
  HelpCircle, FileText, Music, ArrowUpDown
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
  nav_home: { en: "Home", id: "Beranda", es: "Inicio", pt: "Início", ru: "Главная", zh: "主页" },
  nav_market: { en: "Market", id: "Pasar", es: "Mercado", pt: "Mercado", ru: "Рынок", zh: "市场" },
  nav_inventory: { en: "Inventory", id: "Inventaris", es: "Inventario", pt: "Inventário", ru: "Инвентарь", zh: "库存" },
  nav_upgrade: { en: "Upgrade", id: "Tingkatkan", es: "Mejorar", pt: "Melhorar", ru: "Улучшить", zh: "升级" },
  nav_profile: { en: "Profile", id: "Profil", es: "Perfil", pt: "Perfil", ru: "Профиль", zh: "个人资料" },
  nav_pools: { en: "Pools", id: "Pool", es: "Grupos", pt: "Grupos", ru: "Пулы", zh: "矿池" },
  nav_marketplace: { en: "Marketplace", id: "Bursa", es: "Mercado P2P", pt: "Mercado P2P", ru: "Барахолка", zh: "交易市场" },

  // Common / buttons
  common_close: { en: "Close", id: "Tutup", es: "Cerrar", pt: "Fechar", ru: "Закрыть", zh: "关闭" },
  common_back: { en: "Back", id: "Kembali", es: "Atrás", pt: "Voltar", ru: "Назад", zh: "返回" },
  common_cancel: { en: "Cancel", id: "Batal", es: "Cancelar", pt: "Cancelar", ru: "Отмена", zh: "取消" },
  common_confirm: { en: "Confirm", id: "Konfirmasi", es: "Confirmar", pt: "Confirmar", ru: "Подтвердить", zh: "确认" },
  common_claim: { en: "Claim", id: "Klaim", es: "Reclamar", pt: "Resgatar", ru: "Забрать", zh: "领取" },
  common_buy: { en: "Buy", id: "Beli", es: "Comprar", pt: "Comprar", ru: "Купить", zh: "购买" },
  common_sell: { en: "Sell", id: "Jual", es: "Vender", pt: "Vender", ru: "Продать", zh: "出售" },
  common_upgrade: { en: "Upgrade", id: "Tingkatkan", es: "Mejorar", pt: "Melhorar", ru: "Улучшить", zh: "升级" },
  common_repair: { en: "Repair", id: "Perbaiki", es: "Reparar", pt: "Reparar", ru: "Ремонт", zh: "维修" },
  common_install: { en: "Install", id: "Pasang", es: "Instalar", pt: "Instalar", ru: "Установить", zh: "安装" },
  common_uninstall: { en: "Uninstall", id: "Lepas", es: "Desinstalar", pt: "Desinstalar", ru: "Снять", zh: "卸载" },
  common_join: { en: "Join", id: "Gabung", es: "Unirse", pt: "Entrar", ru: "Вступить", zh: "加入" },
  common_leave: { en: "Leave", id: "Keluar", es: "Salir", pt: "Sair", ru: "Покинуть", zh: "离开" },
  common_create: { en: "Create", id: "Buat", es: "Crear", pt: "Criar", ru: "Создать", zh: "创建" },

  // Settings modal
  settings_title: { en: "SETTINGS", id: "PENGATURAN", es: "AJUSTES", pt: "CONFIGURAÇÕES", ru: "НАСТРОЙКИ", zh: "设置" },
  settings_audio: { en: "AUDIO", id: "AUDIO", es: "AUDIO", pt: "ÁUDIO", ru: "АУДИО", zh: "音频" },
  settings_music: { en: "Music", id: "Musik", es: "Música", pt: "Música", ru: "Музыка", zh: "音乐" },
  settings_sfx: { en: "Sound Effects", id: "Efek Suara", es: "Efectos de sonido", pt: "Efeitos sonoros", ru: "Звуковые эффекты", zh: "音效" },
  settings_feedback: { en: "FEEDBACK", id: "UMPAN BALIK", es: "RESPUESTA", pt: "FEEDBACK", ru: "ОБРАТНАЯ СВЯЗЬ", zh: "反馈" },
  settings_vibration: { en: "Vibration", id: "Getaran", es: "Vibración", pt: "Vibração", ru: "Вибрация", zh: "振动" },
  settings_notifications: { en: "Push Notifications", id: "Notifikasi Push", es: "Notificaciones push", pt: "Notificações push", ru: "Push-уведомления", zh: "推送通知" },
  settings_language: { en: "LANGUAGE", id: "BAHASA", es: "IDIOMA", pt: "IDIOMA", ru: "ЯЗЫК", zh: "语言" },
  settings_language_row: { en: "Language", id: "Bahasa", es: "Idioma", pt: "Idioma", ru: "Язык", zh: "语言" },
  settings_support: { en: "SUPPORT", id: "DUKUNGAN", es: "SOPORTE", pt: "SUPORTE", ru: "ПОДДЕРЖКА", zh: "支持" },
  settings_help: { en: "Help & Support", id: "Bantuan & Dukungan", es: "Ayuda y soporte", pt: "Ajuda e suporte", ru: "Помощь и поддержка", zh: "帮助与支持" },
  settings_privacy: { en: "Privacy Policy", id: "Kebijakan Privasi", es: "Política de privacidad", pt: "Política de privacidade", ru: "Политика конфиденциальности", zh: "隐私政策" },
  settings_terms: { en: "Terms of Service", id: "Ketentuan Layanan", es: "Términos de servicio", pt: "Termos de serviço", ru: "Условия обслуживания", zh: "服务条款" },
  settings_help_toast: { en: "Opening support chat...", id: "Membuka obrolan dukungan...", es: "Abriendo chat de soporte...", pt: "Abrindo chat de suporte...", ru: "Открытие чата поддержки...", zh: "正在打开支持聊天…" },
  settings_privacy_toast: { en: "Opening Privacy Policy...", id: "Membuka Kebijakan Privasi...", es: "Abriendo política de privacidad...", pt: "Abrindo política de privacidade...", ru: "Открытие политики конфиденциальности...", zh: "正在打开隐私政策…" },
  settings_terms_toast: { en: "Opening Terms of Service...", id: "Membuka Ketentuan Layanan...", es: "Abriendo términos de servicio...", pt: "Abrindo termos de serviço...", ru: "Открытие условий обслуживания...", zh: "正在打开服务条款…" },
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
    (style = "light") => tg?.HapticFeedback?.impactOccurred(style),
    [tg]
  );
  const hapticNotify = useCallback(
    (type = "success") => tg?.HapticFeedback?.notificationOccurred(type),
    [tg]
  );

  return { tg, user, isTelegram: !!tg, haptic, hapticNotify };
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
  { key: "starter", name: "Starter Rig", rarity: "common", basePower: 4.2, baseCost: 320, kwh: 1.1, wearPerHour: 4.5, desc: "Entry-level rig for new miners. Low power draw, easy to maintain." },
  { key: "pro", name: "Pro Rig", rarity: "rare", basePower: 12.5, baseCost: 880, kwh: 2.4, wearPerHour: 6, desc: "Balanced multi-GPU setup with solid efficiency for steady daily income." },
  { key: "hyper", name: "Hyper Rig", rarity: "epic", basePower: 34, baseCost: 2240, kwh: 4.2, wearPerHour: 8, desc: "High-density rack with reinforced cooling for sustained heavy loads." },
  { key: "quantum", name: "Quantum Rig", rarity: "legendary", basePower: 82, baseCost: 4720, kwh: 6.8, wearPerHour: 10, desc: "Flagship immersion-cooled unit — the highest hash power in the fleet." },
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
const COMPONENT_CATALOG = [
  { key: "rtx5060", name: "RTX 5060", rarity: "common", tflops: 19.2, vram: "8GB GDDR7", msrp: 299, boostPct: 10, power: 8, price: 480, wearPerHour: 3 },
  { key: "rtx5080", name: "RTX 5080", rarity: "rare", tflops: 56.3, vram: "16GB GDDR7", msrp: 999, boostPct: 28, power: 23, price: 1350, wearPerHour: 4 },
  { key: "rtx4090", name: "RTX 4090", rarity: "epic", tflops: 82.6, vram: "24GB GDDR6X", msrp: 1599, boostPct: 41, power: 33, price: 1950, wearPerHour: 5 },
  { key: "rtx5090", name: "RTX 5090", rarity: "legendary", tflops: 104.8, vram: "32GB GDDR7", msrp: 1999, boostPct: 52, power: 42, price: 2350, wearPerHour: 6.5 },
];

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
  { key: "quickcharge", name: "Quick Charge", rarity: "common", amount: 100, price: 10 },
  { key: "powercell", name: "Power Cell", rarity: "rare", amount: 250, price: 22 },
  { key: "fullcharge", name: "Full Charge", rarity: "epic", amount: 500, price: 40 },
];

// 7-day check-in cycle for the Profile "Daily Bonus" tile. Streak wraps back
// to day 1 after day 7 (and resets to day 1 if a day is missed).
// Kept deliberately tiny — CORE is meant to be scarce and earned mainly
// through active mining, not free daily taps.
const DAILY_REWARDS = [
  { day: 1, amount: 1 },
  { day: 2, amount: 2 },
  { day: 3, amount: 3 },
  { day: 4, amount: 4 },
  { day: 5, amount: 6 },
  { day: 6, amount: 8 },
  { day: 7, amount: 12, bonus: "Quick Charge Pack" },
];

// Permanent milestones. `metric` looks up a live value computed in the app
// (see `metrics` in the root component); `format` controls how it's shown.
// Rewards trimmed to the same small scale as daily missions/check-in/
// referral — permanent one-time bonuses, not a shortcut to easy CORE.
const ACHIEVEMENTS = [
  { key: "first_rig", label: "First Rig", desc: "Own at least 1 mining rig.", metric: "rigCount", target: 1, reward: 5, xp: 50, format: "count", unit: "rig" },
  { key: "component_tech", label: "Component Tech", desc: "Install at least 1 component on a rig.", metric: "installedCount", target: 1, reward: 6, xp: 60, format: "count", unit: "installed" },
  { key: "field_repair", label: "Field Repair", desc: "Repair a damaged rig at least once.", metric: "repairsCount", target: 1, reward: 5, xp: 40, format: "count", unit: "repair" },
  { key: "streak_master", label: "Streak Master", desc: "Reach a 7-day daily check-in streak.", metric: "dailyStreak", target: 7, reward: 20, xp: 150, format: "count", unit: "day streak" },
  { key: "fully_loaded", label: "Fully Loaded", desc: "Fill every component slot on one rig.", metric: "maxFillRatio", target: 1, reward: 30, xp: 200, format: "percent" },
  { key: "power_overwhelming", label: "Power Overwhelming", desc: "Reach 350 TH/s total mining power.", metric: "miningPower", target: 350, reward: 40, xp: 250, format: "ths" },
  { key: "rig_collector", label: "Rig Collector", desc: "Own the maximum fleet of 5 rigs.", metric: "rigCount", target: 5, reward: 60, xp: 300, format: "count", unit: "rigs" },
  { key: "six_figures", label: "Six-Figure Miner", desc: "Earn 100,000 CORE in lifetime income.", metric: "totalEarned", target: 100000, reward: 80, xp: 400, format: "core" },
];

// Daily tasks. Progress resets to 0 (and claims unlock again) at midnight.
// Rewards kept tiny — repeatable daily, so anything bigger would snowball
// into free CORE fast and undercut scarcity.
const MISSIONS = [
  { key: "claim3", label: "Claim Reward 3×", desc: "Claim your mining reward 3 times today.", metric: "claims", target: 3, reward: 3, xp: 30 },
  { key: "buy1", label: "Make a Purchase", desc: "Buy anything in the Market today.", metric: "purchases", target: 1, reward: 3, xp: 20 },
  { key: "maintain1", label: "Rig Maintenance", desc: "Upgrade or repair a rig today.", metric: "upgrades", target: 1, reward: 4, xp: 40 },
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
  { key: "ref_25", label: "First Squad", desc: "Invite 25 friends to CORE.", target: 25, reward: 15, xp: 20 },
  { key: "ref_50", label: "Network Builder", desc: "Invite 50 friends to CORE.", target: 50, reward: 35, xp: 40 },
  { key: "ref_100", label: "Mining Cartel", desc: "Invite 100 friends to CORE.", target: 100, reward: 80, xp: 80 },
  { key: "ref_200", label: "Syndicate Leader", desc: "Invite 200 friends to CORE.", target: 200, reward: 180, xp: 160 },
];

// Bot username used to build the shareable invite link — replace with your
// actual bot's @username before shipping.
const BOT_USERNAME = "core_mining_bot";

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

// Seed pools so Browse Pools isn't empty on a fresh install.
const INITIAL_POOLS = [
  {
    id: "pool-nova",
    name: "Nova Collective",
    ownerId: "system-nova",
    ownerName: "NovaAdmin",
    feePct: 5,
    createdAt: Date.now() - 86400000 * 12,
    members: makeBotMembers("nova", [42, 38, 55, 29, 61, 18, 47, 33]),
  },
  {
    id: "pool-vertex",
    name: "Vertex Syndicate",
    ownerId: "system-vertex",
    ownerName: "VertexOwner",
    feePct: 8,
    createdAt: Date.now() - 86400000 * 30,
    members: makeBotMembers("vertex", [95, 120, 80, 140, 60, 110, 75, 130, 90, 105]),
  },
  {
    id: "pool-genesis",
    name: "Genesis Co-op",
    ownerId: "system-genesis",
    ownerName: "GenesisOwner",
    feePct: 0,
    createdAt: Date.now() - 86400000 * 5,
    members: makeBotMembers("genesis", [12, 9, 15, 7, 11]),
  },
];

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

// Seed listings so Marketplace isn't empty on a fresh install — simulates
// other players selling used gear. Real listings (yours, and other real
// players') would come from a backend; these bot ones never disappear on
// their own since there's no server here to keep restocking them.
const INITIAL_LISTINGS = [
  {
    id: "listing-seed-1",
    sellerId: "bot-1",
    sellerName: "Rian",
    itemType: "rig",
    item: { key: "pro", name: "Pro Rig", rarity: "rare", basePower: 12.5, level: 3, durability: 76 },
    price: 1450,
    listedAt: Date.now() - 3600000 * 5,
  },
  {
    id: "listing-seed-2",
    sellerId: "bot-2",
    sellerName: "Nadia",
    itemType: "rig",
    item: { key: "hyper", name: "Hyper Rig", rarity: "epic", basePower: 34, level: 2, durability: 91 },
    price: 3900,
    listedAt: Date.now() - 3600000 * 11,
  },
  {
    id: "listing-seed-3",
    sellerId: "bot-3",
    sellerName: "Toni",
    itemType: "rig",
    item: { key: "starter", name: "Starter Rig", rarity: "common", basePower: 4.2, level: 4, durability: 58 },
    price: 340,
    listedAt: Date.now() - 3600000 * 2,
  },
  {
    id: "listing-seed-4",
    sellerId: "bot-4",
    sellerName: "Gita",
    itemType: "component",
    item: { key: "rtx5080", name: "RTX 5080", rarity: "rare" },
    price: 1380,
    listedAt: Date.now() - 3600000 * 8,
  },
  {
    id: "listing-seed-5",
    sellerId: "bot-5",
    sellerName: "Made",
    itemType: "component",
    item: { key: "rtx4090", name: "RTX 4090", rarity: "epic" },
    price: 2350,
    listedAt: Date.now() - 3600000 * 20,
  },
];

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
const YEAR1_EMISSION = 20_000_000;
const HALVING_RATE = 0.5;
const SECONDS_PER_YEAR = 365 * 24 * 3600;
const YEAR_MS = SECONDS_PER_YEAR * 1000;
// Network launch date the halving clock counts from.
const GENESIS_DATE = new Date("2026-01-01T00:00:00Z").getTime();
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
  return (
    <div
      className={`relative rounded-2xl border ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(16,22,38,0.9), rgba(8,12,22,0.9))",
        borderColor: `${accent}33`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.02) inset, 0 8px 24px -12px ${accent}55`,
        ...style,
      }}
    >
      {brackets && <CornerBrackets accent={accent} />}
      {children}
    </div>
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
    starter: "data:image/webp;base64,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", // "Starter Rig" icon
    pro: "data:image/webp;base64,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", // "Pro Rig" icon
    hyper: "data:image/webp;base64,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", // "Hyper Rig" icon
    quantum: "data:image/webp;base64,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", // "Quantum Rig" icon
  },
  components: {
    rtx5060: "data:image/webp;base64,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",
    rtx5080: "data:image/webp;base64,UklGRqQeAABXRUJQVlA4WAoAAAAQAAAAxwAAbAAAQUxQSMAJAAAN8IVt2yFJ2v4d5xVRaGPa7p4e27Y9Wz/Pa9s2Fm37fR/bxti2bc/0dA+6aqoq7utcqOxBZUS+XIiICeD/91domgHbg1uoSU/rXZXBLFTSsw4+YM3k2CvbmvHRl25uFOlBK6IUc8iF5wLDs5csqmexdPIPv5VUzgFKkSU58KwtAooRQq6O+f2RD39pK6H0QBRySXY//X3zgCaiEj1F6qQfOuCLH3/EVOlBR+HGrDl/y1KgKGredlDY/CPnP/KfF01SOQcYBU2y+rQLNwGFqHnnFemFp//Y4s985kkU6YFEQZMsOfE79wYKUfMuh5xx2Pece
