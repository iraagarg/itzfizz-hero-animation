export type Stat = {
  value: number;
  label: string;
  /** Card background and text colours (from the reference design). */
  bg: string;
  fg: string;
  /** Scroll parallax offset in px; negative drifts up, positive drifts down. */
  parallax: number;
};

// Ordered as they animate in: 1 & 3 sit above the road, 2 & 4 below it.
export const STATS: Stat[] = [
  { value: 58, label: "Increase in pick up point use", bg: "#def54f", fg: "#111111", parallax: -20 },
  { value: 23, label: "Decrease in customer phone calls", bg: "#6ac9ff", fg: "#111111", parallax: 16 },
  { value: 27, label: "Increase in pick up point use", bg: "#333333", fg: "#ffffff", parallax: -12 },
  { value: 40, label: "Decrease in customer phone calls", bg: "#fa7328", fg: "#111111", parallax: 26 },
];
