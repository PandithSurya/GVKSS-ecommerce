import React, { useEffect, useRef } from 'react';

export const FloatingBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for corner leafy structures & floating elements
  const topLeftLeafRef = useRef<HTMLDivElement>(null);
  const topRightLeafRef = useRef<HTMLDivElement>(null);
  const bottomLeftLeafRef = useRef<HTMLDivElement>(null);
  const bottomRightLeafRef = useRef<HTMLDivElement>(null);
  const midLeftLeafRef = useRef<HTMLDivElement>(null);
  const midRightLeafRef = useRef<HTMLDivElement>(null);

  // Ambient gradient glow references
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);

  // Floating single leaf references
  const floatLeaf1Ref = useRef<HTMLDivElement>(null);
  const floatLeaf2Ref = useRef<HTMLDivElement>(null);
  const floatLeaf3Ref = useRef<HTMLDivElement>(null);

  // Physics state for smooth scroll & mouse interpolation
  const physicsRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    scrollY: 0,
    targetScrollY: 0,
    scrollVelocity: 0,
  });

  useEffect(() => {
    // 1. Mouse move listener
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      physicsRef.current.targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      physicsRef.current.targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    // 2. Scroll listener
    const handleScroll = () => {
      physicsRef.current.targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let animationFrameId: number;
    let time = 0;
    let lastScroll = window.scrollY;

    const animate = () => {
      time += 0.02;

      const p = physicsRef.current;

      // Smooth mouse interpolation (lerp)
      p.mouseX += (p.targetMouseX - p.mouseX) * 0.07;
      p.mouseY += (p.targetMouseY - p.mouseY) * 0.07;

      // Smooth scroll interpolation (lerp) with momentum damping
      const prevScroll = p.scrollY;
      p.scrollY += (p.targetScrollY - p.scrollY) * 0.08;
      p.scrollVelocity = p.scrollY - prevScroll;

      const scroll = p.scrollY;
      const sVel = Math.min(Math.max(p.scrollVelocity * 0.4, -25), 25);
      const mx = p.mouseX;
      const my = p.mouseY;

      // ====================================================
      // 1. TOP-LEFT CORNER LEAFY STRUCTURE
      // Dynamically rotates, sways, and expands on scroll
      // ====================================================
      if (topLeftLeafRef.current) {
        const floatX = Math.sin(time * 0.7) * 12 + mx * 22;
        const floatY = Math.cos(time * 0.6) * 10 + my * 18 - scroll * 0.07;
        const rot = Math.sin(time * 0.5) * 4 + sVel * 0.6 + mx * 5;
        const scale = 1 + Math.sin(time * 0.4) * 0.02;
        topLeftLeafRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg) scale(${scale})`;
      }

      // ====================================================
      // 2. TOP-RIGHT CORNER LEAFY STRUCTURE
      // Cascading botanical branch swaying smoothly with scroll
      // ====================================================
      if (topRightLeafRef.current) {
        const floatX = Math.cos(time * 0.65) * 14 - mx * 25;
        const floatY = Math.sin(time * 0.75) * 12 - my * 20 - scroll * 0.09;
        const rot = Math.cos(time * 0.55) * 5 - sVel * 0.7 - mx * 6;
        const scale = 1 + Math.cos(time * 0.45) * 0.02;
        topRightLeafRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg) scale(${scale})`;
      }

      // ====================================================
      // 3. BOTTOM-LEFT CORNER LEAFY STRUCTURE
      // Sprouting organic wheat / leaf sprigs curling with scroll
      // ====================================================
      if (bottomLeftLeafRef.current) {
        const floatX = Math.sin(time * 0.6 + 1.5) * 15 + mx * 20;
        const floatY = Math.cos(time * 0.7 + 1.5) * 14 + my * 16 + scroll * 0.06;
        const rot = Math.sin(time * 0.45) * 4 - sVel * 0.5;
        bottomLeftLeafRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg)`;
      }

      // ====================================================
      // 4. BOTTOM-RIGHT CORNER LEAFY STRUCTURE
      // Lush tropical botanical leaves responding to scroll depth
      // ====================================================
      if (bottomRightLeafRef.current) {
        const floatX = Math.cos(time * 0.7 + 2) * 16 - mx * 22;
        const floatY = Math.sin(time * 0.65 + 2) * 12 - my * 18 + scroll * 0.08;
        const rot = Math.cos(time * 0.5) * 5 + sVel * 0.6;
        bottomRightLeafRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg)`;
      }

      // ====================================================
      // 5. MID-PAGE FLOATING LEAF ACCENTS
      // ====================================================
      if (midLeftLeafRef.current) {
        const floatX = Math.sin(time * 0.5 + 3) * 18 + mx * 28;
        const floatY = Math.cos(time * 0.55 + 3) * 15 - scroll * 0.05;
        const rot = -10 + Math.sin(time * 0.6) * 8 + sVel * 0.4;
        midLeftLeafRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg)`;
      }

      if (midRightLeafRef.current) {
        const floatX = Math.cos(time * 0.55 + 4) * 20 - mx * 30;
        const floatY = Math.sin(time * 0.5 + 4) * 16 - scroll * 0.06;
        const rot = 15 + Math.cos(time * 0.65) * 8 - sVel * 0.4;
        midRightLeafRef.current.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg)`;
      }

      // ====================================================
      // 6. SCATTERED DRIFTING LEAF PARTICLES
      // ====================================================
      if (floatLeaf1Ref.current) {
        const fx = Math.sin(time * 0.8) * 25 + mx * 35;
        const fy = Math.cos(time * 0.7) * 22 - scroll * 0.12;
        const rot = time * 20 + sVel * 1.5;
        floatLeaf1Ref.current.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${rot}deg)`;
      }

      if (floatLeaf2Ref.current) {
        const fx = Math.cos(time * 0.75 + 1) * 28 - mx * 35;
        const fy = Math.sin(time * 0.85 + 1) * 24 - scroll * 0.1;
        const rot = -time * 18 - sVel * 1.2;
        floatLeaf2Ref.current.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${rot}deg)`;
      }

      if (floatLeaf3Ref.current) {
        const fx = Math.sin(time * 0.65 + 2) * 22 + mx * 28;
        const fy = Math.cos(time * 0.75 + 2) * 20 - scroll * 0.08;
        const rot = time * 15;
        floatLeaf3Ref.current.style.transform = `translate3d(${fx}px, ${fy}px, 0) rotate(${rot}deg)`;
      }

      // ====================================================
      // 7. AMBIENT GLOWING ORBS
      // ====================================================
      if (orb1Ref.current) {
        const ox = Math.sin(time * 0.4) * 30 + mx * 35;
        const oy = Math.cos(time * 0.45) * 25 + my * 25 - scroll * 0.04;
        orb1Ref.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }

      if (orb2Ref.current) {
        const ox = Math.cos(time * 0.45) * 35 - mx * 40;
        const oy = Math.sin(time * 0.4) * 30 - my * 30 - scroll * 0.05;
        orb2Ref.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }

      if (orb3Ref.current) {
        const ox = Math.sin(time * 0.35 + 2) * 30 + mx * 30;
        const oy = Math.cos(time * 0.4 + 2) * 25 - scroll * 0.03;
        orb3Ref.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }

      if (orb4Ref.current) {
        const ox = Math.cos(time * 0.38 + 1) * 32 - mx * 35;
        const oy = Math.sin(time * 0.42 + 1) * 28 - scroll * 0.04;
        orb4Ref.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-white select-none will-change-transform"
    >
      {/* ====================================================
          1. SOFT AMBIENT GRADIENT BACKGROUND SHADES
          ==================================================== */}
      <div
        ref={orb1Ref}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 via-green-100/25 to-transparent rounded-full blur-3xl opacity-80"
      />
      <div
        ref={orb2Ref}
        className="absolute top-10 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-emerald-200/35 via-teal-100/20 to-transparent rounded-full blur-3xl opacity-75"
      />
      <div
        ref={orb3Ref}
        className="absolute top-[45%] -left-28 w-[580px] h-[580px] bg-gradient-to-tr from-green-200/35 via-emerald-100/20 to-transparent rounded-full blur-3xl opacity-70"
      />
      <div
        ref={orb4Ref}
        className="absolute bottom-10 right-[5%] w-[620px] h-[620px] bg-gradient-to-tl from-emerald-200/40 via-green-100/25 to-transparent rounded-full blur-3xl opacity-75"
      />

      {/* ====================================================
          2. TOP-LEFT CORNER BOTANICAL LEAF CLUSTER
          Lush monstera & organic leaflets with natural veins
          ==================================================== */}
      <div
        ref={topLeftLeafRef}
        className="absolute -top-12 -left-12 w-64 sm:w-80 h-64 sm:h-80 opacity-40 sm:opacity-50 text-emerald-600 drop-shadow-md origin-top-left"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          {/* Main Large Corner Leaf */}
          <path
            d="M20 20 C60 10, 140 40, 170 110 C180 135, 160 170, 130 180 C90 190, 40 140, 20 80 Z"
            fill="url(#emeraldGrad1)"
            opacity="0.85"
          />
          {/* Leaf Central Vein */}
          <path
            d="M20 20 Q95 95 170 110"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Side Veins */}
          <path d="M50 45 Q70 30 100 35" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M75 70 Q105 55 135 65" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M100 90 Q125 80 155 90" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M60 65 Q45 95 40 125" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M85 85 Q70 120 75 150" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

          {/* Secondary Overlapping Leaflet */}
          <path
            d="M10 30 C30 80, 80 140, 110 160 C90 165, 40 130, 10 70 Z"
            fill="url(#emeraldGrad2)"
            opacity="0.65"
          />
          
          {/* Small Sprout */}
          <path
            d="M30 10 C70 20, 90 60, 95 85 C80 80, 50 50, 25 25 Z"
            fill="url(#emeraldGrad3)"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* ====================================================
          3. TOP-RIGHT CORNER BOTANICAL BRANCH
          Cascading organic eucalyptus / moringa leaf stem
          ==================================================== */}
      <div
        ref={topRightLeafRef}
        className="absolute -top-10 -right-10 w-72 sm:w-96 h-72 sm:h-96 opacity-35 sm:opacity-45 text-emerald-600 drop-shadow-md origin-top-right"
      >
        <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
          {/* Main Stem Curve */}
          <path
            d="M210 10 Q140 70 50 170"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Leaflet Pair 1 */}
          <path
            d="M180 35 C195 15, 170 5, 155 25 C145 38, 165 48, 180 35 Z"
            fill="url(#emeraldGrad1)"
            opacity="0.8"
          />
          <path
            d="M175 42 C160 55, 140 75, 155 85 C170 90, 185 65, 175 42 Z"
            fill="url(#emeraldGrad2)"
            opacity="0.75"
          />

          {/* Leaflet Pair 2 */}
          <path
            d="M135 80 C155 60, 130 50, 110 70 C95 85, 118 95, 135 80 Z"
            fill="url(#emeraldGrad1)"
            opacity="0.85"
          />
          <path
            d="M130 88 C115 105, 95 125, 110 135 C125 140, 140 115, 130 88 Z"
            fill="url(#emeraldGrad3)"
            opacity="0.7"
          />

          {/* Leaflet Pair 3 */}
          <path
            d="M90 125 C110 105, 85 95, 65 115 C50 130, 75 142, 90 125 Z"
            fill="url(#emeraldGrad2)"
            opacity="0.8"
          />
          <path
            d="M85 135 C70 155, 50 175, 65 185 C80 190, 95 165, 85 135 Z"
            fill="url(#emeraldGrad1)"
            opacity="0.7"
          />

          {/* Terminal Tip Leaf */}
          <path
            d="M50 170 C35 190, 20 205, 30 215 C45 220, 65 195, 50 170 Z"
            fill="url(#emeraldGrad2)"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* ====================================================
          4. BOTTOM-LEFT CORNER ORGANIC SPROUTING LEAF CLUSTER
          ==================================================== */}
      <div
        ref={bottomLeftLeafRef}
        className="absolute -bottom-14 -left-14 w-72 sm:w-88 h-72 sm:h-88 opacity-35 sm:opacity-45 text-emerald-600 drop-shadow-md origin-bottom-left"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          {/* Main Stem reaching upward */}
          <path
            d="M10 190 Q60 120 120 40"
            stroke="#15803d"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Left Large Leaf */}
          <path
            d="M20 170 C10 120, 40 80, 85 65 C105 75, 85 125, 45 160 Z"
            fill="url(#emeraldGrad1)"
            opacity="0.75"
          />

          {/* Right Upward Leaf */}
          <path
            d="M50 140 C70 90, 110 50, 145 45 C155 65, 125 105, 75 135 Z"
            fill="url(#emeraldGrad2)"
            opacity="0.8"
          />

          {/* Small Top Leaflet */}
          <path
            d="M100 70 C120 30, 150 15, 170 20 C175 40, 150 65, 120 75 Z"
            fill="url(#emeraldGrad3)"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* ====================================================
          5. BOTTOM-RIGHT CORNER BOTANICAL FOLIAGE CLUSTER
          ==================================================== */}
      <div
        ref={bottomRightLeafRef}
        className="absolute -bottom-14 -right-14 w-72 sm:w-96 h-72 sm:h-96 opacity-35 sm:opacity-45 text-emerald-600 drop-shadow-md origin-bottom-right"
      >
        <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
          {/* Broad Tropical Palm/Monstera Leaf */}
          <path
            d="M200 200 C150 170, 70 140, 40 70 C30 45, 50 15, 80 10 C120 15, 160 65, 185 125 Z"
            fill="url(#emeraldGrad1)"
            opacity="0.8"
          />
          {/* Main Vein */}
          <path
            d="M200 200 Q115 115 40 70"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Secondary Overlapping Leaf */}
          <path
            d="M190 180 C130 130, 95 80, 90 20 C110 15, 150 55, 180 110 Z"
            fill="url(#emeraldGrad2)"
            opacity="0.7"
          />

          {/* Upward Sprout */}
          <path
            d="M170 190 C120 170, 110 120, 120 70 C140 75, 160 115, 185 160 Z"
            fill="url(#emeraldGrad3)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* ====================================================
          6. MID-PAGE FLOATING BOTANICAL STEM ACCENTS
          ==================================================== */}
      {/* Mid-Left Floating Sprig */}
      <div
        ref={midLeftLeafRef}
        className="absolute top-[38%] -left-8 w-36 h-36 opacity-30 text-emerald-600 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path d="M10 90 Q40 50 85 20" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M40 60 C30 40, 50 25, 65 35 C70 45, 55 60, 40 60 Z" fill="url(#emeraldGrad1)" opacity="0.75" />
          <path d="M60 40 C75 25, 95 30, 90 45 C80 55, 65 50, 60 40 Z" fill="url(#emeraldGrad2)" opacity="0.75" />
        </svg>
      </div>

      {/* Mid-Right Floating Sprig */}
      <div
        ref={midRightLeafRef}
        className="absolute top-[58%] -right-8 w-40 h-40 opacity-30 text-emerald-600 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path d="M90 90 Q60 50 15 20" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M60 60 C70 40, 50 25, 35 35 C30 45, 45 60, 60 60 Z" fill="url(#emeraldGrad1)" opacity="0.75" />
          <path d="M40 40 C25 25, 5 30, 10 45 C20 55, 35 50, 40 40 Z" fill="url(#emeraldGrad3)" opacity="0.75" />
        </svg>
      </div>

      {/* ====================================================
          7. SCATTERED DRIFTING LEAF PARTICLES (PARALLAX ON SCROLL)
          ==================================================== */}
      {/* Drifting Leaf 1 */}
      <div
        ref={floatLeaf1Ref}
        className="absolute top-[22%] right-[16%] w-12 h-12 opacity-30 text-emerald-600 hidden sm:block"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      {/* Drifting Leaf 2 */}
      <div
        ref={floatLeaf2Ref}
        className="absolute top-[52%] left-[14%] w-14 h-14 opacity-25 text-emerald-600 hidden md:block"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      {/* Drifting Leaf 3 */}
      <div
        ref={floatLeaf3Ref}
        className="absolute top-[78%] right-[22%] w-11 h-11 opacity-25 text-emerald-600 hidden sm:block"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      {/* ====================================================
          SVG GRADIENTS DEFINITIONS
          ==================================================== */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <linearGradient id="emeraldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="emeraldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#16a34a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="emeraldGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.65" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
