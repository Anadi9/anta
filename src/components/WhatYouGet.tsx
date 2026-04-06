import { CheckCircle2 } from "lucide-react";

const items = [
  "Product built to validate demand",
  "System designed for revenue",
  "Scalable architecture",
  "Clear product thinking",
];

const WhatYouGet = () => {
  return (
    <section
      id="what-you-get"
      className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 border-y border-border/40"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-righteous mb-4">
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              What You Get
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every engagement is structured so you leave with something shippable — and something measurable.
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {items.map((text) => (
            <li
              key={text}
              className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <CheckCircle2 className="w-6 h-6 text-brand-purple shrink-0 mt-0.5" aria-hidden />
              <span className="text-foreground font-medium leading-snug">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhatYouGet;
