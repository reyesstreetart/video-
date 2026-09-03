import { saasContent as c } from "@/content/saas";
import styles from "./Saas.module.css";

interface DashboardMockProps {
  /** Mode "assemblage" : chaque panneau porte un index pour l'animation pilotée par le scroll. */
  assembling?: boolean;
  light?: boolean;
}

/**
 * Vrai screenshot en HTML/CSS dans un browser mockup. Aucun texte généré par IA :
 * tout est lisible, sélectionnable et indexable.
 */
export function DashboardMock({ assembling = false, light = false }: DashboardMockProps) {
  const s = c.dashboard.series;
  const max = Math.max(...s);
  const points = s.map((v, i) => `${(i / (s.length - 1)) * 100},${100 - (v / max) * 90}`).join(" ");
  return (
    <div className={[styles.browser, light ? styles.browserLight : ""].join(" ")} data-assembling={assembling ? "true" : "false"}>
      <div className={styles.browserBar} aria-hidden="true">
        <span />
        <span />
        <span />
        <span className={styles.url}>app.pulse.example/churn</span>
      </div>
      <div className={styles.dash}>
        <div className={styles.dashPanel} data-panel="0" style={{ gridArea: "kpi1" }}>
          <span className={styles.kpiLabel}>Comptes à risque</span>
          <span className={styles.kpiValue}>27</span>
          <span className={styles.kpiDelta}>+4 cette semaine</span>
        </div>
        <div className={styles.dashPanel} data-panel="1" style={{ gridArea: "kpi2" }}>
          <span className={styles.kpiLabel}>MRR exposé</span>
          <span className={styles.kpiValue}>38 400 €</span>
          <span className={styles.kpiDelta}>12 % du MRR</span>
        </div>
        <div className={styles.dashPanel} data-panel="2" style={{ gridArea: "kpi3" }}>
          <span className={styles.kpiLabel}>Sauvés ce mois</span>
          <span className={styles.kpiValue}>9</span>
          <span className={styles.kpiDelta}>21 300 € retenus</span>
        </div>
        <div className={[styles.dashPanel, styles.chartPanel].join(" ")} data-panel="3" style={{ gridArea: "chart" }}>
          <span className={styles.kpiLabel}>Signal de churn · 12 semaines</span>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.chart} role="img" aria-label="Courbe du signal de churn sur douze semaines, en hausse.">
            <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            <polygon points={`0,100 ${points} 100,100`} fill="currentColor" opacity="0.12" />
            <circle cx="100" cy={100 - (s[s.length - 1]! / max) * 90} r="2" fill="currentColor" className={styles.pulse} />
          </svg>
        </div>
        <div className={styles.dashPanel} data-panel="4" style={{ gridArea: "table" }}>
          <span className={styles.kpiLabel}>Comptes prioritaires</span>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Compte</th>
                <th scope="col">Risque</th>
                <th scope="col">MRR</th>
              </tr>
            </thead>
            <tbody>
              {c.dashboard.accounts.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>
                    <span className={styles.risk} data-level={a.risk >= 70 ? "high" : a.risk >= 35 ? "mid" : "low"}>
                      {a.risk}
                    </span>
                  </td>
                  <td>{a.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
