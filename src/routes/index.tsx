import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SlotMachine } from "@/components/slot-machine";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import { Sparkles, Coins, Shield, Trophy, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cirkusová štěstěna — Hrajte cirkusový slot zdarma" },
      { name: "description", content: "Sociální kasino v cirkusovém stylu. Točte válce, sbírejte virtuální mince a bavte se zdarma." },
      { property: "og:title", content: "Cirkusová štěstěna — Sociální kasino" },
      { property: "og:description", content: "Točte válce pod cirkusovým stanem. Hrajte zdarma." },
    ],
  }),
  component: Index,
});

const faqs = [
  { q: "Co je sociální kasino?", a: "Zábavní herní platforma s virtuálními mincemi. Není to hazardní hra o reálné peníze." },
  { q: "Je hra opravdu zdarma?", a: "Ano. Hra je 100 % zdarma a nepožaduje žádné vklady ani platby." },
  { q: "Mohu vyhrát reálné peníze?", a: "Ne. Virtuální mince nemají peněžní hodnotu a nelze je vyměnit za peníze, zboží ani služby." },
  { q: "Jak získat další mince?", a: "Stiskněte tlačítko +500 zdarma v herní obrazovce nebo se zaregistrujte pro uložení pokroku." },
  { q: "Co dělat, když hra nefunguje?", a: "Obnovte stránku, vyzkoušejte jiný prohlížeč nebo nás kontaktujte přes formulář v sekci Kontakt." },
  { q: "Jak obnovit účet?", a: "Použijte funkci „Zapomenuté heslo“ na přihlašovací obrazovce nebo nás kontaktujte." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl border border-[oklch(0.78_0.16_75/0.3)] bg-[oklch(0.22_0.06_25)] overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
            <span className="text-[oklch(0.95_0.04_85)] font-semibold">{f.q}</span>
            <ChevronDown className={`h-5 w-5 text-[oklch(0.88_0.16_85)] transition ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-[oklch(0.85_0.04_75)]">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.17_0.06_25/0.6)] via-transparent to-[oklch(0.17_0.06_25)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <img src={logo} alt="Cirkusová štěstěna" className="mx-auto lg:mx-0 max-w-md w-full h-auto mb-6 drop-shadow-[0_0_30px_oklch(0.78_0.16_75/0.5)]" />
            <p className="text-lg sm:text-xl text-[oklch(0.92_0.04_85)] mb-2 font-medium">Vítejte v cirkusovém kasinu zdarma</p>
            <p className="text-sm text-[oklch(0.8_0.04_75)] mb-8 max-w-lg mx-auto lg:mx-0">
              Točte válce s ohnivými lvy, jokerymi a kouzelnými truhlami. Žádné vklady, žádné výhry v penězích — jen čistá radost ze hry.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/hra"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-grad text-[oklch(0.2_0.06_25)] font-extrabold uppercase tracking-widest shadow-gold hover:brightness-110 transition animate-glow"
              >
                <Sparkles className="h-5 w-5" /> Hrát zdarma
              </Link>
              <Link
                to="/prihlaseni"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[oklch(0.4_0.18_25)] hover:bg-[oklch(0.45_0.2_25)] border border-[oklch(0.78_0.16_75/0.5)] text-[oklch(0.95_0.04_85)] font-semibold uppercase tracking-widest"
              >
                Registrace
              </Link>
            </div>
          </div>
          <div className="lg:scale-90 origin-top">
            <SlotMachineMini />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-12">Proč Cirkusová štěstěna</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Coins, t: "Zcela zdarma", d: "Žádné vklady, žádné mikrotransakce. Hrajte tak dlouho, jak chcete." },
            { icon: Shield, t: "Bezpečné", d: "Sociální kasino bez reálných peněz. Pouze virtuální mince pro zábavu." },
            { icon: Trophy, t: "Ukládání pokroku", d: "Zaregistrujte se a vaše mince, výhry a historie zůstanou s vámi." },
            { icon: Sparkles, t: "Cirkusová atmosféra", d: "Unikátní design, ohnivé symboly a dramatické animace." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-6 bg-[oklch(0.22_0.06_25)] border border-[oklch(0.78_0.16_75/0.3)] hover:border-[oklch(0.78_0.16_75/0.7)] transition">
              <div className="w-12 h-12 rounded-full bg-gold-grad flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-[oklch(0.2_0.06_25)]" />
              </div>
              <h3 className="text-lg text-gold mb-2">{f.t}</h3>
              <p className="text-sm text-[oklch(0.85_0.04_75)] leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO PLAY */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-12">Jak hrát</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Nastavte sázku", d: "Vyberte velikost sázky pomocí tlačítek + a −. Sázka se odečte z vašich virtuálních mincí." },
            { n: "02", t: "Stiskněte Točit", d: "Tři válce se roztočí pod cirkusovým stanem. Sledujte, jak se zastavují jeden po druhém." },
            { n: "03", t: "Vyhrávejte mince", d: "Tři stejné symboly přinesou velkou výhru podle tabulky výplat. Dva stejné menší." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl p-6 bg-gradient-to-br from-[oklch(0.28_0.12_25)] to-[oklch(0.18_0.06_25)] border border-[oklch(0.78_0.16_75/0.4)] relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-7xl font-black text-gold opacity-20">{s.n}</div>
              <h3 className="text-xl text-gold mb-3 relative">{s.t}</h3>
              <p className="text-sm text-[oklch(0.85_0.04_75)] relative leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW GAME */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-3">Vyzkoušejte hru</h2>
        <p className="text-center text-[oklch(0.8_0.04_75)] mb-10">Zatočte válci přímo zde — bez registrace.</p>
        <SlotMachine />
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center text-gold mb-10">Časté otázky</h2>
        <Faq />
      </section>

      {/* DISCLAIMER */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-[oklch(0.22_0.06_25)] border border-[oklch(0.55_0.22_30/0.5)] p-6 text-center">
          <p className="text-sm text-[oklch(0.9_0.04_75)] leading-relaxed">
            <strong className="text-gold">Důležité upozornění:</strong> Cirkusová štěstěna je sociální kasino a není hazardní hrou o reálné peníze.
            Veškeré virtuální mince nemají peněžní hodnotu a nelze je vyměnit za peníze, zboží ani služby. Hra je určena pouze pro osoby starší 18 let.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

// Mini decorative preview (uses real machine — placed in hero for visual punch)
function SlotMachineMini() {
  return (
    <div className="hidden lg:block">
      <SlotMachine />
    </div>
  );
}
