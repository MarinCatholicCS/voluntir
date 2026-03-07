import { useState } from 'react'
import { C } from '../../constants'
import { I } from '../Icons'
import { ProgressBar } from '../Common'
import { getTodayStr, formatDate, btnStyle } from '../../utils'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function calInfo(year, month) {
  return {
    firstDay: new Date(year, month, 1).getDay(),
    daysInMonth: new Date(year, month + 1, 0).getDate(),
  }
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function MyListingsPage({ listings, user, onDelete, onUnsign, onView }) {
  const today    = getTodayStr()
  const mine     = listings.filter(l => l.createdBy === user.uid)
  const upcoming = listings.filter(l => (l.volunteers || []).includes(user.uid) && l.date >= today)

  const [view, setView] = useState('list')
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() } })

  // Combine both upcoming (signed-up) and created listings for the calendar, deduplicating
  const eventsByDate = {}
  const addToDate = (l, type) => {
    if (!eventsByDate[l.date]) eventsByDate[l.date] = []
    const existing = eventsByDate[l.date].find(e => e.id === l.id)
    if (existing) { existing._type = 'both' }
    else { eventsByDate[l.date].push({ ...l, _type: type }) }
  }
  upcoming.forEach(l => addToDate(l, 'upcoming'))
  mine.forEach(l => addToDate(l, 'created'))

  const { firstDay, daysInMonth } = calInfo(calMonth.year, calMonth.month)

  const iconBtn = (active) => ({
    background: active ? C.greenLight : 'transparent',
    border: `1px solid ${active ? C.greenMid : C.borderLight}`,
    borderRadius: 8, padding: '5px 7px', cursor: 'pointer',
    color: active ? C.greenDark : C.textMuted,
    display: 'flex', alignItems: 'center', transition: 'all 0.15s',
  })

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease" }}>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>My Listings</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Your signed-up events and posted listings.</p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <button style={iconBtn(view === 'list')} onClick={() => setView('list')} title="List view"><I.Menu /></button>
          <button style={iconBtn(view === 'calendar')} onClick={() => setView('calendar')} title="Calendar view"><I.Calendar /></button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: C.greenAccent }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Signed Up</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: '#6366f1' }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Created</span>
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: 20, boxShadow: `0 1px 3px ${C.shadow}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month - 1); return { year: d.getFullYear(), month: d.getMonth() } })}
                style={{ background: 'transparent', border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: '4px 12px', cursor: 'pointer', color: C.textMuted, fontSize: 18, lineHeight: 1 }}>‹</button>
              <span style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 16, color: C.textPrimary }}>{MONTH_NAMES[calMonth.month]} {calMonth.year}</span>
              <button onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month + 1); return { year: d.getFullYear(), month: d.getMonth() } })}
                style={{ background: 'transparent', border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: '4px 12px', cursor: 'pointer', color: C.textMuted, fontSize: 18, lineHeight: 1 }}>›</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: C.textMuted, padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} style={{ minHeight: 64 }} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const ds = toDateStr(calMonth.year, calMonth.month, day)
                const events = eventsByDate[ds] || []
                const isToday = ds === today
                return (
                  <div key={day} style={{ minHeight: 64, borderRadius: 8, background: isToday ? C.greenLight : C.offWhite, border: `1px solid ${isToday ? C.greenMid : C.borderLight}`, padding: '4px 5px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? C.greenDark : C.textMuted, alignSelf: 'flex-end' }}>{day}</span>
                    {events.map(l => (
                      <div key={l.id} onClick={() => onView(l.id)} title={l.title}
                        style={{ background: l._type === 'created' ? '#6366f1' : C.greenAccent, color: '#fff', borderRadius: 4, padding: '2px 4px', fontSize: 10, fontWeight: 600, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {l.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Upcoming Events Section */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 20, color: C.textPrimary, margin: "0 0 14px 0" }}>Upcoming Events</h2>

            {upcoming.length === 0 ? (
              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
                <h3 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 17, color: C.textPrimary, margin: "0 0 7px 0" }}>No upcoming events yet</h3>
                <p style={{ fontSize: 13, color: C.textSecondary }}>Browse events and sign up to start volunteering!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {upcoming.map(l => (
                  <div key={l.id} onClick={() => onView(l.id)}
                    style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: `0 1px 3px ${C.shadow}`, cursor: "pointer", transition: "all 0.2s", flexWrap: "wrap" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${C.shadowMd}`; e.currentTarget.style.borderColor = C.greenMid; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 1px 3px ${C.shadow}`;    e.currentTarget.style.borderColor = C.borderLight; }}>

                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${C.greenLight},${C.greenMid}40)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.greenDark, flexShrink: 0 }}><I.Calendar /></div>

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h3 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 17, color: C.textPrimary, margin: "0 0 4px 0" }}>{l.title}</h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {[{ icon: <I.Calendar />, t: formatDate(l.date) }, { icon: <I.Clock />, t: l.time }, { icon: <I.MapPin />, t: l.location }].map((x, i) => (
                          <span key={i} style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 3 }}>{x.icon}{x.t}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <div style={{ background: C.greenAccent, color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 3 }}><I.Check />Confirmed</div>
                      <button onClick={e => { e.stopPropagation(); onUnsign(l.id) }}
                        style={btnStyle("danger", { padding: "5px 10px", fontSize: 12 })}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.X />Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Posted Listings Section */}
          <div>
            <h2 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 20, color: C.textPrimary, margin: "0 0 14px 0" }}>My Posted Listings</h2>

            {mine.length === 0
              ? (
                <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                  <h3 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 17, color: C.textPrimary, margin: "0 0 7px 0" }}>No listings yet</h3>
                  <p style={{ fontSize: 13, color: C.textSecondary }}>Head to Create to post your first volunteer opportunity!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[...mine].sort((a, b) => {
                    const today  = getTodayStr()
                    const aPast  = a.date < today
                    const bPast  = b.date < today
                    if (aPast !== bPast) return aPast ? 1 : -1
                    return a.date.localeCompare(b.date)
                  }).map(l => {
                    const pct    = Math.round((l.currentVolunteers / l.volunteersNeeded) * 100)
                    const full   = l.currentVolunteers >= l.volunteersNeeded
                    const isPast = l.date < getTodayStr()

                    return (
                      <div key={l.id} onClick={() => onView(l.id)}
                        style={{ background: C.white, borderRadius: 16, border: `1px solid ${isPast ? C.border : C.borderLight}`, padding: 20, boxShadow: `0 1px 3px ${C.shadow}`, cursor: "pointer", transition: "all 0.2s", opacity: isPast ? 0.7 : 1 }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${C.shadowMd}`; e.currentTarget.style.borderColor = C.greenMid; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 1px 3px ${C.shadow}`;    e.currentTarget.style.borderColor = isPast ? C.border : C.borderLight; }}>

                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.greenAccent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l.organizer}</span>
                              {isPast && <span style={{ background: "#FEF3CD", color: "#856404", borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>Past Event</span>}
                            </div>
                            <h3 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 18, color: C.textPrimary, margin: "0 0 7px 0" }}>{l.title}</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                              {[{ icon: <I.Calendar />, t: formatDate(l.date) }, { icon: <I.Clock />, t: l.time }, { icon: <I.MapPin />, t: l.location }].map((x, i) => (
                                <span key={i} style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>{x.icon}{x.t}</span>
                              ))}
                            </div>
                            <div style={{ maxWidth: 300 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}><span style={{ fontWeight: 700, color: C.greenDark }}>{l.currentVolunteers}</span> / {l.volunteersNeeded} volunteers</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: full ? C.greenDark : C.textMuted }}>{full ? "Full!" : `${pct}%`}</span>
                              </div>
                              <ProgressBar current={l.currentVolunteers} total={l.volunteersNeeded} />
                            </div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); onDelete(l) }}
                            style={btnStyle("danger", { padding: "8px 12px", fontSize: 13, flexShrink: 0 })}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; e.currentTarget.style.background = C.redLight; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "transparent"; }}><I.Trash />Delete</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </div>
        </>
      )}
    </div>
  )
}
