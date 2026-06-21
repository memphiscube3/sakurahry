import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SlotMachine } from "@/components/slot-machine";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/hra")({
  head: () => ({
    meta: [
      { title: "Hra — Kasino Sakura" },
      { name: "description", content: "Točte válce v japonském slotu. Zdarma, bez registrace." },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  const { user } = useAuth();
  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-5xl text-center text-gold mb-2">Kasino Sakura</h1>
        <p className="text-center text-[oklch(0.8_0.04_75)] mb-10">Roztočte válce a získejte virtuální mince</p>
        <SlotMachine />
        {!user && (
          <div className="mt-10 max-w-xl mx-auto rounded-2xl bg-[oklch(0.24_0.1_300)] border border-[oklch(0.78_0.16_75/0.4)] p-6 text-center">
            <h3 className="text-xl text-gold mb-2">Uložte si pokrok</h3>
            <p className="text-sm text-[oklch(0.85_0.04_75)] mb-4">
              Zaregistrujte se zdarma a vaše mince, historie hry a úspěchy zůstanou s vámi.
            </p>
            <Link to="/prihlaseni" className="inline-flex px-6 py-3 rounded-lg bg-gold-grad text-[oklch(0.22_0.1_300)] font-bold uppercase tracking-widest shadow-gold">
              Registrovat se
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}