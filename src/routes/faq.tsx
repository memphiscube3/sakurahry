import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

const items: [string, string][] = [
  ["Co je sociální kasino?", "Zábavní platforma s virtuálními mincemi. Nejde o hazardní hru o reálné peníze."],
  ["Je hra opravdu zdarma?", "Ano. Hra je 100 % zdarma a nepožaduje žádné vklady ani platby."],
  ["Mohu vyhrát reálné peníze?", "Ne. Virtuální mince nemají peněžní hodnotu a nelze je vyměnit."],
  ["Jak získat další mince?", "Použijte tlačítko +500 zdarma ve hře nebo se zaregistrujte pro uložení pokroku."],
  ["Co dělat, když hra nefunguje?", "Obnovte stránku, zkuste jiný prohlížeč nebo nás kontaktujte."],
  ["Jak obnovit účet?", "Použijte funkci „Zapomenuté heslo“ nebo nás kontaktujte."],
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Cirkusová štěstěna" }, { name: "description", content: "Časté otázky o sociálním kasinu Cirkusová štěstěna." }] }),
  component: () => (
    <InfoPage title="Časté otázky">
      {items.map(([q, a]) => (
        <div key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </div>
      ))}
    </InfoPage>
  ),
});