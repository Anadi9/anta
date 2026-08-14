import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/build", label: "Build" },
  { href: "/about", label: "Studio" },
];

// Placeholder nav — see design-reference/ANTA Site.dc.html for the real
// visual treatment (fixed, minimal, monospace labels, "On this page" side
// index on scroll). Rebuild this against that reference, not from scratch.
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 font-mono text-xs uppercase tracking-widest">
      <Link href="/" className="text-white">
        ANTA
      </Link>
      <nav className="flex items-center gap-6 text-fg-muted">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-white">
            {l.label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="border border-accent/75 px-4 py-2 text-white hover:bg-accent/10"
        >
          Start a conversation
        </Link>
      </nav>
    </header>
  );
}
