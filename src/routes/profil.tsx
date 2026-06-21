import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Coins, Trophy, TrendingUp, Repeat, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profil")({
  head: () => ({ meta: [{ title: "Profil — Kasino Sakura" }] }),
  component: Profile,
});

type HistoryRow = {
  id: string;
  bet: number;
  win: number;
  symbols: string[];
  balance_after: number;
  created_at: string;
};

function Profile() {
  const { user, profile, signOut, loading } = useAuth();
  const nav = useNavigate();
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [tab, setTab] = useState<"profile" | "history" | "achievements" | "settings">("profile");

  useEffect(() => {
    if (!loading && !user) nav({ to: "/prihlaseni" });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("game_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setHistory((data ?? []) as HistoryRow[]));
  }, [user, profile?.total_spins]);

  if (!user || !profile) {
    return (
      <SiteLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center text-[oklch(0.85_0.04_75)]">Načítání…</div>
      </SiteLayout>
    );
  }

  const stats = [
    { icon: Coins, label: "Mince", val: profile.coins.toLocaleString("cs-CZ") },
    { icon: Repeat, label: "Točení", val: profile.total_spins.toLocaleString("cs-CZ") },
    { icon: Trophy, label: "Výhry", val: profile.total_wins.toLocaleString("cs-CZ") },
    { icon: TrendingUp, label: "Největší výhra", val: profile.biggest_win.toLocaleString("cs-CZ") },
  ];

  const achievements = [
    { t: "První točení", got: profile.total_spins >= 1 },
    { t: "Veterán (50 točení)", got: profile.total_spins >= 50 },
    { t: "Sakuraový mistr (500 točení)", got: profile.total_spins >= 500 },
    { t: "Šťastlivec (první výhra)", got: profile.total_wins >= 1 },
    { t: "Velká výhra 1000+", got: profile.biggest_win >= 1000 },
    { t: "Bohatý ringmaster (5000+ mincí)", got: profile.coins >= 5000 },
  ];

  const deleteAccount = async () => {
    if (!confirm("Opravdu chcete smazat účet? Akce je nevratná.")) return;
    // Soft: sign out + ask user to email support to fully delete. Provide page reference.
    toast.info("Pro úplné smazání nás kontaktujte na support@sakuraova-stestena.cz");
    nav({ to: "/smazani-uctu" });
  };

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.28_0.12_25)] to-[oklch(0.18_0.06_25)] border border-[oklch(0.78_0.16_75/0.4)] p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)]">Vítejte zpět</p>
              <h1 className="text-3xl sm:text-4xl text-gold">{profile.username}</h1>
              <p className="text-sm text-[oklch(0.8_0.04_75)] mt-1">{profile.email}</p>
            </div>
            <button onClick={() => signOut()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] hover:bg-black/60 text-[oklch(0.9_0.04_75)]">
              <LogOut className="h-4 w-4" /> Odhlásit
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl p-4 bg-black/30 border border-[oklch(0.78_0.16_75/0.3)]">
                <s.icon className="h-5 w-5 text-[oklch(0.88_0.16_85)] mb-2" />
                <div className="text-xs uppercase tracking-widest text-[oklch(0.75_0.04_75)]">{s.label}</div>
                <div className="text-xl font-bold text-gold tabular-nums">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { k: "profile", l: "Profil" },
            { k: "history", l: "Historie hry" },
            { k: "achievements", l: "Úspěchy" },
            { k: "settings", l: "Nastavení" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as any)}
              className={`px-4 py-2 rounded-lg text-sm uppercase tracking-widest whitespace-nowrap ${
                tab === t.k ? "bg-gold-grad text-[oklch(0.2_0.06_25)]" : "bg-[oklch(0.22_0.06_25)] text-[oklch(0.85_0.04_75)] border border-[oklch(0.78_0.16_75/0.3)]"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <div className="rounded-2xl bg-[oklch(0.22_0.06_25)] border border-[oklch(0.78_0.16_75/0.3)] p-6">
            <h2 className="text-xl text-gold mb-3">Začít hrát</h2>
            <p className="text-sm text-[oklch(0.85_0.04_75)] mb-4">Vaše mince a pokrok se ukládají automaticky.</p>
            <Link to="/hra" className="inline-flex px-6 py-3 rounded-lg bg-gold-grad text-[oklch(0.2_0.06_25)] font-bold uppercase tracking-widest shadow-gold">
              Otevřít hru
            </Link>
          </div>
        )}

        {tab === "history" && (
          <div className="rounded-2xl bg-[oklch(0.22_0.06_25)] border border-[oklch(0.78_0.16_75/0.3)] p-4 sm:p-6">
            <h2 className="text-xl text-gold mb-4">Posledních 50 točení</h2>
            {history.length === 0 ? (
              <p className="text-sm text-[oklch(0.8_0.04_75)]">Zatím žádná historie. Začněte hrát!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[oklch(0.75_0.04_75)] uppercase text-xs tracking-widest border-b border-[oklch(0.78_0.16_75/0.2)]">
                      <th className="py-2 pr-2">Čas</th>
                      <th className="py-2 pr-2">Symboly</th>
                      <th className="py-2 pr-2 text-right">Sázka</th>
                      <th className="py-2 pr-2 text-right">Výhra</th>
                      <th className="py-2 pr-2 text-right">Zůstatek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-b border-[oklch(0.78_0.16_75/0.1)]">
                        <td className="py-2 pr-2 text-[oklch(0.8_0.04_75)]">{new Date(h.created_at).toLocaleString("cs-CZ")}</td>
                        <td className="py-2 pr-2 text-[oklch(0.9_0.04_85)]">{h.symbols.join(" · ")}</td>
                        <td className="py-2 pr-2 text-right text-[oklch(0.85_0.04_75)] tabular-nums">{h.bet}</td>
                        <td className={`py-2 pr-2 text-right tabular-nums font-semibold ${h.win > 0 ? "text-gold" : "text-[oklch(0.6_0.04_75)]"}`}>
                          {h.win > 0 ? `+${h.win}` : "—"}
                        </td>
                        <td className="py-2 pr-2 text-right text-[oklch(0.9_0.04_85)] tabular-nums">{h.balance_after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "achievements" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.t}
                className={`rounded-xl p-4 border flex items-center gap-3 ${
                  a.got ? "bg-[oklch(0.28_0.14_70/0.3)] border-[oklch(0.78_0.16_75/0.6)]" : "bg-[oklch(0.2_0.04_25)] border-[oklch(0.4_0.05_25)] opacity-60"
                }`}
              >
                <Trophy className={`h-6 w-6 ${a.got ? "text-[oklch(0.88_0.16_85)]" : "text-[oklch(0.5_0.04_75)]"}`} />
                <span className={a.got ? "text-gold font-semibold" : "text-[oklch(0.7_0.04_75)]"}>{a.t}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <div className="rounded-2xl bg-[oklch(0.22_0.06_25)] border border-[oklch(0.78_0.16_75/0.3)] p-6 space-y-4">
            <h2 className="text-xl text-gold">Nastavení účtu</h2>
            <p className="text-sm text-[oklch(0.85_0.04_75)]">Email: <strong>{profile.email}</strong></p>
            <p className="text-sm text-[oklch(0.85_0.04_75)]">Přezdívka: <strong>{profile.username}</strong></p>
            <hr className="border-[oklch(0.78_0.16_75/0.2)]" />
            <h3 className="text-[oklch(0.95_0.04_85)] font-semibold">Smazat účet</h3>
            <p className="text-sm text-[oklch(0.8_0.04_75)]">Trvalé smazání účtu a všech dat. Akce je nevratná.</p>
            <button onClick={deleteAccount} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.45_0.2_25)] hover:bg-[oklch(0.5_0.22_25)] text-[oklch(0.98_0.02_85)] font-semibold">
              <Trash2 className="h-4 w-4" /> Smazat účet
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}