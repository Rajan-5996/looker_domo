import { envConfig } from "@/config/enf_config";
import { motion } from "framer-motion";
import { DomoIcon, LookerIcon } from "./icons";
import { ExternalLinkIcon } from "lucide-react";

export const SuccessPage = ({ domoPageId, onMigrateAnother }) => {
  const DomoBaseUrl = envConfig.domoBaseUrl;
  const domoUrl = `${DomoBaseUrl}/page/${domoPageId}`;

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
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255,255,255,0.98)",
          borderRadius: 28,
          padding: "clamp(2rem, 5vw, 2.8rem)",
          boxShadow:
            "0 16px 48px rgba(16,185,129,0.12), 0 4px 16px rgba(15,23,42,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.6rem",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LookerIcon size={70} />
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "#10b981" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <DomoIcon size={45} />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 14,
          }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.05))",
            border: "2px solid rgba(16,185,129,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 8px rgba(16,185,129,0.06)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <motion.path
              d="M8 16l6 6 10-11"
              stroke="#10b981"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <div>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
              color: "var(--text-primary)",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard Migrated Successfully
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.84rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Your selected Looker charts have been transferred to Domo. All cards
            and datasets are ready.
          </p>
        </div>

        <div
          style={{
            width: "100%",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 10,
            padding: "0.55rem 0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <rect
              x="1.5"
              y="1.5"
              width="5"
              height="5"
              rx="1.5"
              fill="#10b981"
              fillOpacity="0.3"
              stroke="#10b981"
              strokeWidth="1.2"
            />
            <rect
              x="7.5"
              y="1.5"
              width="5"
              height="5"
              rx="1.5"
              fill="#10b981"
              fillOpacity="0.3"
              stroke="#10b981"
              strokeWidth="1.2"
            />
            <rect
              x="1.5"
              y="7.5"
              width="5"
              height="5"
              rx="1.5"
              fill="#10b981"
              fillOpacity="0.3"
              stroke="#10b981"
              strokeWidth="1.2"
            />
            <rect
              x="7.5"
              y="7.5"
              width="5"
              height="5"
              rx="1.5"
              fill="#10b981"
              fillOpacity="0.3"
              stroke="#10b981"
              strokeWidth="1.2"
            />
          </svg>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              color: "#059669",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
          >
            Page ID: <strong>{domoPageId}</strong>
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            window.location.href = domoUrl;
          }}
          style={{
            width: "100%",
            padding: "0.88rem 1.4rem",
            background: "linear-gradient(135deg, #10b981, #059669)",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "white",
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
          }}
        >
          <ExternalLinkIcon size={15} />
          Go to Dashboard
        </motion.button>

        <button
          onClick={onMigrateAnother}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            padding: "0.2rem 0",
            transition: "color 0.18s",
            marginTop: "-0.8rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--violet)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          ← Migrate another dashboard
        </button>
      </motion.div>
    </div>
  );
};
