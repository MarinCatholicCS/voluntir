// js/components/EventCard.js

function EventCard({ listing, signedUp, isOwner, onSignUp, onUnsign, onView, onDelete }) {
  const spots = listing.volunteersNeeded - listing.currentVolunteers;
  const full  = spots <= 0;

  return (
    <div onClick={onView}
      style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: 20, cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 1px 3px ${C.shadow}`, position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${C.shadowMd}`; e.currentTarget.style.borderColor = C.greenMid; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = `0 1px 3px ${C.shadow}`;      e.currentTarget.style.borderColor = C.borderLight; }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.greenAccent, letterSpacing: "0.06em", textTransform: "uppercase", flex: 1, paddingRight: 8 }}>{listing.organizer}</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
          {isOwner  && <span style={{ background: C.cream, color: C.textSecondary, borderRadius: 6, padding: "2px 6px", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>Your Listing</span>}
          {signedUp && <span style={{ background: C.greenAccent, color: "#fff", borderRadius: 6, padding: "2px 6px", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}><I.Check />Signed Up</span>}
        </div>
      </div>

      <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18, color: C.textPrimary, margin: "0 0 6px 0", lineHeight: 1.3 }}>{listing.title}</h3>
      <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5, margin: "0 0 12px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{listing.description}</p>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {[{ icon: <I.Calendar />, text: formatDate(listing.date) }, { icon: <I.Clock />, text: listing.time }, { icon: <I.MapPin />, text: listing.location }].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: C.textMuted, fontSize: 12 }}>{x.icon}<span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.text}</span></div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}><span style={{ fontWeight: 700, color: C.greenDark }}>{listing.currentVolunteers}</span> / {listing.volunteersNeeded} volunteers</span>
          <span style={{ fontSize: 11, color: full ? C.textMuted : C.greenAccent, fontWeight: 600 }}>{full ? "Full" : `${spots} left`}</span>
        </div>
        <ProgressBar current={listing.currentVolunteers} total={listing.volunteersNeeded} />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 7 }}>
        {signedUp ? (
          <>
            <div style={{ flex: 1, padding: "9px 12px", borderRadius: 10, background: C.greenLight, color: C.greenDark, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><I.Check />Registered</div>
            <button onClick={e => { e.stopPropagation(); onUnsign(listing.id); }}
              style={btnStyle("danger", { padding: "9px 12px", fontSize: 13 })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.X />Cancel</button>
          </>
        ) : (
          <button onClick={e => { e.stopPropagation(); if (!full) onSignUp(listing.id); }} disabled={full}
            style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "none", background: full ? C.cream : `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: full ? C.textMuted : "#fff", fontWeight: 600, fontSize: 13, cursor: full ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            {full ? "Event Full" : <><span>Sign Up</span><I.ArrowRight /></>}
          </button>
        )}
        {isOwner && (
          <button onClick={e => { e.stopPropagation(); onDelete(listing); }} title="Delete"
            style={btnStyle("danger", { padding: "9px 11px" })}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.Trash /></button>
        )}
      </div>
    </div>
  );
}

window.EventCard = EventCard;
