import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// MatchMedia condition fragment — every animated context must include this so
// prefers-reduced-motion shows all content statically.
export const ANIM_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, useGSAP };
