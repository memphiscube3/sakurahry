import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/ochrana-osobnich-udaju")({
  head: () => ({ meta: [{ title: "Ochrana osobních údajů — Kasino Sakura" }] }),
  component: () => (
    <InfoPage title="Ochrana osobních údajů">
      <p>Vážíme si vašeho soukromí. Tento dokument popisuje, jaká data zpracováváme a proč.</p>
      <h2>Jaké údaje zpracováváme</h2>
      <ul className="list-disc pl-5"><li>Email a přezdívka při registraci</li><li>Herní statistiky (počet točení, výhry, zůstatek virtuálních mincí)</li><li>Technické informace (cookies, IP)</li></ul>
      <h2>K jakému účelu</h2>
      <p>Údaje slouží výhradně k provozu hry, uložení vašeho pokroku a zlepšování služby.</p>
      <h2>Vaše práva</h2>
      <p>Máte právo na přístup, opravu i vymazání svých údajů. Kontaktujte nás na support@sakuraova-stestena.cz.</p>
      <h2>Sdílení s třetími stranami</h2>
      <p>Vaše osobní údaje neprodáváme. Sdílíme je pouze s poskytovateli nezbytné infrastruktury (hosting, databáze).</p>
    </InfoPage>
  ),
});