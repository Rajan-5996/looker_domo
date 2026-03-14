import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DomoIcon, LookerIcon } from "./icons";

export const TransferLoader = ({ fetched, label }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(8);

  const messages = [
    "Connecting to Looker API…",
    "Scanning dashboard metadata…",
    "Mapping dimensions & measures…",
    "Streaming dashboards to view…",
    "Almost there…",
  ];
  const steps = ["Authenticating", "Fetching Metadata", "Streaming Data", "Ready"];

  useEffect(() => {
    const mt = setInterval(() => setMsgIdx(p => (p + 1) % messages.length), 2200);
    const st = setInterval(() => {
      setStepIdx(p => { if (p < steps.length - 1) { setProgress(pp => Math.min(pp + 22, 92)); return p + 1; } return p; });
    }, 3000);
    return () => { clearInterval(mt); clearInterval(st); };
  }, []);

  const barHeights = [20, 34, 26, 40, 30, 36];

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{
        width: "100%", maxWidth: 620,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1.5px solid rgba(255,255,255,0.95)",
        borderRadius: 24,
        padding: "clamp(1.5rem, 4vw, 2.2rem)",
        boxShadow: "0 12px 40px rgba(99,102,241,0.1), 0 4px 12px rgba(15,23,42,0.06)",
        display: "flex", flexDirection: "column", gap: "1.6rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "var(--text-primary)", margin: "0 0 0.3rem", letterSpacing: "-0.01em" }}>
            Looker <span style={{ color: "var(--violet)" }}>→</span> Domo
          </h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            {label || "Fetching your dashboards…"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem, 2vw, 1.25rem)" }}>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            <LookerIcon size={70} />
          </motion.div>

          <div style={{
            flex: 1, height: 130, borderRadius: 16,
            background: "rgba(248,249,254,0.9)",
            border: "1px solid var(--border)",
            boxShadow: "inset 0 2px 8px rgba(99,102,241,0.05)",
            position: "relative", overflow: "hidden",
          }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} viewBox="0 0 300 130">
              {[...Array(8)].map((_, i) => <line key={i} x1="0" x2="300" y1={i * 17} y2={i * 17} stroke="#94a3b8" strokeWidth="0.5" />)}
              {[...Array(13)].map((_, i) => <line key={"v"+i} y1="0" y2="130" x1={i * 25} x2={i * 25} stroke="#94a3b8" strokeWidth="0.5" />)}
            </svg>

            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(129,140,248,0.07) 50%, rgba(16,185,129,0.04) 100%)" }}
            />

            <motion.svg viewBox="0 0 300 130" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", padding: 12 }}>
              <motion.path
                d="M0 95 L40 78 L80 82 L120 62 L160 66 L200 50 L240 53 L280 38"
                fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>

            <motion.svg viewBox="0 0 300 130" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", padding: 12, opacity: 0.25 }}>
              <motion.path
                d="M0 110 L40 95 L80 98 L120 82 L160 86 L200 72 L240 74 L280 60 L280 130 L0 130 Z"
                fill="#6366f1"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.svg>

            <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", alignItems: "flex-end", gap: 3 }}>
              {barHeights.map((h, i) => (
                <motion.div
                  key={i}
                  style={{ width: 6, borderRadius: 3, background: "linear-gradient(180deg, #818cf8, #6366f1)" }}
                  animate={{ scaleY: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
                  initial={{ height: h, transformOrigin: "bottom" }}
                />
              ))}
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", top: 12, right: 14 }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="10" stroke="#10b981" strokeWidth="5" fill="none" strokeDasharray="44 18" />
              </svg>
            </motion.div>

            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                style={{
                  position: "absolute", top: 16 + i * 32, left: -44,
                  width: 44, height: 28,
                  background: "white", borderRadius: 8,
                  border: "1px solid rgba(99,102,241,0.18)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                animate={{ x: [0, 320], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.8, delay: i * 1.1, repeat: Infinity, ease: "linear" }}
              >
                <svg width="26" height="14" viewBox="0 0 26 14">
                  <polyline points="0,12 5,8 10,9 15,5 20,6 26,2" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            ))}

            <motion.div
              style={{
                position: "absolute", bottom: 16, left: -48,
                background: "white", borderRadius: 8,
                border: "1px solid rgba(16,185,129,0.2)",
                boxShadow: "0 2px 8px rgba(16,185,129,0.1)",
                padding: "4px 6px",
                display: "flex", alignItems: "flex-end", gap: 2,
              }}
              animate={{ x: [0, 320], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4.5, delay: 1.4, repeat: Infinity, ease: "linear" }}
            >
              {[7, 11, 8, 13].map((h, i) => (
                <div key={i} style={{ width: 4, height: h, background: "#10b981", borderRadius: 2 }} />
              ))}
            </motion.div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            <DomoIcon size={45} />
          </motion.div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 6, borderRadius: 99, background: "rgba(99,102,241,0.1)", overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${fetched > 0 ? Math.max(progress, 30) : progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 99 }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <motion.p
              key={messages[msgIdx]}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{ margin: 0, fontSize: "0.74rem", color: "var(--text-secondary)", fontFamily: "'Outfit', sans-serif" }}
            >
              {messages[msgIdx]}
            </motion.p>
            {fetched > 0 && (
              <motion.span
                key={fetched} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--violet)", fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {fetched} found
              </motion.span>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "0.45rem 0.7rem", borderRadius: 10,
              background: i === stepIdx ? "rgba(99,102,241,0.07)" : i < stepIdx ? "rgba(16,185,129,0.06)" : "transparent",
              border: `1px solid ${i === stepIdx ? "rgba(99,102,241,0.18)" : i < stepIdx ? "rgba(16,185,129,0.15)" : "transparent"}`,
              transition: "all 0.3s",
            }}>
              {i < stepIdx ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.2"/><path d="M4 6.5l2 2 3-3" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : i === stepIdx ? (
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--violet)", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--border)", flexShrink: 0 }} />
              )}
              <span style={{
                fontSize: "0.72rem", fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                color: i === stepIdx ? "var(--violet)" : i < stepIdx ? "#10b981" : "var(--text-muted)",
              }}>{s}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}