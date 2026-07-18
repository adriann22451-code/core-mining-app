import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
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

  // Wallet
  wallet_title: { en: "TON Wallet", id: "Dompet TON", es: "Billetera TON", pt: "Carteira TON", ru: "TON-кошелёк", zh: "TON 钱包" },
  wallet_connected_desc: { en: "Your wallet is linked to this account.", id: "Dompet kamu sudah terhubung ke akun ini.", es: "Tu billetera está vinculada a esta cuenta.", pt: "Sua carteira está vinculada a esta conta.", ru: "Ваш кошелёк привязан к этому аккаунту.", zh: "您的钱包已关联到此账户。" },
  wallet_disconnected_desc: { en: "Connect your TON wallet to prepare for CORE withdrawals.", id: "Sambungkan dompet TON kamu untuk persiapan penarikan CORE.", es: "Conecta tu billetera TON para preparar retiros de CORE.", pt: "Conecte sua carteira TON para preparar saques de CORE.", ru: "Подключите TON-кошелёк для будущего вывода CORE.", zh: "连接您的 TON 钱包，为提现 CORE 做准备。" },
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
    rtx5080: "data:image/webp;base64,UklGRqQeAABXRUJQVlA4WAoAAAAQAAAAxwAAbAAAQUxQSMAJAAAN8IVt2yFJ2v4d5xVRaGPa7p4e27Y9Wz/Pa9s2Fm37fR/bxti2bc/0dA+6aqoq7utcqOxBZUS+XIiICeD/91domgHbg1uoSU/rXZXBLFTSsw4+YM3k2CvbmvHRl25uFOlBK6IUc8iF5wLDs5csqmexdPIPv5VUzgFKkSU58KwtAooRQq6O+f2RD39pK6H0QBRySXY//X3zgCaiEj1F6qQfOuCLH3/EVOlBR+HGrDl/y1KgKGredlDY/CPnP/KfF01SOQcYBU2y+rQLNwGFqHnnFemFp//Y4s985kkU6YFEQZMsOfE79wYKUfMuh5xx2PecetUHb00q56ChoElmn/LdBwCFqHkvFaSXfu8Pj338k9sIpQcHBU0y++gLjgfSUfPeh5z1sd93xFc+da+pMwcCBU0y7/ALTgLSUYmZqaCw2/e/7+l/vWgHFemOk9Qki48762ggM2oxkyvSo6f/1KqvfOZeqNLdpaCxR4/8zuMAl6iDGR9yav/vOO/Oj105gdxNCppk6KD3nQFkRlXRnwoy533X9y/88geekbtHoalk3uEXHA+4VFXQzxHOOPB95/7kLVXpFklNujryu04AKKoq+l5BTq097WPhDpFiyq6PPP80wCWioiWj8nE3TNCZocZZH3L+mQBNVBUtKja//oLcCRGlOA7ZcjZAE1HTtnNmvdIFiizJwReeDdBE1LRwFlo/Ikuy4czvmgM0ETXt/NZky4XcJKvPfd8qoImoae2pgtsrohSz4eTzNgOFGKLNi2jriFKSdcedtzdQiJpWd5a6nUJZkj3OOXMFUIialreqHdlCEdmYPc87ZyFQiJr2l6/6PFHaJeQmWb/l/IVAIWo6MOP6XwAVWlThxux65rlrgEZR05VLblA1RWsqaJJ1p5+zCSjEEJ0p1k28YFpS4ZIsOeO71gONoqZLrRdEOyhokpXHnX8gUIghOnc8aUEFTTL/hO/bGyhETSfL/aagSeaetOUIIB01Hb2DqvSXMplzzAXHAOmoRGeX0R30tZJjvuNUILOqRHeHD/vgv33kddw3yhWfGAan6qDbpU2/uOO3q+wffYDiqIIBcLKaoH+rqZ9maiQYDCs2P+h+URn5cdcMjrPH+ifXjjA4WrdQlT6BkTJA4DvoW/N8LLcGg8xRbiNnnAJI5NeYzyDoZChe/gepzLSqSaYn8eacAcBlKLjjPy5nxoeb0QOW67U73lr67OSD+2R0m5O6yos/+ghUZaYlP/LLwIJlObT1Ix8h6HJnHbz8+Q8AVTbM7MgD/gFstHo2+/8wnZaug6s/eyUosmGmS79KE5UgURKiq52q9cYX/xWoXJIZr2b2QaUWQEDQ2c46ePAD3wZVpaE/xycWia5P1+FLP/QAVC6F/jQemzdVd5pTtbZ+/j+AylP0r/z71x741xmd5ayD2z5wDYSyob+v/o5DER2drmPiog89DZUb099V+e0D6KpUpVc+/jGgyoa+NytKGaaD7Qju/OSVUJENLSi/tth0sEPljs88sWiXJeNjhZacHKaLNXb1JfURR8x/fQeksx3enNtBHr/2qg2n7D/yZoacWexWGJvdQcReL41XO6gQcqbT/We2LVLnOEYWjzwyJCKQ5Uxn/8ErC4c6Rzx+2+qTxkKSLLBT2XfmpVWUCkqoIzLyoWum9jy+RgYJUJK0wFOf+fIvbyl1RScaxWtfmHXIHiNjFgIjhAzuO73xd//yBlXzyZNXOdrOBGPP3H/whmo8K4MsQEKYvpfnfYOt55/7iz93/6UqVatZYutdz84+dNM4gQWWhUCIFsiVC5prJjbuufLSf/qDRSXUVkbKp+97Y9fNi3JSkgU2QhYS6j/zphaYbS8u0N999k+PpVStZILxRx8e2rxhVtMIITCAkZAgWiCef+qAL/DZP4Xqtl867HeW2tE2RmLrQ8/tstuqmEyQwLIMltwjaEH7++6FiQZK1fzlxT93gVJqExM0zzw8tnbXBTlJgIzZqUBISK3AK1sjkcHVolv+7LXfOISM1rDEG48+NbJhw+hUQWAZYSywQEgQrQBSAwbM1Ny45AP7/sgudrSBkXjp4VeWb1qqiVRY9EwAgyQQIkQ72uw0XVj4+oeu/95TlVK/maA881CzZtOc0iBHRgIGGSMQCEGItrWdLkPzH/y38Z/ck4y+ssSOx54c3bx6eLIIpJTBgOkp0DRJtK+zGOfs+pov7n3hIjv6xUi8+NirSzYu9ZRDRjamFxbIBKBwiDZypk0y/7Uv3nHOyUppBlk7sUR57sGyZt38MimBkbGMLQwyQrIIK2glksw0lHreU5998317kTFzhAWYKONPPTGyeXU9VQjAsrGMBZZBIBDqSTuni9PIOVrffPHuZyywY6a8Nq8ySGy9eWrxpqVqLIQBgzFgkCUjOZBE0N7pTCdg5kx85b4zjpLRe2NhgV97aM8FwIv3jR00f05OgUCWDbaMxU6FEJpOmzvdkACpuc99uTlnExnvnpFARlp3220Ll40/npvWDxcjABkDBvM2BRKaTss73dgGkcP1LVesP3uB0btjgnzpUfZejF+459Dhh14cXr9meCpBWOBpMr2NAFkSIYn2d7pkWgY8u7ns7mOOJaV3Q+x45rnhjX5g1vDLsecKD6eYsoRBNtNNT4MwQjulGzNLOhGQmvPsRW+dvYmMd+aXn3h1lzWLg6knxpauiAYLECAD2ADuAcISkgjRnZlZnBhhDw/ffPXGc2cZvS1r25WjqzfOysZoKHLKSCADGIwBLHoKE6AgwnSpM4sLGGHPeeuSe08+ipTehjx38UOjkwkggwALy1jYWNMAGQQShCTRsc4s6QRlUKo5j1/k89aRsTMYXvqIEQjLMrLABszOLctCIKEK0cWZ2di2LNmj1XVX7XHubFvqkdXt97+vCARYKSxsgTXNMjgshKxAIbra6SYz6a05b150/6lHi95i+ZMpHKQw001vM91AZABSoIpOT5eStkGQ1ZxHvlGO2bjMAovF216vLCMjyyCD6W2EcBhND7re6SzFGAtydOj667f+zIamcpVoopHpaVlgANnIQpYl1JsB0JkuhcQIe/bQ1q+etQa9OZ9q4i2m2wJhgSElLAQSIkSIAdHFWZwGsD33xk8de/oNX9vw48terWQwWEb0lkEghKRADJLpLJlOEM652z9z156n33rxnHPWTIQtjIXDIEDIEiEUDJx2OovTBnJ4+LnljD78+FEISKYLEIAkAgmJwTST4swE0sONPTq8A2RkWQBCEOrJQJvOdKZtDLIlOQwIISEpQIiB1067pG3LskAICRFIIDEwO5mWlqGHAglkBm1jG9wDCTHQm7fpwe6/iwFWUDggvhQAALBIAJ0BKsgAbQA+MRaIQyIhIRX8BWQgAwSzgGq9Ee6ft56BI6eacivYTedPj+jPxOfTV6b/MP+y37R+916Uv8F6gH+H/sHWEegB+tfp0/tz8JP9n/3/7ZfAP/HP7T/184n/h/4YeCv9u/EDzR/G/kH7p/bP2u/ufst4r+pf+c9DP5Z90f2f998yv9b4E+7z+59QL8Z/lX94/NH+6++D7H/u+1407+w/8D8o/gC9bvmH+o/uX7wf330/dQLvz/vPcB/VX/f/2n2x/2f+v8Sn0H2AP6H/XP+p/hPdZ/nP+1/pf9P+6Xs7/RP8T/4P8r8An8n/pX+0/vX+U/+P+k///1eeyX90fZd/YP/mn7IqQizAePXMtjn5GIxQPeepdIN2+K8y/nC03CTt1e6OG3304q0yWwNFo/zResiWNf/s2sRA5O7WbubUO/+ZmSoxuiui3D83YBXqT5jSFNdXgueQswZQ7fp5D96qtL/+c9chuv0oQOtreDPmpKBFLqvgwHddeu2frqPTru5/+1VBZ67DRFvM/7V4mu09S8xLA5y+jYcLkmgG+J3ld8bSn5m46f5jWrDkx4DDW37eVhFrnfFiW9bh4cENWn//9LqU6tD6PnwuRX+38lNO3jGcQjPEBM3JpNycMu4Efxe6Wv6vUCO5+lNhv4D3HTTGI5x+/1nBdgrlqXV7t2+sToXS0h3b/xBU/suxo8pC7g+tm0zyhdT9A/52WEQVlCTA1Nho7fzgsRcn62aJOVWIqpvv5lAnj7VS3As/CjfQMNj5AAs/CjcAAP7/DWQGTHql1x27FUWPH5JNA9uv8nHtkNjtC68bD5Zoo1FBO2F7vyo85Vowv1+8plv8iYSzFyg2rzA2kUhrqZJ45dOOgWN+bQ9XsLHWuEsbvkOn7otnINKVtNDpPUw0zuzjyDJkYAz5eT9kmqq22KhIR1ddfsln70Zz2oD6jLiMK61tyyIs5+EmP1Cg95nwrozPLy89q8UCVyCayFC+GhhcQKyyx5NajH98IjpbkBiMg0q48EAKihknNitTwpM/swLbe/fAIyW8ZxBfhvQ9/ed4JidSZiahepQep8f1xilnE6F/MNMtuByPfkvggb6p7t5O0ruFDgRrpziazpOpDGU8G28aEer5EF9xZcrm/G/x/jGRURN19rzYBN69YgmRug9CxIr92QAEJ/NOA2hZp/BxKWxmCjEZjn1vJHfbPqKFtNfDOYTLCOu4TdJWuR/MXyJTt9mT1O06ctPkQfYiPm84bVhbnlFYstKhkqif5lYHp/SooqpAj7WSwxT/iGmV/kaMDFb98DVXyzHeNqQbK5ZV47u2ah3PQDl/YmfrFe8Qalj05qq648FBfgInc7Xtj+H3BN8xJbcaKDmeGNOk04njqJH8L/guhznghrMjlKJ5nc5XiFNeRTkJea9vFZC8cazJIDvuNUGmuezoVz4lY4p37KyOt/reB3GkjEz7frX81neWaXHgHEAfpAk4oaqZjnmvaqd0Y12Pl84Yh7dDsx9t12IiNEG1X63291TmPPkeJHiBLEZj9KJfhqVRFc1yOquaemEAGOFRDLK+QX2hukZPLQofyE9vRvViIjJ8T+GMJrr5uj6bz2HpmLCiNSjL8e/rq8lcRqt3geveHZ5ac5kHLAIEcN0To+wScKjSbi6HVy17zoN/JJKNwsvmdVv2nTroAveaDrEN+4ngoQFHyCEAD0HUTao7J6MCR5t0nspba++GofXJZEY180VAeaSoLFRvGhOSkfiCs+ZtcTykLJIIFEKd9PA/3r3E+B1i2ZqkuLu3zmo0v3BNV/4J7g9TJEFOgz7kgc+nQMnY/F/ofWuLgOeh9oWoogLiT7gteScXu1KkZbFlJf8/didlDUmKhqaTZ7mQhUWKntKXyl9g2TCVeMsp08NZvvP+y4wGDnaNYJfK62NPKv2rRqDnfm4ajLdoVwMXq7OZX379bNzhFjHWUDK4V612yKAi1ntlhRwnUWAYt9eeFpDzAi/V601a6mDB6treKi5VJ3qpPix/BbdsEt6RJQF1IuQkfpGAljOeLeitBVBB8fDQOH6rIFvQWZD9PLRA5W3gi7eWXmxoxdMQo09RM1zeQ1OcdE38jWvDUV9eGHS9I4om1QJeVDoNHBr3DUh+mWVnXW2wULFYSX7yPjMqlogY/klKzOFGbIB0Gw00u+bo6h+e973hz4ATMxO89IvNYBqZ3brlGmdLvjwmHAyya4wd4pdRZEQpfVIz/peAiX/ugx9HAVa/Cbnlohe89tLjwbvlBqDW0XxQJEgPlr41P5bkLAfz9Nj1M80zKkAxyu6xXqTjzaGiCQ+ivoFmwnVyQ2JN+Rb1GMCJhVPgMVSwH+cFZ/7lhdxnYygFiBCv2tg4OgGmObloSlMz8D/QDSkX54dpAWM4dd/e2e+CfgLRVHodUiJg0na7nlaEviIdCp/bBi2WDqrsfs3I7RQHN2r/kuyFVixTeG8u9oQbLb8+SzYMigVUrTP1oc3OM2uPF2z2ibfrbo27r2pOITNqqSWwc3gL4938uk+d+BmyTXwNN/7w/zsPVZ9vyL+ifw/G9v1YWprRM4/zbkHvNIBgSAJV/hH1qfv2KjJgHAsCE/gvQyY+Ey6Kkh7IdEetnEfHEo8nxWWPWv9K0/XVAvmunOdfMwTZkO1QfWmp1jBx0CkxAll+y3GPUkhzLlLfixLZFC/7P4kKo9YkTgRTpUq8IOhsIBJCcXYXGvFWNVu6UNfXaWGLH9zwXFfzzKA/C2q1AlwD/w0Cdj8hL9nfaZA2otYnd3RiXBFHtSPCy/9zMCmUgWw8hZSzFdD+5+ztjTCuQ94GSoMJnrevxhj9CbtRDDN2O1CAn4cyGJpZO5uR+cENy4m7800vPNzvawNa9cfJYTmDt84XNpa5nWpTI3AfpPyspZHTIV2z0QwzjVjSwS52B5J+Gj985uz6o5wgtsGtInInp3bJJwvluaUjw/VeutD5H0lUo8HHlFftPhXxl8p9Ywg6rJ4JlsXGsg2w6veiN+eQBboHUVKAEFcFG7nmc43KVTQsV7py9BKNRMM37BkQs4pBL+pGH1QBsbGgHdh0cL6ce0TXvUJ7wzDfbULzppTbjAYX0y9jfwR1k4+7r+8IkSWZrsAGLNduigHqx8gU5rIRp2jRz94k+JPlLvOgdrewiUUEwVUAOlBb3OC3gWE1cRm6ViPX8SoEXtIU82U/J0PbqVj237UrzqsPZio6ez4peAvjClXy46Kj9JSTWJmUJ+uSoYoRue+ZrE9Es0xPfyDWNNoYggCMwNNxbVAu/yB/Lor5vznH5DZQ2VBoVZ0QtDwWpuEguxBVJnQE4Efx6vDuVjUTN2eeLxim/3lOwd+0ZAN15qfd/YKHdZtNW9tn3t6c0Cc6SLpk9kTzU7AzY8LIIjj14HskXRO+BGE5v8Ko9a2IY93ebcdNDTeq8bRrGbxQwzX3mYV8rmCGq8i8U+n3UQhl9wiC5a9iE011HaLHG7qEelYqc/X5fIEQN8AEY02tsH9Sm8nERvvPBL20Ve8nxAM2gj0WMOPf/G7iBZwo3k58WnvxHryM+dx5lgXrJNhZnFNpz04icJGAx2n/AaS/EANIZVWctPsnZApmUdeNi59Yk+oOwbeMgGlBuEtSWJlrIa7f/825f/R+3ksrD6vOLd1Z4b16965ByPCZBq1R0UmUks0QHgyjimeetD5MET3KFFuPksrumiH7EA7GfziX52GxM+E6bkgfbmOxKfP6hS3rqA6R6kaZzzup4kKvUuZZoJJ/FM55OMGqY8UxolZhFqmoiLmtZbpJbWPjZVTuaPljoIKsQsjPYBT6N4ujibQY7Yz3lv+bK8gnyZMETsS6uO6TZhokO8bGnrbxT1SKFOUuzYCm1mhfXT1XwOwT8kkFLLYfmqV0I2xyigiZJQrWokB+PAb5kwoo8gMaBcfXRwQMPyFnvAuBzJbozGxobpasCYs2CtfsfSnZNgAdfMXJsed92G5wucqZT1SWLqeBiW+OaoD9ZNdpdXa7456NomPp+JUe3tIceuvVC4D355UFmV+JCDFPlVVEqOSSsSPXGGRiygPXbmRdzcKvDjjKOxZPyK+9+4/UpHDdhiMLJiOIINBZwntXjuWfWoI5dkF9l56V63RN4RoiS9CrDMboyDm35jPzcSuvMImZjGFWmwligc0mVa5qnns0puAgBCWh05q/YFSP5zD8BsaKbx2fl5Tw+GqS7rrlbJj2eVeCt/255HCTP71S6mJT+72l7QcCMCcdDJWNRWhZHy9oKvezsENY0E9ntwfJ0bMNoYqQUHiGUlLfbSf9wzVBi+emn4YWM95OR+jWejBdMXCf7lOwjrW54SVN/PhOBP8ebO/v7XQNDDC+9QF3KEIJlRoTQGQRe88O7UNNwqWQX6VxPZycMx7DZg6DYt2Gfx2dzOg0mxnBp23F17JIqvujFh8JRzA+HDP0HroYQ3NCrfUG19qWRlKoj5eGscZ/QfGhuPnGDZjSdUkL/b1PNtNxX8VOVQLZxkyv21PfqI8MVv/etOoPI5+fO8Pz9flQKXPS8ZBhoFd/4kSes540kDm/mfMmZKo8ZfkSi0G0aqGfm5f7j0VwqYP/DjSMz/wgDIFEyFHsh79se2rS9t5AEaHJ3jhzz8qo1x4wtCL8bwSh9+ghPGFpyThkm6OIVSPUt8BZHvauRXAZCyPgqVmdKAnRaH2aufZ5LU4uG3sehPcdn7gB1mIsDfzKnGSBhMNcaAidm9nD95J3EmabJTB8TxT4lDDL8nPqyclHAKe4MZgrYISs+qRrR3xadgJ4KPpyxJGR6ygWWS85ZhjCbI4SOKs/6sZhFGQn5kIO5LXBvqdcAUekmXRNqC6ReYP5BFcYesa2ccvs4gG1e19wwNvv7VWPh/eqRorogM640YupEhffbsIGZamsWYL3E+TDczWazAFfzpS8jm6Mof8rbn8rWPSoVairD5CJgcR+l+VilBl13GuDt1l0JcLieSfjnG4vsOfK/bsCaGWscQSnkmsRNEyfBRBY/EnrADKqFqZJNOWs3DoXj82u9wGD/pCX6g+oWFPFU4pGxMn7xAOUFIwcTtCn2Sq4/mpenuF3uxp8w98iCR4ah6xLHotLB1a8Uux7dpdBJ7+KEwMhnHgSZ2xWkg2VAhyu++rgAeu0od+Ji86DQd0HABmtP5RFTwyiW76amQt2Mym4jDrEF9y0Ry0id7vnu1J8FaB8bbyLM9IjRQljFqZrICs2AwkKOfIu2M7zhUSPCqkiTADqkhrYIEc/z5BchM6yjsMsXMm3brfNsi5Qqz2MIkFB4JgqWt+yw0OFMymtr5F33dYyvu5xxD2ugJiEm1IZl4Rqff+Ds1UsNg+fh/XRLgjnb6NIcayE73BDNCNz7J3baCPJePbVJonPjXbIocYP+j4shl+g22quKibVprINdJSxSTCWTro4YyFZyjQ3kE3GZn5U7+l+cyBiAqfC2aCKrc3uu3540wHkfPz68pv0tsVYO+NfgAAAwswS/JCs1eToAMj1d3uwLvK1z/QojCLOvuqcPEoFHSBuo30upwkYhwqHvdv/vQ5U8YjIJmzWLn0okhQ/jF/IkBeemHYsnMtEVyyG9b/CFks5a4+HvKhDF7nNBezR7DfN36Xd+H/2fT/yHYQ1LWnPOvm9+eLKfmRq+EAIAUFATyK+Ha+AVJL9Oegu8VrVwAksopN6sFHT+sth/IBxy0eHbjsEvKj2hLJEa+UXXz0K5niDwS8+i4kDJPsGABqrDxq2b3uZbJfB4Yln2rIRAUiXVBMeAzrEhKa9GfJxPplZAUUzMAuCqEUHw3G6RNyrEeMTpAGfotp9Gg1M7BofJIW3ImoyhIiz+B4owOZyfW84DUZgAkeqGTOIIGFi1NZMq9F4PPUT1T8kCjbozr8KerddA+dknkf8NfXjzNVGoDb+iVdvku2PFhNd57PMJxmgBoVCPHhIgC4gfxizTP7G19ySF0orNceKfSe+h1tOETFN0O0fCP3si86kyFrTRskqErdU2PZVTx79qobcZpm5VWqELc/9da7CBRoK2b+ANaFsXPHoHEO7uqJgplqAqKizsFYzcH3Lg4N9lIlaRPI7aAOkEM6BbeAYbNQJNA73dZ6FtLy2gF3ux9dhM+C6GIrbL9Z9gfJOd5VD5xpIo9m9rDwCm3hSywIFNjtdoNfs2c4VBGwUNAW4z7TAJcmdIdUAe7qcO57gaxZuljlWaY7O/g4S1JohnzWYJHIX1ASQS3rg5z/dIsEz+nZvA4hfnWqK9PiyiQPrCUFLczNvQsjyVoquTkTEl7wcNtixIN1cLAFaVq6ttJpTh76Qg1nv2SN/ryUNplrijmB0DSmetFq97v8yM+mPSjE9aHKFmL4NaI43b8dCILyK2P6ZB7J0ucomecnQbTudPHp6a3y6tNi4f//KOrz0L0PICaWd8yfsNo62CForD/YHjav409M/sSFcM3X0eg1QxVlS+uJsgP3MY7uuPbFSFIlwSUCFouzx73FJTlzAhhkb39kGoMxtd0WjrLb+5Q/KDzioxGDDiQ/hLngTmR4qRGNo2R0bIARpoyY8C4y/cH6lUhtGkkPB9aaVcGe8b3yRR+tyKBkAAAFNb2DTCyGOFxgJGdMDkBiNs+bYWQAFcdZNhQR5PMabdzr8tcH+F0HUrj6DrFGZ39f8dq8hC/oZvVQki0AQsc/CgD6HGDnrnAfOi1BgiYS0qOVTtOLnfQEEEoSlvV79sTRAyLwc3McdFgn/KUVxZgARuHnWchx38vCeU/rt1WOr2ZnToFYish9CtlexJOvv3v9a72fVf4dPLuhvyPkQAhPwNUCPnch3uGMh+9IOq4fTB6GTojAHg6P/+L2q15aFnUOh/soLxlwruvBb8MTvaVkaGWcKbMoBn/B4HFQEci0DfPWKuhE5ivDaUWkkAiJldYRXRyNvxPFv7YblZYXy3Uk7pc2ebOeBRQHPdberVcpx3Xqt/v1UGx8dV9aoEgdJsNWgNN/fd55IhJ+e1B2ROftauOes+Wf4sLWT/5yzLFCutRWKoQHGlkAByOIPIAAABCrVnhojaAXb1NCR7UHlNpgHPZ26YAAAAAAAAA==",
    rtx4090: "data:image/webp;base64,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",
    rtx5090: "data:image/webp;base64,UklGRrAcAABXRUJQVlA4WAoAAAAQAAAAxwAAbAAAQUxQSJUGAAAB8EVrt2nbtm39KaXaNWzbtm3btm3btm3btm2721YrKaf/obuXnMuYeImICcD/RYu1VNXMWq1Wy6SxqWFcrZmpAlNtd81zr7zwxIN3XHrKsQesYIA1LzVgwQv+5Nh/uIUCJo1KDVj+viGkVz5qVVWVB/nx7gBMmpKYAAvcWZFV4tinRL6/U0fApAmJAVjujoGkB8c9JfKrvToCJk1HW0D77V9JpAfHb0rk90dMBpg0GDEFptjnS5IeHP/JyR8PmwowaSjaArDwhb+TyYMTNjn51/FTAybNQ0yB1oYPDiM9cSJMTv5x0oyAabMQAzD30V+RrBIn0uRk99NmAkwbg5gCuvGDg8jw4EScnOx50RyAaSMQAzDb0Z+R9MSJPZzsdeFcgGnxxIB2q97VjwwP1jGcHHjlnIBJ0cSAWU76mqQn1jac7Hv1/IAVzICZr+pL0oO1DicHXTgTVAolisn2/Jv0xPqHk112Qpm1Bez+G1kF8xgVefOUIsVRA2a8ifTEfKaKZ6JVFm0JMO/l3RmJWa38Plg5RFsKYOnr+5POzDrfgJRCDQAWOPTVivRgfj4sg6gJ0H7p454fRtKD+U38GAVUA4AFT/rOSboHc5z4ff5UAVvi+NeGk3QPZroApsD8Z37eRtJTMN+Jn2dNTIBV7x9K0j2YdeeHkGyJAVj78SCrFMx9Fa9DM6UGdNrlNZIeLGDwCliOxASY5ahvyfBgASMGbgFFfsUALH9tbzI5CxnDbltZJDdqQLvtXwvSE8sZ/Bx5ERNgpsO+IOnBkrq/lxMxA7DiTb3J5Cys80VoLtQATLXLK0F6YnGdT2ZCzYB2a13fmaQHC5wJMQUw14lfkXQPFrninbC6aQvAbLs+PIAMTyx1xZvRqpcpMOXuTw4g6YkFr3hJrcQEmOeUP0i6B4vuPKROBmCd+weS7sHSe2wDq41isp1fI+mJ5a/I+aB1EWzxExkeLH54MF2pgpqqXUq6s/zhJB9ZHrU1rMxILH84OeLh1QGpTQunp4rFDyerB5cFVFFbwcv04jk58uYlAVXUVzBFZ6ayhQfTPcsBqqizYqVg0cNJvrAyYIraiqlIC4fSCxZODr97dcAUtRXDqK3WJayKFU5WDy0NiKK2YsAUqy0xlQEXFyucbLtjWcAM9RVgsuP/YNX52zcOuotepHBy6B3LAqqo9RSH/0QGyx0VOfTWhQBT1Fkx98+kJ0ZK7iUKJwdfsTBginq3cAxHJBY7VWTfKxYCVFH3Fs6onKVOTg66fG7AFPU37MiRhUpO/nPuPIApciiYc7OzoipQcvKvs6YHTJFJwXKfs7wpkX+dOC1gilwqFifPPoGpKMnJrw6aGjBBPg0bsosuyygK+dO+HYCWIKeGDeKHae+il6T66qBOgAnyaliX7NrGgoa/Oj9ggtwaVmKwmBEkq7Z/phFBdhULpeRRCjJ5It/ulKe5R5Bk8gIEu/5F8ut9OkKQo5lGfNA7BemRv+h8wbUvbtEOudZ5l+nB+PJtMnJHJ18FYJInscO7tr3m5+CUQZGyFh7k61taS5BnwXTDeMicPBdYrqLnK5zkixsi44LpuvkSne5bWdpjt6GsIk/hZPX0hoBYxqRjZy6OUQ3LvE16hsJJv2MZQAw5F6y/iYgKAIMd1Z2eMhNODr9reUAN5VRgzqfIKjISTg6/ewnAFPk3GxNgwI6/kykX4eTgGxYCTFFcVcxwQxs9chBODrh8QcAURTZglc9Ir11yst+FcwKmKLUYOh7XlylqlZzscsZcgClKrsAiz5JV1CY5+fspMwCmKLwYsHMXMtUiJSd/PWIKwBQNUBUzXt7GKiaaNIZEkl8fNgXQEjREA1b9mPSJhZFG8eGvf/7Pfu0AEzRHaaHDSQOZYkLFKIPfJT1SIi/rMA3QEjRLBRZ/jqwmiCemiOi72xafkuT3B7cAEzROMWDnzow03lIiB5JVRa5kZ/X4drcOgAgaqSpmvDroMV5SIj/cdZaj+pD9T5sWmLIdYGiuBmzwCenjg/xiXwEw/1UnzgOIASZosmLocOxgehqX8Pe2aAEmBgAmgAiargFLPE362DkvBGAAoGaKhiwGHNCZ4WND77G7GZq3Cqa/hvQUo/M+5P1oYkAL2OgDkjGa4bf8eOxUIo0MYtAjv+/HGCXxADR4AzrM35VtZPL4bBKRxgYxwVb9WAWr+HsyNDhADPM9RP5K9p4N2uQAA/befvLjh/SYEtLsoAIAS6wDQeM3E8O/RrV/C/9bCABWUDgg9BUAADBNAJ0BKsgAbQA+MRaIQqIhIRXODZQgAwSyhtgcQAMva8lNsq7mHuK9TeH+SbM3CS/PXsAfpN/fPW7/t/XJ5iP5b/j/We9Dv979QD+2/7zrFfQA/WbrMv3J/dr4Bf5T/ef/VnAH8R/BP9dvGj+x/UB6m/jnyj9v/K/+9e2J/Xd7Pl7/k+iP8h+3/5/+7/uD66f6/wN+BX9n/ZPYC/Gf5F/e/zF/tvvq+pf6Lt5q3/7z1AvXf6B/pv7B+83969GT/J9Cvrx/yPcA/oH9V/4/q7/j/+t4kXnP+i9wD+f/2v/hf4f9vf8B9LH8R/4P8b/qv2f9n35//iv+t/j/3p/z32C/yj+jf67+5f5f/z/5b////n7u/YL+2Xsqfrv/yEDpVim1gPJFy90qRPHV32rsWWawqau8Vxu459Rt/jeCu/+q6FNH/3UMmb+PsS1wVIOBWkLkoYds2D3omTRSG65GkP/zxWCkILtBTAOW3z/5COlr1QoDZ1N0mpzuBc9meqa/9v3JJv4RpKk2Bkk+lEKd3bImpfLOPxt5j/8n4h1maHGmdlP/m/7H+RnFhkdBwkLGQg3jKPFwkdvPlir8Za0MILimkd6/6hb+o/hlRwKU8kt5tmS5jwdT5T7zOVCe/sgTus7biUGZaX8AJ7yUkptjle3/vF8x9deC2R0Wt+3fj4b9oyHPKrVhPpavRwU5lkWlnMvai6geU6irfr+vayh+tRFGee8pi3SX28gGlXFDeKZeuc/dtuXfs+3nn7+O78rgCYc5z2J6timGr+DuQhKRy9VSGlXvlIk/vIaV4VfwbuxYBULoprX2K9L9dOHpkaYbP+wAAP7xxoB49KFueuyMfvOh4s/LW55g4nE/K0ALyATo+e8fdrVyzFMmZF4RhbCIEMRGljc5cH8R7Gc3PmEpxkrdo4OCacpnAz387iwkPgtmNfn/Z0H+n1atV9vh5ROmoi/pdrFE8s/de2H9SmzFGO/m4gh0pvDWoMzEUMeyO3aYg8BZAMzj/H7HGdjbTK2mHN2+IU/bkfLrC1t2v1ogF3Gne1Sv+BvS1obqE5BM0+ND4ZsuIuNUx0xu2rDjVkpQZKzgaA4+d61pZJRv17JF9bUZWLDjanD0AlM/vWHYT7o8l5inxBwx3Mh81eIS88e31mDnYecyrr/eERDZeSGxO2gGLz5BXGxDwOD4EB6+hB1oqV+KNGCDYGq95+eo77RxBShhWKCvWIjng6oFmDFg9/LJDhKtIXxi7TtnMg6zd0DAYoDwXUmC8S2i93x9gJ1iJHkveQJHc2p9wM/J5IA8e4hBKrIUOPa/BoBzm30/JhKspX3+Ev3ZMtu13kKLfj73qn4eoceoA9jCDkG9hK5JEQpcyiUSielqEtN97BcPODEoWUgZYopY+awkFKEOScOyoiRN9RAa/9m7Slzxlc5hXOXW2U8rU9Ik8Rjy9OS+cgbfAaIcAg0daCvNK72aTQBYLcuMjJEno43kYxYF5L+H981Nnz/JiFcx2c0x0XtDRFA0CIJcEA1Sgk7U0PDlTH0u40kMWMZW2CPxKYnOuvPFWojdEq1LfqYvo+paGfHEzj16BWABsZa87TBxBg9bOYsawrbh+6lR8Yon/4WCIXQR4eFSBYGRFJror920yPQY5ob7EuJwtZ/Ls12omdxIXXPZ3P3hoJaaGSSKJhSuPHfKgBNTDkKvn4JxJd7Y0+Q4EzIS6NvOQYDph8efq7L5ZEf6YwwsDnpzYgRVuOVIvuCgdr/EpCZ5+9H13y8xC7QKRBiUT+UXIDe5xpJNtmxMYMEz9MKVuNhmbClu6zNSRYyjzsTpjvK5t4ja1YMYbcW+hhzqgbnShPHjfRMrxIWvyad1tm5x2bIAfpVMsMmUbUYu96jpvbr4Q8PMkhBzb3Gd1M9xHm4Yd3isUxaSNL9YkYsjsDJ2ZzWRF86bkGxugljYpmbTVujuBQ4VM4pLB3gF/bqMmDTno/1z4QUeoiE8tPkMcHkc383j72iuhu6zPLAMcCLTkP7l5yWhoigjkYFFzdIk40gQzPzn4bCF3N02AC+pxtw/hfPIXZRRgWzXT2kPY1elY+JjTJRPanN22HAY5XHYRgiEL9/SNbIE5vNMzYnH4UJlV/DWkdIDtoPRqMg185jg+Y6SdotG0eBqRF7UEKqgT8G4B12mepD7q7Q1uT24yUzP9zbINz0MfjQoU8lTuWklxJ5HucNC8gNFkUwDjzJr7plqSEhB1H+pOESokhq46LS0gzcSO+U3NKfIG12NA5nOsuIok2eeDaEw2BSGN7jr7Ms8E+TupB2szl+w7pLT+p16FFeSFmZF1s3fwB7zncraGIA1Q6Bom/Wqi280majk9jlUBETwnAXE0rC3trv3L+GZyWocB55M9rmJFaD8KClY32ZBtO03VhQCID/5Bg4czkH/N0F0h2v3PLrl6N7+uf+q7I66f0waMo3yrmFMsx5lTl5qbUvI8BMUaQcFXNGayjgFScCzTBRB6WWWtVCmMTwXTUuQwt3K9ko9UQJON2RdDXGVNV68FhNcx2rKur3HF3mZ5PBXBmAmJt5ARMNWyxFva0TAP4XK3aKcD1UV/gw7zU8gyyDbQ5Ew7wNmS/OUnZi02CNfj9T7doLwgC+hNp16n/64YDz1Kg5+nhva4e+56sLav1xusPEDVKlNwLcV47/LoOOOvkZL4PuAOM1dc5ZPxOBTa+MfBTq/7ruKCyoNcta77HpN/quir5SjKGQ/FPAjIKtbdb+z1t3ph0+1yVMoqsvT7SRSB41K7MqrmZv1WIDLMvDk7As86ROH9mHYN0wM3XGaVYqwJL8V+uRNDfjl8PwMyqb56e3MInWRRd4hPwasor4lXB9CcLIxC6XMked9I0JpWcNPaC17wTZAMSSKwfSPG8yC4qP6hWzfVIq7Z3lx2clAEEHXdNgEzJeYM13Vh6djA/JK/kMUMZFg8+04WWq8ZGnR53ml9Ff4PpbyQ6rbzr7rVCZfOsfe8qHcWISWwapx7Yob4xTsW6KL+I3rl/VfQcGNfqLsuFvh5h1OkvWaEPOTiEjmmuEDie6hgXOSVopf5KvvxA1/hz1mWY6TgGauhL+ORanQze1MF61UqaBf0ww9RTYE6zTdH06NChiP/FAqIlkgakUBCOptML63ttjgOLR+1JSxAi29nqSGGrF0pGxRdsNaOnP8CRqd+VKj9wCKXyA/Vgyywby1KsV6MPfkeykZRd6JSYIsc4vUjm2PRklfzTjh0JiAPlp4EqrJcVns4QcbPkfmJHpmgFdU0jbr8tGfKi6lrVOAboFG8ViaAD4gWI6jbzoopMCkklbNkvkwj7m8d/tA2e1Ptcjw4X+Sh8IwJSMXzDSrWsoxwCKshiwRamMWsRpGXbh9lXs3BqoBi+sNMyT8G4nevA03rbA8TEW17Ii8fIpdYURiCx0FENGvAdeIbAMOmGuGr6cGy8+8HkQ4bgTKWryLKWHYvEmSkDH9jETSKKXp3lEkTgykA494vpi4C00fFhPKG5isr0HG4JigifbqzuAZNeWALikyAGN34aBVUEoR8Pf/01KyemAAlpfSrDtbWVR1kz4S9cyBySFJWWSRH4QYxD0lHh6JYPziA3JT9uKe2omSyGRtBIG5yR2CwcsGYKkkdp43yTUp44ZAwFiJ5zjEc1GgMd2R0rInWKwjY/g3art3/M11t2UMNkD+dQK9PZBOIQX1MuKo7eiDeqT62rzQMSYHLP9aqesXRbZlC+ItkggzpdLjiE4a88cFA9n4Ia7m42RoL2G3I8WKA74mT/qFllbTULjNFOv//7a7Rx7v95VKzbSaTxTHJI4qPXjwYMfd5Hehwu8NZet8fGeuKBn9oerC3hhZ4uDl8KmIyjxLgA8CHg9if/BrFWT+Yu0bh5V7/JLqi2OxpvR7qjFFSJW+An4a/HpHOwGU8ha91uYSkb84l+oH0MKzz7dd3O/aiEQXyMz+H39YoFLih/CpPyEvRl+hsmeKgCEsdcid8SiRCJSxbxbI6bEUBZ4bzZLXf+JNtwcrYfMPT08IFzm/H+/2bw2N3zdKPgeCKt4deh8mhhry696cuMq0g9HYwrfFF50FxEMzWzim48m/6GYmm81M14/E/g+lPpmxP8NUzDdYso/GHsPV1CBw16lSt4K30ngrK7XiVbWR+ifed0UjuW64CPDU1X1Fwm5wGyy9bTh0OJUN6G7O5QMXGWcH1k5xTauRvs6I6CHbNklKevE/DPG16Ps1H0FbXIVRURMBRBcesdAGKoGitDyqSy9RIa6/sRKvsFlCnlSvCDd5xbCKKjcjyv6wJV/bZ6y+K/F2ya+R2s7oP/o7LUdwEv+5T/93kQf8HzkhPwugR/HyICJQbjSo9yRcCFD/0Gv2fUSsaFwY/X8W6WqveV9nfk+3maEXS5GT1/Sl7LN80msPDhmBlcIktuGolEiLfeN3/OiVjDORWCy7/UZfFpHn4DXYToFB10JuT6JCsK3ZFLfRSjhmDIuIKzOtXbUbB7jv8+mghSGx9Zrk3lthY3W+2sY65iI0lAfAUezio3PtWWiGe64MBOgTXDzQ1CJbMu9F/gm4bZ7bPyLJiBnriA2pnIowP+tHvqwgp3tzmW4ClqemJs94BO5n+5jeEFxdcihg59uuvDhudrsi9dFSYNNP5mw/SDTcIx76r5e3E6SCGyIw/l76ui/Gv+BByfSmCtnj6joKwAxcek81zz7i/3qpdAFY5NvHO9usV31mQFoUNi8fQ4NdzekT2GfWjoQG9xK2zycY6IpwxAWiL8yQVkZwrkYc5VPwovjpJg3Sq73gCLS9Omyu974DIjEzo5OZ0RbiAFe8ElSu9EFgYWP/6IB70Hp3ItSTM+M+oTpKYnJrs+VyrZIR/K7iiY60oOfYtyVkcbkUKn1+C3U3qzWAbxpOeYldnZ7sBHpJi7CfbrUw2c2sgXvju94Yn43AoVdwi/sdqFzXo6tuNC0ORYtdDieU+++rHtXkZlg9kAqbwXGcjESzkvi8EDgf6+MIQv39PnJlNVDoDjfu6mUoVVQsoZb+dbq3bQkA3lhTfSNzu0L+6nzYhzSon4s3pxGDuUlm55Hv2Qvvbyv0EOGmzFhJljT068QsUdUezgfLU0Dor35mzsbMAW1fwv2mc/dXxWN+/VRRgUgIP5FF+aUCUscsQywdlQTRLDNspXdt1M1rFlgRHJTeJC6oKlainSLbXl9mBgXMgi70tsZAkag4n9JrhnDox6egPjFx35yxfj/sYoxqQGacr1nnnW0Sc8PLlc4erU/zKT0tqxpJIRmyygW8sTzomHyvkakVdM9wPVUIQG3N9MnHAK4Jhj1lotlokWWA53t7/QWB5LqWs0UCmi7neZFZ34AolYte+r6AH9YP2L1B8qlnrlZmpMdrTC+bykXLV2ueQjzFdhSkDCtcsVHLpP87f42juzds8EcpR/MotDEpW0g9wzgXYuLH1NRmMD2lVxaoHWxgbcrmlERf8yFz+RtnBgITmyvgkTOfUGmQY/vi3VKWHOlsdzALXlRRBHPWvbn0Oj8cDROweGFVYA7SP3U8IDOZm+d4cEHpriMnscETu/zIExxpmmgKp2eZeVjtLnyAXessGK8YZhLZ8jVWD4izZgU3TJnfM+7Rp28BiWjtB7cgxXPxX2GVsBjPlrYIzYud5Eb14zv4cVUvQB6STSDk9X04DaBzUkiHfAOKD3njVppBiukRrwi94IFu78nlMsEsGbu09/2d4/BlsWQnHXalwLAlpybo8HfOudJDoJlaJmWEfCRBTT5b0aU9QoEWigX680qO66ydvZig0DeTlapkys4wpGxVMACpL669SvUy+9UOeghMjag7h7G8I8n01bH59/NWxbEMtQ4qj9DT+01cwI4ORZbhluoz88lbpt35C6mNNrYMNj7btayxpVwjw8XynHnOT9DKDPM4eEpTlOtWKjVGUz0h7OoPj93/a7RZxynV7TIRq/taF/U+wZor+q7zKkqgh6IliWQK2A1kfTfOLkYHXLmWBQLsJhY49FSbk5gpP81CE8+XAMmGb0gfNRQFQNsJeRoHSsoeKFh7Lq6lESeUoysQuIlXxyTaYFe8zTAj23d8o+YYsSiHAqINIFES+xsf4pQm1tV4LpbToYtDQ7xH7Nm3E1uDnhpk8znU0W2DyDZ0DUK8Gr1CVQBB7nXyRWoxMXvrIjRIn+DKNf43N3Z/vuMW2c/t0rtWFrDltNmQSoSJ2LuRIMX0m1FF23WclLreDkRAkG661N9UUPBYjKpoecP+nPW74xYFngZcWXBRPCoUj5LQ70oFpL81GWKs7Flsbyx148bC3rjOpaiA2gx6eEOjjyWwDWk+zwMAa0UwvrbKPjjjpmmmr9u9GMb92cMuGHGsxuVGyB0ETZokW5bNYlRd8/r8s84i68CZOiYawgNcNZLVHuSSANjOGs0avRwXJFNO7ySILNuFNxGRxbvcx4hncFCkczaOiIXS699m6SSoefzvIzA6o9kZT0crNMjYYaMLGWzTrq0DNbCERsnvyIW51URqv1GLKI0DYGNPa7qwcrxNf+ff3xf/5jvtF8jfo+F8v7L7R+JygLAiBhqQAAW8XgnnMgAd/+EkM9PiP837cpP/ptEgXMGBpBpKiky3/rkbtYqzSyWxSmddy1/rG6SxZBD7H6UvxxVUAVBFzTjwRyS4w1GDfmEKjfU1ZfoTx/NFaapC32EQADasn3rq+ALoqfQDypbJPyliLehzxp7Vdem5zAbuwcJB3EOTXk6oxV+oIQ4+D5tv25DZycuxWuyeRKU784el0KJH4VAzeCZ4HSaT1wzLnr+mAIviBQISZqzy8zu1IRlj8BnCIyR4uWgzhsFgDsochGINcFqmc1cwqNEkc35EInTLxHkHyBI6A/OSJqzG7CMG+aGpAXABp5J7qoGgq3RjwIo6NPjMOSxhBbTSG4z9azubgA4vLyBW+TvEKWCXPE/lkD67ej7Pv7lwXzFcm+MFRKXmbg4tAIirjpNhyGqQlzEWL+0pXszvqss34YCtUAH1C/OS42bz1DPnVMNAAycTrQBmgVJOp/Qu7aqMDpuJRgU7Le9J9L7qeI2vdyO722s5BwEZfN4/s5CCkZ7OoryVeZ/qSULj4a0VwVC5VfPdJ3cgvb8KsXxNT4H1p9gaeU77nCNZrrH0EnFhjqdX8adcCEA1XyPUTg6potoPDc/YlexaEh0TvBVcjkGoSJ0Np7avWN/Sw4HYjt1YhaEh2LaReoakBylR/JQKSC5sn4ibtZ9QXeLA7dq0RTzuyv//lnpxJIW07bLz2CNnf8Mzv79QVp8Qw8fvmYOZ+sJqb0T1mzrIuLT1Q72vYYPsr27zL3Kc5UBxSl/82cAAADy9IXm2/vb9KDABMyODojW7lx0QCcBjs1O0T5biw5pv77BtiFIWZ6hgar1tjZeeEAcVl8owPhth4sIS5aug7vhUOmnWyqgDd8T5zquyZFt3UFN+D+XapCOom5RTGja2fwv4+V9YOCpvNgUIPHmoC+oAAAAAAAA=",
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
  nav: {
    home: "data:image/webp;base64,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",
    market: "data:image/webp;base64,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",
    inventory: "data:image/webp;base64,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",
    upgrade: "data:image/webp;base64,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",
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

// Stylised mining-rig hardware graphic used as the Home tab hero image.
// Renders an isometric "mining box" (top/front/side faces, like RigIcon's
// IsoRigShell) whose slot cells and overall glow react to the rig's real
// installed components — empty slots stay dark, filled slots light up in
// their component's rarity color, and glow intensity scales with how many
// slots are filled and how rare they are.
function RigDevice({ rig }) {
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
      className="relative w-full overflow-hidden rounded-xl flex items-center justify-center"
      style={{
        aspectRatio: "16/9",
        background: "linear-gradient(160deg, #101A2C, #05070E)",
        border: `1px solid ${glowColor}33`,
        boxShadow: filled.length ? `0 0 ${glowBlur}px -12px ${glowColor}88 inset` : undefined,
        perspective: 700,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 78%, ${glowColor}${filled.length ? "33" : "1A"}, transparent 60%)` }}
      />
      <div
        style={{
          position: "relative",
          width: "62%",
          aspectRatio: "1/0.72",
          transformStyle: "preserve-3d",
          transform: "rotateX(38deg) rotateZ(-32deg)",
          animation: filled.length ? "core-float 4.5s ease-in-out infinite" : "none",
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
          <circle cx="50" cy="24" r="2.6" fill={filled.length ? glowColor : "#3A4560"} />
        </svg>
      </div>
      <div className="absolute top-2.5 left-4 text-[10px] font-extrabold tracking-[0.2em] text-white/60">
        CORE
      </div>
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
function RigHero({ rig }) {
  const photo = rig ? ASSET_URLS.rigs[rig.key] : null;
  const rar = rig ? RARITY_STYLE[rig.rarity] : RARITY_STYLE.common;

  if (!photo) return <RigDevice rig={rig} />;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        aspectRatio: "16/9",
        border: `1px solid ${rar.color}44`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 30px -10px ${rar.color}66`,
      }}
    >
      {/* backdrop glow behind the photo so it doesn't float on flat black */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 40%, ${rar.color}22, #05070E 75%)` }}
      />
      <img
        src={photo}
        alt={rig.name}
        className="absolute inset-0 w-full h-full object-contain p-3"
        style={{ filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.55)) drop-shadow(0 0 18px ${rar.color}33)` }}
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
// MAIN APP
// ---------------------------------------------------------------------------
export default function CoreMiningApp() {
  const { tg, user, isTelegram, haptic: hapticRaw, hapticNotify: hapticNotifyRaw } = useTelegram();
  // Read the saved game once per mount (lazy ref, not re-read every render).
  const savedGameRef = useRef(null);
  if (savedGameRef.current === null) savedGameRef.current = loadSavedGame();
  const savedGame = savedGameRef.current;

  // ---- Settings -------------------------------------------------------------
  // Music/SFX are stored preferences only (this build has no audio assets
  // wired up yet) — Vibration and Language are the two that actually do
  // something: Vibration gates every haptic()/hapticNotify() call below, and
  // Language is what a future i18n pass would read.
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [musicOn, setMusicOn] = useState(savedGame.musicOn ?? true);
  const [sfxOn, setSfxOn] = useState(savedGame.sfxOn ?? true);
  const [vibrationOn, setVibrationOn] = useState(savedGame.vibrationOn ?? true);
  const [notificationsOn, setNotificationsOn] = useState(savedGame.notificationsOn ?? true);
  const [language, setLanguage] = useState(savedGame.language ?? "en");
  const t = useCallback(makeTranslator(language), [language]);
  // Wrapping here means every existing haptic("light")/hapticNotify(...)
  // call site elsewhere in the app automatically respects the Vibration
  // toggle, with no changes needed at each call site.
  const haptic = useCallback((style) => { if (vibrationOn) hapticRaw(style); }, [vibrationOn, hapticRaw]);
  const hapticNotify = useCallback((type) => { if (vibrationOn) hapticNotifyRaw(type); }, [vibrationOn, hapticNotifyRaw]);
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
  const [featuredRigId, setFeaturedRigId] = useState(savedGame.featuredRigId ?? null); // manually pinned rig instance for Home hero
  const [activeBooster, setActiveBooster] = useState(savedGame.activeBooster ?? null); // { key, name, boostPct, expiresAt }
  const [nowTick, setNowTick] = useState(Date.now());
  // Real elapsed-time tracker for the tick effect below — using an actual
  // timestamp delta (instead of assuming exactly 1s passed) keeps energy
  // drain/durability wear correct even if the browser throttles the timer
  // (e.g. a backgrounded tab), instead of silently falling behind.
  const lastTickRef = useRef(Date.now());
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
    featuredRigId, activeBooster, dailyStreak, lastClaimDate, repairsCount,
    achievementsClaimed, missionProgress, missionClaimed, invitedFriends,
    referralMilestonesClaimed, pools, joinedPoolId, listings,
    musicOn, sfxOn, vibrationOn, notificationsOn, language,
    accountCreatedAt, welcomeGrantClaimed,
  };
  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(persistRef.current));
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

  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    hapticNotify(type === "error" ? "error" : "success");
    clearTimeout(notify._t);
    notify._t = setTimeout(() => setToast(null), 2200);
  }, [hapticNotify]);

  // One-time welcome grant for a new account: CORE credit, full energy
  // top-up, and a free Starter Rig — so the very first session doesn't
  // stall on an empty energy bar or an empty rig list. The gifted rig is
  // marked tradeable: false (enforced in listRigForSale + SellItemModal
  // below) so it can't be instantly flipped on the Marketplace for free
  // CORE — it has to actually be used to mine. Runs once (guarded by
  // welcomeGrantClaimed); in production this should also check a persisted
  // backend flag so returning users never get it twice.
  useEffect(() => {
    if (welcomeGrantClaimed) return;
    setBalance((b) => b + WELCOME_GRANT_CORE);
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
    notify(`Welcome! +${WELCOME_GRANT_CORE} CORE, a free Starter Rig & ${NEW_MINER_START_ENERGY_KWH} kWh energy — New Miner Boost active for 48h`);
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

  // passive tick — created once (empty dep array) instead of every second.
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const deltaHours = Math.max(0, (now - lastTickRef.current) / 3600000);
      lastTickRef.current = now;
      setNowTick(now);
      setActiveBooster((b) => (b && b.expiresAt <= now ? null : b));
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
    addXp(ach.xp);
    setAchievementsClaimed((c) => [...c, ach.key]);
    notify(`+${ach.reward} CORE — ${ach.label} complete`);
  }, [haptic, notify, addXp]);

  const closeAchievementsModal = useCallback(() => setShowAchievementsModal(false), []);

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
    const shareText = "Yuk gabung mining CORE bareng aku! 🚀";
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`
      );
    } else if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => notify("Link referral disalin!"))
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
    if (reward.core > 0) setBalance((b) => b + reward.core);
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
      className="relative w-full max-w-[420px] mx-auto min-h-screen flex flex-col overflow-hidden"
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

      {showNetworkModal && (
        <NetworkStatsModal
          onClose={() => setShowNetworkModal(false)}
          schedule={schedule}
          networkHashrateTotal={networkHashrateTotal}
          networkRewardRate={networkRewardRate}
          miningPower={miningPower}
          poolSynergyBonusPct={poolSynergyBonusPct}
          joinedPool={joinedPool}
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
        />
      )}

      <div className="relative z-10 flex-1 overflow-y-auto pb-24">
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
            schedule={schedule}
            networkHashrateTotal={networkHashrateTotal}
            onOpenNetwork={() => { haptic("light"); setShowNetworkModal(true); }}
            user={user}
            onOpenProfile={() => { haptic("light"); setTab("profile"); }}
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
            onOpenSettings={() => { haptic("light"); setShowSettingsModal(true); }}
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
        <NavItem navKey="profile" icon={User} label={t("nav_profile")} active={tab === "profile"} onClick={() => { haptic("light"); setSelectedRigId(null); setTab("profile"); }} />
      </div>
    </div>
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// HOME
// ---------------------------------------------------------------------------
function HomeTab({ balance, pending, energy, energyDrainPerHour, storage, storageCap, miningPower, incomePerHour, onClaim, activeBooster, newMinerBoostActive, newMinerBoostHoursLeft, nowTick, owned, featuredRigId, poolInfo, schedule, networkHashrateTotal, onOpenNetwork, user, onOpenProfile }) {
  const boosterMinsLeft = activeBooster ? Math.max(0, Math.round((activeBooster.expiresAt - nowTick) / 60000)) : 0;
  const autoTopRig = owned && owned.length
    ? [...owned].sort((a, b) => b.basePower * (1 + (b.level - 1) * 0.18) - a.basePower * (1 + (a.level - 1) * 0.18))[0]
    : null;
  const topRig = (featuredRigId && owned?.find((r) => r.id === featuredRigId)) || autoTopRig;
  // Energy pool is denominated in real kWh (see MAX_ENERGY_KWH), and
  // energyDrainPerHour is already the sum of every active rig's real `kwh`
  // draw — so the bar's own number IS the real-world-equivalent draw now,
  // no separate flavor stat needed.
  const activeOwnedRigs = (owned || []).filter((r) => r.active !== false);
  // Hours left before energy hits 0 at the current drain rate — this is the
  // number a player actually needs to decide "should I buy a refill now?".
  const energyHoursLeft = energyDrainPerHour > 0 ? energy / energyDrainPerHour : null;
  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <CoreMark size={26} />
          <span className="text-white font-extrabold tracking-widest text-sm">CORE</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Bell size={18} />
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

      {newMinerBoostActive && (
        <div className="px-4 mt-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold"
            style={{ background: `${C.green}15`, border: `1px solid ${C.green}55`, color: C.green }}
          >
            <Sparkles size={13} />
            New Miner Boost active · +{NEW_MINER_BOOST_PCT}% income · {newMinerBoostHoursLeft}h left
          </div>
        </div>
      )}

      {activeBooster && (
        <div className="px-4 mt-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold"
            style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}55`, color: C.orange }}
          >
            <Zap size={13} />
            {activeBooster.name} active · +{activeBooster.boostPct}% income · {boosterMinsLeft}m left
          </div>
        </div>
      )}

      <div className="px-4 mt-5">
        <p className="text-slate-400 text-xs mb-1 tracking-wide">TOTAL BALANCE</p>
        <div className="flex items-end gap-2">
          <span className="text-white text-3xl font-extrabold tabular-nums">{fmt(balance)}</span>
          <span className="text-sm font-bold mb-1" style={{ color: C.cyan }}>CORE</span>
        </div>
        <p className="text-slate-500 text-xs mt-0.5">≈ ${fmt(balance * 504.6, 2)} USD</p>
      </div>

      {/* Rig visual */}
      <div className="px-4 mt-6">
        <GlowCard accent={topRig ? RARITY_STYLE[topRig.rarity].color : C.blue} brackets className="p-3">
          <RigHero rig={topRig} />
        </GlowCard>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <GlowCard accent={C.cyan} className="p-3">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-1">
            <Gauge size={13} /> Mining Power
          </div>
          <p className="text-white font-bold text-sm tabular-nums">{fmt(miningPower)} TH/s</p>
        </GlowCard>
        <GlowCard accent={C.green} className="p-3">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-1">
            <Coins size={13} /> Income / Hour
          </div>
          <p className="text-white font-bold text-sm tabular-nums">{fmt(incomePerHour)} CORE</p>
        </GlowCard>
      </div>

      <div className="px-4 mt-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
          style={
            poolInfo
              ? { background: `${C.purple}15`, border: `1px solid ${C.purple}55`, color: C.purple }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid #1c2536", color: "#8FA3B8" }
          }
        >
          <Users size={13} />
          {poolInfo
            ? `Pool mining · ${poolInfo.name}${poolInfo.isOwner ? " (owner)" : ""} · ${poolInfo.feePct}% fee`
            : "Solo mining · join a Pool for shared hashrate"}
        </div>
      </div>

      <div className="px-4 mt-2">
        <button className="w-full text-left" onClick={onOpenNetwork}>
          <GlowCard accent={C.blue} className="p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Database size={13} color={C.blue} /> Year {schedule.yearNumber} halving
              </span>
              <span style={{ color: C.blue }}>Network →</span>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
              <span>
                {fmt(schedule.totalMined, 0)} / {fmt(MINING_POOL_SUPPLY, 0)} CORE mined
              </span>
              <span className="tabular-nums">{fmt(networkHashrateTotal, 0)} TH/s network</span>
            </div>
          </GlowCard>
        </button>
      </div>

      <div className="px-4 mt-3">
        <GlowCard accent={C.orange} className="p-4">
          <StatBar label="ENERGY" value={energy} max={MAX_ENERGY_KWH} color={C.orange} suffix=" kWh" />
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Zap size={10} /> {fmt(energy, 1)} / {MAX_ENERGY_KWH} kWh
            </span>
            <span className="tabular-nums">
              {energyHoursLeft == null
                ? "not in use (rig off)"
                : energyHoursLeft >= 1
                ? `~${fmt(energyHoursLeft, 1)}h left`
                : `~${fmt(energyHoursLeft * 60, 0)}m left`}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5 mb-2">
            <span>Draining at</span>
            <span className="tabular-nums">
              {activeOwnedRigs.length
                ? `~${fmt(energyDrainPerHour, 1)} kWh/hr · ${activeOwnedRigs.length} rig${activeOwnedRigs.length > 1 ? "s" : ""} active`
                : "0 kWh/hr · no rigs active"}
            </span>
          </div>
          {energy > 0 && energy <= MAX_ENERGY_KWH * 0.25 && (
            <p className="text-[11px] mb-1" style={{ color: C.orange }}>
              Energy running low — refill now in Market → Packs so mining doesn't stop.
            </p>
          )}
          <StatBar label="STORAGE" value={storage} color={C.purple} />
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 mb-1">
            <span className="flex items-center gap-1">
              <Database size={10} /> Unclaimed CORE buffer
            </span>
            <span className="tabular-nums">
              {fmt(pending, 2)} / {fmt(storageCap, 0)} CORE
            </span>
          </div>
          {pending >= storageCap * 0.9 && (
            <p className="text-[11px] mb-1" style={{ color: C.orange }}>
              Storage almost full — claim now, excess mining output will be lost.
            </p>
          )}
          {energy <= 0 && (
            <p className="text-[11px] mt-1" style={{ color: "#FF7A7A" }}>
              Out of energy — mining paused. Buy a pack in Market → Packs.
            </p>
          )}
        </GlowCard>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[11px] text-slate-400 tracking-wide">Ready to claim</span>
          <span className="text-sm font-extrabold tabular-nums" style={{ color: C.green }}>
            +{fmt(pending, 4)} CORE
          </span>
        </div>
        <FuturisticButton onClick={onClaim} accent={C.cyan} accent2={C.blue}>
          Claim Reward
        </FuturisticButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INVENTORY
// ---------------------------------------------------------------------------
function InventoryTab({ owned, onSelect, componentInventory = {}, featuredRigId, onSetFeatured, onBack }) {
  const stockEntries = Object.entries(componentInventory).filter(([, units]) => (units || []).length > 0);
  return (
    <div>
      <TopBar title="Inventory" onBack={onBack} right={<Search size={17} />} />
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
            <GlowCard key={r.id} accent={rar.color} className="p-3 relative">
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
        <p className="text-[11px] text-slate-400 tracking-wide mb-2">COMPONENT INVENTORY (unassigned)</p>
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
                <GlowCard key={key} accent={rar.color} className="p-3 relative">
                  <span
                    className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${rar.color}22`, color: rar.color }}
                  >
                    x{units.length}
                  </span>
                  <div className="flex items-center justify-center h-16 relative">
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// MARKET
// ---------------------------------------------------------------------------
function MarketTab({ balance, filter, setFilter, onBuy, ownedRigCount, componentInventory, onBuyComponent, activeBooster, onBuyBooster, energy, onBuyEnergyPack }) {
  const tabs = ["Rigs", "Components", "Boosters", "Packs"];
  return (
    <div>
      <TopBar title="Shop" right={<Search size={17} />} />
      <div className="px-4 flex gap-4 text-xs mb-1 mt-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="pb-2 font-semibold"
            style={{
              color: filter === t ? C.cyan : "#5B6B82",
              borderBottom: filter === t ? `2px solid ${C.cyan}` : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3 mt-2">
        {filter === "Rigs" ? (
          RIG_CATALOG.slice()
            .reverse()
            .map((rig) => {
              const rar = RARITY_STYLE[rig.rarity];
              const atCap = ownedRigCount >= MAX_RIGS;
              const canAfford = balance >= rig.baseCost && !atCap;
              return (
                <GlowCard key={rig.key} accent={rar.color} className="p-3 flex items-center gap-3">
                  <RigIcon rigKey={rig.key} rarity={rig.rarity} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-bold">{rig.name}</p>
                      <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">{rig.desc}</p>
                    <p className="text-[11px]" style={{ color: C.cyan }}>
                      {fmt(rig.basePower)} TH/s · <span style={{ color: C.purple }}>{SLOT_CAPACITY[rig.rarity]} component slots</span>
                    </p>
                    <p className="text-[10px] flex items-center gap-1" style={{ color: C.orange }}>
                      <Zap size={10} /> {rig.kwh} kWh/hr power draw
                    </p>
                    <p className="text-white text-xs font-bold tabular-nums mt-0.5">
                      {fmt(rig.baseCost, 0)} <span style={{ color: C.cyan }}>CORE</span>
                    </p>
                  </div>
                  <FuturisticButton
                    onClick={() => onBuy(rig)}
                    disabled={!canAfford}
                    accent={rar.color}
                    accent2={C.blue}
                    full={false}
                    size="sm"
                  >
                    {atCap ? `${MAX_RIGS}/${MAX_RIGS}` : "Buy"}
                  </FuturisticButton>
                </GlowCard>
              );
            })
        ) : filter === "Components" ? (
          COMPONENT_CATALOG.slice()
            .reverse()
            .map((comp) => {
              const rar = RARITY_STYLE[comp.rarity];
              const owned = (componentInventory[comp.key] || []).length;
              const canAfford = balance >= comp.price;
              return (
                <GlowCard key={comp.key} accent={rar.color} className="p-3 flex items-center gap-3">
                  <ComponentIcon compKey={comp.key} rarity={comp.rarity} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-bold">{comp.name}</p>
                      <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                      {owned > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${rar.color}22`, color: rar.color }}>
                          owned x{owned}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {comp.tflops} TFLOPS · {comp.vram}
                    </p>
                    <p className="text-[11px]" style={{ color: C.green }}>
                      +{comp.boostPct}% boost · +{comp.power} TH/s
                    </p>
                    <p className="text-white text-xs font-bold tabular-nums mt-0.5">
                      {fmt(comp.price, 0)} <span style={{ color: C.cyan }}>CORE</span>
                    </p>
                  </div>
                  <FuturisticButton
                    onClick={() => onBuyComponent(comp)}
                    disabled={!canAfford}
                    accent={rar.color}
                    accent2={C.blue}
                    full={false}
                    size="sm"
                  >
                    Buy
                  </FuturisticButton>
                </GlowCard>
              );
            })
        ) : filter === "Boosters" ? (
          BOOSTER_CATALOG.slice()
            .reverse()
            .map((boost) => {
              const rar = RARITY_STYLE[boost.rarity];
              const isActive = activeBooster && activeBooster.key === boost.key;
              const canAfford = balance >= boost.price;
              return (
                <GlowCard key={boost.key} accent={rar.color} className="p-3 flex items-center gap-3">
                  <BoosterIcon boostKey={boost.key} rarity={boost.rarity} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-bold">{boost.name}</p>
                      <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">{boost.fact}</p>
                    <p className="text-[11px]" style={{ color: C.green }}>
                      +{boost.boostPct}% income · {boost.durationHours}h
                    </p>
                    <p className="text-white text-xs font-bold tabular-nums mt-0.5">
                      {fmt(boost.price, 0)} <span style={{ color: C.cyan }}>CORE</span>
                    </p>
                  </div>
                  <FuturisticButton
                    onClick={() => onBuyBooster(boost)}
                    disabled={!canAfford}
                    accent={rar.color}
                    accent2={C.orange}
                    full={false}
                    size="sm"
                  >
                    {isActive ? "Extend" : "Activate"}
                  </FuturisticButton>
                </GlowCard>
              );
            })
        ) : filter === "Packs" ? (
          ENERGY_PACK_CATALOG.map((pack) => {
            const rar = RARITY_STYLE[pack.rarity];
            const isFull = energy >= MAX_ENERGY_KWH;
            const canAfford = balance >= pack.price;
            return (
              <GlowCard key={pack.key} accent={rar.color} className="p-3 flex items-center gap-3">
                <PackIcon packKey={pack.key} rarity={pack.rarity} size={44} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-bold">{pack.name}</p>
                    <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: C.orange }}>+{pack.amount} kWh</p>
                  <p className="text-white text-xs font-bold tabular-nums mt-0.5">
                    {fmt(pack.price, 0)} <span style={{ color: C.cyan }}>CORE</span>
                  </p>
                </div>
                <FuturisticButton
                  onClick={() => onBuyEnergyPack(pack)}
                  disabled={isFull || !canAfford}
                  accent={C.orange}
                  accent2={rar.color}
                  full={false}
                  size="sm"
                >
                  {isFull ? "Full" : "Buy"}
                </FuturisticButton>
              </GlowCard>
            );
          })
        ) : (
          <p className="text-slate-500 text-xs text-center mt-10">
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
            <GlowCard key={l.id} accent={rar.color} className="p-3 flex items-center gap-3">
              {l.itemType === "rig" ? (
                <RigIcon rigKey={l.item.key} rarity={l.item.rarity} size={44} />
              ) : (
                <ComponentIcon compKey={l.item.key} rarity={l.item.rarity} size={44} />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-bold">{l.item.name}</p>
                  <span className="text-[10px]" style={{ color: rar.color }}>{rar.label}</span>
                  {isYou && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${C.cyan}22`, color: C.cyan }}>
                      your listing
                    </span>
                  )}
                </div>
                {l.itemType === "rig" && (
                  <p className="text-[11px]" style={{ color: C.cyan }}>
                    Lv.{l.item.level} · {l.item.durability}% durability
                  </p>
                )}
                {l.itemType === "component" && (
                  <p className="text-[11px]" style={{ color: C.cyan }}>
                    {l.item.durability ?? 100}% durability
                  </p>
                )}
                <p className="text-[10px] text-slate-500">Seller: {l.sellerName}</p>
                <p className="text-white text-xs font-bold tabular-nums mt-0.5">
                  {fmt(l.price, 0)} <span style={{ color: C.cyan }}>CORE</span>
                </p>
              </div>
              {isYou ? (
                <FuturisticButton onClick={() => onCancelListing(l.id)} accent={C.orange} accent2="#FF6B6B" full={false} size="sm">
                  Cancel
                </FuturisticButton>
              ) : (
                <FuturisticButton onClick={() => onBuyListing(l.id)} disabled={!canAfford} accent={rar.color} accent2={C.blue} full={false} size="sm">
                  Buy
                </FuturisticButton>
              )}
            </GlowCard>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(3,5,10,0.72)" }} onClick={onClose}>
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" onClick={(e) => e.stopPropagation()}>
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
        <GlowCard accent={rar.color} brackets className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm">{rig.name}</p>
              <p className="text-[11px]" style={{ color: rar.color }}>{rar.label}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              Level {level} <ArrowUpCircle size={14} color={C.green} /> Level {level + 1}
            </div>
          </div>

          <button
            onClick={() => onToggleActive(rig)}
            className="w-full flex items-center justify-between mt-3 px-3 py-2 rounded-xl"
            style={{
              background: isOn ? `${C.green}12` : "rgba(255,255,255,0.03)",
              border: `1px solid ${isOn ? C.green + "55" : "#2a3346"}`,
            }}
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: isOn ? C.green : "#8FA3B8" }}>
              <Zap size={13} color={isOn ? C.green : "#5B6B82"} />
              {isOn ? "Rig is ON — mining actively" : "Rig is OFF — not mining"}
            </span>
            <span
              className="relative inline-flex items-center rounded-full transition-colors"
              style={{ width: 34, height: 18, background: isOn ? C.green : "#2a3346" }}
            >
              <span
                className="absolute rounded-full bg-white transition-all"
                style={{ width: 14, height: 14, top: 2, left: isOn ? 18 : 2 }}
              />
            </span>
          </button>

          <div className="flex justify-center my-5">
            <div className="rounded-2xl" style={{ animation: "core-pulse-ring 2.4s ease-out infinite" }}>
              <RigIcon rigKey={rig.key} rarity={rig.rarity} size={92} />
            </div>
          </div>

          {isBroken && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold mb-4"
              style={{ background: "#FF525215", border: "1px solid #FF525255", color: "#FF7A7A" }}
            >
              <Wrench size={13} /> This rig is broken and mining at 0% — repair it to restore output.
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-snug mb-4">{RIG_CATALOG.find((c) => c.key === rig.key)?.desc}</p>

          <div className="flex items-center justify-between text-xs mb-4">
            <span className="text-slate-400">Hash Power</span>
            <span className="text-white tabular-nums">
              {fmt(power)} TH/s <span style={{ color: C.green }}>→ {fmt(nextPower)} TH/s</span>
            </span>
          </div>

          <StatBar label="Efficiency" value={eff} color={C.cyan} />
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap size={12} color={C.orange} /> Energy Draw
            </span>
            <span className="text-white tabular-nums">
              {kwh} kWh/hr
            </span>
          </div>
          <StatBar label="Durability" value={dur} color={durColor} />
          <p className="text-[10px] text-slate-500 -mt-2 mb-3">
            Wears {wearPerHour}%/hr while active — full durability lasts ~{Math.round(100 / wearPerHour)}h before it needs a repair.
          </p>

          {/* Component slots */}
          <div className="mt-1 mb-4">
            <p className="text-[11px] text-slate-400 tracking-wide mb-1">
              COMPONENT SLOTS ({filledSlots}/{slots.length})
            </p>
            <p className="text-[10px] text-slate-500 mb-2">
              Each GPU wears down on its own — its power/boost output is reduced by its own durability AND this rig's durability together.
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
                      <ComponentIcon compKey={slot.key} rarity={c?.rarity} size={48} />
                      <span
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "#0A0D16", border: "1px solid #FF525288" }}
                      >
                        <X size={9} color="#FF7A7A" />
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
                      width: 48,
                      height: 48,
                      border: `1px dashed ${pickerSlot === i ? C.cyan : "#2a3346"}`,
                      background: pickerSlot === i ? `${C.cyan}10` : "transparent",
                    }}
                  >
                    <Plus size={16} color={pickerSlot === i ? C.cyan : "#5B6B82"} />
                  </button>
                );
              })}
            </div>

            {pickerSlot !== null && (
              <GlowCard accent={C.cyan} className="p-3 mt-2">
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
                          <ComponentIcon compKey={key} rarity={c.rarity} size={32} />
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
              className="mt-2"
            >
              <Wrench size={14} /> Repair · {fmt(repairCost, 0)} CORE
            </FuturisticButton>
          )}

          <FuturisticButton
            onClick={() => onUpgrade(rig)}
            disabled={!canAfford}
            accent={C.cyan}
            accent2={C.purple}
            className="mt-2"
          >
            <Sparkles size={14} /> Upgrade · {fmt(cost, 0)} CORE
          </FuturisticButton>
        </GlowCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DAILY BONUS
// ---------------------------------------------------------------------------
function DailyBonusModal({ onClose, dailyStreak, claimedToday, currentDay, onClaim, balance }) {
  const doneUpTo = claimedToday ? currentDay : currentDay - 1;
  const reward = DAILY_REWARDS[currentDay - 1];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
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
                  className="rounded-xl p-2 flex flex-col items-center gap-1"
                  style={{
                    background: isToday ? `${C.cyan}18` : done ? `${C.green}0F` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${borderColor}`,
                    animation: isToday && !claimedToday ? "core-pulse-ring 2.4s ease-out infinite" : undefined,
                  }}
                >
                  {done ? (
                    <Check size={13} color={C.green} />
                  ) : (
                    <Gift size={13} color={isToday ? C.cyan : "#5B6B82"} />
                  )}
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
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" onClick={(e) => e.stopPropagation()}>
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
// ACHIEVEMENTS
// ---------------------------------------------------------------------------
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
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[75vh] flex flex-col min-h-0" onClick={(e) => e.stopPropagation()}>
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
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[75vh] flex flex-col min-h-0" onClick={(e) => e.stopPropagation()}>
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
function ProfileTab({ level, xp, xpToNext, totalEarned, miningPower, notify, user, isTelegram, onOpenDaily, dailyClaimAvailable, onOpenNetwork, onOpenMissions, missionsClaimReady, onOpenAchievements, achievementsClaimReady, onOpenReferral, referralClaimReady, onOpenSettings }) {
  const pct = (xp / xpToNext) * 100;
  const tiles = [
    { icon: Trophy, label: "Achievements", color: C.orange },
    { icon: Gift, label: "Daily Bonus", color: C.purple },
    { icon: Database, label: "Network", color: C.cyan },
    { icon: Users, label: "Referral", color: C.green },
    { icon: Target, label: "Missions", color: C.blue },
  ];

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "CORE Miner";
  const displayId = user ? `TG-${user.id}` : "ID: CORE-78321";
  const { t } = useLanguage();
  const tonAddress = useTonAddress();

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
      <div className="px-4 flex flex-col items-center mt-2">
        <div
          className="w-20 h-20 rounded-full border-2 flex items-center justify-center overflow-hidden"
          style={{ borderColor: C.cyan, background: "#0c1322" }}
        >
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={34} color={C.cyan} />
          )}
        </div>
        <p className="text-white font-bold mt-2 text-sm">{displayName}</p>
        <p className="text-slate-500 text-[11px]">
          {displayId}
          {user?.username ? ` · @${user.username}` : ""}
        </p>
        {!isTelegram && (
          <p className="text-[10px] mt-1 px-2 py-0.5 rounded-full" style={{ color: C.orange, background: `${C.orange}15` }}>
            Preview mode — open inside Telegram to see your real profile
          </p>
        )}

        <div className="w-full mt-4">
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

      <div className="px-4 mt-4">
        <GlowCard accent={C.green} className="p-4 flex items-center justify-between">
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

      <div className="px-4 mt-3">
        <GlowCard accent={C.blue} className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white font-bold text-xs flex items-center gap-1.5">
                <Database size={14} color={C.blue} /> {t("wallet_title")}
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
        </GlowCard>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3 mt-3">
        {tiles.map((t) => {
          const isDaily = t.label === "Daily Bonus";
          const isNetwork = t.label === "Network";
          const isMissions = t.label === "Missions";
          const isAchievements = t.label === "Achievements";
          const isReferral = t.label === "Referral";
          return (
            <button
              key={t.label}
              onClick={() =>
                isDaily
                  ? onOpenDaily()
                  : isNetwork
                  ? onOpenNetwork()
                  : isMissions
                  ? onOpenMissions()
                  : isAchievements
                  ? onOpenAchievements()
                  : isReferral
                  ? onOpenReferral()
                  : notify(`${t.label} opened`)
              }
            >
              <GlowCard accent={t.color} className="p-4 flex flex-col items-center gap-2 relative">
                {((isDaily && dailyClaimAvailable) ||
                  (isMissions && missionsClaimReady) ||
                  (isAchievements && achievementsClaimReady) ||
                  (isReferral && referralClaimReady)) && (
                  <span
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ background: C.green, boxShadow: `0 0 6px 1px ${C.green}` }}
                  />
                )}
                <t.icon size={20} color={t.color} />
                <span className="text-white text-xs font-semibold">{t.label}</span>
              </GlowCard>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SETTINGS
// ---------------------------------------------------------------------------
const SETTINGS_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
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
}) {
  const { t } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const currentLang = SETTINGS_LANGUAGES.find((l) => l.code === language) || SETTINGS_LANGUAGES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" onClick={(e) => e.stopPropagation()}>
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
              onClick={() => notify(t("settings_help_toast"))}
            />
            <SettingsLinkRow
              icon={ShieldCheck}
              label={t("settings_privacy")}
              onClick={() => notify(t("settings_privacy_toast"))}
            />
            <SettingsLinkRow
              icon={FileText}
              label={t("settings_terms")}
              onClick={() => notify(t("settings_terms_toast"))}
            />
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-4">CORE Miner v1.19</p>
        </GlowCard>
      </div>
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
                <GlowCard accent={C.blue} className="p-3">
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
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
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
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" onClick={(e) => e.stopPropagation()}>
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
function NetworkStatsModal({ onClose, schedule, networkHashrateTotal, networkRewardRate, miningPower, poolSynergyBonusPct, joinedPool }) {
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
      style={{ background: "rgba(3,5,10,0.72)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-[380px] max-h-[85vh] overflow-y-auto min-h-0" onClick={(e) => e.stopPropagation()}>
        <GlowCard accent={C.blue} brackets className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Database size={16} color={C.blue} />
              <h2 className="text-white font-extrabold text-sm tracking-wide">NETWORK STATUS</h2>
            </div>
            <button onClick={onClose}>
              <X size={18} color="#5B6B82" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Max supply {fmt(MAX_SUPPLY, 0)} CORE</p>

          <div className="mb-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Mining pool mined</span>
              <span className="tabular-nums" style={{ color: C.cyan }}>
                {fmt(schedule.totalMined, 0)} / {fmt(MINING_POOL_SUPPLY, 0)} ({schedule.percentMined.toFixed(2)}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${schedule.percentMined}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
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
              <p className="text-[10px] text-slate-500">Network Hashrate</p>
              <p className="text-white font-bold text-sm tabular-nums">{fmt(networkHashrateTotal, 0)} TH/s</p>
            </div>
          </div>

          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: `${C.green}0F`, border: `1px solid ${C.green}33` }}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Your network share</span>
              <span className="font-bold tabular-nums" style={{ color: C.green }}>
                {yourSharePct.toFixed(4)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-slate-400">Reward rate</span>
              <span className="font-bold tabular-nums" style={{ color: C.green }}>
                {networkRewardRate.toFixed(4)} CORE / TH/s / hr
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

          <p className="text-slate-400 text-[11px] font-semibold mb-2 tracking-wide">GENESIS ALLOCATION</p>
          <div className="flex flex-col gap-1.5 mb-1">
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
        </GlowCard>
      </div>
    </div>
  );
}
