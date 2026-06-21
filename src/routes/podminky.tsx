import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/podminky")({
  head: () => ({ meta: [{ title: "Podmínky použití — Kasino Sakura" }] }),
  component: () => (
    <InfoPage title="Podmínky použití">
      <p>Používáním služby Kasino Sakura souhlasíte s těmito podmínkami.</p>
      <h2>1. Charakter služby</h2>
      <p>Kasino Sakura je <strong>sociální kasino</strong>. Není to hazardní hra o reálné peníze. Veškeré mince jsou virtuální a nemají žádnou peněžní hodnotu.</p>
      <h2>2. Věkové omezení</h2>
      <p>Služba je určena pouze osobám starším <strong>18 let</strong>.</p>
      <h2>3. Účet</h2>
      <p>Uživatel odpovídá za bezpečnost svých přihlašovacích údajů. Jeden účet na osobu.</p>
      <h2>4. Zakázané jednání</h2>
      <p>Nepoužívejte boty, exploity ani jiné způsoby zneužití herní mechaniky.</p>
      <h2>5. Zrušení účtu</h2>
      <p>Účet můžete kdykoli zrušit. Viz <a href="/smazani-uctu">Smazání účtu</a>.</p>
    </InfoPage>
  ),
});