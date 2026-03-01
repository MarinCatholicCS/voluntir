// js/components/pages/UpcomingPage.js

function UpcomingPage({ listings, user, onUnsign, onView }) {
  const today    = getTodayStr();
  const upcoming = listings.filter(l => (l.volunteers || []).includes(user.uid) && l.date >= today);

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>Your Upcoming Events</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Events you've signed up for.</p>
      </div>

      {upcoming.length === 0
        ? (
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: "50px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🌱</div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 19, color: C.textPrimary, margin: "0 0 7px 0" }}>No upcoming events yet</h3>
            <p style={{ fontSize: 14, color: C.textSecondary }}>Browse events and sign up to start volunteering!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {upcoming.map(l => (
              <div key={l.id} onClick={() => onView(l.id)}
                style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: `0 1px 3px ${C.shadow}`, cursor: "pointer", transition: "all 0.2s", flexWrap: "wrap" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${C.shadowMd}`; e.currentTarget.style.borderColor = C.greenMid; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 1px 3px ${C.shadow}`;    e.currentTarget.style.borderColor = C.borderLight; }}>

                <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${C.greenLight},${C.greenMid}40)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.greenDark, flexShrink: 0 }}><I.Calendar /></div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 17, color: C.textPrimary, margin: "0 0 4px 0" }}>{l.title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {[{ icon: <I.Calendar />, t: formatDate(l.date) }, { icon: <I.Clock />, t: l.time }, { icon: <I.MapPin />, t: l.location }].map((x, i) => (
                      <span key={i} style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 3 }}>{x.icon}{x.t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ background: C.greenAccent, color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 3 }}><I.Check />Confirmed</div>
                  <button onClick={e => { e.stopPropagation(); onUnsign(l.id); }}
                    style={btnStyle("danger", { padding: "5px 10px", fontSize: 12 })}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.X />Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

window.UpcomingPage = UpcomingPage;
