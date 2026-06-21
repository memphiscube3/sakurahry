import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.png";
import { Menu, X, Coins, LogOut, User as UserIcon } from "lucide-react";

const nav = [
  { to: "/", label: "Domů" },
  { to: "/hra", label: "Hrát" },
  { to: "/o-nas", label: "O nás" },
  { to: "/faq", label: "FAQ" },
  { to: "/kontakt", label: "Kontakt" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Bulb string ornament */}
      <div className="h-3 bg-gradient-to-b from-[oklch(0.22_0.1_300)] to-transparent border-b border-[oklch(0.78_0.16_75/0.3)]">
        <div className="ring-bulbs h-3 animate-bulb opacity-90" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-[oklch(0.18_0.1_300/0.85)] border-b border-[oklch(0.78_0.16_75/0.25)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Kasino Sakura" className="h-12 w-auto drop-shadow-[0_0_10px_oklch(0.78_0.16_75/0.4)]" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm uppercase tracking-widest text-[oklch(0.85_0.05_75)] hover:text-[oklch(0.88_0.16_85)] transition-colors"
                activeProps={{ className: "text-[oklch(0.88_0.16_85)]" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.32_0.14_310)] border border-[oklch(0.78_0.16_75/0.5)]">
                <Coins className="h-4 w-4 text-[oklch(0.88_0.16_85)]" />
                <span className="text-sm font-semibold text-gold">{profile.coins.toLocaleString("cs-CZ")}</span>
              </div>
            )}
            {user ? (
              <>
                <Link to="/profil" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[oklch(0.9_0.04_75)] hover:text-[oklch(0.88_0.16_85)]">
                  <UserIcon className="h-4 w-4" /> Profil
                </Link>
                <button onClick={() => signOut()} className="hidden sm:inline-flex p-2 rounded hover:bg-white/5" aria-label="Odhlásit">
                  <LogOut className="h-4 w-4 text-[oklch(0.85_0.05_75)]" />
                </button>
              </>
            ) : (
              <Link
                to="/prihlaseni"
                className="hidden sm:inline-flex px-4 py-2 rounded-md bg-gold-grad text-[oklch(0.2_0.08_300)] text-sm font-bold shadow-gold hover:brightness-110 transition"
              >
                Přihlásit
              </Link>
            )}
            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-6 w-6 text-[oklch(0.88_0.16_85)]" /> : <Menu className="h-6 w-6 text-[oklch(0.88_0.16_85)]" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-[oklch(0.78_0.16_75/0.2)] bg-[oklch(0.2_0.1_300)]">
            <div className="px-4 py-3 flex flex-col gap-3">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-1 text-[oklch(0.9_0.04_75)]">
                  {n.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profil" onClick={() => setOpen(false)} className="py-1 text-[oklch(0.9_0.04_75)]">Profil</Link>
                  <button onClick={() => { setOpen(false); signOut(); }} className="py-1 text-left text-[oklch(0.9_0.04_75)]">Odhlásit</button>
                </>
              ) : (
                <Link to="/prihlaseni" onClick={() => setOpen(false)} className="py-1 text-[oklch(0.88_0.16_85)] font-semibold">Přihlásit / Registrace</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-[oklch(0.78_0.16_75/0.25)] bg-[oklch(0.14_0.08_300)]">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="" className="h-16 w-auto mb-3" />
            <p className="text-xs text-[oklch(0.75_0.04_75)] leading-relaxed">
              Sociální kasino zdarma. Bez reálných peněz, bez vkladů, bez výher. Pouze pro zábavu.
            </p>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Hra</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li><Link to="/hra" className="hover:text-[oklch(0.88_0.16_85)]">Hrát zdarma</Link></li>
              <li><Link to="/profil" className="hover:text-[oklch(0.88_0.16_85)]">Můj profil</Link></li>
              <li><Link to="/faq" className="hover:text-[oklch(0.88_0.16_85)]">Časté otázky</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Informace</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li><Link to="/o-nas" className="hover:text-[oklch(0.88_0.16_85)]">O nás</Link></li>
              <li><Link to="/kontakt" className="hover:text-[oklch(0.88_0.16_85)]">Kontakt</Link></li>
              <li><Link to="/zodpovedna-hra" className="hover:text-[oklch(0.88_0.16_85)]">Zodpovědná hra</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-sm uppercase tracking-widest mb-3">Právní</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.85_0.04_75)]">
              <li><Link to="/ochrana-osobnich-udaju" className="hover:text-[oklch(0.88_0.16_85)]">Ochrana osobních údajů</Link></li>
              <li><Link to="/podminky" className="hover:text-[oklch(0.88_0.16_85)]">Podmínky použití</Link></li>
              <li><Link to="/cookies" className="hover:text-[oklch(0.88_0.16_85)]">Cookies</Link></li>
              <li><Link to="/smazani-uctu" className="hover:text-[oklch(0.88_0.16_85)]">Smazání účtu</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[oklch(0.78_0.16_75/0.15)] py-5 text-center text-xs text-[oklch(0.7_0.04_75)] px-4">
          <p className="mb-1">⚠ Hra je určena pouze pro osoby starší 18 let.</p>
          <p>© {new Date().getFullYear()} Kasino Sakura — Sociální kasino. Virtuální mince nemají peněžní hodnotu.</p>
        </div>
      </footer>
    </div>
  );
}