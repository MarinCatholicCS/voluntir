import { useState, useEffect } from 'react'
import { C } from './constants'
import { embed } from './embeddings'

export function getTodayStr() {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function genTimeOptions() {
  const opts = []
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      const ap  = h < 12 ? "AM" : "PM"
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      opts.push({
        label: `${h12}:${String(m).padStart(2, "0")} ${ap}`,
        value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      })
    }
  }
  return opts
}

export const TIME_OPTIONS = genTimeOptions()

export function toMins(v)          { const [h, m] = v.split(":").map(Number); return h * 60 + m }
export function toLabel(v)         { if (!v) return ""; const o = TIME_OPTIONS.find(x => x.value === v); return o ? o.label : v }
export function calcHours(s, e)    { if (!s || !e) return 0; return Math.max(0, Math.round((toMins(e) - toMins(s)) / 60 * 10) / 10) }
export function buildTimeStr(s, e) { if (!s || !e) return ""; return `${toLabel(s)} – ${toLabel(e)}` }

export function parseHours(t) {
  if (!t) return 2
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 2
  let sh = +m[1], sm = +m[2], sp = m[3].toUpperCase(), eh = +m[4], em = +m[5], ep = m[6].toUpperCase()
  if (sp === "PM" && sh !== 12) sh += 12; if (sp === "AM" && sh === 12) sh = 0
  if (ep === "PM" && eh !== 12) eh += 12; if (ep === "AM" && eh === 12) eh = 0
  return Math.max(1, Math.round((eh * 60 + em - (sh * 60 + sm)) / 60))
}

export function formatDate(s) {
  if (!s) return ""
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

export function getInitials(n) {
  if (!n) return "??"
  return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0)
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
  return magA && magB ? dot / (magA * magB) : 0
}

export async function rankListingsBySkills(listings, userSkills) {
  if (!userSkills || userSkills.length === 0) return listings
  const userVec = await embed(userSkills.join(', '))
  const scored = await Promise.all(listings.map(async l => {
    if (!l.skills || l.skills.length === 0) return { l, score: 0 }
    const vec = await embed(l.skills.join(', '))
    return { l, score: cosineSim(userVec, vec) }
  }))
  return scored
    .sort((a, b) => b.score - a.score || a.l.date.localeCompare(b.l.date))
    .map(x => x.l)
}

export function btnStyle(variant = "primary", extra = {}) {
  const base = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, padding: "10px 16px", borderRadius: 10,
    fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
    ...extra,
  }
  if (variant === "primary") return { ...base, border: "none", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff" }
  if (variant === "ghost")   return { ...base, border: `1.5px solid ${C.border}`, background: "transparent", color: C.textMuted }
  if (variant === "danger")  return { ...base, border: `1.5px solid ${C.border}`, background: "transparent", color: C.textMuted }
  return base
}
