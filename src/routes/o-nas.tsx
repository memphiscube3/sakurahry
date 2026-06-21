import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/o-nas")({
  head: () => ({ meta: [{ title: "O nás — Cirkusová štěstěna" }, { name: "description", content: "O sociálním kasinu Cirkusová štěstěna." }] }),
  component: () => (
    <InfoPage title="O nás">
      <p>
        Cirkusová štěstěna je bezplatné sociální kasino inspirované magickou atmosférou starých
        cirkusů — sametovými oponami, zlatým ornamentem, žárovkami nad arénou a tajemnými umělci.
      </p>
      <p>
        Naším cílem je nabídnout zábavu bez rizika. <strong>Žádné reálné peníze, žádné vklady,
        žádné výhry.</strong> Jen virtuální mince, krásný design a pocit vzrušení z točení válců.
      </p>
      <h2>Pro koho je hra</h2>
      <p>Pro každého ve věku 18+, kdo má rád cirkusovou estetiku a chce si zahrát zdarma.</p>
      <h2>Naše hodnoty</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Bezpečnost a transparentnost</li>
        <li>Zábava bez rizika</li>
        <li>Respekt k uživatelům a jejich datům</li>
      </ul>
    </InfoPage>
  ),
});