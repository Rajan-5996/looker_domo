import { useAppContext } from "@/context/useAppContext";
import {
  ArrowRightIcon,
  DatabaseIcon,
  KeyIcon,
  LinkIcon,
  Lock,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const LookerAuth = () => {
  const {
    setLookerInstanceUrl,
    setLookerClientId,
    setLookerClientSecret,
    lookerInstanceUrl,
    lookerClientId,
    lookerClientSecret,
  } = useAppContext();
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const isDisabled =
    !lookerInstanceUrl?.trim() ||
    !lookerClientId?.trim() ||
    !lookerClientSecret?.trim();

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "clamp(1rem, 3vw, 1.75rem) clamp(1rem, 4vw, 2rem)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 440 }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.7rem",
            }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: 56,
                height: 56,
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(129,140,248,0.16))",
                border: "1.5px solid rgba(99,102,241,0.2)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--violet)",
                boxShadow: "0 6px 20px rgba(99,102,241,0.14)",
              }}
            >
              <DatabaseIcon />
            </motion.div>
          </div>

          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
              color: "var(--text-primary)",
              margin: "0 0 0.3rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Connect to Looker
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.84rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Enter your API credentials to fetch available dashboards
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: "clamp(1.2rem, 3.5vw, 1.7rem)",
            boxShadow:
              "0 12px 40px rgba(99,102,241,0.1), 0 4px 12px rgba(15,23,42,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -28,
              width: 110,
              height: 110,
              background:
                "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -18,
              left: -18,
              width: 90,
              height: 90,
              background:
                "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ marginBottom: "1.1rem" }}></div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <div>
              <label
                className="field-label"
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    color:
                      focused === "url"
                        ? "var(--violet)"
                        : "var(--text-secondary)",
                    transition: "color 0.2s",
                  }}
                >
                  <LinkIcon size={14} />
                </span>
                Looker Instance URL
              </label>

              <input
                className="fancy-input"
                type="text"
                placeholder="https://company.looker.com"
                value={lookerInstanceUrl}
                onFocus={() => setFocused("url")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setLookerInstanceUrl(e.target.value)}
              />
            </div>

            <div>
              <label
                className="field-label"
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    color:
                      focused === "id"
                        ? "var(--violet)"
                        : "var(--text-secondary)",
                    transition: "color 0.2s",
                  }}
                >
                  <KeyIcon size={14} />
                </span>
                Client ID
              </label>

              <input
                className="fancy-input"
                type="text"
                placeholder="API Client ID"
                value={lookerClientId}
                onFocus={() => setFocused("id")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setLookerClientId(e.target.value)}
              />
            </div>

            <div>
              <label
                className="field-label"
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    color:
                      focused === "secret"
                        ? "var(--violet)"
                        : "var(--text-secondary)",
                    transition: "color 0.2s",
                  }}
                >
                  <Lock size={13} />
                </span>
                Client Secret
              </label>

              <input
                className="fancy-input"
                type="password"
                placeholder="API Client Secret"
                value={lookerClientSecret}
                onFocus={() => setFocused("secret")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setLookerClientSecret(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              margin: "1.1rem 0",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--border-strong), transparent)",
            }}
          />

          <button
            onClick={()=> navigate("/dashboard")}
            disabled={isDisabled}
            className="btn-primary"
          >
            GO
            <ArrowRightIcon />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
