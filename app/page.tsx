import { ChatWidget } from "@/components/ChatWidget";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-treehouse-paper text-treehouse-ink">
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-treehouse-olive">
          Mérida, Yucatán
        </p>
        <h1 className="font-serif mt-6 text-7xl leading-[1.05] tracking-tight">
          The TreeHouse
        </h1>
        <p className="font-serif mt-8 text-xl text-treehouse-ink/80">
          Boutique hotel in Mérida, Yucatán.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-32">
        <div className="h-px w-16 bg-treehouse-terracotta/60" />
        <p className="font-serif mt-10 text-lg leading-relaxed text-treehouse-ink/85">
          Nestled in the heart of Mérida&apos;s historic Santa Ana neighborhood,
          The TreeHouse offers an adults-only sanctuary where colonial charm
          meets contemporary comfort. Fifteen rooms surround a courtyard of
          lush greenery, a naturally cool microclimate that holds even on the
          warmest Yucatán days.
        </p>
        <p className="font-serif mt-6 text-base text-treehouse-ink/70">
          The first Michelin Key hotel in Mérida.
        </p>
      </section>

      <footer className="mx-auto max-w-3xl px-6 pb-16">
        <div className="h-px w-full bg-treehouse-sand/60" />
        <p className="font-serif mt-6 text-sm text-treehouse-ink/60">
          Calle 43 x 58 y 60 #489, Santa Ana, Mérida
        </p>
      </footer>

      <ChatWidget />
    </main>
  );
}
