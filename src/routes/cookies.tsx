import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [{ title: "Cookies — Cirkusová štěstěna" }] }),
  component: () => (
    <InfoPage title="Zásady používání cookies">
      <p>Tento web používá pouze nezbytné cookies pro fungování přihlášení a uložení herního stavu.</p>
      <h2>Typy cookies</h2>
      <ul className="list-disc pl-5"><li><strong>Nezbytné:</strong> přihlášení, herní zůstatek hostů</li><li><strong>Funkční:</strong> uložení preferencí</li></ul>
      <h2>Správa</h2>
      <p>Cookies můžete kdykoli vymazat v nastavení svého prohlížeče.</p>
    </InfoPage>
  ),
});