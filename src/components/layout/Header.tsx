"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { Wordmark } from "./Wordmark";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className={[styles.header, scrolled ? styles.scrolled : ""].join(" ")} data-open={open ? "true" : "false"}>
      <div className={styles.inner}>
        <Wordmark />
        <nav className={styles.nav} aria-label="Navigation principale">
          <ul className={styles.list}>
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <Link href={siteConfig.cta.href} className={["btn", "btn--primary", styles.cta].join(" ")}>
            {siteConfig.cta.label}
          </Link>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="visually-hidden">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span className={styles.burgerLine} aria-hidden="true" />
            <span className={styles.burgerLine} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={styles.mobile} hidden={!open}>
        <nav aria-label="Navigation mobile">
          <ul className={styles.mobileList}>
            {siteConfig.nav.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }}>
                <Link href={item.href} className={styles.mobileLink} aria-current={isActive(item.href) ? "page" : undefined}>
                  <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={siteConfig.cta.href} className="btn btn--primary">
          {siteConfig.cta.label}
        </Link>
      </div>
    </header>
  );
}
