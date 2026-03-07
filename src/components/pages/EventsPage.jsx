import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { C } from '../../constants'
import { I } from '../Icons'
import EventCard from '../EventCard'
import EventDetail from '../EventDetail'
import { getTodayStr, rankListingsBySkills } from '../../utils'

const geocodeCache = {}
async function geocode(location) {
  if (!location) return null
  if (geocodeCache[location]) return geocodeCache[location]
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    )
    const data = await res.json()
    if (data && data.length > 0) {
      const result = { lat: +data[0].lat, lon: +data[0].lon }
      geocodeCache[location] = result
      return result
    }
  } catch {}
  return null
}

function EventsMap({ listings, onSelectListing }) {
  const mapRef      = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    // Destroy any stale instance before re-init
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }

    // Init map immediately so tiles start loading while geocoding runs
    const map = L.map(mapRef.current, { zoomControl: true }).setView([37.7749, -122.4194], 11)
    mapInstance.current = map

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    // Fix tile fragmentation: recalculate size after the container is fully laid out
    const sizeTimer = setTimeout(() => { if (!cancelled) map.invalidateSize() }, 150)

    Promise.all(
      listings.map(async l => {
        const coords = await geocode(l.location)
        return coords ? { listing: l, ...coords } : null
      })
    ).then(results => {
      if (cancelled) return
      const valid = results.filter(Boolean)

      valid.forEach(({ listing: l, lat, lon }) => {
        const pin = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${C.greenAccent};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);cursor:pointer"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          className: "",
        })
        const marker = L.marker([lat, lon], { icon: pin }).addTo(map)
        marker.bindTooltip(
          `<div class="vm-label-org">${l.organizer || ""}</div><div class="vm-label-title">${l.title}</div>`,
          { permanent: true, direction: "top", className: "vm-tooltip", offset: [0, -12] }
        )
        marker.on("click", () => onSelectListing(l.id))
      })

      if (valid.length === 1) {
        map.setView([valid[0].lat, valid[0].lon], 14)
      } else if (valid.length > 1) {
        map.fitBounds(valid.map(r => [r.lat, r.lon]), { padding: [60, 60] })
      }
    })

    return () => {
      cancelled = true
      clearTimeout(sizeTimer)
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null }
    }
  }, [listings.map(l => l.id).join(",")])

  return (
    <>
      <style>{`
        .vm-tooltip {
          background: #fff;
          border: 1.5px solid ${C.borderLight};
          border-radius: 8px;
          padding: 7px 11px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.13);
          font-family: 'Asap', sans-serif;
          max-width: 190px;
          white-space: normal;
          cursor: pointer;
        }
        .vm-tooltip::before { border-top-color: #fff !important; }
        .vm-tooltip.leaflet-tooltip-top::before { border-top-color: ${C.borderLight} !important; }
        .vm-label-org { font-size: 10px; color: ${C.greenAccent}; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px; }
        .vm-label-title { font-size: 12px; color: ${C.textPrimary}; font-weight: 700; line-height: 1.3; }
      `}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </>
  )
}

export default function EventsPage({ listings, user, profile, onSignUp, onUnsign, onDelete, onRefresh, refreshing, initialSel, onRequireLogin, isMobile, onConfirmHours, onUnconfirmHours }) {
  const [sel,     setSel]     = useState(initialSel || null)
  const [search,  setSearch]  = useState("")
  const [showMap, setShowMap] = useState(false)
  const today    = getTodayStr()
  const upcoming = listings.filter(l => l.date >= today)
  const searched = upcoming.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    (l.organizer || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.location  || "").toLowerCase().includes(search.toLowerCase())
  )
  const userSkills = profile && profile.skills && profile.skills.length > 0 ? profile.skills : null
  const [filtered, setFiltered] = useState(searched)

  useEffect(() => {
    let stale = false
    if (!userSkills) { setFiltered(searched); return }
    setFiltered(searched)
    rankListingsBySkills(searched, userSkills).then(ranked => { if (!stale) setFiltered(ranked) })
    return () => { stale = true }
  }, [listings, search, userSkills && userSkills.join(',')])

  const uid = user ? user.uid : null

  if (sel) {
    const li = listings.find(l => l.id === sel)
    if (li) return (
      <EventDetail
        listing={li}
        signedUp={uid ? (li.volunteers || []).includes(uid) : false}
        isOwner={uid ? li.createdBy === uid : false}
        onSignUp={uid ? onSignUp : onRequireLogin}
        onUnsign={uid ? onUnsign : onRequireLogin}
        onBack={() => setSel(null)}
        onDelete={l => { onDelete(l); setSel(null) }}
        onConfirmHours={onConfirmHours}
        onUnconfirmHours={onUnconfirmHours}
      />
    )
  }

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>Volunteer Events</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Find opportunities to make a difference.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => setShowMap(m => !m)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${showMap ? C.greenAccent : C.border}`, background: showMap ? `linear-gradient(135deg,${C.greenAccent},${C.greenDark})` : C.white, color: showMap ? "#fff" : C.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
            <I.MapPin />{!isMobile && (showMap ? "Hide Map" : "Show Map")}
          </button>
          <button onClick={onRefresh} disabled={refreshing}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, color: C.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenAccent; e.currentTarget.style.color = C.greenDark; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;      e.currentTarget.style.color = C.textSecondary; }}>
            <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}><I.Refresh /></span>
            {!isMobile && (refreshing ? "Refreshing..." : "Refresh")}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="Search events, organizations, or locations…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "11px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 14, color: C.textPrimary, outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = C.greenAccent}
          onBlur={e  => e.target.style.borderColor = C.border} />
      </div>

      {showMap ? (
        <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.borderLight}`, boxShadow: `0 2px 12px ${C.shadow}`, height: "65vh" }}>
          <EventsMap listings={filtered.length ? filtered : upcoming} onSelectListing={id => { setShowMap(false); setSel(id) }} />
        </div>
      ) : filtered.length === 0 ? (
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
      )}
    </div>
  )
}
