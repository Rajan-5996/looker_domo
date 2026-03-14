import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DomoIcon, LookerIcon } from "./icons";

export const TransferLoader = ({ label, subtitle }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(8);
  const messages = [
    "Transferring dashboard structure…",
    "Mapping Looker views to Domo…",
    "Building Domo cards…",
    "Almost done…",
  ];
  const steps = [
    "Authenticating",
    "Transferring Data",
    "Building Cards",
    "Finalising",
  ];

  useEffect(() => {
    const mt = setInterval(
      () => setMsgIdx((p) => (p + 1) % messages.length),
      2200,
    );
    const st = setInterval(() => {
      setStepIdx((p) => {
        if (p < steps.length - 1) {
          setProgress((pp) => Math.min(pp + 22, 92));
          return p + 1;
        }
        return p;
      });
    }, 3000);
    return () => {
      clearInterval(mt);
      clearInterval(st);
    };
  }, []);

  const barHeights = [20, 34, 26, 40, 30, 36];
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "clamp(1.5rem, 4vw, 2.2rem)",
          boxShadow: "0 12px 40px rgba(99,102,241,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.6rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
              color: "var(--text-primary)",
              margin: "0 0 0.3rem",
            }}
          >
            {label || "Processing…"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
            }}
          >
            {subtitle || "Please wait…"}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ flexShrink: 0 }}
          >
            <LookerIcon size={70} />
          </motion.div>
          <div
            style={{
              flex: 1,
              height: 130,
              borderRadius: 16,
              background: "rgba(248,249,254,0.9)",
              border: "1px solid var(--border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.svg
              viewBox="0 0 300 130"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                padding: 12,
              }}
            >
              <motion.path
                d="M0 95 L40 78 L80 82 L120 62 L160 66 L200 50 L240 53 L280 38"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.svg>
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: 14,
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
              }}
            >
              {barHeights.map((h, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 6,
                    borderRadius: 3,
                    background: "linear-gradient(180deg, #818cf8, #6366f1)",
                  }}
                  animate={{ scaleY: [1, 1.3, 1] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.18,
                    repeat: Infinity,
                  }}
                  initial={{ height: h, transformOrigin: "bottom" }}
                />
              ))}
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
            style={{ flexShrink: 0 }}
          >
            <DomoIcon size={50} />
          </motion.div>
        </div>
        <div>
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: "rgba(99,102,241,0.1)",
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #818cf8)",
                borderRadius: 99,
              }}
            />
          </div>
          <motion.p
            key={messages[msgIdx]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              margin: 0,
              fontSize: "0.74rem",
              color: "var(--text-secondary)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {messages[msgIdx]}
          </motion.p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "0.45rem 0.7rem",
                borderRadius: 10,
                background:
                  i === stepIdx
                    ? "rgba(99,102,241,0.07)"
                    : i < stepIdx
                      ? "rgba(16,185,129,0.06)"
                      : "transparent",
                border: `1px solid ${i === stepIdx ? "rgba(99,102,241,0.18)" : i < stepIdx ? "rgba(16,185,129,0.15)" : "transparent"}`,
                transition: "all 0.3s",
              }}
            >
              {i < stepIdx ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="6"
                    fill="#10b981"
                    fillOpacity="0.15"
                    stroke="#10b981"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4 6.5l2 2 3-3"
                    stroke="#10b981"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : i === stepIdx ? (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--violet)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--border)",
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "0.72rem",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  color:
                    i === stepIdx
                      ? "var(--violet)"
                      : i < stepIdx
                        ? "#10b981"
                        : "var(--text-muted)",
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
