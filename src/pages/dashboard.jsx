import { TransferLoader } from "@/components/LoadDashBoardTransferLoader";
import { useAppContext } from "@/context/useAppContext";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircleIcon,
  ArrowRight,
  BrushCleaning,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react";
import { GridIcon } from "@/components/icons";

export const DashBoard = () => {
  const {
    lookerInstanceUrl,
    lookerClientId,
    fetchDashboards,
    setSelectedDash,
  } = useAppContext();

  const [dashboards, setDashboards] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [error, setError] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const navigate = useNavigate();
  const abortRef = useRef(null);
  const itemsPerPage = 20;

  useEffect(() => {
    if (!lookerInstanceUrl || !lookerClientId) {
      navigate("/");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const loadDashboards = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchDashboards(controller);

        if (controller.signal.aborted) return;

        let dashboardsData = [];
        if (Array.isArray(data)) {
          dashboardsData = data;
        } else if (data && Array.isArray(data.data)) {
          dashboardsData = data.data;
        } else if (data && Array.isArray(data.dashboards)) {
          dashboardsData = data.dashboards;
        } else if (data) {
          console.warn("[DashBoard] Unexpected fetchDashboards shape:", data);
        }

        setDashboards(dashboardsData);
        setFetchedCount(dashboardsData.length);
        setError("");
      } catch (err) {
        if (controller.signal.aborted || err.name === "AbortError") return;
        console.error("[DashBoard] fetchDashboards threw:", err);
        setError(
          "Could not load dashboards. Check your credentials and try again.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDashboards();
    return () => controller.abort();
  }, [lookerInstanceUrl, lookerClientId, fetchDashboards, navigate]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return dashboards.filter(
      (d) =>
        d?.id?.toString().toLowerCase().includes(q) ||
        d?.title?.toLowerCase().includes(q),
    );
  }, [dashboards, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <TransferLoader fetched={fetchedCount} label="Fetching Dashboards…" />
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "clamp(0.8rem, 2vw, 1.2rem) clamp(0.8rem, 3vw, 1.4rem)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "0.8rem",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--violet-dim)",
                border: "1px solid rgba(99,102,241,0.18)",
                borderRadius: 99,
                padding: "0.2rem 0.65rem",
                marginBottom: "0.45rem",
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
                Step 2 of 3
              </span>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <div style={{ color: "var(--violet)", display: "flex" }}>
                <GridIcon />
              </div>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Select a Dashboard
              </h2>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: searchFocused ? "var(--violet)" : "var(--text-muted)",
                pointerEvents: "none",
                transition: "color 0.2s",
              }}
            >
              <SearchIcon size={15} />
            </span>
            <input
              type="text"
              placeholder="Search dashboards…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                background: "rgba(255,255,255,0.85)",
                border: `1.5px solid ${searchFocused ? "var(--violet)" : "var(--border)"}`,
                borderRadius: 12,
                color: "var(--text-primary)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.82rem",
                padding: "0.52rem 0.9rem 0.52rem 2.1rem",
                width: "clamp(180px, 28vw, 260px)",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: searchFocused ? "var(--shadow-glow)" : "none",
              }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              flexShrink: 0,
              background: "rgba(244,63,94,0.06)",
              border: "1.5px solid rgba(244,63,94,0.18)",
              borderRadius: 12,
              padding: "0.7rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.82rem",
              color: "#e11d48",
            }}
          >
            <AlertCircleIcon size={15} /> {error}
          </div>
        )}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.95)",
            borderRadius: 18,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow:
              "0 12px 40px rgba(99,102,241,0.08), 0 2px 8px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{ flexShrink: 0, borderBottom: "1px solid var(--border)" }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 340,
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col style={{ width: "16%" }} />
                <col style={{ width: "63%" }} />
                <col style={{ width: "21%" }} />
              </colgroup>
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(129,140,248,0.03) 100%)",
                  }}
                >
                  {["Dashboard ID", "Title", "Action"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.65rem clamp(0.65rem, 2vw, 1rem)",
                        textAlign: i === 2 ? "right" : "left",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.62rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 340,
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col style={{ width: "16%" }} />
                <col style={{ width: "63%" }} />
                <col style={{ width: "21%" }} />
              </colgroup>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{ padding: "4rem 1rem", textAlign: "center" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.65rem",
                        }}
                      >
                        <div style={{ color: "var(--text-muted)" }}>
                          <BrushCleaning />
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            fontWeight: 500,
                          }}
                        >
                          {dashboards.length === 0
                            ? "No dashboards found"
                            : "No results match your search"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((d, idx) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.018, duration: 0.25 }}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        cursor: "default",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(99,102,241,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "0.65rem clamp(0.65rem, 2vw, 1rem)",
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {d.id}
                      </td>

                      <td
                        style={{
                          padding: "0.65rem clamp(0.65rem, 2vw, 1rem)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={d.title}
                      >
                        {d.title}
                      </td>

                      <td
                        style={{
                          padding: "0.65rem clamp(0.65rem, 2vw, 1rem)",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() => {
                            setSelectedDash(d);
                            navigate("/migrate");
                          }}
                          style={{
                            background: "var(--emerald-dim)",
                            border: "1.5px solid rgba(16,185,129,0.25)",
                            color: "var(--emerald)",
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            padding: "0.32rem 0.65rem",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all 0.18s",
                            whiteSpace: "nowrap",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(16,185,129,0.18)";
                            e.currentTarget.style.transform = "scale(1.04)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(16,185,129,0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "var(--emerald-dim)";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Migrate <ArrowRight size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {dashboards.length > 0 && (
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.76rem",
                color: "var(--text-muted)",
              }}
            >
              {search && filteredData.length !== dashboards.length && (
                <>
                  <b style={{ color: "var(--text-secondary)" }}>
                    {filteredData.length}
                  </b>{" "}
                  results
                </>
              )}
            </p>

            {totalPages > 1 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <button
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((p) => p - 1)
                  }
                  disabled={currentPage === 1}
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text-secondary)",
                    borderRadius: 9,
                    padding: "0.32rem 0.7rem",
                    fontSize: "0.75rem",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "var(--violet)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <ChevronLeftIcon /> Prev
                </button>

                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    padding: "0 0.35rem",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage((p) => p + 1)
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text-secondary)",
                    borderRadius: 9,
                    padding: "0.32rem 0.7rem",
                    fontSize: "0.75rem",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "var(--violet)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  Next <ChevronRightIcon size={15} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
