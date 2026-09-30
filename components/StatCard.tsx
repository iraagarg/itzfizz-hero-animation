import type { CSSProperties } from "react";
import type { Stat } from "@/lib/stats";

type StatCardProps = {
  stat: Stat;
  /** Position in the intro stagger (0 animates first). */
  order: number;
};

// Outer div carries the GSAP scroll parallax, inner div the CSS intro,
// so the two never fight over the same transform.
export default function StatCard({ stat, order }: StatCardProps) {
  return (
    <div data-parallax={stat.parallax}>
      <div
        className="intro-card rounded-[10px] p-4 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] sm:p-6 lg:w-[clamp(220px,17vw,300px)] lg:p-[clamp(18px,3.4vh,30px)]"
        style={{ backgroundColor: stat.bg, color: stat.fg, "--i": order } as CSSProperties}
      >
        <p className="text-[clamp(1.75rem,6vw,3.625rem)] lg:text-[clamp(2.5rem,6.4vh,3.625rem)] leading-none font-semibold tabular-nums">
          {/* The number counts up in CSS; screen readers get the plain value. */}
          <span aria-hidden="true">
            <span className="intro-count" style={{ "--to": stat.value, "--i": order } as CSSProperties} />%
          </span>
          <span className="sr-only">{stat.value}%</span>
        </p>
        <p className="mt-2 text-sm leading-snug sm:text-base lg:text-lg">{stat.label}</p>
      </div>
    </div>
  );
}
