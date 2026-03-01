// js/components/pages/ProfilePage.js

function ViewProfileModal({ uid, leaderboard, onClose }) {
  const [profileData, setProfileData] = React.useState(null);
  const [loadingP,    setLoadingP]    = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingP(true);
      try { const p = await fbGetProfile(uid); if (!cancelled) setProfileData(p); } catch (e) {}
      if (!cancelled) setLoadingP(false);
    })();
    return () => { cancelled = true; };
  }, [uid]);

  const rank = leaderboard.findIndex(p => p.uid === uid) + 1;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 22, border: `1px solid ${C.borderLight}`, padding: "32px 28px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4 }}><I.X /></button>
        {loadingP
          ? <div style={{ padding: "36px 0", textAlign: "center", color: C.textMuted, fontSize: 14 }}>Loading...</div>
          : profileData
            ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Avatar name={profileData.name} size={68} profilePic={profileData.profilePic} /></div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: 22, color: C.textPrimary, margin: "0 0 6px 0" }}>{profileData.name || "Anonymous"}</h2>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  {profileData.age      && <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><I.User />Age {profileData.age}</span>}
                  {profileData.location && <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><I.MapPin />{profileData.location}</span>}
                  {profileData.school   && <span style={{ fontSize: 13, color: C.greenDark, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}><I.School />{profileData.school}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: C.cream, borderRadius: 12, padding: "14px 10px" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.greenAccent, lineHeight: 1 }}>{profileData.hoursServed || 0}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>Hours Served</div>
                  </div>
                  <div style={{ background: C.cream, borderRadius: 12, padding: "14px 10px" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#FF9800", lineHeight: 1 }}>{rank > 0 ? `#${rank}` : "—"}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>Leaderboard Rank</div>
                  </div>
                </div>
              </div>
            )
            : <div style={{ padding: "36px 0", textAlign: "center", color: C.textMuted, fontSize: 14 }}>Profile not found.</div>
        }
      </div>
    </div>
  );
}

function ProfilePage({ user, profile, setProfile, listings, leaderboard, onView, isMobile }) {
  const [editing,    setEditing]    = React.useState(false);
  const [form,       setForm]       = React.useState(profile);
  const fileInputRef                = React.useRef(null);
  const [previewPic, setPreviewPic] = React.useState(null);

  React.useEffect(() => { setForm(profile); setPreviewPic(profile.profilePic || null); }, [profile]);

  const signedUp = listings.filter(l => (l.volunteers || []).includes(user.uid) && l.date >= getTodayStr());
  const rank     = leaderboard.findIndex(p => p.uid === user.uid) + 1;

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 500000) { alert("Image too large. Please choose an image under 500KB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas"); const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPreviewPic(dataUrl); setForm(prev => ({ ...prev, profilePic: dataUrl }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePic = () => { setPreviewPic(null); setForm(prev => ({ ...prev, profilePic: "" })); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const save = async () => {
    setProfile(form);
    try { await fbSetProfile(user.uid, form); } catch (e) { console.error(e); }
    setEditing(false);
  };

  const cancel = () => { setEditing(false); setForm(profile); setPreviewPic(profile.profilePic || null); };

  const inp        = { padding: "10px 13px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.textPrimary, outline: "none", boxSizing: "border-box", width: "100%" };
  const displayPic = profile.profilePic || null;

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      {/* Profile header */}
      <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.borderLight}`, padding: isMobile ? 20 : 32, boxShadow: `0 2px 12px ${C.shadow}`, marginBottom: 20, display: "flex", alignItems: "center", gap: isMobile ? 16 : 24, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              <Avatar name={form.name || user.displayName} size={72} profilePic={previewPic} />
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: `2px solid ${C.white}` }}><I.Camera /></div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textSecondary, fontSize: 11, cursor: "pointer" }}>Upload</button>
              {previewPic && <button onClick={removeProfilePic} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.red, fontSize: 11, cursor: "pointer" }}>Remove</button>}
            </div>
          </div>
        ) : (
          <Avatar name={profile.name || user.displayName} size={72} photoURL={!displayPic ? user.photoURL : undefined} profilePic={displayPic} />
        )}

        <div style={{ flex: 1, minWidth: isMobile ? "100%" : "200px" }}>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 70px" : "1fr 70px 1fr", gap: 9 }}>
                <input style={inp} placeholder="Name"     value={form.name}     onChange={e => setForm({ ...form, name: e.target.value })} />
                <input style={inp} placeholder="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                {!isMobile && <input style={inp} placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />}
              </div>
              {isMobile && <input style={inp} placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />}
              <div style={{ position: "relative" }}>
                <input style={{ ...inp, paddingLeft: 34 }} placeholder="School (optional)" value={form.school || ""} onChange={e => setForm({ ...form, school: e.target.value })} />
                <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.textMuted, display: "flex" }}><I.School /></div>
              </div>
              <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={save}   style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: C.greenAccent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Save</button>
                <button onClick={cancel} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.textSecondary, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                {form.school && <button onClick={() => setForm({ ...form, school: "" })} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.red, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Leave School</button>}
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(20px,5vw,26px)", color: C.textPrimary, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>{profile.name || user.displayName}</h1>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
                {profile.age      && <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><I.User />Age {profile.age}</span>}
                {profile.location && <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><I.MapPin />{profile.location}</span>}
                {profile.school   && <span style={{ fontSize: 13, color: C.greenDark, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}><I.School />{profile.school}</span>}
                {!isMobile        && <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><I.Mail />{user.email}</span>}
              </div>
              <button onClick={() => setEditing(true)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.textSecondary, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Edit Profile</button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Hours Served", value: profile.hoursServed || 0, icon: <I.Clock />,   accent: C.greenAccent },
          { label: "Events Joined", value: signedUp.length,          icon: <I.Calendar />, accent: "#4CAF50"     },
          { label: "Board Rank",    value: rank > 0 ? `#${rank}` : "—", icon: <I.Trophy />, accent: "#FF9800"  },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.borderLight}`, padding: isMobile ? "16px 10px" : "20px 16px", textAlign: "center", boxShadow: `0 1px 3px ${C.shadow}` }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, color: s.accent }}>{s.icon}</div>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: s.accent, lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
            <div style={{ fontSize: isMobile ? 10 : 12, color: C.textMuted, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Registered events */}
      <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 18, color: C.textPrimary, margin: "0 0 14px 0" }}>Registered Events</h2>
      {signedUp.length === 0
        ? <p style={{ fontSize: 14, color: C.textMuted }}>No upcoming events registered.</p>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {signedUp.map(l => (
              <div key={l.id} onClick={() => onView(l.id)}
                style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.borderLight}`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s", gap: 10 }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${C.shadowMd}`; e.currentTarget.style.borderColor = C.greenMid; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none";                      e.currentTarget.style.borderColor = C.borderLight; }}>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 15, color: C.textPrimary, margin: "0 0 3px 0" }}>{l.title}</h4>
                  <span style={{ fontSize: 12, color: C.textMuted }}>{formatDate(l.date)} · {l.time}</span>
                </div>
                <div style={{ background: C.greenLight, color: C.greenDark, borderRadius: 7, padding: "3px 9px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Confirmed</div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

window.ViewProfileModal = ViewProfileModal;
window.ProfilePage      = ProfilePage;
