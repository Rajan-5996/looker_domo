import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TransferLoader } from "@/components/MigrateTransferLoader";
import { SuccessPage } from "@/components/successPage";
import { useAppContext } from "@/context/useAppContext";
import {
  AlertCircleIcon,
  ArrowLeft,
  BarChartIcon,
  MapIcon,
  X,
  ZapIcon,
} from "lucide-react";
import { createCard } from "@/API/dataApi";
import { mapVizToCardConfig } from "@/helper/mapVizToCards";
import { CalcPopup } from "@/components/CalcPop";
import { CustomCheckbox, FieldError, SectionCard } from "@/components/utility";
import { CalcIcon, DashboardIcon, IdIcon, TokenIcon } from "@/components/icons";

export const Migrate = () => {
  const navigate = useNavigate();

  const {
    selectedDash,
    fetchPreview,
    previewData,
    previewLoading,
    previewError,
  } = useAppContext();

  const dashboardTitle =
    previewData?.dashboard_name || selectedDash?.title || "";
  const lookerViews = previewData?.looker_datasets || [];
  const visuals = previewData?.visuals || [];
  const calculatedFields = previewData?.calculatedFields || [];

  const [domoForm, setDomoForm] = useState({ pageId: "" });
  const [resolvedMappings, setResolvedMappings] = useState({});
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [mappingErrors, setMappingErrors] = useState({});
  const [selectedVisualIds, setSelectedVisualIds] = useState(new Set());
  const [popupViz, setPopupViz] = useState(null);

  const abortRef = useRef(null);

  useEffect(() => {
    if (!selectedDash) {
      navigate("/");
      return;
    }

    if (previewData) return;

    const controller = new AbortController();
    abortRef.current = controller;

    fetchPreview(controller).catch(() => {
      // previewError in context handles the error display
    });

    return () => controller.abort();
  }, [selectedDash?.id]);

  const toggleVisual = (id) => {
    setSelectedVisualIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setDomoField = (key, val) => {
    setDomoForm((p) => ({ ...p, [key]: val }));
    if (fieldErrors[key])
      setFieldErrors((p) => {
        const n = { ...p };
        delete n[key];
        return n;
      });
  };

  const setMapping = (name, val) => {
    setResolvedMappings((p) => ({ ...p, [name]: val }));
    if (mappingErrors[name])
      setMappingErrors((p) => {
        const n = { ...p };
        delete n[name];
        return n;
      });
  };

  const executeMigration = async () => {
    const fErrs = {};
    if (!domoForm.pageId.trim()) fErrs.pageId = "Page ID is required.";
    setFieldErrors(fErrs);

    const mErrs = {};
    lookerViews.forEach((v) => {
      if (!resolvedMappings[v.name]?.trim())
        mErrs[v.name] = "Please enter the Dataset UUID.";
    });
    setMappingErrors(mErrs);

    if (Object.keys(fErrs).length > 0 || Object.keys(mErrs).length > 0) return;

    const selectedIds = [...selectedVisualIds];
    if (selectedIds.length === 0) {
      setStatus(
        "error:No charts selected. Please check at least one chart to migrate.",
      );
      return;
    }

    setStatus("loading");

    try {
      const pageId = domoForm.pageId;
      const selectedVisuals = visuals.filter((v) =>
        selectedVisualIds.has(v.id),
      );

      for (const viz of selectedVisuals) {
        const config = mapVizToCardConfig(viz, resolvedMappings);
        await createCard(pageId, config);
      }

      setStatus("success");
    } catch (err) {
      const detail = err.response?.data?.detail
        ? JSON.stringify(err.response.data.detail)
        : err.message;
      setStatus("error:" + detail);
    }
  };

  if (!selectedDash)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          No dashboard selected.
        </p>
        <button
          onClick={() => navigate("/dashboards")}
          className="btn-primary"
          style={{ width: "auto", padding: "0.6rem 1.4rem" }}
        >
          Back to Dashboards
        </button>
      </div>
    );

  if (previewLoading)
    return (
      <TransferLoader
        label="Scanning Dashboard"
        subtitle="Reading charts, datasets and layout from Looker…"
      />
    );

  if (previewError)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        <p style={{ color: "#e11d48", fontSize: "0.85rem" }}>
          Failed to load dashboard preview. Please try again.
        </p>
        <button
          onClick={() => navigate("/dashboards")}
          className="btn-primary"
          style={{ width: "auto", padding: "0.6rem 1.4rem" }}
        >
          Back to Dashboards
        </button>
      </div>
    );

  if (status === "loading")
    return (
      <TransferLoader
        label="Migrating to Domo"
        subtitle="Transferring your selected charts and datasets…"
      />
    );

  if (status === "success")
    return (
      <SuccessPage
        domoPageId={domoForm.pageId}
        onMigrateAnother={() => navigate("/dashboards")}
      />
    );

  const isError = status.startsWith("error:");
  const errorMsg = isError ? status.replace("error:", "") : "";
  const selectedCount = selectedVisualIds.size;
  const selectableCount = visuals.filter((v) => v.type !== "TEXT").length;

  return (
    <>
      <AnimatePresence>
        {popupViz && (
          <CalcPopup
            viz={popupViz}
            calculatedFields={calculatedFields}
            onClose={() => setPopupViz(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 3vw, 1.25rem)",
        }}
      >
        <div style={{ flexShrink: 0, marginBottom: "0.7rem" }}>
          <button
            onClick={() => navigate("/dashboards")}
            style={{
              background: "none",
              border: "none",
              padding: "0.2rem 0",
              color: "var(--text-muted)",
              fontSize: "0.78rem",
              fontFamily: "'Outfit', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--violet)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <ArrowLeft size={15} /> Back to Dashboards
          </button>
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
          <div
            style={{
              maxWidth: 660,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
              paddingBottom: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--violet-dim)",
                  border: "1px solid rgba(99,102,241,0.18)",
                  borderRadius: 99,
                  padding: "0.2rem 0.65rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--violet)",
                    animation: "dotPulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: "var(--violet)",
                  }}
                >
                  Step 3 of 3
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.15rem, 3vw, 1.45rem)",
                  color: "var(--text-primary)",
                  margin: "0 0 0.5rem",
                }}
              >
                Configure &amp; Migrate
              </h2>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.88)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 12,
                  padding: "0.5rem 0.85rem",
                  boxShadow: "0 2px 10px rgba(99,102,241,0.06)",
                }}
              >
                <div style={{ color: "var(--violet)", display: "flex" }}>
                  <DashboardIcon />
                </div>
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "var(--text-primary)",
                    maxWidth: "clamp(180px, 40vw, 380px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {dashboardTitle}
                </span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1.5px solid rgba(255,255,255,0.95)",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(99,102,241,0.06)",
              }}
            >
              <div
                style={{
                  padding: "0.85rem 1.15rem",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.03), rgba(129,140,248,0.02))",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: "var(--violet-dim)",
                    border: "1px solid rgba(99,102,241,0.18)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--violet)",
                    flexShrink: 0,
                  }}
                >
                  <MapIcon />
                </div>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Dataset Mapping
                </div>
              </div>
              <div style={{ padding: "1rem 1.15rem" }}>
                <p
                  style={{
                    margin: "0 0 0.9rem",
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  Match each Looker view to its Domo Dataset UUID.
                </p>
                {lookerViews.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    No Looker views detected.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                    }}
                  >
                    {lookerViews.map((view, i) => (
                      <div key={i}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: "0.38rem",
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                          >
                            <rect
                              x="1"
                              y="1"
                              width="11"
                              height="8"
                              rx="1.5"
                              stroke="#6366f1"
                              strokeWidth="1.3"
                            />
                            <path
                              d="M4 11h5M6.5 9v2"
                              stroke="#6366f1"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span
                            style={{
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              fontWeight: 500,
                            }}
                          >
                            View from dashboard:
                          </span>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                              color: "var(--violet)",
                              background: "rgba(99,102,241,0.07)",
                              border: "1px solid rgba(99,102,241,0.15)",
                              borderRadius: 6,
                              padding: "0.1rem 0.45rem",
                              maxWidth: "clamp(140px, 35vw, 280px)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={view.name}
                          >
                            {view.name}
                          </span>
                        </div>
                        <input
                          className="fancy-input"
                          placeholder="Enter Domo Dataset UUID"
                          value={resolvedMappings[view.name] || ""}
                          onChange={(e) =>
                            setMapping(view.name, e.target.value)
                          }
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.76rem",
                            background: "white",
                            padding: "0.5rem 0.85rem",
                            borderColor: mappingErrors[view.name]
                              ? "#e11d48"
                              : undefined,
                            boxShadow: mappingErrors[view.name]
                              ? "0 0 0 3px rgba(225,29,72,0.1)"
                              : undefined,
                          }}
                        />
                        <AnimatePresence>
                          {mappingErrors[view.name] && (
                            <FieldError msg={mappingErrors[view.name]} />
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {visuals.length > 0 && (
              <div
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1.5px solid rgba(255,255,255,0.95)",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.06)",
                }}
              >
                <div
                  style={{
                    padding: "0.85rem 1.15rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.03), rgba(129,140,248,0.02))",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        background: "var(--violet-dim)",
                        border: "1px solid rgba(99,102,241,0.18)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--violet)",
                        flexShrink: 0,
                      }}
                    >
                      <BarChartIcon />
                    </div>
                    <div
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      Charts to Migrate
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedCount}
                      initial={{ opacity: 0, scale: 0.8, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 4 }}
                      transition={{ duration: 0.14 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background:
                          selectedCount > 0
                            ? "rgba(99,102,241,0.08)"
                            : "rgba(148,163,184,0.07)",
                        border: `1px solid ${selectedCount > 0 ? "rgba(99,102,241,0.2)" : "rgba(148,163,184,0.15)"}`,
                        borderRadius: 99,
                        padding: "0.22rem 0.65rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 800,
                          fontSize: "0.72rem",
                          color:
                            selectedCount > 0
                              ? "var(--violet)"
                              : "var(--text-muted)",
                        }}
                      >
                        {selectedCount}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text-muted)",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        / {selectableCount} selected
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div style={{ padding: "0.75rem 1.15rem 1rem" }}>
                  <p
                    style={{
                      margin: "0 0 0.75rem",
                      fontSize: "0.76rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    Check charts to migrate. Click <strong>Calculation</strong>{" "}
                    to preview Beast Mode formulas.
                  </p>
                  <div
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      overflow: "hidden",
                      maxHeight: 280,
                      overflowY: "auto",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.8rem",
                      }}
                    >
                      <colgroup>
                        <col style={{ width: "38px" }} />
                        <col style={{ width: "32%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "26%" }} />
                        <col style={{ width: "18%" }} />
                      </colgroup>
                      <thead>
                        <tr
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(129,140,248,0.03))",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          <th style={{ padding: "0.5rem 0.6rem" }} />
                          {["Title", "Type", "Looker View", "Details"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  padding: "0.5rem 0.7rem",
                                  textAlign: "left",
                                  fontFamily:
                                    "'Bricolage Grotesque', sans-serif",
                                  fontWeight: 700,
                                  fontSize: "0.6rem",
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {visuals.map((viz, idx) => {
                          const isText = viz.type === "TEXT";
                          const isChecked =
                            !isText && selectedVisualIds.has(viz.id);
                          const viewName =
                            lookerViews.find((v) => v.id === viz.datasetRef)
                              ?.name ||
                            viz.datasetRef ||
                            "—";
                          const isPopupOpen = popupViz?.id === viz.id;
                          return (
                            <motion.tr
                              key={viz.id}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.02, duration: 0.2 }}
                              style={{
                                borderBottom: "1px solid var(--border)",
                                transition: "background 0.13s",
                                cursor: isText ? "default" : "pointer",
                                background: isPopupOpen
                                  ? "rgba(99,102,241,0.06)"
                                  : isChecked
                                    ? "rgba(99,102,241,0.035)"
                                    : "transparent",
                              }}
                              onClick={() => !isText && toggleVisual(viz.id)}
                              onMouseEnter={(e) => {
                                if (!isText)
                                  e.currentTarget.style.background =
                                    isChecked || isPopupOpen
                                      ? "rgba(99,102,241,0.06)"
                                      : "rgba(99,102,241,0.02)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isPopupOpen
                                  ? "rgba(99,102,241,0.06)"
                                  : isChecked
                                    ? "rgba(99,102,241,0.035)"
                                    : "transparent";
                              }}
                            >
                              <td
                                style={{
                                  padding: "0.5rem 0.6rem",
                                  textAlign: "center",
                                }}
                              >
                                {isText ? (
                                  <div
                                    style={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: 5,
                                      background: "rgba(148,163,184,0.08)",
                                      border:
                                        "1.5px solid rgba(148,163,184,0.18)",
                                      margin: "0 auto",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CustomCheckbox
                                      checked={isChecked}
                                      onChange={() => toggleVisual(viz.id)}
                                    />
                                  </div>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "0.5rem 0.7rem",
                                  fontWeight: 500,
                                  color: isText
                                    ? "var(--text-muted)"
                                    : "var(--text-primary)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 0,
                                }}
                              >
                                <span title={viz.title || "—"}>
                                  {viz.title || "—"}
                                </span>
                                {isText && (
                                  <span
                                    style={{
                                      marginLeft: 5,
                                      fontSize: "0.6rem",
                                      background: "rgba(148,163,184,0.1)",
                                      border:
                                        "1px solid rgba(148,163,184,0.18)",
                                      borderRadius: 4,
                                      padding: "0.1rem 0.35rem",
                                      color: "var(--text-muted)",
                                      fontFamily:
                                        "'Bricolage Grotesque', sans-serif",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    text tile
                                  </span>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "0.5rem 0.7rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <span
                                  style={{
                                    background: isChecked
                                      ? "var(--violet-dim)"
                                      : "rgba(148,163,184,0.08)",
                                    border: `1px solid ${isChecked ? "rgba(99,102,241,0.18)" : "rgba(148,163,184,0.18)"}`,
                                    color: isChecked
                                      ? "var(--violet)"
                                      : "var(--text-muted)",
                                    fontFamily:
                                      "'Bricolage Grotesque', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "0.6rem",
                                    textTransform: "uppercase",
                                    padding: "0.15rem 0.4rem",
                                    borderRadius: 6,
                                    transition: "all 0.15s",
                                  }}
                                >
                                  {viz.type || "—"}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "0.5rem 0.7rem",
                                  color: "var(--text-secondary)",
                                  fontFamily: "monospace",
                                  fontSize: "0.72rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 0,
                                }}
                              >
                                {isText ? "—" : viewName}
                              </td>
                              <td
                                style={{
                                  padding: "0.4rem 0.7rem",
                                  whiteSpace: "nowrap",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {isText ? (
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      color: "var(--text-muted)",
                                    }}
                                  >
                                    —
                                  </span>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setPopupViz(isPopupOpen ? null : viz)
                                    }
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      background: isPopupOpen
                                        ? "linear-gradient(135deg, #6366f1, #818cf8)"
                                        : "rgba(99,102,241,0.07)",
                                      border: `1.5px solid ${isPopupOpen ? "#6366f1" : "rgba(99,102,241,0.2)"}`,
                                      color: isPopupOpen
                                        ? "white"
                                        : "var(--violet)",
                                      borderRadius: 8,
                                      padding: "0.28rem 0.6rem",
                                      cursor: "pointer",
                                      fontFamily:
                                        "'Bricolage Grotesque', sans-serif",
                                      fontWeight: 700,
                                      fontSize: "0.62rem",
                                      transition: "all 0.15s",
                                      boxShadow: isPopupOpen
                                        ? "0 2px 8px rgba(99,102,241,0.3)"
                                        : "none",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isPopupOpen) {
                                        e.currentTarget.style.background =
                                          "rgba(99,102,241,0.14)";
                                        e.currentTarget.style.borderColor =
                                          "rgba(99,102,241,0.35)";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isPopupOpen) {
                                        e.currentTarget.style.background =
                                          "rgba(99,102,241,0.07)";
                                        e.currentTarget.style.borderColor =
                                          "rgba(99,102,241,0.2)";
                                      }
                                    }}
                                  >
                                    <CalcIcon /> Calculation
                                  </button>
                                )}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <SectionCard title="Domo Session Details" icon={<TokenIcon />}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <label
                    className="field-label"
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <span style={{ color: "var(--violet)" }}>
                      <IdIcon />
                    </span>{" "}
                    Target Page ID
                  </label>
                  <input
                    className="fancy-input"
                    placeholder="e.g. 650770219"
                    value={domoForm.pageId}
                    onChange={(e) => setDomoField("pageId", e.target.value)}
                    style={{
                      borderColor: fieldErrors.pageId ? "#e11d48" : undefined,
                      boxShadow: fieldErrors.pageId
                        ? "0 0 0 3px rgba(225,29,72,0.1)"
                        : undefined,
                    }}
                  />
                  <AnimatePresence>
                    {fieldErrors.pageId && (
                      <FieldError msg={fieldErrors.pageId} />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionCard>

            <div>
              <button
                onClick={executeMigration}
                className="btn-emerald"
                style={{ padding: "0.9rem 1.2rem", fontSize: "0.9rem" }}
              >
                <ZapIcon />
                Execute Migration
                {selectedCount > 0 && (
                  <span
                    style={{
                      background: "rgba(255,255,255,0.22)",
                      borderRadius: 99,
                      padding: "0.1rem 0.6rem",
                      fontSize: "0.78rem",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    {selectedCount} chart{selectedCount !== 1 ? "s" : ""}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: "0.7rem",
                      background: "var(--rose-dim)",
                      border: "1.5px solid rgba(244,63,94,0.2)",
                      borderRadius: 14,
                      padding: "0.85rem 1rem",
                      fontSize: "0.82rem",
                      color: "#e11d48",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 4,
                      }}
                    >
                      <AlertCircleIcon /> Migration failed
                    </span>
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        opacity: 0.85,
                      }}
                    >
                      {errorMsg}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </>
  );
};
