// js/components/pages/LeaderboardPage.js

function LeaderboardPage({ leaderboard, user, onViewProfile, isMobile }) {
  const [tab, setTab] = React.useState("volunteers");

  // Build school leaderboard
  const schoolMap = {};
  leaderboard.forEach(p => {
    if (p.school && p.school.trim()) {
      const s = p.school.trim();
      if (!schoolMap[s]) schoolMap[s] = { name: s, totalHours: 0, members: 0 };
      schoolMap[s].totalHours += (p.hoursServed || 0);
      schoolMap[s].members    += 1;
    }
  });
  const schoolBoard = Object.values(schoolMap).sort((a, b) => b.totalHours - a.totalHours);

  const top3       = leaderboard.slice(0, 3);
  const pod        = [1, 0, 2].map(i => top3[i]).filter(Boolean);
  const podRanks   = ["2nd", "1st", "3rd"];
  const schoolTop3 = schoolBoard.slice(0, 3);
  const schoolPod  = [1, 0, 2].map(i => schoolTop3[i]).filter(Boolean);

  const tabBtn = (id) => ({
    padding: isMobile ? "8px 14px" : "10px 22px", borderRadius: 10, border: "none",
    background: tab === id ? C.greenLight : "transparent",
    color:      tab === id ? C.greenDark  : C.textSecondary,
    fontWeight: tab === id ? 700          : 500,
    fontSize: isMobile ? 13 : 14, cursor: "pointer", transition: "all 0.2s",
  });

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ marginBottom: 18, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>Service Leaderboard</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Celebrating our top volunteers and schools.</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 24, background: C.white, borderRadius: 12, padding: 4, width: "fit-content", margin: "0 auto 24px auto", border: `1px solid ${C.borderLight}` }}>
        <button onClick={() => setTab("volunteers")} style={tabBtn("volunteers")}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.User />Volunteers</span></button>
        <button onClick={() => setTab("schools")}    style={tabBtn("schools")}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.School />Schools</span></button>
      </div>

      {/* Volunteers tab */}
      {tab === "volunteers" && <>
        {top3.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: isMobile ? 10 : 14, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
            {pod.map((p, di) => {
              const best = di === 1;
              const ht   = isMobile ? (best ? 200 : 170) : (best ? 250 : 210);
              const w    = isMobile ? (best ? 150 : 130) : (best ? 180 : 160);
              return (
                <div key={p.uid}
                  style={{ background: C.white, borderRadius: 16, padding: isMobile ? "18px 12px" : "24px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: ht, width: w, flexShrink: 0, border: best ? `2px solid ${C.greenAccent}` : `1px solid ${C.borderLight}`, boxShadow: best ? `0 4px 20px ${C.shadowMd}` : `0 1px 3px ${C.shadow}`, cursor: "pointer" }}
                  onClick={() => onViewProfile && onViewProfile(p.uid)}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: best ? C.greenAccent : C.textMuted, marginBottom: 8 }}>{podRanks[di]}</div>
                  <Avatar name={p.name} size={best ? 52 : 40} profilePic={p.profilePic} />
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: best ? 15 : 13, color: C.textPrimary, margin: "8px 0 2px 0", lineHeight: 1.2 }}>{p.name}</h3>
                  {p.school && <span style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>{p.school}</span>}
                  <span style={{ fontSize: 22, fontWeight: 800, color: C.greenAccent }}>{p.hoursServed}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>hours</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, overflow: "hidden", boxShadow: `0 1px 3px ${C.shadow}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "40px 1fr 80px" : "50px 1fr 140px 120px", padding: "12px 16px", background: C.cream, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <span style={{ textAlign: "center" }}>Rank</span><span>Volunteer</span>{!isMobile && <span>School</span>}<span style={{ textAlign: "right" }}>Hours</span>
          </div>
          {leaderboard.length === 0 && <div style={{ padding: "36px 20px", textAlign: "center", fontSize: 14, color: C.textMuted }}>No volunteers yet. Sign up for an event to appear here!</div>}
          {leaderboard.map((p, i) => (
            <div key={p.uid} onClick={() => onViewProfile && onViewProfile(p.uid)}
              style={{ display: "grid", gridTemplateColumns: isMobile ? "40px 1fr 80px" : "50px 1fr 140px 120px", padding: "12px 16px", alignItems: "center", borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none", background: p.uid === user.uid ? `${C.greenLight}60` : "transparent", cursor: "pointer" }}
              onMouseEnter={e => { if (p.uid !== user.uid) e.currentTarget.style.background = `${C.cream}80`; }}
              onMouseLeave={e => { e.currentTarget.style.background = p.uid === user.uid ? `${C.greenLight}60` : "transparent"; }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? C.greenAccent : C.textMuted, textAlign: "center" }}>#{i + 1}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <Avatar name={p.name} size={32} rank={i} profilePic={p.profilePic} />
                <span style={{ fontSize: 13, fontWeight: p.uid === user.uid ? 700 : 500, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}{p.uid === user.uid && <span style={{ fontSize: 10, color: C.greenAccent, marginLeft: 5, fontWeight: 600 }}>(You)</span>}
                </span>
              </div>
              {!isMobile && <span style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.school || "—"}</span>}
              <div style={{ textAlign: "right" }}><span style={{ fontSize: 15, fontWeight: 700, color: C.greenDark }}>{p.hoursServed}</span><span style={{ fontSize: 11, color: C.textMuted, marginLeft: 3 }}>hrs</span></div>
            </div>
          ))}
        </div>
      </>}

      {/* Schools tab */}
      {tab === "schools" && <>
        {schoolPod.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: isMobile ? 10 : 14, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
            {schoolPod.map((s, di) => {
              const best = di === 1;
              const ht   = isMobile ? (best ? 190 : 160) : (best ? 230 : 195);
              return (
                <div key={s.name}
                  style={{ background: C.white, borderRadius: 16, padding: isMobile ? "16px 12px" : "24px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: ht, width: isMobile ? 140 : 190, flexShrink: 0, border: best ? `2px solid ${C.greenAccent}` : `1px solid ${C.borderLight}`, boxShadow: best ? `0 4px 20px ${C.shadowMd}` : `0 1px 3px ${C.shadow}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: best ? C.greenAccent : C.textMuted, marginBottom: 8 }}>{podRanks[di]}</div>
                  <div style={{ width: best ? 48 : 38, height: best ? 48 : 38, borderRadius: 12, background: `linear-gradient(135deg,${C.greenLight},${C.greenMid}40)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.greenDark, marginBottom: 7 }}><I.School /></div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: best ? 14 : 12, color: C.textPrimary, margin: "0 0 2px 0", lineHeight: 1.3 }}>{s.name}</h3>
                  <span style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{s.members} member{s.members !== 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: C.greenAccent }}>{s.totalHours}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>hours</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, overflow: "hidden", boxShadow: `0 1px 3px ${C.shadow}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 60px 80px" : "50px 1fr 100px 120px", padding: "12px 16px", background: C.cream, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {!isMobile && <span style={{ textAlign: "center" }}>Rank</span>}<span>School</span><span style={{ textAlign: "center" }}>Members</span><span style={{ textAlign: "right" }}>Hrs</span>
          </div>
          {schoolBoard.length === 0 && <div style={{ padding: "36px 20px", textAlign: "center", fontSize: 14, color: C.textMuted }}>No schools yet. Add your school in Profile!</div>}
          {schoolBoard.map((s, i) => {
            const userEntry  = user && leaderboard.find(p => p.uid === user.uid);
            const isMySchool = userEntry && userEntry.school && userEntry.school.trim() === s.name;
            return (
              <div key={s.name}
                style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 60px 80px" : "50px 1fr 100px 120px", padding: "12px 16px", alignItems: "center", borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none", background: isMySchool ? `${C.greenLight}60` : "transparent" }}>
                {!isMobile && <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? C.greenAccent : C.textMuted, textAlign: "center" }}>#{i + 1}</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  {isMobile && <span style={{ fontSize: 11, fontWeight: 700, color: i < 3 ? C.greenAccent : C.textMuted, minWidth: 20 }}>#{i + 1}</span>}
                  <span style={{ fontSize: 13, fontWeight: isMySchool ? 700 : 500, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.name}{isMySchool && <span style={{ fontSize: 10, color: C.greenAccent, marginLeft: 4, fontWeight: 600 }}>(You)</span>}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: C.textMuted, textAlign: "center" }}>{s.members}</span>
                <div style={{ textAlign: "right" }}><span style={{ fontSize: 14, fontWeight: 700, color: C.greenDark }}>{s.totalHours}</span></div>
              </div>
            );
          })}
        </div>
      </>}
    </div>
  );
}

window.LeaderboardPage = LeaderboardPage;
