import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/kontakt")({
  head: () => ({ meta: [{ title: "Kontakt — Kasino Sakura" }, { name: "description", content: "Kontaktujte podporu Sakuraové štěstěny." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Zpráva odeslána. Odpovíme do 24–48 hodin.");
    setName(""); setEmail(""); setMsg("");
  };
  return (
    <InfoPage title="Kontakt">
      <p>
        Potřebujete pomoc? Napište nám na{" "}
        <a href="mailto:support@sakuraova-stestena.cz">support@sakuraova-stestena.cz</a>.
        Odpovídáme zpravidla do <strong>24–48 hodin</strong>.
      </p>
      <form onSubmit={submit} className="space-y-4 mt-6 not-prose">
        <div>
          <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Jméno</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)]" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)]" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[oklch(0.8_0.04_75)] mb-1 block">Zpráva</label>
          <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-lg bg-black/40 border border-[oklch(0.78_0.16_75/0.4)] text-[oklch(0.95_0.04_85)]" />
        </div>
        <button type="submit" className="px-6 py-3 rounded-lg bg-gold-grad text-[oklch(0.22_0.1_300)] font-bold uppercase tracking-widest shadow-gold">Odeslat</button>
      </form>
    </InfoPage>
  );
}