// js/components/pages/EventsPage.js

function EventsPage({ listings, user, onSignUp, onUnsign, onDelete, onRefresh, refreshing, initialSel, onRequireLogin, isMobile }) {
  const [sel,    setSel]    = React.useState(initialSel || null);
  const [search, setSearch] = React.useState("");
  const today    = getTodayStr();
  const upcoming = listings.filter(l => l.date >= today);
  const filtered = upcoming.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    (l.organizer || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.location  || "").toLowerCase().includes(search.toLowerCase())
  );
  const uid = user ? user.uid : null;

  if (sel) {
    const li = listings.find(l => l.id === sel);
    if (li) return (
      <EventDetail
        listing={li}
        signedUp={uid ? (li.volunteers || []).includes(uid) : false}
        isOwner={uid ? li.createdBy === uid : false}
        onSignUp={uid ? onSignUp : onRequireLogin}
        onUnsign={uid ? onUnsign : onRequireLogin}
        onBack={() => setSel(null)}
        onDelete={l => { onDelete(l); setSel(null); }}
      />
    );
  }

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>Volunteer Events</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Find opportunities to make a difference.</p>
        </div>
        <button onClick={onRefresh} disabled={refreshing}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, color: C.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenAccent; e.currentTarget.style.color = C.greenDark; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;      e.currentTarget.style.color = C.textSecondary; }}>
          <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}><I.Refresh /></span>
          {!isMobile && (refreshing ? "Refreshing..." : "Refresh")}
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="Search events, organizations, or locations…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "11px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 14, color: C.textPrimary, outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = C.greenAccent}
          onBlur={e  => e.target.style.borderColor = C.border} />
      </div>

      {filtered.length === 0
        ? (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 6 }}>{upcoming.length === 0 ? "No upcoming events at the moment." : "No events match your search."}</p>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.map(l => (
              <EventCard
                key={l.id}
                listing={l}
                signedUp={uid ? (l.volunteers || []).includes(uid) : false}
                isOwner={uid ? l.createdBy === uid : false}
                onSignUp={uid ? onSignUp : onRequireLogin}
                onUnsign={uid ? onUnsign : onRequireLogin}
                onView={() => setSel(l.id)}
                onDelete={onDelete}
              />
            ))}
          </div>
        )
      }
    </div>
  );
}

window.EventsPage = EventsPage;
