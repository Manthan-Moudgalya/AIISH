import { motion } from "framer-motion";

/**
 * PatientOverviewPage
 * Pure React + inline CSS – no Tailwind, shadcn, or UI libs.
 * Only external dependency: framer‑motion.
 */

const cases = [
  {
    id: 1,
    title: "Speech-Language Pathology",
    description:
      "Current therapy focuses on articulation and expressive-language expansion. The patient is showing steady improvement—80% accuracy on targeted phonemes and increasing phrase length to 5-word utterances.",
    progress: 0.8,
    href: "https://progresstrackingforslp.vercel.app/",
  },
  {
    id: 2,
    title: "Audiology",
    description:
      "Completed baseline audiogram and fitted with behind-the-ear hearing aids. Follow-up indicates 70% adherence with device use and improved speech discrimination in quiet environments.",
    progress: 0.7,
    href: "https://ptsforaudiologist.vercel.app/dashboard",
  },
];

export default function PatientOverviewPage() {
  return (
    <section style={styles.pageWrapper}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Patient Care Overview</h1>
        <p style={styles.subhead}>
          Quick glance at the patient's current status in Speech-Language Pathology and Audiology services.
        </p>
      </header>

      <div style={styles.grid}>
        {cases.map((c, idx) => (
          <motion.a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noreferrer noopener"
            style={styles.cardLink}
            initial={{ opacity: 0, translateY: 40 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.15, type: "spring", stiffness: 120 }}
          >
            <article style={styles.card}>
              <h1 style={styles.cardTitle}>{c.title}</h1>
              <p style={styles.cardDesc}>{c.description}</p>

              <div style={styles.progressTrack}>
                <div
                  style={{ ...styles.progressBar, width: `${c.progress * 100}%` }}
                />
              </div>
              <p style={styles.progressLabel}>{Math.round(c.progress * 100)}% complete</p>
            </article>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// Inline style objects
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    gap: "3rem",
    background: "linear-gradient(135deg, #fafafa 0%, #e9ecef 100%)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: { maxWidth: 640, textAlign: "center" },
  heading: { margin: 0, fontSize: "2.5rem", fontWeight: 700, color: "#222" },
  subhead: { marginTop: 8, fontSize: "1rem", lineHeight: 1.5, color: "#555" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: 960,
  },
  cardLink: {
    textDecoration: "none",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "block",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  cardTitle: { margin: 0, fontSize: "1.5rem", fontWeight: 600, color: "#111" },
  cardDesc: { margin: "12px 0 16px", fontSize: "0.95rem", lineHeight: 1.6, color: "#333" },
  progressTrack: {
    width: "100%",
    height: 8,
    background: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "#38a169",
  },
  progressLabel: { marginTop: 8, fontSize: "0.85rem", color: "#555" },
};
