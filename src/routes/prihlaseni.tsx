import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/prihlaseni")({
  head: () => ({
    meta: [
      { title: "Přihlášení / Registrace — Cirkusová štěstěna" },
      { name: "description", content: "Přihlaste se nebo si vytvořte účet a uložte si pokrok ve hře." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) nav({ to: "/profil" });
  }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password !== password2) {
          toast.error("Hesla se neshodují");
          return;
        }
        if (!agree) {
          toast.error("Musíte souhlasit s pravidly");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profil`,
            data: { username: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Účet vytvořen!");
        nav({ to: "/profil" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Vítejte zpět!");
        nav({ to: "/profil" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Chyba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-2xl bg-[oklch(0.22_0.06_25)] border border-[oklch(0.78_0.16_75/0.4)] p-8 shadow-gold">
          <div className="flex gap-2 mb-6 p-1 rounded-lg bg-black/40">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold uppercase tracking-widest transition ${
                mode === "login" ? "bg-gold-grad text-[oklch(0.2_0.06_25)]" : "text-[oklch(0.8_0.04_75)]"
              }`}
            >
              Přihlášení
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold uppercase tracking-widest transition ${
                mode === "signup" ? "bg-gold-grad text-[oklch(0.2_0.06_25)]" : "text-[oklch(0.8_0.04_75)]"
              }`}
            >
              Registrace
            </button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Přezdívka</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)] focus:outline-none focus:border-[oklch(0.88_0.16_85)]"
                  placeholder="ringmaster"
                />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)] focus:outline-none focus:border-[oklch(0.88_0.16_85)]"
                placeholder="vy@email.cz"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Heslo</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)] focus:outline-none focus:border-[oklch(0.88_0.16_85)]"
              />
            </div>
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Potvrzení hesla</label>
                  <input
                    type="password"
                    required
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)] focus:outline-none focus:border-[oklch(0.88_0.16_85)]"
                  />
                </div>
                <label className="flex items-start gap-2 text-sm text-[oklch(0.85_0.04_75)]">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
                  <span>
                    Souhlasím s{" "}
                    <Link to="/podminky" className="text-[oklch(0.88_0.16_85)] underline">podmínkami použití</Link>{" "}
                    a{" "}
                    <Link to="/ochrana-osobnich-udaju" className="text-[oklch(0.88_0.16_85)] underline">ochranou osobních údajů</Link>.
                    Potvrzuji, že je mi 18+ let.
                  </span>
                </label>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gold-grad text-[oklch(0.2_0.06_25)] font-extrabold uppercase tracking-widest shadow-gold disabled:opacity-50"
            >
              {loading ? "..." : mode === "login" ? "Přihlásit" : "Vytvořit účet"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-[oklch(0.7_0.04_75)]">
            Hra je pouze pro osoby starší 18 let. Virtuální mince nemají peněžní hodnotu.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}