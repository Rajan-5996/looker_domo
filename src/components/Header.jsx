import { motion } from "framer-motion";
import { ArrowRightIcon, LayersIcon } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 0 rgba(99,102,241,0.07), 0 2px 16px rgba(99,102,241,0.06)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent 0%, #6366f1 30%, #818cf8 55%, #a5b4fc 75%, transparent 100%)",
        opacity: 0.7,
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0.7rem clamp(0.9rem, 3vw, 1.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          {/* Icon badge */}
          <motion.div
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
              color: "white",
              flexShrink: 0,
            }}>
            <LayersIcon />
          </motion.div>

          <div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(0.92rem, 2.2vw, 1.1rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              Looker
              <span style={{ color: "var(--violet)", display: "flex", alignItems: "center" }}>
                <ArrowRightIcon />
              </span>
              Domo
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.62rem",
              fontWeight: 400,
              color: "var(--text-muted)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              marginTop: 1,
            }}>
              Dashboard Migration Tool
            </div>
          </div>
        </div>

        {/* Right: step pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {[
            { num: "1", label: "Connect" },
            { num: "2", label: "Select" },
            { num: "3", label: "Migrate" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <div style={{
                width: 22, height: 22,
                borderRadius: "50%",
                background: "var(--violet-dim)",
                border: "1.5px solid var(--border-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "0.62rem",
                color: "var(--violet)",
              }}>{s.num}</div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500, display: window.innerWidth < 480 ? "none" : "block" }}>
                {s.label}
              </span>
              {i < 2 && <div style={{ width: 14, height: 1, background: "var(--border)", marginLeft: 2 }} />}
            </div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}