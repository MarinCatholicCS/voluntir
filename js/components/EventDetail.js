// js/components/EventDetail.js

function VolunteerRoster({ volunteerIds, isOwner }) {
  const [volunteers, setVolunteers] = React.useState([]);
  const [loading,    setLoading]    = React.useState(true);
  const [copied,     setCopied]     = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try { const users = await fbGetUsersByIds(volunteerIds); if (!cancelled) setVolunteers(users); }
      catch (e) { console.error(e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [volunteerIds.join(",")]);

  const emails   = volunteers.map(v => v.email).filter(Boolean);
  const copyEmails = () => {
    if (emails.length === 0) return;
    navigator.clipboard.writeText(emails.join(", ")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  };
  const emailAll = () => { if (emails.length > 0) window.location.href = `mailto:${emails.join(",")}`; };

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${C.greenMid}40`, padding: 24, boxShadow: `0 2px 12px ${C.shadow}`, marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><I.User /></div>
          <div>
            <h3 style={{ fontFamily: "'Asap', sans-serif;", fontWeight: 700, fontSize: 17, color: C.textPrimary, margin: 0 }}>Signed-Up Volunteers</h3>
            <span style={{ fontSize: 12, color: C.textMuted }}>{volunteerIds.length} volunteer{volunteerIds.length !== 1 ? "s" : ""} registered</span>
          </div>
        </div>
        {isOwner && emails.length > 0 && (
          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={copyEmails} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: copied ? C.greenLight : "transparent", color: copied ? C.greenDark : C.textSecondary, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              {copied ? <><I.Check />Copied!</> : "Copy Emails"}
            </button>
            <button onClick={emailAll} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}><I.Mail />Email All</button>
          </div>
        )}
      </div>

      {loading
        ? <div style={{ padding: "20px 0", textAlign: "center", color: C.textMuted, fontSize: 14 }}>Loading...</div>
        : volunteerIds.length === 0
          ? <div style={{ padding: "20px 0", textAlign: "center" }}><p style={{ fontSize: 14, color: C.textMuted }}>No sign-ups yet.</p></div>
          : (
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 300 }}>
                <div style={{ display: "grid", gridTemplateColumns: isOwner ? "36px 1fr 1fr 90px" : "36px 1fr 90px", padding: "8px 12px", background: C.cream, borderRadius: "8px 8px 0 0", fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  <span></span><span>Name</span>{isOwner && <span>Email</span>}<span style={{ textAlign: "right" }}>Hours</span>
                </div>
                {volunteers.map((v, i) => (
                  <div key={v.uid} style={{ display: "grid", gridTemplateColumns: isOwner ? "36px 1fr 1fr 90px" : "36px 1fr 90px", padding: "10px 12px", alignItems: "center", borderBottom: i < volunteers.length - 1 ? `1px solid ${C.borderLight}` : "none", background: i % 2 === 0 ? "transparent" : `${C.cream}40` }}>
                    <Avatar name={v.name} size={28} profilePic={v.profilePic} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 6 }}>{v.name || "Anonymous"}</span>
                    {isOwner && <a href={`mailto:${v.email || ""}`} style={{ fontSize: 12, color: C.greenDark, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 6 }}>{v.email || "—"}</a>}
                    <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: C.greenAccent }}>{v.hoursServed || 0}<span style={{ fontSize: 10, color: C.textMuted, fontWeight: 400, marginLeft: 2 }}>hrs</span></span>
                  </div>
                ))}
              </div>
            </div>
          )
      }
    </div>
  );
}

function EventDetail({ listing, signedUp, isOwner, onSignUp, onUnsign, onBack, onDelete }) {
  const spots = listing.volunteersNeeded - listing.currentVolunteers;
  const full  = spots <= 0;

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textSecondary, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>← Back to Events</button>
        {isOwner && (
          <button onClick={() => onDelete(listing)}
            style={btnStyle("danger", { padding: "8px 14px", fontSize: 13 })}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.Trash />Delete Listing</button>
        )}
      </div>

      <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.borderLight}`, padding: "28px 24px", boxShadow: `0 2px 12px ${C.shadow}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.greenAccent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{listing.organizer}</span>
          {isOwner && <span style={{ background: C.cream, color: C.textSecondary, borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>Your Listing</span>}
        </div>

        <h1 style={{ fontFamily: "'Asap', sans-serif;", fontWeight: 800, fontSize: "clamp(22px,5vw,32px)", color: C.textPrimary, margin: "6px 0 14px 0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{listing.title}</h1>
        <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, margin: "0 0 22px 0" }}>{listing.description}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginBottom: 22 }}>
          {[
            { icon: <I.Calendar />, label: "Date",         value: formatDate(listing.date) },
            { icon: <I.Clock />,    label: "Time",         value: listing.time },
            { icon: <I.MapPin />,   label: "Location",     value: listing.location },
            { icon: <I.User />,     label: "Organized by", value: listing.createdByName },
          ].map((x, i) => (
            <div key={i} style={{ background: C.cream, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 9 }}>
              <div style={{ color: C.greenAccent, marginTop: 2, flexShrink: 0 }}>{x.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 2 }}>{x.label}</div>
                <div style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500, wordBreak: "break-word" }}>{x.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          {listing.contactEmail && <a href={`mailto:${listing.contactEmail}`} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: C.greenLight, color: C.greenDark, fontSize: 13, fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}><I.Mail />{listing.contactEmail}</a>}
          {listing.website       && <a href={listing.website} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, background: C.greenLight, color: C.greenDark, fontSize: 13, fontWeight: 600, textDecoration: "none" }}><I.Link />Website</a>}
        </div>

        <div style={{ marginBottom: 20, maxWidth: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 14, color: C.textSecondary, fontWeight: 500 }}><span style={{ fontWeight: 700, color: C.greenDark, fontSize: 17 }}>{listing.currentVolunteers}</span> / {listing.volunteersNeeded} volunteers</span>
            <span style={{ fontSize: 13, color: full ? C.textMuted : C.greenAccent, fontWeight: 600 }}>{full ? "Full" : `${spots} spots left`}</span>
          </div>
          <ProgressBar current={listing.currentVolunteers} total={listing.volunteersNeeded} />
        </div>

        {signedUp ? (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ padding: "12px 24px", borderRadius: 12, background: C.greenLight, color: C.greenDark, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 7 }}><I.Check />You're Registered</div>
            <button onClick={() => onUnsign(listing.id)}
              style={btnStyle("danger", { padding: "12px 20px", fontSize: 14 })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.X />Cancel Registration</button>
          </div>
        ) : (
          <button onClick={() => { if (!full) onSignUp(listing.id); }} disabled={full}
            style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: full ? C.cream : `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: full ? C.textMuted : "#fff", fontWeight: 700, fontSize: 15, cursor: full ? "default" : "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            {full ? "Event Full" : <><span>Sign Up to Volunteer</span><I.ArrowRight /></>}
          </button>
        )}
      </div>

      {isOwner && <VolunteerRoster volunteerIds={listing.volunteers || []} isOwner={true} />}
      {!isOwner && (listing.volunteers || []).length > 0 && <VolunteerRoster volunteerIds={listing.volunteers || []} isOwner={false} />}
    </div>
  );
}

window.VolunteerRoster = VolunteerRoster;
window.EventDetail     = EventDetail;
