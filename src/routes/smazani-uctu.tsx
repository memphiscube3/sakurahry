import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/smazani-uctu")({
  head: () => ({ meta: [{ title: "Smazání účtu — Kasino Sakura" }] }),
  component: () => (
    <InfoPage title="Smazání účtu a dat">
      <p>Vaše právo na vymazání respektujeme. Účet i veškerá osobní data můžete kdykoli smazat.</p>
      <h2>Postup</h2>
      <ol className="list-decimal pl-5">
        <li>Přihlaste se do svého profilu.</li>
        <li>Otevřete sekci <strong>Nastavení</strong>.</li>
        <li>Klikněte na <strong>Smazat účet</strong>.</li>
        <li>Nebo napište na <a href="mailto:support@sakuraova-stestena.cz">support@sakuraova-stestena.cz</a> z emailu, kterým jste se registrovali.</li>
      </ol>
      <p>Po potvrzení dojde k trvalému vymazání profilu, herní historie a všech osobních údajů do 30 dnů.</p>
    </InfoPage>
  ),
});