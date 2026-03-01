// js/components/Common.js
// Shared reusable components: ProgressBar, Avatar, ConfirmModal, TimePicker, LoginPage

function ProgressBar({ current, total }) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div style={{ width: "100%", height: 6, borderRadius: 3, background: C.borderLight, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${C.greenAccent},${C.greenMid})`, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

function Avatar({ name, size = 40, rank, photoURL, profilePic }) {
  const ini = getInitials(name);
  const cols = [
    { bg: C.greenLight, text: C.greenDark },
    { bg: "#FFF3E0",    text: "#E65100"   },
    { bg: "#E3F2FD",    text: "#1565C0"   },
    { bg: "#FCE4EC",    text: "#AD1457"   },
    { bg: "#F3E5F5",    text: "#6A1B9A"   },
  ];
  const c     = cols[(ini.charCodeAt(0) + (ini.length > 1 ? ini.charCodeAt(1) : 0)) % cols.length];
  const top3  = rank !== undefined && rank < 3;
  const imgSrc = profilePic || photoURL;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {imgSrc
        ? <img src={imgSrc} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: top3 ? `2px solid ${C.greenAccent}` : "none" }} />
        : <div style={{ width: size, height: size, borderRadius: "50%", background: c.bg, color: c.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, border: top3 ? `2px solid ${C.greenAccent}` : "none" }}>{ini}</div>
      }
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🗑️</div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 22, color: C.textPrimary, margin: "0 0 10px 0", textAlign: "center" }}>{title}</h2>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, margin: "0 0 24px 0", textAlign: "center" }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "transparent", fontWeight: 600, fontSize: 14, color: C.textSecondary, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: C.red, fontWeight: 700, fontSize: 14, color: "#fff", cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function TimePicker({ startVal, endVal, onStartChange, onEndChange }) {
  const sel = {
    padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`,
    background: C.white, fontSize: 14, color: C.textPrimary, outline: "none",
    cursor: "pointer", appearance: "none", WebkitAppearance: "none", width: "100%",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238BA67D' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36,
  };
  const hours = calcHours(startVal, endVal);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 5, letterSpacing: "0.03em" }}>START TIME</label>
          <select style={sel} value={startVal} onChange={e => onStartChange(e.target.value)} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border}>
            <option value="">Select start…</option>
            {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, display: "block", marginBottom: 5, letterSpacing: "0.03em" }}>END TIME</label>
          <select style={sel} value={endVal} onChange={e => onEndChange(e.target.value)} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border}>
            <option value="">Select end…</option>
            {TIME_OPTIONS.filter(o => !startVal || toMins(o.value) > toMins(startVal)).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      {startVal && endVal && (
        <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: C.greenLight, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <I.Clock />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.greenDark }}>{hours} hour{hours !== 1 ? "s" : ""} · {toLabel(startVal)} – {toLabel(endVal)}</span>
        </div>
      )}
    </div>
  );
}

function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState(null);
  const go = async () => {
    setLoading(true); setError(null);
    try { await fbSignIn(); }
    catch (e) { setError(e.message || "Sign-in failed."); setLoading(false); }
  };
  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.borderLight}`, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: `0 4px 24px ${C.shadowMd}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="voluntir.png" alt="Voluntir" style={{ width: 42, height: 42, objectFit: "cover" }} onError={e => e.target.style.display = 'none'} />
          </div>
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 28, color: C.textPrimary, letterSpacing: "-0.02em" }}>Voluntir</span>
        </div>
        <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 32, lineHeight: 1.6 }}>Connect with your community. Find volunteer opportunities and track your impact.</p>
        {error && <div style={{ background: C.redLight, color: C.red, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, textAlign: "left" }}>{error}</div>}
        <button onClick={go} disabled={loading}
          style={{ width: "100%", padding: "14px 20px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, fontWeight: 600, fontSize: 15, color: C.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.greenAccent}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
          <I.Google />{loading ? "Signing in..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}

window.ProgressBar   = ProgressBar;
window.Avatar        = Avatar;
window.ConfirmModal  = ConfirmModal;
window.TimePicker    = TimePicker;
window.LoginPage     = LoginPage;
