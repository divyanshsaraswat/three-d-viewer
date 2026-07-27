import Link from "next/link";

export type LegalBlock =
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "dl"; items: { term: string; text: string }[] }
    | { type: "card"; title: string; rows: { label: string; value: string }[] };

function Block({ block }: { block: LegalBlock }) {
    switch (block.type) {
        case "h2":
            return <h2 className="text-lg md:text-xl font-bold tracking-tight mt-2 mb-3 first:mt-0">{block.text}</h2>;
        case "h3":
            return <h3 className="text-[15px] md:text-base font-bold tracking-tight mt-5 mb-2 text-black/80 dark:text-white/70">{block.text}</h3>;
        case "p":
            return <p className="text-justify text-[14px] md:text-[15px] text-black/60 dark:text-white/50 leading-relaxed font-medium mb-3">{block.text}</p>;
        case "ul":
            return (
                <ul className="list-disc pl-5 space-y-2 mb-3">
                    {block.items.map((item, i) => (
                        <li key={i} className="text-justify text-[14px] md:text-[15px] text-black/60 dark:text-white/50 leading-relaxed font-medium">{item}</li>
                    ))}
                </ul>
            );
        case "dl":
            return (
                <ul className="list-disc pl-5 space-y-2 mb-3">
                    {block.items.map((item, i) => (
                        <li key={i} className="text-justify text-[14px] md:text-[15px] text-black/60 dark:text-white/50 leading-relaxed font-medium">
                            <span className="font-bold text-black/80 dark:text-white/70">{item.term}</span> {item.text}
                        </li>
                    ))}
                </ul>
            );
        case "card":
            return (
                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-4 mb-3 space-y-1">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-[#8aab00] dark:text-[#ccff00] mb-2">{block.title}</p>
                    {block.rows.map((row, i) => (
                        <p key={i} className="text-justify text-[13px] text-black/60 dark:text-white/50 leading-relaxed font-medium">
                            <span className="font-bold text-black/80 dark:text-white/70">{row.label}:</span> {row.value}
                        </p>
                    ))}
                </div>
            );
    }
}

export function LegalPage({
    badge,
    title,
    lastUpdated,
    intro,
    blocks,
}: {
    badge: string;
    title: string;
    lastUpdated: string;
    intro?: string[];
    blocks: LegalBlock[];
}) {
    return (
        <main className="relative min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] pt-[18vh] pb-32 overflow-hidden font-sans text-black dark:text-white transition-colors duration-500">

            {/* Background ambient glows */}
            <div className="absolute top-[-15%] left-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />

            {/* HERO */}
            <section className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center text-center px-4 md:px-8 mb-16 z-10">
                <span className="bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 font-semibold tracking-widest text-[10px] sm:text-xs px-6 py-2 rounded-full uppercase mb-8">
                    {badge}
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-[4rem] font-black leading-[1.05] tracking-tighter uppercase mb-6">
                    {title}
                </h1>

                <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/30 font-mono mb-6">
                    Last updated: {lastUpdated}
                </p>

                {intro?.map((p, i) => (
                    <p key={i} className="text-sm md:text-base font-medium tracking-wide text-black/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
                        {p}
                    </p>
                ))}
            </section>

            {/* CONTENT */}
            <section className="px-4 md:px-8 max-w-[900px] mx-auto relative z-10">
                <div className="bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[2rem] p-6 sm:p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    {blocks.map((block, i) => (
                        <Block key={i} block={block} />
                    ))}

                    <div className="border-t border-black/10 dark:border-white/10 pt-8 mt-8">
                        <p className="text-[14px] md:text-[15px] text-black/60 dark:text-white/50 leading-relaxed font-medium">
                            Questions can also be sent via our{" "}
                            <Link href="/contact-us" className="text-[#8aab00] dark:text-[#ccff00] font-bold hover:underline">
                                Contact page
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
