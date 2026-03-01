// js/app.js
// Root App component — wires everything together

const { useState, useEffect, useRef } = React;

function App() {
  const isMobile = useIsMobile();

  const [user,        setUser]        = useState(null);
  const [profile,     setProfile]     = useState({ name: "", age: "", location: "", hoursServed: 0, profilePic: "", school: "" });
  const [listings,    setListings]    = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [page,        setPage]        = useState("events");
  const [toast,       setToast]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [deleteTgt,   setDeleteTgt]   = useState(null);
  const [showLoginModal,  setShowLoginModal]  = useState(false);
  const [loginLoading,    setLoginLoading]    = useState(false);
  const [loginError,      setLoginError]      = useState(null);
  const [viewProfileUid,  setViewProfileUid]  = useState(null);
  const [selEvent,        setSelEvent]        = useState(null);

  const viewEvent  = (id) => { setSelEvent(id); setPage("events"); };
  const toast_     = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const loadL      = async () => { const l = await fbGetListings(); setListings(l); };
  const loadLb     = async () => { try { const lb = await fbGetLeaderboard(); setLeaderboard(lb); } catch (e) { console.error(e); } };
  const refresh    = async () => { setRefreshing(true); try { await Promise.all([loadL(), loadLb()]); } catch (e) { console.error(e); } setRefreshing(false); };
  const requireLogin = () => { setShowLoginModal(true); };

  const nav = (p) => {
    if (!user && (p === "upcoming" || p === "my-listings" || p === "create" || p === "profile")) {
      setShowLoginModal(true); return;
    }
    setPage(p);
    if (p === "events" || p === "leaderboard") refresh();
  };

  const handleViewProfile = (uid) => {
    if (user && uid === user.uid) { setPage("profile"); }
    else { setViewProfileUid(uid); }
  };

  const doLogin = async () => {
    setLoginLoading(true); setLoginError(null);
    try { await fbSignIn(); setShowLoginModal(false); }
    catch (e) { setLoginError(e.message || "Sign-in failed."); }
    setLoginLoading(false);
  };

  // Auth listener
  useEffect(() => {
    let unsub;
    (async () => {
      const fb = await loadFirebase();
      unsub = fb.onAuthStateChanged(fb.auth, async u => {
        if (u) {
          setUser({ uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL });
          const p = await fbGetProfile(u.uid);
          if (p) {
            if (!p.email || p.email !== u.email) { await fbSetProfile(u.uid, { email: u.email }); p.email = u.email; }
            setProfile(p);
          } else {
            const np = { name: u.displayName || "", age: "", location: "", hoursServed: 0, profilePic: "", email: u.email || "", school: "" };
            await fbSetProfile(u.uid, np);
            setProfile(np);
          }
        } else {
          setUser(null);
        }
        try { await Promise.all([loadL(), loadLb()]); } catch (e) { console.error(e); }
        setLoading(false);
      });
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  const logout = async () => {
    try { await fbSignOut(); } catch (e) { console.error(e); }
    setUser(null);
    setProfile({ name: "", age: "", location: "", hoursServed: 0, profilePic: "", school: "" });
    setPage("events");
  };

  const signUp = async (id) => {
    if (!user) { requireLogin(); return; }
    const l = listings.find(x => x.id === id); if (!l) return;
    const h = parseHours(l.time);
    setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: x.currentVolunteers + 1, volunteers: [...(x.volunteers || []), user.uid] } : x));
    setProfile(p => ({ ...p, hoursServed: (p.hoursServed || 0) + h }));
    toast_(`Signed up for ${l.title}! +${h} hr${h !== 1 ? "s" : ""}`);
    try { await fbSignUp(id, user.uid, h); await loadLb(); }
    catch (e) {
      console.error(e);
      setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: x.currentVolunteers - 1, volunteers: (x.volunteers || []).filter(v => v !== user.uid) } : x));
      setProfile(p => ({ ...p, hoursServed: Math.max(0, (p.hoursServed || 0) - h) }));
      toast_("Error signing up.");
    }
  };

  const unsign = async (id) => {
    if (!user) return;
    const l = listings.find(x => x.id === id); if (!l) return;
    const h = parseHours(l.time);
    setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: Math.max(0, x.currentVolunteers - 1), volunteers: (x.volunteers || []).filter(v => v !== user.uid) } : x));
    setProfile(p => ({ ...p, hoursServed: Math.max(0, (p.hoursServed || 0) - h) }));
    toast_(`Cancelled registration for ${l.title}`);
    try { await fbUnsign(id, user.uid, h); await loadLb(); }
    catch (e) {
      console.error(e);
      setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: x.currentVolunteers + 1, volunteers: [...(x.volunteers || []), user.uid] } : x));
      setProfile(p => ({ ...p, hoursServed: (p.hoursServed || 0) + h }));
      toast_("Error cancelling.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTgt) return;
    const { id, title } = deleteTgt;
    const listing = listings.find(l => l.id === id);
    setDeleteTgt(null);
    setListings(p => p.filter(l => l.id !== id));
    toast_(`"${title}" deleted.`);
    try {
      if (listing && listing.volunteers && listing.volunteers.length > 0) {
        const hours = parseHours(listing.time);
        await fbDeductHoursFromUsers(listing.volunteers, hours);
      }
      await fbDeleteListing(id);
      await Promise.all([loadL(), loadLb()]);
    } catch (e) { console.error(e); toast_("Error deleting."); await loadL(); }
  };

  const createListing = async (data) => {
    try {
      const newId = await fbAddListing(data);
      setListings(p => [...p, { ...data, id: newId }].sort((a, b) => a.date.localeCompare(b.date)));
      nav("my-listings");
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.offWhite }}>
      <p style={{ color: C.textMuted, fontSize: 15 }}>Loading…</p>
    </div>
  );

  const LoginModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowLoginModal(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 22, border: `1px solid ${C.borderLight}`, padding: "36px 28px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", position: "relative" }}>
        <button onClick={() => setShowLoginModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4 }}><I.X /></button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 7 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden" }}><img src="voluntir.png" alt="" style={{ width: 36, height: 36, objectFit: "cover" }} onError={e => e.target.style.display = 'none'} /></div>
          <span style={{ fontFamily: "'Asap', sans-serif;", fontWeight: 800, fontSize: 22, color: C.textPrimary, letterSpacing: "-0.02em" }}>Voluntir</span>
        </div>
        <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24, lineHeight: 1.6 }}>Sign in to sign up for events, create listings, and track your volunteer hours.</p>
        {loginError && <div style={{ background: C.redLight, color: C.red, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14, textAlign: "left" }}>{loginError}</div>}
        <button onClick={doLogin} disabled={loginLoading}
          style={{ width: "100%", padding: "13px 20px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, fontWeight: 600, fontSize: 15, color: C.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.greenAccent}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
          <I.Google />{loginLoading ? "Signing in..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );

  const mainPadding = isMobile ? "16px 14px 80px" : "32px 24px 80px";

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite }}>
      <Navbar currentPage={page} setCurrentPage={nav} onLogout={logout} onLogin={() => setShowLoginModal(true)} user={user} isMobile={isMobile} />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: mainPadding }}>
        {page === "events"      && <EventsPage      listings={listings} user={user} onSignUp={signUp} onUnsign={unsign} onDelete={setDeleteTgt} onRefresh={refresh} refreshing={refreshing} initialSel={selEvent} key={selEvent} onRequireLogin={requireLogin} isMobile={isMobile} />}
        {page === "upcoming"    && user && <UpcomingPage    listings={listings} user={user} onUnsign={unsign} onView={viewEvent} />}
        {page === "my-listings" && user && <MyListingsPage  listings={listings} user={user} onDelete={setDeleteTgt} onView={viewEvent} />}
        {page === "leaderboard" && <LeaderboardPage leaderboard={leaderboard} user={user || { uid: null }} onViewProfile={handleViewProfile} isMobile={isMobile} />}
        {page === "create"      && user && <CreateListingPage user={user} onCreateListing={createListing} isMobile={isMobile} />}
        {page === "profile"     && user && <ProfilePage user={user} profile={profile} setProfile={setProfile} listings={listings} leaderboard={leaderboard} onView={viewEvent} isMobile={isMobile} />}
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: isMobile ? 72 : 24, left: "50%", transform: "translateX(-50%)", background: C.greenDark, color: "#fff", padding: "11px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 7, animation: "toastIn 0.3s ease", zIndex: 200, whiteSpace: "nowrap" }}>
          <span style={{ color: C.greenMid }}><I.Check /></span>{toast}
        </div>
      )}

      {/* Modals */}
      {deleteTgt     && <ConfirmModal title="Delete this listing?" message={`"${deleteTgt.title}" will be permanently removed and all sign-ups will be lost.`} onConfirm={confirmDelete} onCancel={() => setDeleteTgt(null)} />}
      {showLoginModal && <LoginModal />}
      {viewProfileUid && <ViewProfileModal uid={viewProfileUid} leaderboard={leaderboard} onClose={() => setViewProfileUid(null)} />}
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Hide loading screen
setTimeout(() => {
  const ls = document.getElementById("loading-screen");
  if (ls) { ls.classList.add("fade-out"); setTimeout(() => ls.remove(), 300); }
}, 100);
