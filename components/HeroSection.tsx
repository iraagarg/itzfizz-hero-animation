"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { assetPath } from "@/lib/assetPath";
import { STATS } from "@/lib/stats";
import StatCard from "./StatCard";

const WORDS = ["WELCOME", "ITZFIZZ"];

/** How far (in viewport heights) the user scrolls while the hero is pinned. */
const PIN_DISTANCE = 1.5;

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const one = (sel: string) => q(sel)[0] as HTMLElement;

      const track = one("[data-track]");
      const road = one("[data-road]");
      const car = one("[data-car]");
      const carBody = one("[data-car-body]");
      const trail = one("[data-trail]");
      const hint = one("[data-hint]");
      const hintInner = one("[data-hint-inner]");
      const eyebrow = one("[data-eyebrow]");
      const letters = q("[data-letter]") as HTMLElement[];
      const solids = q("[data-solid]");
      const ghosts = q("[data-ghost]");
      const parallax = q("[data-parallax]") as HTMLElement[];
      const cards = (q("[data-stat]") as HTMLElement[]).sort(
        (a, b) => Number(a.dataset.stat) - Number(b.dataset.stat),
      );

      const mm = gsap.matchMedia();

      // Reduced motion: no JS animation at all. CSS shows the final state.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- Layout cache ----------
         * Measured once up front and again after every ScrollTrigger refresh
         * (resize, orientation change, fonts loaded), once pins have been
         * re-applied at the new size. Never measured inside onUpdate. */
        const m = { roadW: 1, carW: 0, startX: 0, endX: 0, edges: [] as number[] };
        const measure = () => {
          const roadLeft = road.getBoundingClientRect().left;
          const overhang = parseFloat(getComputedStyle(track).getPropertyValue("--car-overhang")) || 0;
          m.roadW = road.clientWidth || 1;
          m.carW = car.offsetWidth;
          m.startX = -m.carW * overhang;
          m.endX = m.roadW - m.carW + m.carW * overhang;
          // Right edge of each letter, relative to the road.
          m.edges = letters.map((el) => el.getBoundingClientRect().right - roadLeft);
        };

        /* ---------- Intro timeline (plays once on load) ---------- */
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(eyebrow, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8 }, 0)
          .fromTo(
            letters,
            { opacity: 0, y: 40, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.05, clearProps: "filter" },
            0.1,
          )
          .fromTo(carBody, { opacity: 1, xPercent: -160 }, { xPercent: 0, duration: 1.3, ease: "expo.out" }, 0.25)
          .fromTo(
            cards,
            { opacity: 0, y: 40, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12 },
            0.55,
          )
          .fromTo(hintInner, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.3);

        // Count each stat up from 0 in step with its card.
        cards.forEach((card, i) => {
          const el = card.querySelector<HTMLElement>("[data-count]");
          if (!el) return;
          const counter = { value: 0 };
          intro.to(
            counter,
            {
              value: Number(el.dataset.count),
              duration: 1.1,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(counter.value));
              },
            },
            0.55 + i * 0.12,
          );
        });

        /* ---------- Per-frame rendering ----------
         * The scroll timeline only animates `drive.p` from 0 to 1. Everything
         * that depends on layout is derived from it here with quickSetters,
         * so car, trail and letters always share one measurement snapshot. */
        const drive = { p: 0 };
        const setCarX = gsap.quickSetter(car, "x", "px");
        const setTrail = gsap.quickSetter(trail, "scaleX");
        const tiltTo = gsap.quickTo(carBody, "rotation", { duration: 0.5, ease: "power3.out" });
        let lastP = 0;

        // A letter turns solid once the car's centre (where the trail ends) has
        // fully passed it. A short tween runs only when a letter's state flips,
        // so scrolling back reverses it cleanly.
        gsap.set(solids, { opacity: 0, scale: 0.85 });
        const revealed = letters.map(() => false);
        const syncLetters = (carCenter: number) => {
          m.edges.forEach((edge, i) => {
            const on = carCenter >= edge;
            if (on === revealed[i]) return;
            revealed[i] = on;
            gsap.to(solids[i], {
              opacity: on ? 1 : 0,
              scale: on ? 1 : 0.85,
              duration: 0.35,
              ease: on ? "back.out(2)" : "power2.out",
              overwrite: true,
            });
            gsap.to(ghosts[i], { opacity: on ? 0 : 1, duration: 0.25, overwrite: true });
          });
        };

        const render = () => {
          const x = m.startX + (m.endX - m.startX) * drive.p;
          const carCenter = x + m.carW / 2;
          setCarX(x);
          // Trail always ends at the car's centre. scaleX, not width, so no layout.
          setTrail(carCenter / m.roadW);
          syncLetters(carCenter);
          // Subtle steering tilt driven by how fast the car is moving.
          tiltTo(gsap.utils.clamp(-2.5, 2.5, (drive.p - lastP) * 250));
          lastP = drive.p;
        };

        const onRefresh = () => {
          measure();
          render();
        };
        onRefresh();
        ScrollTrigger.addEventListener("refresh", onRefresh);

        /* ---------- Scroll timeline ----------
         * Pinned for PIN_DISTANCE viewports. The numeric scrub smooths the
         * playhead towards the scroll position, which gives the easing. */
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: () => `+=${window.innerHeight * PIN_DISTANCE}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          // Car drives from the left edge to the right edge of the road.
          .to(drive, { p: 1, duration: 1, onUpdate: render }, 0)
          // The scroll hint fades out as soon as the drive starts.
          .to(hint, { opacity: 0, duration: 0.06 }, 0)
          // Tiny suspension bounce while driving.
          .fromTo(carBody, { y: 0 }, { y: -1.5, duration: 0.05, repeat: 19, yoyo: true, ease: "sine.inOut" }, 0)
          // Each stat card drifts at its own speed (halved on small screens).
          .to(
            parallax,
            {
              y: (_i: number, el: HTMLElement) =>
                Number(el.dataset.parallax) * (window.innerWidth < 1024 ? 0.5 : 1),
              duration: 1,
            },
            0,
          );

        // Re-measure once web fonts and the car image are ready.
        const img = carBody.querySelector("img");
        Promise.all([document.fonts.ready, img?.decode().catch(() => undefined)]).then(() =>
          ScrollTrigger.refresh(),
        );

        return () => ScrollTrigger.removeEventListener("refresh", onRefresh);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero relative">
      <div data-track className="relative flex h-svh flex-col overflow-hidden bg-track text-ink">
        <header
          data-intro
          data-eyebrow
          className="flex items-center justify-between gap-4 px-4 pt-4 text-xs sm:px-8 sm:pt-6 sm:text-sm"
        >
          <span className="font-bold tracking-[0.3em]">ITZFIZZ</span>
          <span className="hidden text-[#3a3a3a] sm:block">
            Digital marketing &amp; growth agency · 250+ projects
          </span>
        </header>

        {/* Stats above the road */}
        <div className="flex flex-1 items-end px-4 pt-4 pb-4 sm:px-8 lg:pb-[5vh]">
          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:mr-[6%] lg:ml-auto lg:flex lg:w-auto lg:gap-[5vw]">
            <StatCard stat={STATS[0]} order={0} />
            <StatCard stat={STATS[2]} order={2} />
          </div>
        </div>

        {/* Road: trail, headline and car */}
        <div data-road className="relative z-10 bg-road lg:h-(--road-h)">
          <div data-trail className="absolute inset-0 origin-left scale-x-0 bg-trail" />

          <h1
            aria-label="Welcome Itzfizz"
            className="relative z-10 flex flex-col gap-[calc(var(--car-h)_+_12px)] px-(--headline-inset) py-3 text-(length:--headline-size) leading-none font-bold lg:absolute lg:inset-0 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-0"
          >
            {WORDS.map((word, w) => (
              <Fragment key={word}>
                {w > 0 && <span aria-hidden="true" className="hidden lg:block lg:w-[0.35em]" />}
                <span className="flex justify-between lg:contents">
                  {[...word].map((char, i) => (
                    <span key={i} data-intro data-letter aria-hidden="true" className="relative inline-block">
                      <span data-ghost className="letter-ghost block">
                        {char}
                      </span>
                      <span data-solid className="absolute inset-0 block text-ink opacity-0">
                        {char}
                      </span>
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </h1>

          <div
            data-car
            className="pointer-events-none absolute top-[calc(50%_-_var(--car-h)/2)] left-0 z-20 h-(--car-h) w-(--car-w) will-change-transform"
          >
            <div data-car-body data-intro className="size-full">
              <Image
                src={assetPath("/car.png")}
                alt="Top view of an orange McLaren sports car driving along the road"
                width={1023}
                height={465}
                preload
                draggable={false}
                className="size-full object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* Stats below the road */}
        <div className="flex flex-1 items-start px-4 pt-4 pb-14 sm:px-8 lg:pt-[5vh] lg:pb-12">
          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:mr-[11%] lg:ml-auto lg:flex lg:w-auto lg:gap-[7vw]">
            <StatCard stat={STATS[1]} order={1} />
            <StatCard stat={STATS[3]} order={3} />
          </div>
        </div>

        <div data-hint className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <div data-intro data-hint-inner className="flex flex-col items-center gap-1 text-xs tracking-[0.25em] text-[#333] uppercase">
            Scroll
            <span aria-hidden="true" className="motion-safe:animate-bounce">
              ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
