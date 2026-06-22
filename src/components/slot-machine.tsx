import { useEffect, useRef, useState } from "react";
import symOni from "@/assets/sym-oni.png";
import symKoi from "@/assets/sym-koi.png";
import symTorii from "@/assets/sym-torii.png";
import symWagasa from "@/assets/sym-wagasa.png";
import symCrane from "@/assets/sym-crane.png";
import symLantern from "@/assets/sym-lantern.png";
import symLotus from "@/assets/sym-lotus.png";
import symFan from "@/assets/sym-fan.png";
import symKoban from "@/assets/sym-koban.png";
import symBonsai from "@/assets/sym-bonsai.png";
import symSakura from "@/assets/sym-sakura.png";
import { Coins, Minus, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SymbolKey =
  | "oni" | "koi" | "torii" | "wagasa" | "crane" | "lantern" | "lotus"
  | "fan" | "koban" | "bonsai" | "sakura";

const SYMBOLS: { key: SymbolKey; img: string; mult: number; weight: number; name: string }[] = [
  { key: "sakura", img: symSakura, mult: 4, weight: 16, name: "Sakura" },
  { key: "torii", img: symTorii, mult: 5, weight: 14, name: "Torii" },
  { key: "fan", img: symFan, mult: 7, weight: 12, name: "Sensu" },
  { key: "lantern", img: symLantern, mult: 8, weight: 11, name: "Lampion" },
  { key: "wagasa", img: symWagasa, mult: 10, weight: 9, name: "Wagasa" },
  { key: "bonsai", img: symBonsai, mult: 12, weight: 8, name: "Bonsai" },
  { key: "koi", img: symKoi, mult: 15, weight: 7, name: "Koi" },
  { key: "crane", img: symCrane, mult: 25, weight: 5, name: "Jeřáb" },
  { key: "koban", img: symKoban, mult: 40, weight: 4, name: "Koban" },
  { key: "oni", img: symOni, mult: 50, weight: 3, name: "Oni" },
  { key: "lotus", img: symLotus, mult: 100, weight: 2, name: "Lotos" },
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
const CELL_H = 88; // px — height of one symbol cell
const VISIBLE = 3;
const REEL_GAP = 8; // px — horizontal gap between reels
const REEL_PAD = 12; // px — padding inside reel frame (p-3)

function getGuestCoins() {
  if (typeof window === "undefined") return 1000;
  const v = localStorage.getItem(GUEST_KEY);
  return v ? Number(v) : 1000;
}
function setGuestCoins(v: number) {
  if (typeof window !== "undefined") localStorage.setItem(GUEST_KEY, String(v));
}

type Sym = typeof SYMBOLS[number];

export function SlotMachine() {
  const { user, profile, refreshProfile } = useAuth();
  const [coins, setCoins] = useState<number>(1000);
  const [bet, setBet] = useState(25);
  const [spinning, setSpinning] = useState(false);
  const [strips, setStrips] = useState<Sym[][]>([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[1], SYMBOLS[2], SYMBOLS[3]],
    [SYMBOLS[2], SYMBOLS[3], SYMBOLS[4]],
  ]);
  const [lastWin, setLastWin] = useState(0);
  const [winPulse, setWinPulse] = useState(false);
  const [winningRows, setWinningRows] = useState<number[]>([]);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const reelTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

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
    setWinningRows([]);
    setSpinning(true);
    const newCoins = coins - bet;
    setCoins(newCoins);

    // pre-pick finals: per reel, 3 visible rows (the last 3 of the strip)
    const finals: Sym[][] = [
      [pickSymbol(), pickSymbol(), pickSymbol()],
      [pickSymbol(), pickSymbol(), pickSymbol()],
      [pickSymbol(), pickSymbol(), pickSymbol()],
    ];

    // Build a long strip for each reel: many random symbols + finals at the end.
    const newStrips: Sym[][] = [0, 1, 2].map((i) => {
      const pad = 22 + i * 8; // longer strips for later-stopping reels
      const rand = Array.from({ length: pad }, () => pickSymbol());
      return [...rand, ...finals[i]];
    });
    setStrips(newStrips);

    // reset positions to top (no transition) on the next frame
    requestAnimationFrame(() => {
      [0, 1, 2].forEach((i) => {
        const el = reelRefs.current[i];
        if (!el) return;
        el.style.transition = "none";
        el.style.transform = "translateY(0)";
      });
      // then start the spin animation
      requestAnimationFrame(() => {
        [0, 1, 2].forEach((i) => {
          const el = reelRefs.current[i];
          if (!el) return;
          const dur = 0.7 + i * 0.45; // staggered stop
          const dist = (newStrips[i].length - VISIBLE) * CELL_H;
          el.style.transition = `transform ${dur}s cubic-bezier(0.18, 0.7, 0.2, 1)`;
          el.style.transform = `translateY(-${dist}px)`;
        });
      });
    });

    // resolve outcome after the last reel stops
    const totalDuration = 700 + 2 * 450 + 120;
    const t = setTimeout(() => {
      let totalWin = 0;
      const wonRows: number[] = [];
      const flatSyms: SymbolKey[] = [];
      for (let row = 0; row < 3; row++) {
        const a = finals[0][row], b = finals[1][row], c = finals[2][row];
        flatSyms.push(a.key, b.key, c.key);
        let rowWin = 0;
        if (a.key === b.key && b.key === c.key) {
          rowWin = bet * a.mult;
        } else if (a.key === b.key || b.key === c.key || a.key === c.key) {
          const matchSym = a.key === b.key ? a : b.key === c.key ? b : a;
          rowWin = Math.floor(bet * (matchSym.mult / 5));
        }
        // halve win frequency: 50% of would-be wins are voided
        if (rowWin > 0 && Math.random() < 0.5) rowWin = 0;
        if (rowWin > 0) {
          wonRows.push(row);
          totalWin += rowWin;
        }
      }
      const afterWin = newCoins + totalWin;
      setCoins(afterWin);
      setLastWin(totalWin);
      setWinningRows(wonRows);
      setSpinning(false);
      if (totalWin > 0) {
        setWinPulse(true);
        setTimeout(() => setWinPulse(false), 1500);
        toast.success(`Výhra ${totalWin.toLocaleString("cs-CZ")} mincí!`, { duration: 2500 });
      }
      persistCoins(afterWin, totalWin, flatSyms);
    }, totalDuration);
    reelTimers.current.push(t);
  };

  useEffect(() => () => reelTimers.current.forEach(clearTimeout), []);

  const topUp = () => {
    const next = coins + 500;
    setCoins(next);
    if (user) {
      supabase.from("profiles").update({ coins: next }).eq("id", user.id).then(() => refreshProfile());
    } else {
      setGuestCoins(next);
    }
    toast.success("+500 mincí zdarma!");
  };

  const reelsViewportHeight = CELL_H * VISIBLE;

  return (
    <div className="relative max-w-xl mx-auto">
      {/* Cabinet */}
      <div className="relative rounded-3xl p-1 bg-gold-grad shadow-gold">
        <div className="rounded-3xl bg-gradient-to-b from-[oklch(0.32_0.16_310)] to-[oklch(0.18_0.1_300)] p-4 sm:p-5 border border-[oklch(0.88_0.16_85/0.3)]">
          <div className="ring-bulbs h-2.5 animate-bulb mb-3 rounded-full" />

          <div className="flex items-center justify-between mb-3 gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)]">
              <Coins className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              <span className="text-[10px] uppercase tracking-widest text-[oklch(0.8_0.05_75)]">Mince</span>
              <span className="text-base font-bold text-gold tabular-nums">{coins.toLocaleString("cs-CZ")}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] ${winPulse ? "animate-glow" : ""}`}>
              <span className="text-[10px] uppercase tracking-widest text-[oklch(0.8_0.05_75)]">Výhra</span>
              <span className={`text-base font-bold tabular-nums ${lastWin > 0 ? "text-gold" : "text-[oklch(0.7_0.05_75)]"}`}>
                {lastWin > 0 ? `+${lastWin.toLocaleString("cs-CZ")}` : "—"}
              </span>
            </div>
          </div>

          {/* Reels frame */}
          <div
            className="relative rounded-2xl bg-[oklch(0.14_0.08_300)] border-2 border-[oklch(0.78_0.16_75/0.5)] shadow-inner"
            style={{ padding: `${REEL_PAD}px` }}
          >
            <div
              className="grid grid-cols-3"
              style={{ gap: `${REEL_GAP}px`, height: `${reelsViewportHeight}px` }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-gradient-to-b from-[oklch(0.22_0.12_300)] to-[oklch(0.16_0.09_300)] border border-[oklch(0.65_0.22_340/0.4)]"
                  style={{ height: `${reelsViewportHeight}px` }}
                >
                  <div
                    ref={(el) => {
                      reelRefs.current[i] = el;
                    }}
                    className="flex flex-col will-change-transform"
                    style={{ transform: "translateY(0)" }}
                  >
                    {strips[i].map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center"
                        style={{ height: `${CELL_H}px` }}
                      >
                        <img
                          src={s.img}
                          alt={s.name}
                          className="max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_4px_10px_oklch(0.3_0.14_320/0.6)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Winning row frames (static, site-styled) */}
            {!spinning &&
              winningRows.map((row) => (
                <div
                  key={`win-${row}`}
                  className="pointer-events-none absolute rounded-xl border-2 border-[oklch(0.88_0.18_85)] shadow-[0_0_18px_oklch(0.88_0.18_85/0.55),inset_0_0_14px_oklch(0.88_0.18_85/0.25)]"
                  style={{
                    top: `${REEL_PAD + row * CELL_H}px`,
                    left: `${REEL_PAD}px`,
                    right: `${REEL_PAD}px`,
                    height: `${CELL_H}px`,
                  }}
                >
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[oklch(0.88_0.18_85)] shadow-[0_0_8px_oklch(0.88_0.18_85)]" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[oklch(0.88_0.18_85)] shadow-[0_0_8px_oklch(0.88_0.18_85)]" />
                </div>
              ))}
          </div>

          {/* Controls */}
          <div className="mt-4 grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setBet(BET_OPTIONS[Math.max(0, BET_OPTIONS.indexOf(bet) - 1)])}
                className="p-2 rounded-full bg-black/40 border border-[oklch(0.78_0.16_75/0.5)] hover:bg-black/60"
                disabled={spinning}
              >
                <Minus className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
              </button>
              <div className="px-4 py-1.5 rounded-lg bg-black/50 border border-[oklch(0.78_0.16_75/0.5)] min-w-[110px] text-center">
                <div className="text-[10px] uppercase tracking-widest text-[oklch(0.7_0.04_75)]">Sázka</div>
                <div className="text-base font-bold text-gold tabular-nums">{bet}</div>
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
              className="relative px-8 py-3 rounded-xl bg-gold-grad text-[oklch(0.22_0.1_300)] text-base uppercase tracking-widest font-extrabold shadow-gold disabled:opacity-50 hover:brightness-110 active:scale-95 transition border-2 border-[oklch(0.6_0.22_340)]"
            >
              {spinning ? "Točím…" : "Točit"}
            </button>

            <div className="flex justify-center">
              <button
                onClick={topUp}
                className="px-4 py-2 rounded-lg bg-[oklch(0.55_0.22_340)] hover:bg-[oklch(0.62_0.24_340)] border border-[oklch(0.78_0.16_75/0.5)] text-sm text-[oklch(0.95_0.04_85)] font-semibold"
              >
                +500 zdarma
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paytable */}
      <div className="mt-4 rounded-2xl bg-[oklch(0.22_0.1_300)] border border-[oklch(0.78_0.16_75/0.3)] p-4">
        <h3 className="text-gold text-xs uppercase tracking-widest mb-2">Výplaty (3 stejné × sázka)</h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {SYMBOLS.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-black/30">
              <img src={s.img} alt={s.name} className="w-9 h-9 object-contain" />
              <span className="text-[10px] text-[oklch(0.85_0.04_75)]">{s.name}</span>
              <span className="text-xs font-bold text-gold">×{s.mult}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[oklch(0.7_0.04_75)]">2 stejné symboly vyplácí 1/5 hodnoty. Bez vkladů, bez reálných peněz — pouze virtuální mince pro zábavu.</p>
      </div>
    </div>
  );
}
