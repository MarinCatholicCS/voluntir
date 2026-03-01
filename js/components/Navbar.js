// js/components/Navbar.js

function Navbar({ currentPage, setCurrentPage, onLogout, onLogin, user, isMobile }) {
  const guestLinks = [
    { id: "events",      label: "Events",      icon: <I.Calendar /> },
    { id: "leaderboard", label: "Leaderboard", icon: <I.Trophy />   },
  ];
  const authLinks = [
    { id: "events",      label: "Events",      icon: <I.Calendar /> },
    { id: "upcoming",    label: "Upcoming",    icon: <I.Clock />    },
    { id: "my-listings", label: "My Listings", icon: <I.List />     },
    { id: "leaderboard", label: "Leaderboard", icon: <I.Trophy />   },
    { id: "create",      label: "Create",      icon: <I.Plus />     },
    { id: "profile",     label: "Profile",     icon: <I.User />     },
  ];
  const links = user ? authLinks : guestLinks;
  const nav   = (p) => { setCurrentPage(p); };

  if (isMobile) {
    const bottomLinks = user
      ? [
          { id: "events",      label: "Events",   icon: <I.Calendar /> },
          { id: "upcoming",    label: "Upcoming", icon: <I.Clock />    },
          { id: "leaderboard", label: "Board",    icon: <I.Trophy />   },
          { id: "create",      label: "Create",   icon: <I.Plus />     },
          { id: "profile",     label: "Profile",  icon: <I.User />     },
        ]
      : [
          { id: "events",      label: "Events",      icon: <I.Calendar /> },
          { id: "leaderboard", label: "Leaderboard", icon: <I.Trophy />   },
        ];

    return (
      <>
        {/* Mobile top bar */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.borderLight}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => nav("events")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="voluntir.png" alt="" style={{ width: 30, height: 30, objectFit: "cover" }} onError={e => e.target.style.display = 'none'} />
            </div>
            <span style={{ fontFamily: "'Asap', sans-serif;", fontWeight: 800, fontSize: 20, color: C.textPrimary, letterSpacing: "-0.02em" }}>Voluntir</span>
          </div>
          {user
            ? <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><I.Logout />Log out</button>
            : <button onClick={onLogin}  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, border: "none", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><I.Google />Sign In</button>
          }
        </nav>
        {/* Mobile bottom tab bar */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: `1px solid ${C.borderLight}`, display: "flex", alignItems: "stretch", paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
          {bottomLinks.map(l => (
            <button key={l.id} onClick={() => nav(l.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "8px 4px", border: "none", background: "transparent", color: currentPage === l.id ? C.greenDark : C.textMuted, cursor: "pointer", minHeight: 52, transition: "all 0.2s", position: "relative" }}>
              <div style={{ color: currentPage === l.id ? C.greenAccent : C.textMuted, transition: "color 0.2s" }}>{l.icon}</div>
              <span style={{ fontSize: 10, fontWeight: currentPage === l.id ? 700 : 500, letterSpacing: "0.01em" }}>{l.label}</span>
              {currentPage === l.id && <div style={{ position: "absolute", bottom: 0, width: 28, height: 2, borderRadius: 2, background: C.greenAccent }} />}
            </button>
          ))}
        </div>
      </>
    );
  }

  // Desktop nav
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.borderLight}`, padding: "0 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div onClick={() => nav("events")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="voluntir.png" alt="Voluntir" style={{ width: 34, height: 34, objectFit: "cover" }} onError={e => e.target.style.display = 'none'} />
          </div>
          <span style={{ fontFamily: "'Asap', sans-serif;", fontWeight: 800, fontSize: 22, color: C.textPrimary, letterSpacing: "-0.02em" }}>Voluntir</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => nav(l.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "none", background: currentPage === l.id ? C.greenLight : "transparent", color: currentPage === l.id ? C.greenDark : C.textSecondary, fontWeight: currentPage === l.id ? 600 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
              {l.icon}<span>{l.label}</span>
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: C.borderLight, margin: "0 6px" }} />
          {user
            ? <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "none", background: "transparent", color: C.textMuted, fontSize: 13, cursor: "pointer" }}><I.Logout />Log out</button>
            : <button onClick={onLogin}  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><I.Google />Sign In</button>
          }
        </div>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;
