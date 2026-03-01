// js/components/pages/MyListingsPage.js

function MyListingsPage({ listings, user, onDelete, onView }) {
  const mine = listings.filter(l => l.createdBy === user.uid);

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>My Listings</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Events you've posted for the community.</p>
      </div>

      {mine.length === 0
        ? (
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: "50px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 19, color: C.textPrimary, margin: "0 0 7px 0" }}>No listings yet</h3>
            <p style={{ fontSize: 14, color: C.textSecondary }}>Head to Create to post your first volunteer opportunity!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mine.map(l => {
              const pct    = Math.round((l.currentVolunteers / l.volunteersNeeded) * 100);
              const full   = l.currentVolunteers >= l.volunteersNeeded;
              const isPast = l.date < getTodayStr();

              return (
                <div key={l.id} onClick={() => onView(l.id)}
                  style={{ background: C.white, borderRadius: 16, border: `1px solid ${isPast ? C.border : C.borderLight}`, padding: 20, boxShadow: `0 1px 3px ${C.shadow}`, cursor: "pointer", transition: "all 0.2s", opacity: isPast ? 0.7 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${C.shadowMd}`; e.currentTarget.style.borderColor = C.greenMid; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 1px 3px ${C.shadow}`;    e.currentTarget.style.borderColor = isPast ? C.border : C.borderLight; }}>

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.greenAccent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l.organizer}</span>
                        {isPast && <span style={{ background: "#FEF3CD", color: "#856404", borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>Past Event</span>}
                      </div>
                      <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18, color: C.textPrimary, margin: "0 0 7px 0" }}>{l.title}</h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                        {[{ icon: <I.Calendar />, t: formatDate(l.date) }, { icon: <I.Clock />, t: l.time }, { icon: <I.MapPin />, t: l.location }].map((x, i) => (
                          <span key={i} style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>{x.icon}{x.t}</span>
                        ))}
                      </div>
                      <div style={{ maxWidth: 300 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}><span style={{ fontWeight: 700, color: C.greenDark }}>{l.currentVolunteers}</span> / {l.volunteersNeeded} volunteers</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: full ? C.greenDark : C.textMuted }}>{full ? "Full!" : `${pct}%`}</span>
                        </div>
                        <ProgressBar current={l.currentVolunteers} total={l.volunteersNeeded} />
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onDelete(l); }}
                      style={btnStyle("danger", { padding: "8px 12px", fontSize: 13, flexShrink: 0 })}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.Trash />Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

window.MyListingsPage = MyListingsPage;
