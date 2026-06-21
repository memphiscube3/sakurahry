import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/zodpovedna-hra")({
  head: () => ({ meta: [{ title: "Zodpovědná hra — Kasino Sakura" }] }),
  component: () => (
    <InfoPage title="Zodpovědná hra">
      <p>I když hra nepředpokládá výhru peněz, doporučujeme přistupovat ke hraní s mírou.</p>
      <p>Pokud začne herní aktivita negativně ovlivňovat váš život, doporučujeme udělat si pauzu nebo používání služby ukončit.</p>
      <h2>Tipy</h2>
      <ul className="list-disc pl-5">
        <li>Stanovte si časový limit hraní.</li>
        <li>Hrajte pro zábavu, nikoli z nutnosti.</li>
        <li>Dělejte přestávky.</li>
      </ul>
      <h2>Pomoc</h2>
      <p>Pokud potřebujete pomoc, kontaktujte odborné organizace zabývající se prevencí závislostí.</p>
    </InfoPage>
  ),
});