"use client";

import { useEffect, useRef } from "react";
import { useChapter } from "@/components/motion/ScrollChapter";
import { easeInOut } from "@/lib/utils";
import styles from "./LuxuryProduct.module.css";

/**
 * Vue éclatée en SVG : les composants se séparent selon un axe vertical plausible (0 → 0.5)
 * puis se réassemblent (0.5 → 1). Aucun média requis, entièrement piloté par la progression.
 */
export function ExplodedWatch() {
  const ref = useRef<SVGSVGElement>(null);
  const { subscribe, isStatic } = useChapter();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const layers = Array.from(svg.querySelectorAll<SVGGElement>("[data-layer]"));
    if (isStatic) {
      layers.forEach((g) => {
        const off = Number(g.dataset.offset ?? 0) * 0.5;
        g.style.transform = `translate3d(0, ${(-off).toFixed(1)}px, 0)`;
      });
      return;
    }
    return subscribe((p) => {
      const t = p < 0.5 ? p / 0.5 : 1 - (p - 0.5) / 0.5;
      const e = easeInOut(Math.min(1, Math.max(0, t)));
      layers.forEach((g) => {
        const off = Number(g.dataset.offset ?? 0);
        g.style.transform = `translate3d(0, ${(-off * e).toFixed(1)}px, 0)`;
      });
    });
  }, [subscribe, isStatic]);

  return (
    <svg ref={ref} className={styles.exploded} viewBox="0 0 600 900" role="img" aria-label="Vue éclatée conceptuelle de la montre Eclipse : verre saphir, lunette, cadran, tourbillon, mouvement et fond de boîte.">
      <defs>
        <radialGradient id="ew-gold" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#e7cf9a" />
          <stop offset="60%" stopColor="#c8a96b" />
          <stop offset="100%" stopColor="#7a6238" />
        </radialGradient>
        <radialGradient id="ew-dial" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#1a1a1f" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
        <linearGradient id="ew-ti" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3d44" />
          <stop offset="50%" stopColor="#15161a" />
          <stop offset="100%" stopColor="#2a2d33" />
        </linearGradient>
        <linearGradient id="ew-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.16)" />
        </linearGradient>
      </defs>
      {/* Fond de boîte */}
      <g data-layer data-offset="-160" style={{ transformOrigin: "300px 450px" }}>
        <ellipse cx="300" cy="470" rx="190" ry="60" fill="url(#ew-ti)" stroke="#4a4d55" strokeWidth="1.5" />
        <ellipse cx="300" cy="470" rx="150" ry="46" fill="none" stroke="#6b6e78" strokeWidth="1" opacity="0.6" />
      </g>
      {/* Mouvement */}
      <g data-layer data-offset="-80" style={{ transformOrigin: "300px 450px" }}>
        <ellipse cx="300" cy="455" rx="160" ry="50" fill="#0c0c10" stroke="#3b3e46" strokeWidth="1.2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = 300 + Math.cos(a) * 120;
          const y = 455 + Math.sin(a) * 36;
          return <circle key={i} cx={x} cy={y} r="5" fill="url(#ew-gold)" opacity="0.85" />;
        })}
        <circle cx="300" cy="455" r="14" fill="url(#ew-gold)" />
      </g>
      {/* Tourbillon */}
      <g data-layer data-offset="0" style={{ transformOrigin: "300px 450px" }}>
        <ellipse cx="300" cy="445" rx="52" ry="17" fill="none" stroke="url(#ew-gold)" strokeWidth="3" />
        <ellipse cx="300" cy="445" rx="34" ry="11" fill="none" stroke="#e7cf9a" strokeWidth="1.2" />
        <line x1="248" y1="445" x2="352" y2="445" stroke="#e7cf9a" strokeWidth="1" />
        <circle cx="300" cy="445" r="5" fill="#e7cf9a" />
      </g>
      {/* Cadran */}
      <g data-layer data-offset="80" style={{ transformOrigin: "300px 450px" }}>
        <ellipse cx="300" cy="440" rx="170" ry="54" fill="url(#ew-dial)" stroke="#2a2a30" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x1 = 300 + Math.cos(a) * 150;
          const y1 = 440 + Math.sin(a) * 47;
          const x2 = 300 + Math.cos(a) * 162;
          const y2 = 440 + Math.sin(a) * 51;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8a96b" strokeWidth={i % 3 === 0 ? 3 : 1.5} />;
        })}
        <line x1="300" y1="440" x2="300" y2="400" stroke="#f4f0e8" strokeWidth="3" strokeLinecap="round" />
        <line x1="300" y1="440" x2="380" y2="452" stroke="#f4f0e8" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Lunette */}
      <g data-layer data-offset="160" style={{ transformOrigin: "300px 450px" }}>
        <ellipse cx="300" cy="430" rx="200" ry="64" fill="none" stroke="url(#ew-ti)" strokeWidth="16" />
        <ellipse cx="300" cy="430" rx="200" ry="64" fill="none" stroke="#c8a96b" strokeWidth="1" opacity="0.7" />
      </g>
      {/* Verre saphir */}
      <g data-layer data-offset="240" style={{ transformOrigin: "300px 450px" }}>
        <ellipse cx="300" cy="420" rx="186" ry="58" fill="url(#ew-glass)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </g>
    </svg>
  );
}
