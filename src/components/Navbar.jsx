import { motion, LayoutGroup } from 'framer-motion'
import { C } from '../constants'
import { I } from './Icons'

const guestLinks = [
  { id: "events",      label: "Events",      Icon: I.Calendar },
  { id: "leaderboard", label: "Leaderboard", Icon: I.Trophy   },
]
const authLinks = [
  { id: "events",      label: "Events",      Icon: I.Calendar },
  { id: "my-listings", label: "My Listings", Icon: I.List     },
  { id: "leaderboard", label: "Leaderboard", Icon: I.Trophy   },
  { id: "create",      label: "Create",      Icon: I.Plus     },
  { id: "profile",     label: "Profile",     Icon: I.User     },
]
const mobileAuthLinks = [
  { id: "events",      label: "Events",   Icon: I.Calendar },
  { id: "my-listings", label: "Listings", Icon: I.List     },
  { id: "leaderboard", label: "Board",    Icon: I.Trophy   },
  { id: "create",      label: "Create",   Icon: I.Plus     },
  { id: "profile",     label: "Profile",  Icon: I.User     },
]
const mobileGuestLinks = [
  { id: "events",      label: "Events",      Icon: I.Calendar },
  { id: "leaderboard", label: "Leaderboard", Icon: I.Trophy   },
]

const pillStyle = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  background: "rgba(226,240,213,0.45)",
  border: `1px solid ${C.borderLight}`,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: 3,
  borderRadius: 999,
  boxShadow: `0 2px 12px ${C.shadow}`,
}

function TubelightItems({ items, showLabels, currentPage, onNav, layoutId }) {
  return items.map(l => {
    const isActive = currentPage === l.id
    return (
      <button
        key={l.id}
        onClick={() => onNav(l.id)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: showLabels ? "8px 16px" : "8px 14px",
          borderRadius: 999,
          border: "none",
          background: "transparent",
          color: isActive ? C.greenDark : C.textSecondary,
          fontWeight: isActive ? 600 : 500,
          fontSize: showLabels ? 14 : 12,
          cursor: "pointer",
          transition: "color 0.2s",
          zIndex: 1,
          minHeight: showLabels ? 38 : 40,
          minWidth: showLabels ? undefined : 44,
          flexDirection: showLabels ? "row" : "column",
        }}
      >
        <span style={{ color: isActive ? C.greenDark : C.textMuted, transition: "color 0.2s", display: "flex", alignItems: "center" }}>
          <l.Icon />
        </span>
        <span style={showLabels ? undefined : { fontSize: 9, fontWeight: isActive ? 700 : 500, letterSpacing: "0.01em" }}>
          {l.label}
        </span>
        {isActive && (
          <motion.div
            layoutId={layoutId}
            style={{
              position: "absolute",
              inset: 0,
              background: C.greenLight,
              borderRadius: 999,
              zIndex: -1,
            }}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div style={{
              position: "absolute",
              top: -2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 32,
              height: 4,
              background: C.greenAccent,
              borderRadius: "4px 4px 0 0",
            }}>
              <div style={{ position: "absolute", width: 48, height: 24, background: `${C.greenAccent}33`, borderRadius: 999, filter: "blur(8px)", top: -8, left: -8 }} />
              <div style={{ position: "absolute", width: 32, height: 24, background: `${C.greenAccent}33`, borderRadius: 999, filter: "blur(6px)", top: -4, left: 0 }} />
              <div style={{ position: "absolute", width: 16, height: 16, background: `${C.greenAccent}33`, borderRadius: 999, filter: "blur(4px)", top: 0, left: 8 }} />
            </div>
          </motion.div>
        )}
      </button>
    )
  })
}

export default function Navbar({ currentPage, setCurrentPage, onLogout, onLogin, onLogoClick, user, isMobile }) {
  const links = user ? authLinks : guestLinks
  const nav   = (p) => { setCurrentPage(p) }

  const logo = (
    <div onClick={onLogoClick || (() => nav("events"))} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
      <div style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, borderRadius: isMobile ? 9 : 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={`${import.meta.env.BASE_URL}voluntir.png`} alt="Voluntir" style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, objectFit: "cover" }} onError={e => e.target.style.display = 'none'} />
      </div>
      <span style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: isMobile ? 20 : 22, color: C.textPrimary, letterSpacing: "-0.02em" }}>Voluntir</span>
      <span style={{ background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.2 }}>Beta</span>
    </div>
  )

  const authBtn = user
    ? <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><I.Logout />Log out</button>
    : <button onClick={onLogin}  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, border: "none", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><I.Google />Sign In</button>

  if (isMobile) {
    const bottomLinks = user ? mobileAuthLinks : mobileGuestLinks
    return (
      <>
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.borderLight}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {logo}
          {authBtn}
        </nav>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 12px)", pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto", ...pillStyle }}>
            <LayoutGroup id="mobile-nav">
              <TubelightItems items={bottomLinks} showLabels={false} currentPage={currentPage} onNav={nav} layoutId="tubelight-mobile" />
            </LayoutGroup>
          </div>
        </div>
      </>
    )
  }

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.borderLight}`, padding: "0 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "relative" }}>
        {logo}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", ...pillStyle }}>
          <LayoutGroup id="desktop-nav">
            <TubelightItems items={links} showLabels={true} currentPage={currentPage} onNav={nav} layoutId="tubelight-desktop" />
          </LayoutGroup>
        </div>
        {authBtn}
      </div>
    </nav>
  )
}
