import { useEffect, useRef, useState } from "react";
import symOni from "@/assets/sym-oni.png";
import symKoi from "@/assets/sym-koi.png";
import symCat from "@/assets/sym-cat.png";
import symDaruma from "@/assets/sym-daruma.png";
import symSushi from "@/assets/sym-sushi.png";
import symLantern from "@/assets/sym-lantern.png";
import symCoin from "@/assets/sym-coin.png";
import { Coins, Minus, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SymbolKey = "sushi" | "lantern" | "daruma" | "koi" | "cat" | "oni" | "coin";

const SYMBOLS: { key: SymbolKey; img: string; mult: number; weight: number; name: string }[] = [
  { key: "sushi", img: symSushi, mult: 5, weight: 14, name: "Sushi" },
  { key: "lantern", img: symLantern, mult: 8, weight: 12, name: "Lampion" },
  { key: "daruma", img: symDaruma, mult: 10, weight: 10, name: "Daruma" },
  { key: "koi", img: symKoi, mult: 15, weight: 8, name: "Koi" },
  { key: "cat", img: symCat, mult: 25, weight: 6, name: "Maneki" },
  { key: "oni", img: symOni, mult: 50, weight: 3, name: "Oni" },
  { key: "coin", img: symCoin, mult: 100, weight: 2, name: "Sakura mince" },
];

const TOTAL_WEIGHT = SYMBOLS.reduce((s, x) => s + x.weight, 0);
function pickSymbol() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const s of SYMBOLS) {
    if (r < s.weight) return s;
    r -= s.weight;
  }
  return SYMBOLS[0];
}

const BET_OPTIONS = [10, 25, 50, 100, 250];
const GUEST_KEY = "cs_guest_coins";

function getGuestCoins() {
  if (typeof window === "undefined") return 1000;
  const v = localStorage.getItem(GUEST_KEY);
  return v ? Number(v) : 1000;
}
function setGuestCoins(v: number) {
  if (typeof window !== "undefined") localStorage.setItem(GUEST_KEY, String(v));
}

export function SlotMachine() {
  const { user, profile, refreshProfile } = useAuth();
  const [coins, setCoins] = useState<number>(1000);
  const [bet, setBet] = useState(25);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<typeof SYMBOLS>([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]);
  const [lastWin, setLastWin] = useState(0);
  const [winPulse, setWinPulse] = useState(false);
  const reelTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // sync coins source
  useEffect(() => {
    if (user && profile) setCoins(profile.coins);
    else if (!user) setCoins(getGuestCoins());
  }, [user, profile]);

  const persistCoins = async (newCoins: number, win: number, syms: SymbolKey[]) => {
    if (user) {
      await supabase
        .from("profiles")
        .update({
          coins: newCoins,
          total_spins: (profile?.total_spins ?? 0) + 1,
          total_wins: (profile?.total_wins ?? 0) + (win > 0 ? 1 : 0),
          biggest_win: Math.max(profile?.biggest_win ?? 0, win),
        })
        .eq("id", user.id);
      await supabase.from("game_history").insert({
        user_id: user.id,
        bet,
        win,
        symbols: syms,
        balance_after: newCoins,
      });
      refreshProfile();
    } else {
      setGuestCoins(newCoins);
    }
  };

  const spin = () => {
    if (spinning) return;
    if (coins < bet) {
      toast.error("Nedostatek mincí. Snižte sázku.");
      return;
    }
    setLastWin(0);
    setSpinning(true);
    const newCoins = coins - bet;
    setCoins(newCoins);

    // pre-pick final symbols
    const finals = [pickSymbol(), pickSymbol(), pickSymbol()];

    // animate each reel with cycling random symbols, stop staggered
    const cycleHandles: ReturnType<typeof setInterval>[] = [];
    [0, 1, 2].forEach((i) => {
      cycleHandles[i] = setInterval(() => {
        setReels((prev) => {
          const copy = [...prev];
          copy[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return copy;
        });
      }, 70);
    });

    [600, 1000, 1400].forEach((delay, i) => {
      const t = setTimeout(() => {
        clearInterval(cycleHandles[i]);
        setReels((prev) => {
          const copy = [...prev];
          copy[i] = finals[i];
          return copy;
        });
        if (i === 2) {
          // resolve win
          const a = finals[0].key, b = finals[1].key, c = finals[2].key;
          let win = 0;
          if (a === b && b === c) {
            win = bet * finals[0].mult;
          } else if (a === b || b === c || a === c) {
            const matchSym = a === b ? finals[0] : b === c ? finals[1] : finals[0];
            win = Math.floor(bet * (matchSym.mult / 5));
          }
          const afterWin = newCoins + win;
          setCoins(afterWin);
          setLastWin(win);
          setSpinning(false);
          if (win > 0) {
            setWinPulse(true);
            setTimeout(() => setWinPulse(false), 1500);
            toast.success(`Výhra ${win.toLocaleString("cs-CZ")} mincí!`, { duration: 2500 });
          }
          persistCoins(afterWin, win, [a, b, c]);
        }
      }, delay);
      reelTimers.current.push(t);
    });
  };

  useEffect(() => () => reelTimers.current.forEach(clearTimeout), []);

  const topUp = () => {
    if (user) {
      toast.info("Mince se obnoví za chvíli zdarma");
    }
    const next = coins + 500;
    setCoins(next);
    if (user) {
      supabase.from("profiles").update({ coins: next }).eq("id", user.id).then(() => refreshProfile());
    } else {
      setGuestCoins(next);
    }
    toast.success("+500 mincí zdarma!");
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Cabinet */}
      <div className="relative rounded-3xl p-1 bg-gold-grad shadow-gold">
        <div className="rounded-3xl bg-gradient-to-b from-[oklch(0.28_0.14_25)] to-[oklch(0.18_0.08_25)] p-5 sm:p-8 border border-[oklch(0.88_0.16_85/0.3)]">
          {/* marquee bulbs */}
          <div className="ring-bulbs h-3 animate-bulb mb-4 rounded-full" />

          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)]">
              <Coins className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              <span className="text-xs uppercase tracking-widest text-[oklch(0.8_0.05_75)]">Mince</span>
              <span className="text-lg font-bold text-gold tabular-nums">{coins.toLocaleString("cs-CZ")}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] ${winPulse ? "animate-glow" : ""}`}>
              <span className="text-xs uppercase tracking-widest text-[oklch(0.8_0.05_75)]">Výhra</span>
              <span className={`text-lg font-bold tabular-nums ${lastWin > 0 ? "text-gold" : "text-[oklch(0.7_0.05_75)]"}`}>
                {lastWin > 0 ? `+${lastWin.toLocaleString("cs-CZ")}` : "—"}
              </span>
            </div>
          </div>

          {/* Reels */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-[oklch(0.1_0.04_25)] border-2 border-[oklch(0.78_0.16_75/0.5)] shadow-inner">
            {reels.map((s, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-gradient-to-b from-[oklch(0.95_0.04_85)] to-[oklch(0.75_0.08_75)] flex items-center justify-center p-2 sm:p-4 overflow-hidden border-2 border-[oklch(0.5_0.12_55)] ${
                  spinning ? "" : "animate-coin-pop"
                }`}
              >
                <img
                  key={`${i}-${s.key}-${spinning}`}
                  src={s.img}
                  alt={s.name}
                  className={`w-full h-full object-contain drop-shadow-[0_4px_10px_oklch(0.3_0.1_25/0.6)] ${spinning ? "blur-[1px] scale-110" : ""}`}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setBet(BET_OPTIONS[Math.max(0, BET_OPTIONS.indexOf(bet) - 1)])}
                className="p-2 rounded-full bg-black/40 border border-[oklch(0.78_0.16_75/0.5)] hover:bg-black/60"
                disabled={spinning}
              >
                <Minus className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              </button>
              <div className="px-4 py-2 rounded-lg bg-black/50 border border-[oklch(0.78_0.16_75/0.5)] min-w-[120px] text-center">
                <div className="text-[10px] uppercase tracking-widest text-[oklch(0.7_0.04_75)]">Sázka</div>
                <div className="text-lg font-bold text-gold tabular-nums">{bet}</div>
              </div>
              <button
                onClick={() => setBet(BET_OPTIONS[Math.min(BET_OPTIONS.length - 1, BET_OPTIONS.indexOf(bet) + 1)])}
                className="p-2 rounded-full bg-black/40 border border-[oklch(0.78_0.16_75/0.5)] hover:bg-black/60"
                disabled={spinning}
              >
                <Plus className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              </button>
            </div>

            <button
              onClick={spin}
              disabled={spinning || coins < bet}
              className="relative px-10 py-4 rounded-xl bg-gold-grad text-[oklch(0.2_0.06_25)] text-lg uppercase tracking-widest font-extrabold shadow-gold disabled:opacity-50 hover:brightness-110 active:scale-95 transition border-2 border-[oklch(0.5_0.12_55)]"
            >
              {spinning ? "Točím…" : "Točit"}
            </button>

            <div className="flex justify-center">
              <button
                onClick={topUp}
                className="px-4 py-2 rounded-lg bg-[oklch(0.4_0.18_25)] hover:bg-[oklch(0.45_0.2_25)] border border-[oklch(0.78_0.16_75/0.5)] text-sm text-[oklch(0.95_0.04_85)] font-semibold"
              >
                +500 zdarma
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paytable */}
      <div className="mt-6 rounded-2xl bg-[oklch(0.2_0.06_25)] border border-[oklch(0.78_0.16_75/0.3)] p-5">
        <h3 className="text-gold text-sm uppercase tracking-widest mb-3">Výplaty (3 stejné × sázka)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {SYMBOLS.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-black/30">
              <img src={s.img} alt={s.name} className="w-12 h-12 object-contain" />
              <span className="text-xs text-[oklch(0.85_0.04_75)]">{s.name}</span>
              <span className="text-sm font-bold text-gold">×{s.mult}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[oklch(0.7_0.04_75)]">2 stejné symboly vyplácí 1/5 hodnoty. Bez vkladů, bez reálných peněz — pouze virtuální mince pro zábavu.</p>
      </div>
    </div>
  );
}