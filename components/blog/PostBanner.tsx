import Image from "next/image";
import { PLATE_SIZE, type Banner } from "@/lib/blog/banners";

/**
 * The art band under an article's title block.
 *
 * Two layers, and the split matters. The *ground* — grid rules, accent
 * bloom, baseline, mono strip — is coded, uses the site tokens, and is
 * identical on every post. The *plates* are art, positioned per post by
 * lib/blog/banners.ts. So the banner is recognisably the same object across
 * the blog while still being specific to the piece, which is the thing a
 * folder of one-off hero JPEGs never manages.
 *
 * COMPOSITING follows the homepage hero exactly (see the plate loop in
 * components/hero-background/scenes.ts): `mix-blend-mode: screen` over the
 * dark ground, and a two-axis linear-gradient mask feathering the edges.
 * The plates carry a knocked-out matte with real alpha, so without the
 * feather their crop rectangle prints as a faint seam against the bloom.
 * Screen blend is what keeps the matte's residue from reading as grey haze.
 *
 * The whole band is `aria-hidden`. It carries no information the prose
 * doesn't — the motif string is a caption for the composition, not content
 * — and announcing three decorative plates plus a two-word label ahead of
 * the article body is noise in a screen reader.
 *
 * PERFORMANCE. The first plate is `priority`; it sits in the viewport on
 * load, immediately under an h1, so it is a genuine LCP candidate and
 * lazy-loading it costs a visible pop-in. The rest load lazily. `sizes` is
 * derived from each plate's own `w` percentage against the 1280px shell
 * rather than left at the 100vw default, which would have the browser
 * fetching a full-width source for a plate that paints 200px wide.
 */
export function PostBanner({ banner, slug }: { banner: Banner; slug: string }) {
  /* Rules and bloom. Order matters and flips with the layer underneath:
     over the ground they sit *below* the plates, which screen-blend and
     need something to blend into; over a photograph they sit *above* it,
     because a photo that swallows the 104px rhythm detaches the band from
     the header. Same markup either way — only the position in the tree
     changes. */
  const ground = (
    <>
      <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(245,244,241,0.055)_0_1px,transparent_1px_104px)]" />
      <div className="pointer-events-none absolute -bottom-[45%] left-[38%] h-[54vw] w-[54vw] opacity-[0.16] [background:radial-gradient(circle,var(--color-accent-deep)_0%,transparent_60%)]" />
    </>
  );

  return (
    <div
      aria-hidden
      className="relative h-[clamp(150px,25vw,290px)] overflow-hidden border-t border-line-2 bg-bg-deep"
    >
      {banner.art ? null : ground}

      {/* A post with a photograph gets the photograph and nothing else. The
          ground still shows through the rules and the bloom above, which is
          what keeps a stock frame looking like part of this site rather
          than like a stock frame. See the `Art` note in lib/blog/banners.ts
          for why plates and photos are mutually exclusive. */}
      {banner.art ? (
        <Image
          src={`/blog/art/${slug}.webp`}
          alt=""
          width={1600}
          height={700}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.85]"
        />
      ) : null}
      {banner.art ? ground : null}

      {banner.art ? null : banner.plates.map((plate, i) => {
        const [w, h] = PLATE_SIZE[plate.src];
        const [fl, fr, ft, fb] = plate.feather ?? [12, 12, 12, 12];
        const stops = (a: number, b: number) =>
          `${a ? `transparent,#000 ${a}%,` : "#000,"}#000 ${100 - b}%${
            b ? ",transparent" : ""
          }`;
        const mask = `linear-gradient(to right,${stops(
          fl,
          fr,
        )}),linear-gradient(to bottom,${stops(ft, fb)})`;

        return (
          <Image
            key={`${plate.src}-${i}`}
            src={`/scene/${plate.src}.webp`}
            alt=""
            width={w}
            height={h}
            priority={i === 0}
            sizes={`(max-width: 1280px) ${plate.w}vw, ${Math.round(
              (plate.w / 100) * 1280,
            )}px`}
            className="pointer-events-none absolute h-auto -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
            style={{
              left: `${plate.cx}%`,
              top: `${plate.cy}%`,
              width: `${plate.w}%`,
              opacity: plate.op ?? 1,
              maskImage: mask,
              WebkitMaskImage: mask,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
              transform: `translate(-50%,-50%)${
                plate.flip ? " scaleX(-1)" : ""
              }`,
            }}
          />
        );
      })}

      {/* Left-edge scrim. The plates sit right of centre by convention, but
          a wide viewport pulls them leftward into the label — this keeps the
          mono strip legible without having to re-tune eight compositions. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] [background:linear-gradient(to_right,var(--color-bg-deep)_10%,transparent_100%)]" />

      <div className="relative mx-auto flex h-full max-w-[1280px] items-end px-[clamp(18px,4vw,56px)] pb-[clamp(14px,2vw,22px)]">
        <p className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-t-dimmer">
          <span aria-hidden className="h-[7px] w-[7px] bg-accent" />
          <span className="text-t-bright">{banner.motif}</span>
        </p>
      </div>
    </div>
  );
}
