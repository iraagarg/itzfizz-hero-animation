"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins once; every component imports gsap from here.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Don't re-layout when the mobile address bar shows/hides.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
