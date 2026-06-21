import { type ReactNode } from "react";
import { SiteLayout } from "./site-layout";

export function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-5xl text-gold mb-8 text-center">{title}</h1>
        <div className="prose prose-invert max-w-none text-[oklch(0.88_0.04_75)] space-y-4 [&_h2]:text-gold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_a]:text-[oklch(0.88_0.16_85)] [&_a]:underline [&_strong]:text-[oklch(0.95_0.04_85)]">
          {children}
        </div>
      </article>
    </SiteLayout>
  );
}