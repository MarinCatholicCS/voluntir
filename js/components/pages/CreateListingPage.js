// js/components/pages/CreateListingPage.js

function CreateListingPage({ user, onCreateListing, isMobile }) {
  const today = getTodayStr();
  const [form, setForm] = React.useState({
    title: "", description: "", volunteersNeeded: "", date: "",
    startTime: "", endTime: "", location: "", organizer: "", contactEmail: "", website: "",
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [saving,    setSaving]    = React.useState(false);

  const set = f => setForm(p => ({ ...p, ...f }));

  const go = async () => {
    if (!form.title || !form.date || !form.volunteersNeeded || !form.startTime || !form.endTime) return;
    setSaving(true);
    const data = {
      title: form.title, description: form.description,
      volunteersNeeded: parseInt(form.volunteersNeeded),
      date: form.date, time: buildTimeStr(form.startTime, form.endTime),
      location: form.location, organizer: form.organizer,
      contactEmail: form.contactEmail, website: form.website,
      currentVolunteers: 0, volunteers: [],
      createdBy: user.uid, createdByName: user.displayName || "Anonymous",
    };
    await onCreateListing(data);
    setSaving(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ title: "", description: "", volunteersNeeded: "", date: "", startTime: "", endTime: "", location: "", organizer: "", contactEmail: "", website: "" });
    }, 3000);
  };

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 14, color: C.textPrimary, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 13, fontWeight: 600, color: C.textSecondary, marginBottom: 5, display: "block" };
  const ok  = form.title && form.date && form.volunteersNeeded && form.startTime && form.endTime;

  if (submitted) return (
    <div style={{ animation: "fadeSlideIn 0.35s ease", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ background: C.white, borderRadius: 16, border: `2px solid ${C.greenAccent}`, padding: "50px 24px", textAlign: "center", boxShadow: `0 4px 20px ${C.shadowMd}` }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
        <h2 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 22, color: C.greenDark, margin: "0 0 7px 0" }}>Listing Created!</h2>
        <p style={{ fontSize: 15, color: C.textSecondary }}>Your event is now live and open for volunteers.</p>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>Create a Listing</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Post a new volunteer opportunity for the community.</p>
      </div>

      <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: isMobile ? 20 : 28, boxShadow: `0 1px 3px ${C.shadow}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div><label style={lbl}>Organization Name</label><input style={inp} placeholder="e.g., Portland Food Alliance" value={form.organizer} onChange={e => set({ organizer: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
          <div><label style={lbl}>Event Title *</label><input style={inp} placeholder="e.g., Weekend Food Drive" value={form.title} onChange={e => set({ title: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
          <div><label style={lbl}>Description</label><textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} placeholder="Describe the volunteer opportunity…" value={form.description} onChange={e => set({ description: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div><label style={lbl}># Volunteers Needed *</label><input style={inp} type="number" min="1" placeholder="e.g., 20" value={form.volunteersNeeded} onChange={e => set({ volunteersNeeded: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
            <div>
              <label style={lbl}>Date * <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 11 }}>(today or later)</span></label>
              <input style={inp} type="date" min={today} value={form.date} onChange={e => set({ date: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div>
            <label style={lbl}>Event Time * <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 11 }}>(auto-calculates volunteer hours)</span></label>
            <TimePicker startVal={form.startTime} endVal={form.endTime} onStartChange={v => set({ startTime: v })} onEndChange={v => set({ endTime: v })} />
          </div>

          <div><label style={lbl}>Location</label><input style={inp} placeholder="e.g., 123 Main St, Portland, OR" value={form.location} onChange={e => set({ location: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div><label style={lbl}>Contact Email</label><input style={inp} type="email" placeholder="contact@org.com" value={form.contactEmail} onChange={e => set({ contactEmail: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
            <div><label style={lbl}>Website</label><input style={inp} type="url" placeholder="https://yourorg.com" value={form.website} onChange={e => set({ website: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
          </div>

          <button onClick={go} disabled={!ok || saving}
            style={{ padding: "13px 24px", borderRadius: 12, border: "none", background: ok ? `linear-gradient(135deg,${C.greenAccent},${C.greenDark})` : C.border, color: ok ? "#fff" : C.textMuted, fontWeight: 700, fontSize: 15, cursor: ok ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <I.Plus />{saving ? "Publishing…" : "Publish Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.CreateListingPage = CreateListingPage;
