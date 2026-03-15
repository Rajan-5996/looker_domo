import { motion } from "framer-motion";
import { FxIcon } from "./icons";
import { X } from "lucide-react";

export const CalcPopup = ({ viz, calculatedFields, onClose }) => {
  if (!viz) return null;
  const cfMap = {};
  (calculatedFields || []).forEach((cf) => {
    cfMap[cf.name] = cf;
  });
  const formulas = [];
  const seen = new Set();
  const addFormula = (fieldName) => {
    if (!fieldName || seen.has(fieldName)) return;
    const cf = cfMap[fieldName];
    if (cf) {
      seen.add(fieldName);
      formulas.push({
        key: fieldName,
        label: cf.label || cf.name,
        beast_mode: cf.beast_mode || "",
        category: cf.category || "",
        is_disabled: cf.is_disabled || false,
      });
    }
  };
  (viz.columns || []).forEach((c) => {
    if (c.is_calc || cfMap[c.field]) addFormula(c.field);
  });
  (viz.measures || []).forEach((m) => {
    if (m.is_calc || cfMap[m.column]) addFormula(m.column);
  });
  if (formulas.length === 0) {
    (viz.measures || []).forEach((m) => addFormula(m.column));
    (viz.columns || []).forEach((c) => addFormula(c.field));
  }
  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          background: "rgba(8,10,30,0.55)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      />
      <motion.div
        key="popup"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          marginTop: "-160px",
          marginLeft: "-210px",
          zIndex: 9999,
          width: 420,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "440px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 16,
          background: "linear-gradient(160deg, #ffffff 0%, #f3f4ff 100%)",
          border: "1.5px solid rgba(129,140,248,0.35)",
          boxShadow:
            "0 0 0 1px rgba(99,102,241,0.12), 0 8px 20px rgba(99,102,241,0.18), 0 24px 60px rgba(15,23,42,0.32), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div
          style={{
            height: 3,
            flexShrink: 0,
            background:
              "linear-gradient(90deg, #4f46e5 0%, #6366f1 30%, #818cf8 65%, #a5b4fc 90%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.05) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            padding: "0.65rem 0.85rem",
            borderBottom: "1px solid rgba(99,102,241,0.1)",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              flexShrink: 0,
              borderRadius: 8,
              background: "linear-gradient(135deg, #5b5ef4, #818cf8)",
              boxShadow: "0 3px 10px rgba(99,102,241,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <FxIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "0.82rem",
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              Beast Mode Calculations
            </div>
            <div
              style={{
                marginTop: 2,
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.63rem",
                color: "#94a3b8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={viz.title}
            >
              {viz.title || "Untitled"}&nbsp;&nbsp;
              <span
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "#6366f1",
                  borderRadius: 4,
                  padding: "0 4px",
                  fontSize: "0.56rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {viz.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              borderRadius: 6,
              border: "1.5px solid rgba(99,102,241,0.2)",
              background: "rgba(255,255,255,0.85)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              transition: "all 0.15s",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244,63,94,0.08)";
              e.currentTarget.style.borderColor = "rgba(244,63,94,0.4)";
              e.currentTarget.style.color = "#e11d48";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.85)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <X />
          </button>
        </div>
        <div
          className="hide-scrollbar"
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            overflowY: "auto",
            padding: "0.65rem 0.85rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {formulas.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "1.8rem 1rem",
                textAlign: "center",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
                <path
                  d="M13 20h14M20 13v14"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.76rem",
                  color: "#64748b",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 600,
                }}
              >
                No calculations for this chart
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.68rem",
                  color: "#94a3b8",
                  lineHeight: 1.5,
                }}
              >
                Uses only base dataset columns.
              </p>
            </div>
          ) : (
            formulas.map((f, idx) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.18 }}
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1.5px solid rgba(99,102,241,0.13)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.07)",
                  background: "white",
                }}
              >
                <div
                  style={{
                    padding: "0.38rem 0.65rem",
                    background:
                      "linear-gradient(90deg, rgba(99,102,241,0.05), transparent)",
                    borderBottom: "1px solid rgba(99,102,241,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#6366f1,#818cf8)",
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      color: "#0f172a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      borderRadius: 4,
                      padding: "0.06rem 0.3rem",
                      flexShrink: 0,
                      background:
                        f.category === "table_calculation"
                          ? "rgba(245,158,11,0.09)"
                          : "rgba(99,102,241,0.09)",
                      border: `1px solid ${f.category === "table_calculation" ? "rgba(245,158,11,0.28)" : "rgba(99,102,241,0.22)"}`,
                      color:
                        f.category === "table_calculation"
                          ? "#d97706"
                          : "#6366f1",
                    }}
                  >
                    {f.category === "table_calculation"
                      ? "Table Calc"
                      : "Measure"}
                  </span>
                  {f.is_disabled && (
                    <span
                      style={{
                        fontSize: "0.55rem",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background: "rgba(244,63,94,0.07)",
                        border: "1px solid rgba(244,63,94,0.22)",
                        color: "#e11d48",
                        borderRadius: 4,
                        padding: "0.06rem 0.3rem",
                        flexShrink: 0,
                      }}
                    >
                      Disabled
                    </span>
                  )}
                </div>
                <div style={{ padding: "0.45rem 0.65rem" }}>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#94a3b8",
                      marginBottom: "0.22rem",
                    }}
                  >
                    Beast Mode SQL
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: "monospace",
                      fontSize: "0.72rem",
                      color: "#3730a3",
                      lineHeight: 1.65,
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(129,140,248,0.02))",
                      border: "1px solid rgba(99,102,241,0.12)",
                      borderRadius: 7,
                      padding: "0.45rem 0.65rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  >
                    {f.beast_mode || "(empty)"}
                  </pre>
                </div>
              </motion.div>
            ))
          )}
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            padding: "0.45rem 0.85rem",
            borderTop: "1px solid rgba(99,102,241,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.62rem", color: "#94a3b8" }}>
            <span style={{ fontWeight: 700, color: "#6366f1" }}>
              {formulas.length}
            </span>{" "}
            calc{formulas.length !== 1 ? "s" : ""} · {viz.type}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #5b5ef4, #818cf8)",
              border: "none",
              color: "white",
              borderRadius: 7,
              padding: "0.28rem 0.85rem",
              cursor: "pointer",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: "0.68rem",
              boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
};
