const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div onClick={e => { e.stopPropagation(); onChange(); }}
      style={{ width: 16, height: 16, borderRadius: 5, background: checked ? "linear-gradient(135deg, #6366f1, #818cf8)" : "white", border: checked ? "1.5px solid #6366f1" : "1.5px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s", boxShadow: checked ? "0 2px 8px rgba(99,102,241,0.3)" : "inset 0 1px 2px rgba(15,23,42,0.06)" }}>
      {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

const FieldError = ({ msg }) => (
  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, fontSize: "0.71rem", color: "#e11d48", fontFamily: "'Outfit', sans-serif" }}>
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="5" stroke="#e11d48" strokeWidth="1.2"/><path d="M5.5 3v3M5.5 7.5v.5" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round"/></svg>
    {msg}
  </motion.div>
);

const SectionCard = ({ number, title, icon, children }) => (
  <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,0.95)", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(99,102,241,0.06)" }}>
    <div style={{ padding: "0.85rem 1.15rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg, rgba(99,102,241,0.03), rgba(129,140,248,0.02))" }}>
      <div style={{ width: 28, height: 28, background: "var(--violet-dim)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--violet)", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "var(--text-primary)" }}>{title}</div>
        {number && <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 1 }}>{number}</div>}
      </div>
    </div>
    <div style={{ padding: "1rem 1.15rem" }}>{children}</div>
  </div>
);

export {
    CustomCheckbox,
    FieldError,
    SectionCard
}